'use client';
import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

export default function CounterAnimation({ value, className = '' }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 50, damping: 20 });
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) motionValue.set(typeof value === 'number' ? value : parseInt(value) || 0);
  }, [inView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString();
    });
    return unsubscribe;
  }, [spring]);

  return <span ref={ref} className={className}>0</span>;
}
