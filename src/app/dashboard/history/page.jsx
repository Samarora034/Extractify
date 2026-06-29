'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';

export default function HistoryPage() {
  const [items, setItems]       = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch('/api/extractions').then(r => r.json()).then(setItems).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Hero */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <ScrollReveal y={20}>
          <p className="section-label">Extraction Log</p>
        </ScrollReveal>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#fff', marginBottom: '1rem' }}
          >
            History
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ color: 'var(--gray-light)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '380px' }}
        >
          Browse all past extractions with their results and performance metrics.
        </motion.p>
      </section>

      {/* Table */}
      <ScrollReveal y={24} delay={0.05}>
        <div className="glass-card" style={{ overflow: 'hidden', borderRadius: 16 }}>
          {items.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--gray-mid)', fontSize: '0.875rem' }}>
              No extractions yet.
            </div>
          ) : (
            items.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <button
                  onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                  className="activity-row"
                  data-cursor
                  style={{ width: '100%', border: 'none', background: 'none', cursor: 'none', textAlign: 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', textTransform: 'capitalize' }}>
                      {e.schemaName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gray-mid)', letterSpacing: '0.05em' }}>{e.tokensUsed} tok</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gray-mid)', letterSpacing: '0.05em' }}>{Math.round(e.latencyMs)}ms</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gray-mid)', letterSpacing: '0.05em' }}>
                      {new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <motion.span
                      animate={{ rotate: expanded === e.id ? 180 : 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ display: 'flex', color: 'var(--gray-mid)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 4l4 4 4-4" />
                      </svg>
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expanded === e.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <pre
                        style={{
                          margin: '0',
                          padding: '1.25rem 1.5rem 1.5rem',
                          fontSize: '0.75rem',
                          fontFamily: '"Fira Code", "Cascadia Code", monospace',
                          color: 'rgba(255,255,255,0.55)',
                          background: 'rgba(255,255,255,0.015)',
                          borderTop: '1px solid var(--border)',
                          overflow: 'auto',
                          maxHeight: '280px',
                          lineHeight: 1.7,
                        }}
                      >
                        {JSON.stringify(JSON.parse(e.result), null, 2)}
                      </pre>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
