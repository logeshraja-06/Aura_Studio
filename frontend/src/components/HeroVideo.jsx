import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HeroVideo() {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoaded(true);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-charcoal">
      <motion.video
        ref={videoRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85"
        className="w-full h-full object-cover object-[center_25%] sm:object-[center_20%] lg:object-[center_18%]"
        style={{ willChange: 'transform, opacity' }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        <source src="/videos/PixVerse_V6_Image_Text_540P_Create_a_premium_c.mp4" type="video/mp4" />
      </motion.video>
    </div>
  );
}
