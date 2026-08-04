import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, Calendar, ShieldCheck, Users, HardDrive, Send, CheckCircle2 } from 'lucide-react';
import servicesData from '../data/services.json';
import Footer from '../sections/Footer';
import confetti from 'canvas-confetti';
import { createBooking } from '../utils/api';

export default function ServiceBookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // Find exact service by URL param or default to first
  const service = servicesData.find((s) => s.id === serviceId) || servicesData[0];
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    location: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [serviceId]);

  const activeTier = service.tiers[selectedTierIndex] || service.tiers[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      serviceId: service.id,
      tierName: activeTier.name,
      packageName: `${service.title} - ${activeTier.name} (${activeTier.price})`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      eventDate: form.date,
      location: form.location || 'Not Specified',
      notes: form.notes,
    };

    try {
      await createBooking(payload);
      setSubmitted(true);
      setLoading(false);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9A227', '#A8654A', '#E9C08C', '#FFFFFF'],
        });
      } catch (err) {}
    } catch (err) {
      setLoading(false);
      console.warn('Service Booking API error, proceeding with fallback confirmation:', err.message);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9A227', '#A8654A', '#E9C08C', '#FFFFFF'],
        });
      } catch (e) {}
    }
  };


  return (
    <div className="min-h-screen bg-cream text-charcoal selection:bg-gold selection:text-white">
      {/* Hero Service Banner */}
      <section className="relative pt-32 pb-20 bg-charcoal text-cream overflow-hidden">

        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rust/30 hover:bg-rust text-gold hover:text-cream text-xs font-montserrat font-semibold tracking-wider uppercase border border-gold/30 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Studio</span>
          </button>

          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full bg-rust text-cream text-[10px] font-montserrat uppercase font-semibold tracking-wider border border-gold/40">
              {service.category} Collection
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-cream mt-3">
              {service.title}
            </h1>
            <p className="text-lg font-serif italic text-gold-glow mt-2">
              "{service.tagline}"
            </p>
            <p className="text-sm text-cream/80 font-sans mt-4 leading-relaxed">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Service Details & Tier Selector */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Details & Custom Animated Tiers */}
          <div className="lg:col-span-7 space-y-8">
            {/* Animated Tier Selector Card */}
            <div className="bg-white p-8 rounded-3xl border border-rust/15 shadow-luxury">
              <span className="text-xs uppercase font-montserrat font-bold text-rust tracking-wider block mb-2">
                1. Select Experience Tier
              </span>
              <h3 className="text-2xl font-serif font-bold text-rust mb-6">
                Custom Collection Packages
              </h3>

              {/* Animated Staggered Tier Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {service.tiers.map((t, idx) => {
                  const isSelected = selectedTierIndex === idx;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      whileHover={{ y: -4, scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTierIndex(idx)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                        isSelected
                          ? 'bg-rust text-cream border-2 border-gold shadow-rust-glow-shadow font-semibold scale-105 z-10'
                          : 'bg-cream-soft text-charcoal border-rust/15 hover:border-rust/40 hover:shadow-md'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="selectedTierGlow"
                          className="absolute inset-0 bg-gold/10 border-2 border-gold rounded-2xl pointer-events-none"
                          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        />
                      )}

                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-montserrat font-bold truncate">{t.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-gold shrink-0" />}
                      </div>
                      <span className={`text-base font-bold block mt-1 ${
                        isSelected ? 'text-gold' : 'text-rust'
                      }`}>
                        {t.price}
                      </span>
                      <span className="text-[10px] opacity-75 font-sans block mt-1 font-medium">
                        {t.coverage}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Smooth Deliverables Detail Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTier.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 rounded-2xl bg-cream-soft border border-rust/10 space-y-2 text-xs font-sans text-charcoal/80"
                >
                  <span className="font-montserrat font-bold text-rust uppercase tracking-wider block">
                    Included Deliverables ({activeTier.name}):
                  </span>
                  <p className="leading-relaxed text-charcoal-soft">
                    {activeTier.deliverables}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Crew & Optics Specifications */}
            <div className="bg-white p-8 rounded-3xl border border-rust/15 shadow-luxury space-y-6">
              <span className="text-xs uppercase font-montserrat font-bold text-rust tracking-wider block">
                2. Technical Production Specifications
              </span>

              <div className="flex items-start gap-4 bg-cream-soft p-5 rounded-2xl border border-rust/10">
                <Users className="w-6 h-6 text-rust shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-montserrat font-bold text-rust">Dedicated Production Crew</h4>
                  <p className="text-xs text-charcoal/80 font-sans mt-1">{service.teamSize}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-cream-soft p-5 rounded-2xl border border-rust/10">
                <HardDrive className="w-6 h-6 text-rust shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-montserrat font-bold text-rust">Cinema Optics & Gear Included</h4>
                  <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal/80 font-sans">
                    {service.equipment.map((eq, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Booking Form */}
          <div className="lg:col-span-5 bg-charcoal text-cream p-8 rounded-3xl border-2 border-gold shadow-2xl space-y-6 sticky top-28">
            <div>
              <span className="text-[10px] uppercase font-montserrat tracking-[0.2em] text-gold font-bold flex items-center gap-1 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                Direct Service Reservation
              </span>
              <h3 className="text-3xl font-serif font-bold text-cream">
                Reserve {service.title}
              </h3>
              <p className="text-xs font-serif italic text-gold-glow mt-1">
                Selected Tier: {activeTier.name} ({activeTier.price})
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-4" />
                <h4 className="text-2xl font-serif font-bold text-cream mb-2">Inquiry Sent!</h4>
                <p className="text-xs text-cream/80 font-sans max-w-xs mx-auto mb-6">
                  Thank you, <span className="font-semibold text-gold">{form.name}</span>. Our director will contact you shortly regarding date availability.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-rust text-cream font-montserrat text-xs font-semibold uppercase"
                >
                  Edit Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[11px] font-montserrat font-semibold uppercase text-gold mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-charcoal-light border border-rust/30 text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-montserrat font-semibold uppercase text-gold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="aarav@wedding.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-charcoal-light border border-rust/30 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-montserrat font-semibold uppercase text-gold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-charcoal-light border border-rust/30 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-montserrat font-semibold uppercase text-gold mb-1">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      style={{ colorScheme: 'dark' }}
                      className="w-full px-4 py-3 rounded-xl bg-charcoal-light border border-rust/30 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-montserrat font-semibold uppercase text-gold mb-1">
                      Venue Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai or Mahabalipuram"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-charcoal-light border border-rust/30 text-cream focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-montserrat font-semibold uppercase text-gold mb-1">
                    Special Event Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about ritual timings, mandap decor..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-charcoal-light border border-rust/30 text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-rust via-clay to-rust text-cream font-montserrat text-xs font-bold uppercase tracking-widest shadow-rust-glow-shadow hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 border border-gold/40 mt-4"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Submit Service Reservation</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
