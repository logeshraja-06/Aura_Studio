import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, Phone, Calendar, CheckCircle2, Clock, XCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { lookupBookingStatusApi } from '../utils/api';
import Footer from '../sections/Footer';

export default function ClientStatusLookup() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLookup = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await lookupBookingStatusApi(email, phone);
      setLoading(false);
      if (res.data) {
        setResults(res.data);
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'No reservation record found. Please verify email or phone.');
      setResults(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal selection:bg-gold selection:text-white flex flex-col justify-between">
      {/* Top Banner */}
      <section className="relative pt-36 pb-20 bg-charcoal text-cream overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rust/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="text-xs uppercase font-montserrat tracking-[0.25em] text-gold font-bold flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-gold" />
            Client Concierge Portal
            <Sparkles className="w-4 h-4 text-gold" />
          </span>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-cream">
            Check Reservation Status
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-rust via-gold to-rust mx-auto mt-4 rounded-full" />

          <p className="mt-4 text-sm sm:text-base text-cream/80 font-sans max-w-xl mx-auto leading-relaxed">
            Enter your registered email address or phone number below to view live updates on your wedding shoot booking.
          </p>
        </div>
      </section>

      {/* Main Lookup Card */}
      <section className="py-16 max-w-2xl mx-auto px-6 w-full flex-1">
        <div className="bg-white p-8 rounded-3xl border border-rust/20 shadow-luxury space-y-6">
          <form onSubmit={handleLookup} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-xs font-montserrat font-bold text-rust uppercase tracking-wider mb-2">
                Registered Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-rust absolute left-4 top-3.5" />
                <input
                  type="email"
                  placeholder="couple@wedding.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream-soft border border-rust/20 text-charcoal focus:outline-none focus:border-rust"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-montserrat font-bold text-rust uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-rust absolute left-4 top-3.5" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream-soft border border-rust/20 text-charcoal focus:outline-none focus:border-rust"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-rust via-clay to-rust text-cream font-montserrat font-bold text-xs uppercase tracking-widest shadow-rust-glow-shadow hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 border border-gold/40 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-cream border-t-transparent animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 text-gold" />
                  <span>Lookup Reservation Status</span>
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rust/10 border border-rust/30 text-rust text-xs font-montserrat font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Results Display */}
          <AnimatePresence>
            {results && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-6 border-t border-rust/15"
              >
                <span className="text-xs font-montserrat font-bold text-rust uppercase tracking-wider block">
                  Found ({results.length}) Matching Reservations:
                </span>

                {results.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-5 rounded-2xl bg-cream-soft border border-rust/20 space-y-3 shadow-sm text-xs font-sans"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-lg text-rust">
                        {item.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-montserrat font-bold uppercase ${
                        item.status === 'confirmed'
                          ? 'bg-gold/20 text-rust border border-gold/40'
                          : item.status === 'pending'
                          ? 'bg-gold/20 text-rust border border-gold/40'
                          : 'bg-rust/20 text-rust border border-rust/40'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-charcoal/80">
                      <div>
                        <span className="text-charcoal/60 font-semibold block">Collection / Service:</span>
                        <span className="font-semibold text-rust">{item.packageName}</span>
                      </div>
                      <div>
                        <span className="text-charcoal/60 font-semibold block">Scheduled Event Date:</span>
                        <span className="font-semibold text-gold-dark">{item.eventDate || 'TBD'}</span>
                      </div>
                    </div>

                    {item.location && (
                      <div className="text-charcoal/80 pt-1 border-t border-rust/10">
                        <span className="text-charcoal/60 font-semibold">Venue Location: </span>
                        <span>{item.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
