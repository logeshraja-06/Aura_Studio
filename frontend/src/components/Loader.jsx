import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onFinish }) {
  const [stage, setStage] = useState('iris'); // 'iris' -> 'shimmer' -> 'exit'

  useEffect(() => {
    // Stage 1: Iris blade spirals open (0 -> 1.2s)
    const timer1 = setTimeout(() => {
      setStage('shimmer');
    }, 1100);

    // Stage 2: Gold shimmer sweep over logo (1.2s -> 2.4s)
    const timer2 = setTimeout(() => {
      setStage('exit');
    }, 2300);

    // Stage 3: Complete & callback (2.6s)
    const timer3 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {stage !== 'exit' && (
        <motion.div
          key="aperture-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-[100] bg-charcoal text-cream flex items-center justify-center overflow-hidden select-none"
        >
          {/* Camera Aperture Blade Ring SVG (Spiraling Open) */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
            <svg
              className="w-full h-full text-gold/30"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
            >
              {/* 8 Aperture Blades spiraling */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.path
                  key={i}
                  d="M100 20 C140 20 180 60 180 100 C150 70 120 40 100 20 Z"
                  transform={`rotate(${angle} 100 100)`}
                  initial={{ rotate: angle, scale: 0.2, opacity: 0 }}
                  animate={{
                    rotate: angle + (stage === 'iris' ? 0 : 35),
                    scale: stage === 'iris' ? 1 : 1.35,
                    opacity: stage === 'iris' ? 0.7 : 0,
                  }}
                  transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
                  fill="url(#blade-gradient)"
                  stroke="#C9A227"
                  strokeWidth="0.5"
                />
              ))}

              <defs>
                <linearGradient id="blade-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A8654A" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#C9A227" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Center Monogram with Gold Shimmer Sweep */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center z-10"
            >
              {/* Studio Logo Text with Gold Shimmer Sweep */}
              <div className="relative overflow-hidden inline-block px-4 py-2">
                <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-widest text-cream">
                  AURA
                </h1>

                {/* Subtle Gold Shimmer Sweep across letters */}
                {stage === 'shimmer' && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gold to-transparent opacity-75 mix-blend-overlay pointer-events-none"
                  />
                )}
              </div>

              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="block text-[10px] uppercase font-montserrat tracking-[0.3em] text-gold mt-1 font-semibold"
              >
                Cinematic Wedding Studio
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
