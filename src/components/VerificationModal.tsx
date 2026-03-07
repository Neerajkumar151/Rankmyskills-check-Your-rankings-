import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Copy, Check, Clock, ExternalLink, Loader2, Shield,
  AlertCircle, CheckCircle2, RefreshCw, Code2, Trophy, Award, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';
import {
  createVerificationRequest, getActiveVerificationRequest,
  verifyPlatform, deleteVerificationRequest, getRemainingTime,
  formatTimeRemaining, PLATFORM_CONFIG, type VerificationRequest,
} from '@/services/verificationService';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'leetcode' | 'codechef' | 'codeforces' | 'gfg';
  username: string;
  onVerified: () => void | Promise<void>;
}

const PlatformIcons = { leetcode: Code2, codechef: Trophy, codeforces: Award, gfg: User };

// Updated redirect links per spec
const PLATFORM_EDIT_URLS: Record<string, string> = {
  leetcode: 'https://leetcode.com/profile/',
  codechef: 'https://www.codechef.com/settings/profile',
  codeforces: 'https://codeforces.com/settings/social',
  gfg: 'https://auth.geeksforgeeks.org/user-profile',
};

export function VerificationModal({ isOpen, onClose, platform, username, onVerified }: VerificationModalProps) {
  const { user } = useAuth();
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 5, seconds: 0, totalSeconds: 300, isExpired: false });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const platformConfig = PLATFORM_CONFIG[platform];
  const PlatformIcon = PlatformIcons[platform];

  const loadVerificationRequest = useCallback(async () => {
    if (!user) return;
    setIsGenerating(true);
    setError(null);
    try {
      const { request: existingRequest, error: fetchError } = await getActiveVerificationRequest(user.id, platform);
      if (fetchError) { setError(fetchError.message); setIsGenerating(false); return; }
      if (existingRequest) { setVerificationRequest(existingRequest); setIsGenerating(false); return; }
      const { request: newRequest, error: createError, cooldownRemaining: cooldown } = await createVerificationRequest(user.id, platform, username);
      if (createError) {
        if (cooldown) setCooldownRemaining(cooldown);
        setError(createError.message);
        setIsGenerating(false);
        return;
      }
      setVerificationRequest(newRequest);
    } finally { setIsGenerating(false); }
  }, [user, platform, username]);

  const handleGenerateNew = async () => {
    if (!user || !verificationRequest) return;
    setIsGenerating(true);
    setError(null);
    try {
      await deleteVerificationRequest(verificationRequest.id);
      const { request: newRequest, error: createError, cooldownRemaining: cooldown } = await createVerificationRequest(user.id, platform, username);
      if (createError) {
        if (cooldown) setCooldownRemaining(cooldown);
        setError(createError.message);
        return;
      }
      setVerificationRequest(newRequest);
      setSuccess(false);
    } finally { setIsGenerating(false); }
  };

  const handleVerify = async () => {
    if (!user || !verificationRequest) return;
    setIsVerifying(true);
    setError(null);
    try {
      const result = await verifyPlatform(user.id, platform, username, verificationRequest.code);
      if (result.success) {
        const { supabase } = await import('@/integrations/supabase/client');
        await supabase.from('platform_accounts').update({ verified: true, verified_at: new Date().toISOString() })
          .eq('user_id', user.id).eq('platform', platform);
        setSuccess(true);
        await onVerified();
        setTimeout(() => onClose(), 2000);
      } else {
        setError(result.message);
      }
    } finally { setIsVerifying(false); }
  };

  const handleCopy = async () => {
    if (!verificationRequest) return;
    try {
      await navigator.clipboard.writeText(verificationRequest.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch { setError('Failed to copy to clipboard'); }
  };

  useEffect(() => {
    if (!verificationRequest) return;
    const updateTimer = () => {
      const remaining = getRemainingTime(verificationRequest.expires_at);
      setTimeRemaining(remaining);
      if (remaining.isExpired && !error?.includes('expired')) {
        setError('Verification code expired. Generate a new one.');
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [verificationRequest, error]);

  useEffect(() => { if (isOpen && user) loadVerificationRequest(); }, [isOpen, user, loadVerificationRequest]);

  useEffect(() => {
    if (!isOpen) {
      setVerificationRequest(null); setError(null); setSuccess(false);
      setIsCopied(false); setCooldownRemaining(0);
      setTimeRemaining({ minutes: 5, seconds: 0, totalSeconds: 300, isExpired: false });
    }
  }, [isOpen]);

  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining((prev) => { if (prev <= 1) { setError(null); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  if (!isOpen) return null;

  const editUrl = PLATFORM_EDIT_URLS[platform] || platformConfig.editUrl();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-border"
              onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className={`${platformConfig.headerColor} px-6 py-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <PlatformIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Verify {platformConfig.name} Profile</h3>
                    <p className="text-white/80 text-sm">Username: {username}</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-5">
                {success ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">Verification Successful!</h4>
                    <p className="text-muted-foreground">Your {platformConfig.name} account has been verified.</p>
                  </motion.div>
                ) : (
                  <>
                    {/* Instructions */}
                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4">
                      <h4 className="text-blue-900 dark:text-blue-300 font-medium mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        How to verify your profile
                      </h4>
                      <p className="text-blue-700 dark:text-blue-400 text-sm">{platformConfig.instructions}</p>
                    </div>

                    {/* Verification Code */}
                    {isGenerating ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <span className="ml-3 text-muted-foreground">Generating code...</span>
                      </div>
                    ) : verificationRequest ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <label className="block text-sm font-medium text-foreground mb-2">Your Verification Code</label>
                        <div className="flex gap-3">
                          <div className="flex-1 bg-secondary border-2 border-blue-200 dark:border-blue-500/30 rounded-xl px-4 py-4 flex items-center justify-between">
                            <code className="text-blue-600 dark:text-blue-400 font-mono text-xl font-bold tracking-wider">
                              {verificationRequest.code}
                            </code>
                            <button onClick={handleCopy}
                              className="w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors">
                              {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Timer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              Expires in{' '}
                              <span className={timeRemaining.totalSeconds < 60 ? 'text-red-500 font-medium' : 'text-foreground font-medium'}>
                                {formatTimeRemaining(timeRemaining.minutes, timeRemaining.seconds)}
                              </span>
                            </span>
                          </div>
                          <button onClick={handleGenerateNew} disabled={isGenerating || cooldownRemaining > 0}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center gap-1">
                            {isGenerating ? <><Loader2 className="w-3 h-3 animate-spin" />Generating...</>
                              : cooldownRemaining > 0 ? <>Wait {cooldownRemaining}s</>
                              : <><RefreshCw className="w-3 h-3" />Generate New</>}
                          </button>
                        </div>

                        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-3 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                          <span className="text-green-700 dark:text-green-400 text-sm">Verification code generated! Follow the steps below.</span>
                        </div>
                      </motion.div>
                    ) : null}

                    {/* Step-by-step instructions */}
                    {verificationRequest && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Step-by-step instructions:</h4>
                        <ol className="space-y-2">
                          {platformConfig.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-sm font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-muted-foreground text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {/* Open Profile Button */}
                    {verificationRequest && (
                      <a href={editUrl} target="_blank" rel="noopener noreferrer"
                        className={`w-full ${platformConfig.buttonColor} text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors`}>
                        <ExternalLink className="w-5 h-5" />
                        Open {platformConfig.name} Edit Page
                      </a>
                    )}

                    {/* Error */}
                    {error && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" onClick={onClose} className="flex-1 py-6 border-border text-foreground hover:bg-accent">
                        Cancel
                      </Button>
                      <Button onClick={handleVerify} disabled={isVerifying || !verificationRequest || timeRemaining.isExpired}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-6">
                        {isVerifying ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Verifying...</>
                          : <><Shield className="w-5 h-5 mr-2" />Verify Profile</>}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
