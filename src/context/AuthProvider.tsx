import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  bio: string | null;
  profile_image_url: string | null;
  created_at: string;
}

interface PlatformAccount {
  id: string;
  platform: 'leetcode' | 'codechef' | 'codeforces' | 'gfg';
  username: string;
  verified: boolean;
  verified_at: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  platformAccounts: PlatformAccount[];
  isLoading: boolean;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, userData: { name: string; college: string; course: string; graduationYear: string }) => Promise<{ error: AuthError | null; success: boolean; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; success: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null; success: boolean }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null; success: boolean }>;
  refreshProfile: () => Promise<void>;
  refreshPlatformAccounts: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null; success: boolean }>;
  uploadProfileImage: (file: File) => Promise<{ url: string | null; error: Error | null; success: boolean }>;
  upsertPlatformAccount: (platform: string, username: string) => Promise<{ error: Error | null; success: boolean }>;
}

const PROFILE_CACHE_PREFIX = 'rms_profile_cache_v1_';

const getProfileCacheKey = (userId: string) => `${PROFILE_CACHE_PREFIX}${userId}`;

const readCachedProfile = (userId: string): UserProfile | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(getProfileCacheKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    return parsed?.id === userId ? parsed : null;
  } catch {
    return null;
  }
};

const writeCachedProfile = (profile: UserProfile) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(getProfileCacheKey(profile.id), JSON.stringify(profile));
  } catch {
    // Ignore cache failures.
  }
};

