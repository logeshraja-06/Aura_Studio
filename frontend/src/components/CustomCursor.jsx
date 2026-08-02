import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Enable on desktop viewports only
    if (window.innerWidth < 1024) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9990] rounded-full border border-gold/70 shadow-gold-glow"
      animate={{
        x: position.x - (isHovered ? 20 : 12),
        y: position.y - (isHovered ? 20 : 12),
        width: isHovered ? 40 : 24,
        height: isHovered ? 40 : 24,
        backgroundColor: isHovered ? 'rgba(201, 162, 39, 0.12)' : 'rgba(201, 162, 39, 0.04)',
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 26, mass: 0.25 }}
    />
  );
}
