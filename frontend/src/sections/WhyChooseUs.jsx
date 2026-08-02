import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera, Film, Aperture, Zap, BookOpen, Headset, ShieldCheck } from 'lucide-react';

const ADVANTAGES = [
  {
    icon: Camera,
    title: 'Award-Winning Artists',
    description: 'Vogue & Harper’s Bazaar featured leads dedicated to your story.',
  },
  {
    icon: Film,
    title: 'RED & Sony 4K Optics',
    description: 'Hollywood-grade full-frame cinema sensors & prime lenses.',
  },
  {
    icon: Aperture,
    title: 'FAA Drone Pilots',
    description: 'Licensed aerial operators capturing grand architectural vistas.',
  },
  {
    icon: Zap,
    title: 'Same-Day Social Reeling',
    description: 'Receive color-graded 60-second Reels within 24 hours of your vows.',
  },
  {
    icon: BookOpen,
    title: 'Italian Leather Albums',
    description: 'Flush-mount archival paper albums handmade in Florence, Italy.',
  },
  {
    icon: Headset,
    title: '24/7 Priority Support',
    description: 'Dedicated concierge answering questions every step of the journey.',
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-24 bg-cream-soft relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            The AURA Studio Benchmark
            <Sparkles className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-rust">
            Why Discerning Couples Choose Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust to-gold mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-sans leading-relaxed">
            We don't just photograph events; we preserve legacy memories with state-of-the-art cinematic technology and uncompromised artisanal care.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVANTAGES.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-3xl bg-white border border-rust/15 shadow-luxury hover:shadow-gold-glow transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-rust/10 text-rust border border-rust/20 flex items-center justify-center mb-6 group-hover:bg-rust group-hover:text-gold transition-colors duration-300 shadow-sm">
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-serif font-bold text-rust group-hover:text-gold-dark transition-colors">
                  {adv.title}
                </h3>
                <p className="text-xs text-charcoal-soft font-sans mt-2 leading-relaxed">
                  {adv.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
