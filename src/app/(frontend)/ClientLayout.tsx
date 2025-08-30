'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './header/page';
import Footer from './components/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const _handleRouteChange = () => {
      setLoading(true);
    };

    const _handleRouteComplete = () => {
      setLoading(false);
    };

    // NProgress events can be used here if you add nprogress to your project
    // For now, we'll simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the delay as needed

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <>
      {loading && <LoadingSpinner />}
      <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}
