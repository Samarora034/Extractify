'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JsonReveal from '@/components/JsonReveal';
import MagneticButton, { FilledMagneticButton } from '@/components/MagneticButton';
import ScrollReveal from '@/components/ScrollReveal';

const SCHEMAS = ['invoice', 'resume', 'email', 'article'];

function ArrowRight({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984" />
    </svg>
  );
}

export default function ExtractPage() {
  const [text, setText]     = useState('');
  const [schema, setSchema] = useState('invoice');
  const [result, setResult] = useState(null);
  const [meta, setMeta]     = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleExtract() {
    setLoading(true); setResult(null); setMeta(null);
    const res  = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, schemaName: schema }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) { setResult(data.result); setMeta({ tokens: data.tokensUsed, latency: data.latencyMs }); }
    else          setResult({ error: data.error });
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Hero */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <ScrollReveal y={20}>
          <p className="section-label">AI Engine</p>
        </ScrollReveal>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#fff', marginBottom: '1rem' }}
          >
            Extract Data
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ color: 'var(--gray-light)', fontSize: '0.95rem', maxWidth: '400px', lineHeight: 1.6 }}
        >
          Paste any text and extract structured JSON using our SGLang-powered AI engine.
        </motion.p>
      </section>

      {/* Two-column form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* Left: Input */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          <div>
            <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-mid)', display: 'block', marginBottom: '0.5rem' }}>
              Schema
            </label>
            <select
              value={schema}
              onChange={e => setSchema(e.target.value)}
              className="lusion-input"
              data-cursor
              style={{ appearance: 'none', cursor: 'none' }}
            >
              {SCHEMAS.map(s => (
                <option key={s} value={s} style={{ background: '#111' }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-mid)', display: 'block', marginBottom: '0.5rem' }}>
              Input Text
            </label>
            <div style={{ position: 'relative' }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={14}
                placeholder="Paste text to extract data from…"
                className="lusion-input"
                data-cursor
                style={{ resize: 'vertical', minHeight: '280px' }}
              />
            </div>
          </div>

          <div>
            <FilledMagneticButton
              as="button"
              onClick={handleExtract}
              disabled={loading || !text}
              style={{
                width: '100%',
                justifyContent: 'center',
                opacity: loading || !text ? 0.5 : 1,
                pointerEvents: loading || !text ? 'none' : 'all',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                    style={{
                      display: 'inline-block',
                      width: 14, height: 14,
                      border: '1.5px solid rgba(0,0,0,0.2)',
                      borderTopColor: '#000',
                      borderRadius: '50%',
                    }}
                  />
                  Processing…
                </span>
              ) : (
                <>
                  Extract
                  <span style={{ marginLeft: '0.3rem' }}><ArrowRight /></span>
                </>
              )}
            </FilledMagneticButton>
          </div>
        </motion.div>

        {/* Right: Output */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Meta badges */}
          <AnimatePresence>
            {meta && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}
              >
                {[
                  { label: 'Latency', value: `${meta.latency}ms` },
                  { label: 'Tokens',  value: meta.tokens },
                ].map(b => (
                  <span
                    key={b.label}
                    style={{
                      fontSize: '0.68rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--gray-mid)',
                      border: '1px solid var(--border)',
                      borderRadius: '100px',
                      padding: '0.2rem 0.75rem',
                    }}
                  >
                    {b.label}: <span style={{ color: 'rgba(255,255,255,0.7)' }}>{b.value}</span>
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="glass-card"
            style={{ minHeight: '360px', padding: '1.5rem', overflow: 'auto', borderRadius: '16px' }}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.04)', overflow: 'hidden', width: `${60 + (i * 13) % 40}%` }}>
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.1, ease: 'easeInOut' }}
                        style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }}
                      />
                    </div>
                  ))}
                </motion.div>
              ) : result?.error ? (
                <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#ff6b6b', fontSize: '0.875rem' }}>
                  {result.error}
                </motion.p>
              ) : result ? (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <JsonReveal data={result} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    padding: '4rem 2rem',
                  }}
                >
                  <div className="cross" style={{ opacity: 0.15 }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-mid)', letterSpacing: '0.05em' }}>
                    Results will appear here
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {result && !result.error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(74,222,128,0.7)' }}>
                Extraction Complete
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
