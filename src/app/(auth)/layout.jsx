'use client';
import Cursor from '@/components/Cursor';
import SmoothScroll from '@/components/SmoothScroll';

export default function AuthLayout({ children }) {
  return (
    <SmoothScroll>
      <Cursor />
      {/* Noise overlay */}
      <div className="noise-overlay" aria-hidden="true" />
      <div
        className="hide-cursor"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow blobs */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'drift 12s ease-in-out infinite',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: '40vw',
            height: '40vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'drift 15s ease-in-out infinite reverse',
          }}
        />
        {children}
      </div>
    </SmoothScroll>
  );
}
