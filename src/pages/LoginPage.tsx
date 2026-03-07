import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthProvider';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { AnimatedShaderBG } from '@/components/ui/animated-shader-bg';
import type { Page } from '@/lib/constants';

export const LoginPage = memo(({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { signIn, isAuthLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error: signInError, success } = await signIn(email, password);
        if (!success && signInError) {
            setError(signInError.message);
            toast.error('Login failed', { description: signInError.message });
        } else if (success) {
            toast.success('Welcome back!');
            onNavigate('landing');
        }
    };

    return (
        <motion.div className="min-h-screen bg-background flex relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 z-0">
                <AnimatedShaderBG />
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-12 z-10">
                <motion.div className="w-full max-w-md" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <div className="bg-background/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-border/50">
                        <div className="flex justify-between items-center mb-6">
                            <Button variant="ghost" size="sm" onClick={() => onNavigate('landing')} className="text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back
                            </Button>
                            <ThemeToggle />
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
                            <p className="text-muted-foreground">
                                Don't have an account?{' '}
                                <button onClick={() => onNavigate('register')} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign up</button>
                            </p>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="floating-group">
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder=" " className="floating-input" required />
                                <label className="floating-label">Email</label>
                            </div>
                            <div className="floating-group mt-2">
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                        placeholder=" " className="floating-input pr-12" required />
                                    <label className="floating-label">Password</label>
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => onNavigate('forgot-password')} className="text-muted-foreground hover:text-foreground text-sm">Forgot Password?</button>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-medium rounded-xl" disabled={isAuthLoading}>
                                {isAuthLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Signing in...</> : 'Sign In'}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
});
