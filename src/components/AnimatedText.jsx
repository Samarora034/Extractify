'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * AnimatedText — animates text with a slide-up reveal per-word.
 * Drop-in replacement for the previous character-by-character component.
 */
export default function AnimatedText({ text = '', className = '', as: Tag = 'span' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px 0px' });
  const words = text.split(' ');

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0 0.3em', overflow: 'hidden' }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              delay: i * 0.07,
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
