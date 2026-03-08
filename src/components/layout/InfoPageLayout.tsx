import { ReactNode } from 'react';
import { Header } from '@/components/layout/Header';
import type { Page } from '@/lib/constants';
import { Footer } from '@/components/landing/Footer';

interface InfoPageLayoutProps {
    children: ReactNode;
    onNavigate: (page: Page) => void;
    ambientGradientClasses?: string;
}

export const InfoPageLayout = ({ children, onNavigate, ambientGradientClasses }: InfoPageLayoutProps) => {
    return (
        <div className="min-h-screen bg-background relative flex flex-col pt-16 selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Ambient Background Gradient (Passed dynamically or default) */}
            <div className={`absolute inset-0 pointer-events-none z-0 ${ambientGradientClasses || 'bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_50%)]'}`} />

            {/* Common Header */}
            <Header onNavigate={onNavigate} />

            {/* Page Content */}
            <div className="relative z-10 flex-1 w-full flex flex-col">
                {children}

                {/* Common Footer fixed at the bottom of the layout flow */}
                <div className="mt-auto relative z-20">
                    <Footer onNavigate={onNavigate} />
                </div>
            </div>
        </div>
    );
};
