import React from 'react';
import { motion } from 'framer-motion';

export default function Aperture3DBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-[#1F140D] via-[#2B1B12] to-[#140D08]">
      {/* Soft Ambient Terracotta & Coffee Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#B87352]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#8B5E3C]/15 blur-3xl pointer-events-none" />

      {/* Rotating Concentric Aperture Ring SVG Pattern */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="w-[600px] h-[600px] border border-[#B87352]/30 rounded-full flex items-center justify-center p-8"
        >
          <div className="w-full h-full border border-dashed border-[#8B5E3C]/40 rounded-full flex items-center justify-center p-12">
            <div className="w-full h-full border border-[#B87352]/20 rounded-full flex items-center justify-center p-16">
              <div className="w-full h-full border border-dotted border-[#8B5E3C]/30 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fine Subtle Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#B8735208_1px,transparent_1px),linear-gradient(to_bottom,#B8735208_1px,transparent_1px)] bg-[size:32px_32px]" />
    </div>
  );
}
