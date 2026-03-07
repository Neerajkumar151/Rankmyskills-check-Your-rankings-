import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthProvider';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { AnimatedShaderBG } from '@/components/ui/animated-shader-bg';
import { colleges, courses, graduationYears, type Page } from '@/lib/constants';

export const RegisterPage = memo(({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    const { signUp, isAuthLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', college: '', course: '', graduationYear: '' });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error: signUpError, success, needsVerification } = await signUp(formData.email, formData.password, {
            name: formData.fullName, college: formData.college, course: formData.course, graduationYear: formData.graduationYear
        });
        if (!success && signUpError) {
            setError(signUpError.message);
            toast.error('Signup failed', { description: signUpError.message });
        } else if (success && needsVerification) {
            toast.success('Account created!', {
                description: 'Please verify your email before logging in.',
                duration: 6000,
            });
            onNavigate('login');
        } else if (success) {
            toast.success('Account created!', { description: 'Welcome aboard!' });
            onNavigate('landing');
        }
    };

    return (
        <motion.div className="min-h-screen bg-background flex relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 z-0">
                <AnimatedShaderBG />
            </div>

            <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto z-10">
                <motion.div className="w-full max-w-md my-auto" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <div className="bg-background/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-border/50">
                        <div className="flex justify-between items-center mb-6">
                            <Button variant="ghost" size="sm" onClick={() => onNavigate('landing')} className="text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back
                            </Button>
                            <ThemeToggle />
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-foreground mb-2">Create Account</h1>
                            <p className="text-muted-foreground">
                                Already have an account?{' '}
                                <button onClick={() => onNavigate('login')} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign in</button>
                            </p>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="floating-group">
                                <input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder=" " className="floating-input" required />
                                <label className="floating-label">Full Name</label>
                            </div>
                            <div className="floating-group mt-2">
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder=" " className="floating-input" required />
                                <label className="floating-label">Email</label>
                            </div>
                            <div className="floating-group mt-2 relative">
                                <input type={showPassword ? 'text' : 'password'} value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder=" " className="floating-input pr-12" minLength={6} required />
                                <label className="floating-label">Password</label>
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <div>
                                <Label className="text-foreground mb-2 block">College</Label>
                                <Select onValueChange={(value) => setFormData({ ...formData, college: value })}>
                                    <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Select Your College" /></SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                        {colleges.map((c) => <SelectItem key={c} value={c} className="text-foreground">{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-foreground mb-2 block">Course</Label>
                                    <Select onValueChange={(value) => setFormData({ ...formData, course: value })}>
                                        <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Course" /></SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            {courses.map((c) => <SelectItem key={c} value={c} className="text-foreground">{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-foreground mb-2 block">Year</Label>
                                    <Select onValueChange={(value) => setFormData({ ...formData, graduationYear: value })}>
                                        <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue placeholder="Year" /></SelectTrigger>
                                        <SelectContent className="bg-card border-border">
                                            {graduationYears.map((y) => <SelectItem key={y} value={y} className="text-foreground">{y}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 font-medium rounded-xl mt-2" disabled={isAuthLoading}>
                                {isAuthLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Creating account...</> : 'Create Account'}
                            </Button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
});