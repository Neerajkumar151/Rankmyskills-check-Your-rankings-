import { useState, memo } from 'react';
import { Home, FolderOpen, Globe, Building2, Edit3, LogOut, Menu, ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthProvider';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import type { Page, DashboardPage } from '@/lib/constants';

export const DashboardLayout = memo(({ children, currentPage, onNavigate }: { children: React.ReactNode; currentPage: DashboardPage; onNavigate: (page: Page) => void }) => {
  const { profile, signOut, isAuthLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
    { id: 'global-leaderboard', label: 'Global Leaderboard', icon: Globe },
    { id: 'college-leaderboard', label: 'College Leaderboard', icon: Building2 },
    { id: 'edit-profile', label: 'Edit Profile', icon: Edit3 },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId === 'home' ? 'dashboard' : (pageId as Page));
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed', { description: 'Your local session has been cleared. Please refresh if needed.' });
    } finally {
      onNavigate('landing');
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-foreground font-semibold text-lg">RankMySkills</span>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile?.profile_image_url || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">{profile?.name?.split(' ').map((n) => n[0]).join('') || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-medium truncate">{profile?.name || 'User'}</p>
            <p className="text-muted-foreground text-sm truncate">{profile?.email || ''}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={handleSignOut} disabled={isAuthLoading}>
          {isAuthLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </>
          )}
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-[280px] flex-col bg-card border-r border-border fixed h-full">
        <SidebarContent />
      </aside>
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 text-foreground">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] bg-card border-border p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <main className="flex-1 lg:ml-[280px]">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('landing')} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
});
