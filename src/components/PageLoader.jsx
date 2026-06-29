'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const TITLE = 'EXTRACTIFY';
const SUB   = 'SGLang-Powered Extraction';

export default function PageLoader({ children }) {
  const [phase, setPhase] = useState('loading'); // loading | exiting | done
  const lineRef = useRef(null);

  useEffect(() => {
    // After letters reveal, wait, then exit
    const t1 = setTimeout(() => setPhase('exiting'), 2000);
    const t2 = setTimeout(() => setPhase('done'), 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {phase !== 'done' && (
          <motion.div
            key="loader"
            className="loader-panel"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Letter reveal */}
            <div className="loader-letters">
              {TITLE.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="loader-letter"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.2 + i * 0.045,
                    duration: 0.55,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Progress line */}
            <motion.div
              className="loader-line"
              initial={{ width: 0 }}
              animate={{ width: '12rem' }}
              transition={{ delay: 0.15, duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
            />

            {/* Subtitle */}
            <motion.p
              className="loader-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              {SUB}
            </motion.p>

            {/* Cross decorations */}
            {[
              { top: '15%', left: '10%' },
              { top: '15%', right: '10%' },
              { bottom: '15%', left: '10%' },
              { bottom: '15%', right: '10%' },
            ].map((style, i) => (
              <motion.div
                key={i}
                className="cross"
                style={{ position: 'absolute', ...style, opacity: 0.15 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== 'loading' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: phase === 'exiting' ? 0.5 : 0 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
