'use client';
import { motion } from 'framer-motion';

export default function JsonReveal({ data }) {
  if (!data) return null;
  const entries = Object.entries(data);

  return (
    <div className="font-mono text-sm">
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500">{'{'}</motion.span>
      {entries.map(([key, val], i) => (
        <motion.div key={key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] }} className="pl-4">
          <span className="text-purple-400">&quot;{key}&quot;</span>
          <span className="text-gray-500">: </span>
          <span className="text-green-300">{typeof val === 'object' ? JSON.stringify(val) : JSON.stringify(val)}</span>
          {i < entries.length - 1 && <span className="text-gray-500">,</span>}
        </motion.div>
      ))}
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: entries.length * 0.06 }} className="text-gray-500">{'}'}</motion.span>
    </div>
  );
}
