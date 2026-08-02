import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Camera, Calendar, Star } from 'lucide-react';

const STATS_DATA = [
  {
    id: 1,
    icon: Heart,
    value: '500+',
    label: 'Happy Couples',
    description: 'Love stories documented across 18 countries.',
  },
  {
    id: 2,
    icon: Camera,
    value: '750+',
    label: 'Events Covered',
    description: 'Weddings, engagements, receptions & galas.',
  },
  {
    id: 3,
    icon: Calendar,
    value: '12+',
    label: 'Years Experience',
    description: 'Mastery in luxury editorial photography.',
  },
  {
    id: 4,
    icon: Star,
    value: '4.9★',
    label: 'Google Rating',
    description: 'Based on 320+ verified client reviews.',
  },
];

export default function Stats() {
  return (
    <section id="stats" className="py-16 bg-gradient-to-r from-rust via-clay to-rust text-cream relative overflow-hidden">
      {/* Decorative Shimmer Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {STATS_DATA.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-cream/10 border border-gold/40 flex items-center justify-center mb-4 text-gold group-hover:scale-110 group-hover:bg-cream group-hover:text-rust transition-all duration-300 shadow-md">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-cream tracking-tight group-hover:text-gold transition-colors">
                  {stat.value}
                </h3>
                <span className="text-xs uppercase font-montserrat tracking-[0.2em] font-semibold text-gold-glow mt-2">
                  {stat.label}
                </span>
                <p className="text-xs text-cream/70 font-sans mt-1 max-w-[200px] leading-relaxed">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
