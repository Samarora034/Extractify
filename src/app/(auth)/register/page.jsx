'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FilledMagneticButton } from '@/components/MagneticButton';

function ArrowRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984" />
    </svg>
  );
}

export default function RegisterPage() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error);
      setLoading(false);
      return;
    }
    router.push('/login');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '100%',
        maxWidth: '400px',
        padding: '2.5rem',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
      }}
    >
      {/* Corner crosses */}
      {[
        { top: '1rem', left: '1rem' },
        { top: '1rem', right: '1rem' },
        { bottom: '1rem', left: '1rem' },
        { bottom: '1rem', right: '1rem' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="cross"
          style={{ position: 'absolute', opacity: 0.15, ...pos }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08 }}
        />
      ))}

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gray-mid)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span style={{ width: 16, height: 1, background: 'var(--gray-mid)', display: 'inline-block' }} />
          Extractify
        </motion.p>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}
          >
            Create account
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ fontSize: '0.85rem', color: 'var(--gray-mid)', marginTop: '0.4rem' }}
        >
          Join the extraction platform
        </motion.p>
      </div>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: '0.8rem', color: '#ff6b6b',
            background: 'rgba(255,107,107,0.08)',
            border: '1px solid rgba(255,107,107,0.15)',
            borderRadius: 8, padding: '0.625rem 1rem',
            marginBottom: '1.25rem',
          }}
        >
          {error}
        </motion.p>
      )}

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {[
          { label: 'Name',     type: 'text',     value: name,     set: setName,     placeholder: 'Your name'        },
          { label: 'Email',    type: 'email',    value: email,    set: setEmail,    placeholder: 'you@example.com'  },
          { label: 'Password', type: 'password', value: password, set: setPassword, placeholder: '••••••••'         },
        ].map(({ label, type, value, set, placeholder }) => (
          <div key={label}>
            <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-mid)', display: 'block', marginBottom: '0.4rem' }}>
              {label}
            </label>
            <input
              type={type}
              value={value}
              onChange={e => set(e.target.value)}
              placeholder={placeholder}
              required={type !== 'text'}
              className="lusion-input"
              data-cursor
            />
          </div>
        ))}

        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
          <FilledMagneticButton
            as="button"
            type="submit"
            style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'all' }}
          >
            {loading ? 'Creating…' : 'Create Account'}
            {!loading && <span style={{ marginLeft: '0.25rem' }}><ArrowRight /></span>}
          </FilledMagneticButton>
        </div>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ fontSize: '0.8rem', color: 'var(--gray-mid)', marginTop: '1.5rem', textAlign: 'center' }}
      >
        Already have an account?{' '}
        <Link
          href="/login"
          data-cursor
          style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
        >
          Sign In →
        </Link>
      </motion.p>
    </motion.div>
  );
}
