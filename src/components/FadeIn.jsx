'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * FadeIn — scroll-triggered fade + translateY reveal.
 * Compatible with Lusion-style section reveals.
 */
export default function FadeIn({
  children,
  delay = 0,
  duration = 0.8,
  y = 30,
  className = '',
  once = true,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ delay, duration, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
