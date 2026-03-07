import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthProvider';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { AnimatedShaderBG } from '@/components/ui/animated-shader-bg';
import type { Page } from '@/lib/constants';

export const ForgotPasswordPage = memo(({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { resetPassword, isAuthLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error: resetError, success: resetSuccess } = await resetPassword(email);
        if (!resetSuccess && resetError) {
            setError(resetError.message);
            toast.error('Failed', { description: resetError.message });
        } else {
            setSuccess(true);
            toast.success('Reset link sent!');
        }
    };

    return (
        <motion.div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="absolute inset-0 z-0">
                <AnimatedShaderBG />
            </div>

            <motion.div className="w-full max-w-md relative z-10" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="bg-background/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-border/50">
                    <div className="flex justify-between items-center mb-6">
                        <Button variant="ghost" size="sm" onClick={() => onNavigate('login')} className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4 mr-1" /> Back
                        </Button>
                        <ThemeToggle />
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-foreground mb-2">Reset Password</h1>
                        <p className="text-muted-foreground">Enter your email to receive a reset link.</p>
                    </div>
                    {success ? (
                        <div className="text-center py-8">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <p className="text-foreground font-medium mb-2">Check your email</p>
                            <p className="text-muted-foreground text-sm mb-6">We've sent a password reset link to {email}</p>
                            <button onClick={() => onNavigate('login')} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Back to Login</button>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500" /><p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                </div>
                            )}
                            <div className="floating-group">
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder=" " className="floating-input" required />
                                <label className="floating-label">Email</label>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl" disabled={isAuthLoading}>
                                {isAuthLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Sending...</> : 'Send Reset Link'}
                            </Button>
                        </form>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
});
