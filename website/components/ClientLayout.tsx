'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
