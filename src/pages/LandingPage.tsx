import { memo } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PlatformsSection } from '@/components/landing/PlatformsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { Footer } from '@/components/landing/Footer';
import type { Page } from '@/lib/constants';

export const LandingPage = memo(({ onNavigate }: { onNavigate: (page: Page) => void }) => {
    return (
        <motion.div className="min-h-screen bg-background" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Header onNavigate={onNavigate} />

            <HeroSection onNavigate={onNavigate} />
            <PlatformsSection />
            <HowItWorks />
            <FeaturesSection />
            <TestimonialsSection />
            <Footer onNavigate={onNavigate} />
        </motion.div>
    );
});
