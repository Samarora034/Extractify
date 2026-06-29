'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import { FilledMagneticButton } from '@/components/MagneticButton';

function ArrowRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984" />
    </svg>
  );
}

export default function SettingsPage() {
  const [user, setUser]   = useState(null);
  const [name, setName]   = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(u => { setUser(u); setName(u.name || ''); }).catch(() => {});
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!user) {
    return (
      <div style={{ paddingTop: '6rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--gray-mid)', fontSize: '0.875rem' }}>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
          style={{ display: 'inline-block', width: 18, height: 18, border: '1.5px solid rgba(255,255,255,0.1)', borderTopColor: 'rgba(255,255,255,0.5)', borderRadius: '50%' }}
        />
        Loading…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Hero */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <ScrollReveal y={20}>
          <p className="section-label">Account</p>
        </ScrollReveal>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#fff', marginBottom: '1rem' }}
          >
            Settings
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ color: 'var(--gray-light)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '380px' }}
        >
          Manage your profile, preferences, and account settings.
        </motion.p>
      </section>

      {/* Form card */}
      <ScrollReveal y={28} delay={0.1}>
        <div
          className="glass-card"
          style={{ maxWidth: '480px', padding: '2.5rem', borderRadius: 20, position: 'relative', overflow: 'hidden' }}
        >
          {/* Corner crosses */}
          {[
            { top: '1rem', right: '1rem' },
            { bottom: '1rem', right: '1rem' },
          ].map((pos, i) => (
            <div key={i} className="cross" style={{ position: 'absolute', opacity: 0.1, ...pos }} />
          ))}

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-mid)', display: 'block', marginBottom: '0.5rem' }}>
                Display Name
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="lusion-input"
                data-cursor
                placeholder="Your name"
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-mid)', display: 'block', marginBottom: '0.5rem' }}>
                Email
              </label>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', padding: '0.5rem 0' }}>{user.email}</p>
            </div>

            {/* Tier */}
            <div>
              <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-mid)', display: 'block', marginBottom: '0.5rem' }}>
                Plan Tier
              </label>
              <span
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.875rem',
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  letterSpacing: '0.06em',
                  textTransform: 'capitalize',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                {user.tier}
              </span>
            </div>

            {/* Save row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingTop: '0.5rem' }}>
              <FilledMagneticButton as="button" type="submit">
                Save Changes
                <span style={{ marginLeft: '0.25rem' }}><ArrowRight /></span>
              </FilledMagneticButton>

              <AnimatePresence>
                {saved && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    Saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}
