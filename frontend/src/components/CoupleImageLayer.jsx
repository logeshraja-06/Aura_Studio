import React from 'react';
import { motion } from 'framer-motion';

export default function CoupleImageLayer({ mouseTilt = { rotateX: 0, rotateY: 0 } }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1], delay: 0.5 }}
      style={{
        rotateX: mouseTilt.rotateX,
        rotateY: mouseTilt.rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="absolute right-[2%] sm:right-[5%] lg:right-[8%] bottom-0 sm:bottom-[-2%] w-[180px] sm:w-[320px] md:w-[380px] pointer-events-none select-none z-10 transition-transform duration-300 ease-out"
    >
      {/* Idle float wrapper */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Soft Radial Edge Masked Couple Photograph */}
        <img
          src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=85"
          alt="Couple embracing at golden hour"
          className="w-full h-auto rounded-[2.5rem] object-cover shadow-2xl opacity-70 sm:opacity-100 transition-opacity duration-500"
          style={{
            maskImage: 'radial-gradient(ellipse 75% 85% at center, black 50%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 85% at center, black 50%, transparent 100%)',
          }}
        />

        {/* Warm Golden-Hour Light Sweep Overlay */}
        <motion.div
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
          style={{
            background: 'linear-gradient(115deg, transparent 20%, rgba(233,192,140,0.65) 45%, rgba(201,162,39,0.45) 55%, transparent 75%)',
            backgroundSize: '250% 250%',
            mixBlendMode: 'soft-light',
          }}
          animate={{ backgroundPosition: ['-150% -150%', '150% 150%'] }}
          transition={{ duration: 5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        />

        {/* Soft Gold & Rust Ambient Glow Behind Photo */}
        <div className="absolute -inset-8 -z-10 bg-gradient-radial from-gold/30 via-rust/15 to-transparent blur-3xl opacity-80" />
      </motion.div>
    </motion.div>
  );
}
