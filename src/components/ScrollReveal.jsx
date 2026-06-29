'use client';
import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * ScrollReveal — wraps children in a clip-path / translateY reveal
 * triggered when the element enters the viewport.
 *
 * Props:
 *  - delay:     number (seconds, default 0)
 *  - duration:  number (seconds, default 0.9)
 *  - y:         number (px to start from, default 50)
 *  - once:      bool (default true — only reveal once)
 *  - className: string
 *  - as:        string (html tag, default 'div')
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.9,
  y = 50,
  once = true,
  className = '',
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-80px 0px' });

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y, opacity: 0 }}
        transition={{
          delay,
          duration,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * WordReveal — splits text into words, each revealed individually
 */
export function WordReveal({ text, className = '', delay = 0, stagger = 0.06 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px 0px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}>
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              delay: delay + i * stagger,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