const buildFallbackProfile = (currentUser: User): UserProfile => {
  const metadata = (currentUser.user_metadata ?? {}) as Record<string, string | undefined>;
  const email = currentUser.email ?? '';
  const guessedName = metadata.name ?? metadata.full_name ?? (email.includes('@') ? email.split('@')[0] : 'User');

  return {
    id: currentUser.id,
    name: guessedName || 'User',
    email,
    college: metadata.college ?? metadata.college_name ?? '',
    bio: null,
    profile_image_url: null,
    created_at: currentUser.created_at ?? new Date().toISOString(),
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [platformAccounts, setPlatformAccounts] = useState<PlatformAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const isReady = useRef(false);
  const activeLoadId = useRef(0);
  const activeUserId = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as UserProfile | null;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  }, []);

  const fetchPlatformAccounts = useCallback(async (userId: string): Promise<PlatformAccount[]> => {
    try {
      const { data, error } = await supabase.from('platform_accounts').select('*').eq('user_id', userId);
      if (error) {
        console.error('Error fetching platform accounts:', error);
        return [];
      }
      return (data as PlatformAccount[]) || [];
    } catch (error) {
      console.error('Error in fetchPlatformAccounts:', error);
      return [];
    }
  }, []);

  const ensureProfile = useCallback(async (currentUser: User, fallbackProfile?: UserProfile) => {
    try {
      const metadata = (currentUser.user_metadata ?? {}) as Record<string, string | undefined>;
      const profileFromMetadata = fallbackProfile ?? buildFallbackProfile(currentUser);

      const { error } = await supabase.from('users').upsert(
        {
          id: currentUser.id,
          name: profileFromMetadata.name,
          email: currentUser.email ?? profileFromMetadata.email,
          college: profileFromMetadata.college ?? '',
          course: metadata.course ?? null,
          graduation_year: metadata.graduation_year ?? null,
          bio: profileFromMetadata.bio,
          profile_image_url: profileFromMetadata.profile_image_url,
        },
        { onConflict: 'id' },
      );

      if (error) {
        console.error('Error ensuring profile row:', error);
      }
    } catch (error) {
      console.error('Error in ensureProfile:', error);
    }
  }, []);

  const loadUserData = useCallback(async (currentUser: User) => {
    const loadId = ++activeLoadId.current;
    activeUserId.current = currentUser.id;

    const fallbackProfile = buildFallbackProfile(currentUser);
    const cachedProfile = readCachedProfile(currentUser.id);

    setProfile((prev) => {
      if (prev?.id === currentUser.id) return prev;
      return cachedProfile ?? fallbackProfile;
    });

    const [profileResult, accountsResult] = await Promise.allSettled([
      fetchProfile(currentUser.id),
      fetchPlatformAccounts(currentUser.id),
    ]);

    const isStaleLoad = activeLoadId.current !== loadId || activeUserId.current !== currentUser.id;
    if (isStaleLoad) return;

    if (profileResult.status === 'fulfilled') {
      const dbProfile = profileResult.value;
      if (dbProfile) {
        setProfile(dbProfile);
        writeCachedProfile(dbProfile);
      } else {
        const recoveredProfile = cachedProfile ?? fallbackProfile;
        setProfile(recoveredProfile);
        writeCachedProfile(recoveredProfile);
        void ensureProfile(currentUser, recoveredProfile);
      }
    } else {
      console.error('Profile load rejected:', profileResult.reason);
      const recoveredProfile = cachedProfile ?? fallbackProfile;
      setProfile((prev) => (prev?.id === currentUser.id ? prev : recoveredProfile));
      writeCachedProfile(recoveredProfile);
    }

    if (accountsResult.status === 'fulfilled') {
      setPlatformAccounts(accountsResult.value);
    } else {
      console.error('Platform accounts load rejected:', accountsResult.reason);
    }
  }, [ensureProfile, fetchPlatformAccounts, fetchProfile]);

  useEffect(() => {
    let cancelled = false;

    const applySession = (nextSession: Session | null) => {
      if (cancelled) return;

      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);
      activeUserId.current = nextUser?.id ?? null;

      if (!nextUser) {
        activeLoadId.current += 1;
        setProfile(null);
        setPlatformAccounts([]);
        return;
      }

      void loadUserData(nextUser);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, nextSession: Session | null) => {
      if (cancelled) return;
      if (event === 'INITIAL_SESSION') return;

      applySession(nextSession);

      if (!isReady.current) {
        isReady.current = true;
        setIsLoading(false);
      }
    });

    const restoreSession = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();

        if (error) console.error('Error getting session:', error);
        applySession(initialSession);
      } catch (error) {
        console.error('Session restore failed:', error);
        setSession(null);
        setUser(null);
        setProfile(null);
        setPlatformAccounts([]);
      } finally {
        if (!cancelled) {
          isReady.current = true;
          setIsLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadUserData]);

  const signUp = async (
    email: string,
    password: string,
    userData: { name: string; college: string; course: string; graduationYear: string },
  ): Promise<{ error: AuthError | null; success: boolean; needsVerification?: boolean }> => {
    setIsAuthLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            college: userData.college,
            course: userData.course,
            graduation_year: userData.graduationYear,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (authError) return { error: authError, success: false };
      if (!authData.user) return { error: new Error('No user returned from signup') as AuthError, success: false };

      // Existing email case from Supabase signup response.
      if (authData.user.identities && authData.user.identities.length === 0) {
        return {
          error: new Error('An account with this email already exists.') as unknown as AuthError,
          success: false,
        };
      }

      // Enforce verification flow: never keep a signup session alive.
      await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);

      return { error: null, success: true, needsVerification: true };
    } catch (error) {
      return { error: error as AuthError, success: false };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null; success: boolean }> => {
    setIsAuthLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error, success: false };

      // Defensive gate for unverified emails.
      if (data?.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);
        return {
          error: new Error('Please verify your email before logging in.') as unknown as AuthError,
          success: false,
        };
      }

      return { error: null, success: true };
    } catch (error) {
      return { error: error as AuthError, success: false };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const signOut = async () => {
    setIsAuthLoading(true);

    // Always clear local UI state first so logout feels immediate and deterministic.
    activeLoadId.current += 1;
    activeUserId.current = null;
    setSession(null);
    setUser(null);
    setProfile(null);
    setPlatformAccounts([]);

    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) console.error('Signout error:', error);
    } catch (error) {
      console.error('Signout exception:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ error: AuthError | null; success: boolean }> => {
    setIsAuthLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error, success: !error };
    } catch (error) {
      return { error: error as AuthError, success: false };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ error: AuthError | null; success: boolean }> => {
    setIsAuthLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error, success: !error };
    } catch (error) {
      return { error: error as AuthError, success: false };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;

    const nextProfile = await fetchProfile(user.id);
    if (nextProfile) {
      setProfile(nextProfile);
      writeCachedProfile(nextProfile);
      return;
    }

    const fallback = readCachedProfile(user.id) ?? buildFallbackProfile(user);
    setProfile(fallback);
    writeCachedProfile(fallback);
    void ensureProfile(user, fallback);
  };

  const refreshPlatformAccounts = async () => {
    if (!user) return;

    const accounts = await fetchPlatformAccounts(user.id);
    setPlatformAccounts(accounts);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error: Error | null; success: boolean }> => {
    if (!user) return { error: new Error('Not authenticated'), success: false };

    try {
      const { error } = await supabase.from('users').update(updates).eq('id', user.id);
      if (error) return { error, success: false };
      await refreshProfile();
      return { error: null, success: true };
    } catch (error) {
      return { error: error as Error, success: false };
    }
  };

  const uploadProfileImage = async (file: File): Promise<{ url: string | null; error: Error | null; success: boolean }> => {
    if (!user) return { url: null, error: new Error('Not authenticated'), success: false };

    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return { url: null, error: new Error('Invalid file type.'), success: false };
      }

      if (file.size > 2 * 1024 * 1024) {
        return { url: null, error: new Error('File size exceeds 2MB.'), success: false };
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) return { url: null, error: uploadError, success: false };

      const {
        data: { publicUrl },
      } = supabase.storage.from('profile-images').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) return { url: null, error: updateError, success: false };

      await refreshProfile();
      return { url: publicUrl, error: null, success: true };
    } catch (error) {
      return { url: null, error: error as Error, success: false };
    }
  };

  const upsertPlatformAccount = async (platform: string, username: string): Promise<{ error: Error | null; success: boolean }> => {
    if (!user) return { error: new Error('Not authenticated'), success: false };

    try {
      const { data: existing, error: lookupError } = await supabase
        .from('platform_accounts')
        .select('id, verified')
        .eq('user_id', user.id)
        .eq('platform', platform)
        .maybeSingle();

      if (lookupError) return { error: lookupError, success: false };

      if (existing) {
        const { error } = await supabase
          .from('platform_accounts')
          .update({ username, updated_at: new Date().toISOString() })
          .eq('user_id', user.id)
          .eq('platform', platform);

        if (error) return { error, success: false };
      } else {
        const { error } = await supabase.from('platform_accounts').insert({
          user_id: user.id,
          platform: platform as any,
          username,
          verified: false,
          verified_at: null,
        });

        if (error) return { error, success: false };
      }

      await refreshPlatformAccounts();
      return { error: null, success: true };
    } catch (error) {
      return { error: error as Error, success: false };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    platformAccounts,
    isLoading,
    isAuthLoading,
    isAuthenticated: Boolean(session?.access_token && user),
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
    refreshPlatformAccounts,
    updateProfile,
    uploadProfileImage,
    upsertPlatformAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
