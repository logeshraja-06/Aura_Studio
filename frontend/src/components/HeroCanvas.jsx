import React from 'react';
import { motion } from 'framer-motion';

const BOKEH_DOTS = [
  { id: 1, top: '15%', left: '10%', size: 'w-48 h-48', color: 'bg-[#B87352]/20', duration: 8 },
  { id: 2, top: '60%', left: '75%', size: 'w-64 h-64', color: 'bg-[#8B5E3C]/20', duration: 10 },
  { id: 3, top: '40%', left: '30%', size: 'w-36 h-36', color: 'bg-[#D99B7D]/25', duration: 7 },
  { id: 4, top: '25%', left: '80%', size: 'w-52 h-52', color: 'bg-[#B87352]/15', duration: 9 },
  { id: 5, top: '75%', left: '20%', size: 'w-44 h-44', color: 'bg-[#8B5E3C]/20', duration: 11 },
];

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft Blurred Bokeh Floating Circles */}
      {BOKEH_DOTS.map((dot) => (
        <motion.div
          key={dot.id}
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ top: dot.top, left: dot.left }}
          className={`absolute rounded-full blur-3xl ${dot.size} ${dot.color}`}
        />
      ))}

      {/* Subtle Dust Sparkles */}
      <div className="absolute inset-0 bg-[radial-gradient(#B8735215_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
    </div>
  );
}
