import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/context/AuthProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { DashboardHome } from '@/pages/DashboardHome';
import { Portfolio } from '@/pages/Portfolio';
import { GlobalLeaderboard } from '@/pages/GlobalLeaderboard';
import { CollegeLeaderboard } from '@/pages/CollegeLeaderboard';
import { EditProfile } from '@/pages/EditProfile';
import { ScoreFormulaPage } from '@/pages/ScoreFormulaPage';
import { LevelSystemPage } from '@/pages/LevelSystemPage';
import { FAQPage } from '@/pages/FAQPage';
import { HowItWorksPage } from '@/pages/HowItWorksPage';
import type { Page } from '@/lib/constants';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && ['login', 'register', 'forgot-password'].includes(currentPage)) {
      setCurrentPage('landing');
    }
  }, [isAuthenticated, currentPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (isLoading) {
    return (
      <>
        <LoadingSpinner />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'register':
        return <RegisterPage onNavigate={setCurrentPage} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return isAuthenticated ? (
          <DashboardLayout currentPage="home" onNavigate={setCurrentPage}>
            <DashboardHome />
          </DashboardLayout>
        ) : (
          <LoginPage onNavigate={setCurrentPage} />
        );
      case 'portfolio':
        return isAuthenticated ? (
          <DashboardLayout currentPage="portfolio" onNavigate={setCurrentPage}>
            <Portfolio onNavigate={setCurrentPage} />
          </DashboardLayout>
        ) : (
          <LoginPage onNavigate={setCurrentPage} />
        );
      case 'global-leaderboard':
        return isAuthenticated ? (
          <DashboardLayout currentPage="global-leaderboard" onNavigate={setCurrentPage}>
            <GlobalLeaderboard />
          </DashboardLayout>
        ) : (
          <LoginPage onNavigate={setCurrentPage} />
        );
      case 'college-leaderboard':
        return isAuthenticated ? (
          <DashboardLayout currentPage="college-leaderboard" onNavigate={setCurrentPage}>
            <CollegeLeaderboard />
          </DashboardLayout>
        ) : (
          <LoginPage onNavigate={setCurrentPage} />
        );
      case 'edit-profile':
        return isAuthenticated ? (
          <DashboardLayout currentPage="edit-profile" onNavigate={setCurrentPage}>
            <EditProfile />
          </DashboardLayout>
        ) : (
          <LoginPage onNavigate={setCurrentPage} />
        );
      case 'score-formula':
        return <ScoreFormulaPage onNavigate={setCurrentPage} />;
      case 'level-system':
        return <LevelSystemPage onNavigate={setCurrentPage} />;
      case 'faq':
        return <FAQPage onNavigate={setCurrentPage} />;
      case 'how-it-works':
        return <HowItWorksPage onNavigate={setCurrentPage} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
