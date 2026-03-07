import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  FileText, 
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthProvider';

interface ProfileFormProps {
  onSuccess?: () => void;
}

export function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { profile, updateProfile, uploadProfileImage } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
      });
      setPreviewUrl(profile.profile_image_url);
    }
  }, [profile]);

  const clearMessages = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 5000);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Only JPG, PNG, and WebP are allowed.');
      clearMessages();
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('File size exceeds 2MB limit.');
      clearMessages();
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { url, error, success } = await uploadProfileImage(file);
      if (error || !success) {
        setErrorMessage(error?.message || 'Failed to upload image');
        setPreviewUrl(profile?.profile_image_url || null);
      } else if (url) {
        setSuccessMessage('Profile image updated successfully!');
        clearMessages();
      }
    } catch {
      setErrorMessage('An unexpected error occurred while uploading.');
      setPreviewUrl(profile?.profile_image_url || null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [uploadProfileImage, profile?.profile_image_url, clearMessages]);

  const handleCameraClick = () => fileInputRef.current?.click();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage('Name is required');
      clearMessages();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { error, success } = await updateProfile({
        name: formData.name.trim(),
        bio: formData.bio.trim() || null,
      });

      if (error || !success) {
        setErrorMessage(error?.message || 'Failed to update profile');
      } else {
        setSuccessMessage('Profile updated successfully!');
        onSuccess?.();
        clearMessages();
      }
    } catch {
      setErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 shadow-lg">
            <AvatarImage src={previewUrl || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
              {formData.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={handleCameraClick}
            disabled={isUploading}
            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors disabled:opacity-50 shadow-lg"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} className="hidden" />
        </div>
        <p className="text-muted-foreground text-xs mt-3">Max 2MB. JPG, PNG, WebP</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-foreground flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        <div>
          <Label htmlFor="bio" className="text-foreground flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            Bio
          </Label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none resize-none"
          />
        </div>

        <div>
          <Label htmlFor="college" className="text-foreground flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            College
            <span className="text-muted-foreground text-xs">(read-only)</span>
          </Label>
          <Input
            id="college"
            value={profile?.college || ''}
            disabled
            className="bg-muted border-border text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-400 text-sm">{successMessage}</p>
          </motion.div>
        )}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-400 text-sm">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-medium rounded-xl transition-colors"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
}
