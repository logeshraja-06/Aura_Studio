import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Sparkles, Shield, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Aperture3DBackground from '../../components/admin/Aperture3DBackground';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@aurastudio.com');
  const [password, setPassword] = useState('aura2026');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        navigate('/admin');
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#1F140D] text-cream flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-gold selection:text-black">
      {/* Exit to Main Site Navigation Button */}
      <div className="w-full max-w-md flex justify-start sm:absolute sm:top-6 sm:left-6 sm:w-auto mb-4 sm:mb-0 z-20">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 text-gold hover:bg-gold/10 text-xs font-montserrat uppercase font-semibold tracking-wider transition-all duration-300 backdrop-blur-md bg-black/40 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-gold" />
          <span>Exit to Main Site</span>
        </button>
      </div>

      {/* 3D Rotating Aperture Ring Canvas Background */}
      <Aperture3DBackground />

      {/* Foreground Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 max-w-md w-full bg-[#2B1B12]/90 border border-gold/40 rounded-3xl p-8 backdrop-blur-2xl shadow-gold-glow-shadow"
      >
        {/* Top Metallic Border Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rust via-gold to-rust" />

        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/40 text-gold flex items-center justify-center mx-auto mb-4 shadow-gold-glow">
            <Sparkles className="w-7 h-7 text-gold" />
          </div>

          <span className="text-[10px] font-montserrat uppercase font-bold text-rust tracking-[0.25em] block mb-1">
            Restricted Control Room
          </span>
          <h1 className="text-3xl font-serif font-bold text-cream">
            AURA Studio Admin
          </h1>
          <p className="text-xs text-cream/70 font-sans mt-2">
            Enter administrative credentials to access live booking data & studio logistics.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-2xl bg-rust/20 border border-rust/40 text-rust text-xs font-montserrat font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rust shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
          <div>
            <label className="block text-[11px] font-montserrat font-bold text-gold uppercase tracking-wider mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gold/70 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aurastudio.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-montserrat font-bold text-gold uppercase tracking-wider mb-2">
              Security Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gold/70 absolute left-4 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/60 border border-white/15 text-cream placeholder-cream/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-all duration-300"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rust via-gold to-rust text-charcoal font-montserrat font-bold text-xs uppercase tracking-widest hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2 border border-gold/50 shadow-md cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Launch Control Room</span>
                  <ArrowRight className="w-4 h-4 text-charcoal" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Security Badge */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center flex items-center justify-center gap-2 text-[10px] text-cream/50 font-sans">
          <Shield className="w-3.5 h-3.5 text-gold" />
          <span>AURA Executive Studio Authorization System</span>
        </div>
      </motion.div>
    </div>
  );
}
