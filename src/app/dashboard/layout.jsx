'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';
import PageLoader from '@/components/PageLoader';
import SmoothScroll from '@/components/SmoothScroll';
import Cursor from '@/components/Cursor';

export default function DashboardLayout({ children }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '1px solid rgba(255,255,255,0.15)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin-slow 0.9s linear infinite',
          }}
        />
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <SmoothScroll>
      <Cursor />

      {/* Noise film grain */}
      <div className="noise-overlay" aria-hidden="true" />

      <PageLoader>
        <div className="hide-cursor" style={{ minHeight: '100vh' }}>
          {/* Lusion-style floating header */}
          <Header />

          {/* Page content sits below the fixed header */}
          <main className="app-main" style={{ padding: '2.5rem' }}>
            {children}
          </main>
        </div>
      </PageLoader>
    </SmoothScroll>
  );
}
