import React from 'react';
import { Camera, Aperture, Radio, Sparkles } from 'lucide-react';

const CATEGORY_ICON_MAP = {
  camera: { icon: Camera, color: 'text-[#B87352]', bg: 'bg-[#B87352]/15 border-[#B87352]/30' },
  drone: { icon: Aperture, color: 'text-[#8B5E3C]', bg: 'bg-[#8B5E3C]/15 border-[#8B5E3C]/30' },
  audio: { icon: Radio, color: 'text-[#4C8C5A]', bg: 'bg-[#4C8C5A]/15 border-[#4C8C5A]/30' },
  lighting: { icon: Sparkles, color: 'text-[#B87352]', bg: 'bg-[#B87352]/15 border-[#B87352]/30' },
};

export default function Equipment3DShape({ category = 'camera' }) {
  const normCategory = (category || 'camera').toLowerCase();
  const config = CATEGORY_ICON_MAP[normCategory] || CATEGORY_ICON_MAP.camera;
  const IconComponent = config.icon;

  return (
    <div className={`w-12 h-12 rounded-2xl ${config.bg} border flex items-center justify-center shrink-0 shadow-sm`}>
      <IconComponent className={`w-6 h-6 ${config.color}`} />
    </div>
  );
}
