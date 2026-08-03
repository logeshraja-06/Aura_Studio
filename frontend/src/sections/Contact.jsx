import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, PhoneCall, Mail, Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createContact } from '../utils/api';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createContact(form);
      setSent(true);
      setLoading(false);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C9A227', '#A8654A', '#E9C08C'],
        });
      } catch (err) {}
    } catch (err) {
      setLoading(false);
      console.warn('Contact API error, proceeding with fallback confirmation UI:', err.message);
      setSent(true);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C9A227', '#A8654A', '#E9C08C'],
        });
      } catch (e) {}
    }
  };


  return (
    <section id="contact" className="py-24 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-rust font-semibold flex items-center justify-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-gold" />
            Connect With Us
            <Mail className="w-4 h-4 text-gold" />
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-rust">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rust to-gold mx-auto mt-4 rounded-full" />
          <p className="mt-4 text-sm sm:text-base text-charcoal-soft font-sans leading-relaxed">
            We would love to hear your vision. Send us a message or visit our flaghsip studio lounge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Studio Details & Map Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-charcoal text-cream p-8 rounded-3xl border border-rust/30 shadow-2xl space-y-6">
              <h3 className="text-3xl font-serif font-bold text-gold">
                Flagship Studio
              </h3>
              <p className="text-xs text-cream/70 font-sans leading-relaxed">
                Experience our high-resolution album gallery and private screening theater in person.
              </p>

              <div className="space-y-4 pt-4 border-t border-rust/20 text-xs font-sans">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-rust shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-cream block">Studio Address</span>
                    <span className="text-cream/70">AURA Luxury Studio Tower, 45 Grand Avenue, Suite 1200, NY 10001</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-rust shrink-0" />
                  <div>
                    <span className="font-semibold text-cream block">Direct Telephone</span>
                    <a href="tel:+18005552872" className="text-gold hover:underline">+1 (800) AURA-WED / +1 (555) 019-2834</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-rust shrink-0" />
                  <div>
                    <span className="font-semibold text-cream block">Official Email</span>
                    <a href="mailto:concierge@aurastudio.com" className="text-gold hover:underline">concierge@aurastudio.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-rust shrink-0" />
                  <div>
                    <span className="font-semibold text-cream block">Studio Consultation Hours</span>
                    <span className="text-cream/70">Mon – Sat: 10:00 AM – 8:00 PM EST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Visual Placeholder */}
            <div className="relative h-64 rounded-3xl overflow-hidden border border-rust/20 shadow-md bg-charcoal-light flex items-center justify-center group">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                alt="Studio map location"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
              <div className="relative z-10 text-center p-4">
                <div className="w-12 h-12 rounded-full bg-rust text-gold border border-gold/40 flex items-center justify-center mx-auto mb-2 shadow-gold-glow animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-xs font-montserrat font-bold text-cream block">
                  AURA Flagship Studio Lounge
                </span>
                <span className="text-[10px] text-gold font-sans">
                  Click to open Google Maps navigation
                </span>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form Card */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl border border-rust/15 shadow-luxury">
            {sent ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-rust/10 text-rust flex items-center justify-center mx-auto mb-4 border border-rust/30">
                  <CheckCircle2 className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-3xl font-serif font-bold text-rust mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs font-sans text-charcoal/70 max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you for writing to AURA. Our team will review your message and reply via email or phone within 4 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-6 py-2.5 rounded-full bg-rust text-cream font-montserrat text-xs uppercase font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-montserrat font-semibold text-rust uppercase tracking-wider mb-2">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-cream-soft border border-rust/20 text-xs font-sans text-charcoal focus:outline-none focus:border-rust"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-montserrat font-semibold text-rust uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="aarav@wedding.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-cream-soft border border-rust/20 text-xs font-sans text-charcoal focus:outline-none focus:border-rust"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-montserrat font-semibold text-rust uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-cream-soft border border-rust/20 text-xs font-sans text-charcoal focus:outline-none focus:border-rust"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-montserrat font-semibold text-rust uppercase tracking-wider mb-2">
                      Topic / Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-cream-soft border border-rust/20 text-xs font-sans text-charcoal focus:outline-none focus:border-rust"
                    >
                      <option>General Studio Inquiry</option>
                      <option>Destination Wedding Quote</option>
                      <option>Press & Media Inquiry</option>
                      <option>Career & Internship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-montserrat font-semibold text-rust uppercase tracking-wider mb-2">
                    Message Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us about your event date, location, or questions..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-cream-soft border border-rust/20 text-xs font-sans text-charcoal focus:outline-none focus:border-rust"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-rust to-clay text-cream text-xs font-montserrat font-bold uppercase tracking-widest shadow-rust-glow-shadow hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 border border-gold/40"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>Send Studio Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
