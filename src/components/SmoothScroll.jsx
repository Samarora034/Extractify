'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

// Shared Lenis instance so ScrollTrigger can access it
let lenisInstance = null;
export const getLenis = () => lenisInstance;

export default function SmoothScroll({ children }) {
  const rafRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisInstance = lenis;

    // Expose on window for GSAP ScrollTrigger integration
    if (typeof window !== 'undefined') {
      window.__lenis = lenis;
    }

    function raf(time) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisInstance = null;
      if (typeof window !== 'undefined') delete window.__lenis;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return children;
}
