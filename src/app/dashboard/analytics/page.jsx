'use client';
import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import CounterAnimation from '@/components/CounterAnimation';
import ScrollReveal from '@/components/ScrollReveal';
import Shimmer from '@/components/Shimmer';

const PALETTE = ['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)', 'rgba(255,255,255,0.25)'];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden:  { y: 28, opacity: 0 },
  visible: { y: 0,  opacity: 1, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.65 } },
};

function StatBadge({ label, value, suffix = '', index = 0 }) {
  return (
    <motion.div variants={fadeUp} className="stat-card">
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray-mid)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'inline-block' }} />
        {label}
      </p>
      <p style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>
        <CounterAnimation value={value} />{suffix}
      </p>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* Hero */}
      <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <ScrollReveal y={20}>
          <p className="section-label">Data Intelligence</p>
        </ScrollReveal>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.04em', color: '#fff', marginBottom: '1rem' }}
          >
            Analytics
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ color: 'var(--gray-light)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '380px' }}
        >
          Real-time performance insights across your extraction pipeline.
        </motion.p>
      </section>

      {/* Stats grid */}
      {!data ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {[1,2,3,4].map(i => <Shimmer key={i} style={{ height: '6.5rem', borderRadius: 12 }} />)}
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}
        >
          <StatBadge label="Extractions" value={data.totalExtractions} />
          <StatBadge label="Total Tokens" value={data.totalTokens} />
          <StatBadge label="Avg Latency"  value={data.avgLatency} suffix="ms" />
          <StatBadge label="Schemas"      value={data.bySchema?.length ?? 0} />
        </motion.div>
      )}

      {/* Divider */}
      <ScrollReveal y={0}>
        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '4rem' }} />
      </ScrollReveal>

      {/* Chart */}
      {data?.bySchema?.length > 0 && (
        <ScrollReveal y={30} delay={0.1}>
          <div className="glass-card" style={{ padding: '2rem', borderRadius: 16 }}>
            <p className="section-label" style={{ marginBottom: '2rem' }}>Extractions by Schema</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.bySchema.map(s => ({ name: s.name, count: s.count }))} barCategoryGap="35%">
                <XAxis
                  dataKey="name"
                  stroke="transparent"
                  tick={{ fill: 'var(--gray-mid)', fontSize: 11, fontFamily: 'var(--font)', letterSpacing: '0.05em' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="transparent"
                  tick={{ fill: 'var(--gray-mid)', fontSize: 11, fontFamily: 'var(--font)' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(12,12,12,0.95)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    fontSize: 12,
                    fontFamily: 'var(--font)',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1200} animationEasing="ease-out">
                  {data.bySchema.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
