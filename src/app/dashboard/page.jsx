'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ScrollReveal, { WordReveal } from '@/components/ScrollReveal';
import CounterAnimation from '@/components/CounterAnimation';
import MarqueeTicker from '@/components/MarqueeTicker';
import MagneticButton, { FilledMagneticButton } from '@/components/MagneticButton';
import Shimmer from '@/components/Shimmer';

/* ── Arrow icons ──────────────────────────────────────── */
function ArrowRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984" />
    </svg>
  );
}

/* ── Stat Card ────────────────────────────────────────── */
function StatCard({ label, value, suffix = '', index = 0 }) {
  return (
    <ScrollReveal delay={0.1 + index * 0.1} y={40}>
      <div className="stat-card">
        <p
          style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--gray-mid)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
            }}
          />
          {label}
        </p>
        <p
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: '#fff',
          }}
        >
          <CounterAnimation value={value} />
          {suffix}
        </p>
      </div>
    </ScrollReveal>
  );
}

/* ── Activity Row ──────────────────────────────────────── */
function ActivityRow({ item, index }) {
  return (
    <motion.div
      className="activity-row"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 + index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', textTransform: 'capitalize' }}>
          {item.schemaName}
        </span>
      </div>
      <span style={{ fontSize: '0.75rem', color: 'var(--gray-mid)', letterSpacing: '0.03em' }}>
        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    </motion.div>
  );
}

/* ── Main Page ────────────────────────────────────────── */
export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setStats).catch(() => {});
    fetch('/api/extractions').then(r => r.json()).then(d => setRecent(Array.isArray(d) ? d.slice(0, 6) : [])).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── Hero section ──────────────────────────────── */}
      <section style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <ScrollReveal y={20}>
          <p className="section-label">Overview</p>
        </ScrollReveal>

        <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#fff',
            }}
          >
            Dashboard
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ fontSize: '1rem', color: 'var(--gray-light)', maxWidth: '420px', lineHeight: 1.6 }}
        >
          Monitor your extractions, track token usage, and manage your AI-powered data pipeline.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <Link href="/dashboard/extract">
            <FilledMagneticButton>
              Start Extracting
              <span style={{ marginLeft: '0.25rem' }}><ArrowRight /></span>
            </FilledMagneticButton>
          </Link>
          <Link href="/dashboard/history">
            <MagneticButton>
              View History
              <span className="arrow-icon" style={{ marginLeft: '0.25rem' }}><ArrowRight /></span>
            </MagneticButton>
          </Link>
        </motion.div>
      </section>

      {/* ── Marquee ───────────────────────────────────── */}
      <ScrollReveal y={20} delay={0.05}>
        <MarqueeTicker />
      </ScrollReveal>

      {/* ── Stats grid ────────────────────────────────── */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <ScrollReveal y={20}>
          <p className="section-label">Performance</p>
        </ScrollReveal>

        {!stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            {[1, 2, 3].map(i => (
              <Shimmer key={i} className="h-28" style={{ height: '7rem' }} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginTop: '1.5rem',
            }}
          >
            <StatCard index={0} label="Total Extractions" value={stats.totalExtractions} />
            <StatCard index={1} label="Tokens Used"       value={stats.totalTokens} />
            <StatCard index={2} label="Avg Latency"       value={stats.avgLatency} suffix="ms" />
          </div>
        )}
      </section>

      {/* ── Divider line ──────────────────────────────── */}
      <ScrollReveal y={0}>
        <div style={{ height: '1px', background: 'var(--border)', margin: '0 0 5rem' }} />
      </ScrollReveal>

      {/* ── Recent activity ───────────────────────────── */}
      <section style={{ paddingBottom: '6rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
          }}
        >
          <ScrollReveal y={20}>
            <p className="section-label" style={{ marginBottom: 0 }}>Recent Activity</p>
          </ScrollReveal>
          <ScrollReveal y={16} delay={0.1}>
            <Link href="/dashboard/history">
              <MagneticButton style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                See all
                <span className="arrow-icon" style={{ marginLeft: '0.25rem' }}><ArrowRight size={12} /></span>
              </MagneticButton>
            </Link>
          </ScrollReveal>
        </div>

        <ScrollReveal y={30} delay={0.05}>
          <div className="glass-card" style={{ overflow: 'hidden', borderRadius: '16px' }}>
            {recent.length === 0 ? (
              <div
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  color: 'var(--gray-mid)',
                  fontSize: '0.875rem',
                  letterSpacing: '0.03em',
                }}
              >
                <p>No extractions yet.</p>
                <Link href="/dashboard/extract" style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', display: 'inline-block' }}>
                  Try the Extract tab →
                </Link>
              </div>
            ) : (
              recent.map((e, i) => <ActivityRow key={e.id} item={e} index={i} />)
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* ── CTA footer band ──────────────────────────── */}
      <ScrollReveal y={40} delay={0.05}>
        <div
          style={{
            marginBottom: '4rem',
            padding: '4rem 3rem',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Corner crosses */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
            <div
              key={pos}
              className="cross"
              style={{
                position: 'absolute',
                opacity: 0.2,
                ...(pos === 'top-left'     ? { top: '1.5rem', left: '1.5rem' } : {}),
                ...(pos === 'top-right'    ? { top: '1.5rem', right: '1.5rem' } : {}),
                ...(pos === 'bottom-left'  ? { bottom: '1.5rem', left: '1.5rem' } : {}),
                ...(pos === 'bottom-right' ? { bottom: '1.5rem', right: '1.5rem' } : {}),
              }}
            />
          ))}

          <p className="section-label" style={{ justifyContent: 'center' }}>Ready to extract?</p>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: '0.75rem 0 2rem',
            }}
          >
            Turn any text into structured data
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link href="/dashboard/extract">
              <FilledMagneticButton>
                Start Extracting
                <span style={{ marginLeft: '0.25rem' }}><ArrowRight /></span>
              </FilledMagneticButton>
            </Link>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
}
