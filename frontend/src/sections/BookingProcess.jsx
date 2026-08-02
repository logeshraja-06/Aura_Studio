import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, MessageCircle, Lock, Camera, Film, Gift } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Calendar,
    title: 'Choose Collection',
    description: 'Select your preferred photography, cinema, or multi-day destination package.',
  },
  {
    step: '02',
    icon: MessageCircle,
    title: 'Creative Consultation',
    description: 'Direct call with our Director to discuss timeline, lighting, moodboards & locations.',
  },
  {
    step: '03',
    icon: Lock,
    title: 'Reserve Your Date',
    description: 'Lock in your wedding date on our studio calendar with instant agreement.',
  },
  {
    step: '04',
    icon: Camera,
    title: 'The Wedding Day Shoot',
    description: 'Our lead team captures your vows, emotions, and grand celebrations seamlessly.',
  },
  {
    step: '05',
    icon: Film,
    title: '4K Cinema Editing',
    description: 'Color grading, orchestral sound scoring, and same-day social teaser clips.',
  },
  {
    step: '06',
    icon: Gift,
    title: 'Luxury Box Delivery',
    description: 'Receive your Italian leather album, custom USB keepsake box & online 4K gallery.',
  },
];

export default function BookingProcess({ onBook }) {
  return (
    <section id="booking-process" className="py-24 bg-cream-soft relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            Seamless Client Journey
            <Sparkles className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-rust">
            Our 6-Step Production Process
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust to-gold mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-sans leading-relaxed">
            From initial inquiry to holding your handcrafted leather album, we ensure an effortless, high-touch luxury experience.
          </p>
        </div>

        {/* 6-Step Horizontal / Grid Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative p-8 rounded-3xl bg-white border border-rust/15 shadow-luxury hover:shadow-gold-glow transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-rust text-gold flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <span className="text-3xl font-serif font-bold text-gold/40 group-hover:text-rust transition-colors">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-rust">
                  {s.title}
                </h3>
                <p className="text-xs text-charcoal-soft font-sans mt-2 leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={onBook}
            className="px-10 py-4 rounded-full bg-rust text-cream font-montserrat text-xs uppercase font-bold tracking-widest shadow-rust-glow-shadow hover:shadow-gold-glow hover:scale-105 transition-all duration-300 border border-gold/40"
          >
            Start Step 1: Reserve Your Date
          </button>
        </div>
      </div>
    </section>
  );
}
