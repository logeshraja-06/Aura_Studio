import React, { useRef, useState, useEffect } from 'react';

// Color map for luxury palette HSL tones
const GLOW_COLOR_MAP = {
  gold: {
    ambient: 'rgba(201, 162, 39, 0.22)',
    border: 'rgba(233, 192, 140, 0.55)',
    ring: 'rgba(201, 162, 39, 0.4)',
  },
  rust: {
    ambient: 'rgba(168, 101, 74, 0.22)',
    border: 'rgba(180, 115, 90, 0.55)',
    ring: 'rgba(168, 101, 74, 0.4)',
  },
  cream: {
    ambient: 'rgba(233, 192, 140, 0.25)',
    border: 'rgba(253, 248, 243, 0.7)',
    ring: 'rgba(201, 162, 39, 0.35)',
  },
};

export default function GlowCard({
  children,
  glowColor = 'gold',
  as: Component = 'div',
  className = '',
  style = {},
  ...rest
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Detect if fine pointer (mouse) is supported
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    let rafId = null;

    const handlePointerMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPos({ x, y });
        el.style.setProperty('--x', `${x}px`);
        el.style.setProperty('--y', `${y}px`);
      });
    };

    const handlePointerEnter = () => setIsHovered(true);
    const handlePointerLeave = () => {
      setIsHovered(false);
      if (rafId) cancelAnimationFrame(rafId);
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerenter', handlePointerEnter);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerenter', handlePointerEnter);
      el.removeEventListener('pointerleave', handlePointerLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const colorScheme = GLOW_COLOR_MAP[glowColor] || GLOW_COLOR_MAP.gold;

  return (
    <Component
      ref={containerRef}
      className={`group relative overflow-hidden transition-all duration-300 ${className}`}
      style={{
        ...style,
        '--x': `${pos.x}px`,
        '--y': `${pos.y}px`,
      }}
      {...rest}
    >
      {/* Layer 1: Wide Ambient Spotlight (~260px radius) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit] z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(260px circle at var(--x, -200px) var(--y, -200px), ${colorScheme.ambient}, transparent 80%)`,
        }}
      />

      {/* Layer 2: Tighter Brighter Border-Hugging Glow Ring (~180px radius) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit] z-0 mix-blend-screen"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(180px circle at var(--x, -200px) var(--y, -200px), ${colorScheme.border}, transparent 65%)`,
        }}
      />

      {/* Subtle Inset Ring Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[inherit] z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: `inset 0 0 15px ${colorScheme.ring}`,
        }}
      />

      {/* Children Layer (Stacked above glows) */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </Component>
  );
}
