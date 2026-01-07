'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout wraps all user-facing pages with the Header and Footer.
 * It handles the sticky header spacing and provides a consistent layout.
 * 
 * Note: Admin pages (/admin/*) should NOT use this layout.
 * They will have their own AdminLayout with a sidebar.
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Main content area - grows to fill available space */}
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
