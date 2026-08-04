import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import faqData from '../data/faq.json';

export default function FAQ() {
  const [openId, setOpenId] = useState('faq-1');

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-cream-soft relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-gold" />
            Clear Answers
            <HelpCircle className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-rust">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust to-gold mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm text-charcoal-soft font-sans leading-relaxed">
            Everything you need to know about reserving dates, destination travel, photo delivery, and custom packages.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-rust/15 overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-rust/10 text-rust text-[10px] uppercase font-montserrat font-bold tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-serif font-bold text-rust">
                      {item.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-rust text-gold' : 'bg-rust/10 text-rust'
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 border-t border-rust/10 text-xs sm:text-sm font-sans text-charcoal/80 leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
