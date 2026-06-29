'use client';
import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * MagneticButton
 * Wraps any button/link with a magnetic hover effect.
 * The element slightly follows the cursor within its bounds.
 *
 * Props:
 *  - children
 *  - className
 *  - strength: number (0–1, default 0.35)
 *  - as: 'button' | 'a' | 'div'
 *  - href: (if as='a')
 *  - onClick
 *  - ...rest: any other html button/a props
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  as: Tag = 'button',
  ...rest
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setOffset({ x: dx * strength, y: dy * strength });
    });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.5 }}
      style={{ display: 'inline-flex' }}
    >
      <Tag
        className={`magnetic-btn ${className}`}
        data-cursor
        {...rest}
      >
        {children}
      </Tag>
    </motion.div>
  );
}

/**
 * FilledMagneticButton — white filled variant
 */
export function FilledMagneticButton({ children, className = '', ...rest }) {
  return (
    <MagneticButton className={`filled ${className}`} {...rest}>
      {children}
    </MagneticButton>
  );
}
