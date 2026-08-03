import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Mail, Bell, Globe, DollarSign } from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    studioName: 'AURA Cinematic Luxury Wedding Studio',
    contactEmail: 'concierge@aurastudio.com',
    phone: '+1 (800) AURA-WED',
    currency: 'INR (₹)',
    autoConfirm: false,
    emailNotifications: true,
    smsNotifications: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="text-[10px] font-montserrat uppercase font-bold text-gold tracking-widest block">
          Control Room Configuration
        </span>
        <h1 className="text-3xl font-serif font-bold text-cream">
          Studio Operational Settings
        </h1>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-montserrat font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>Studio settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Studio Identity Settings */}
        <div className="bg-[#1F140D] p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-lg font-serif font-bold text-cream flex items-center gap-2">
            <Globe className="w-5 h-5 text-gold" />
            <span>Studio Identity & Contact Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="block text-[11px] font-montserrat font-bold text-gold uppercase tracking-wider mb-2">
                Official Studio Name
              </label>
              <input
                type="text"
                value={settings.studioName}
                onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#2B1B12] border border-white/15 text-cream focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-montserrat font-bold text-gold uppercase tracking-wider mb-2">
                Concierge Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#2B1B12] border border-white/15 text-cream focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Automation */}
        <div className="bg-[#1F140D] p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-lg font-serif font-bold text-cream flex items-center gap-2">
            <Bell className="w-5 h-5 text-gold" />
            <span>Notification & Auto-Hold Controls</span>
          </h3>

          <div className="space-y-3 text-xs font-sans">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#2B1B12] border border-white/10 cursor-pointer">
              <div>
                <span className="font-montserrat font-bold text-cream block">Email Dispatch on New Inquiries</span>
                <span className="text-[10px] text-cream/60">Receive instant director alert when a client submits a booking.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-4 h-4 accent-gold cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-[#2B1B12] border border-white/10 cursor-pointer">
              <div>
                <span className="font-montserrat font-bold text-cream block">Auto-Confirm Availability Hold</span>
                <span className="text-[10px] text-cream/60">Automatically mark incoming web inquiries as confirmed priority hold.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoConfirm}
                onChange={(e) => setSettings({ ...settings, autoConfirm: e.target.checked })}
                className="w-4 h-4 accent-gold cursor-pointer"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rust to-gold text-black font-montserrat font-bold text-xs uppercase tracking-widest shadow-gold-glow flex items-center gap-2 border border-gold/40 hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4 text-black" />
          <span>Save Studio Settings</span>
        </button>
      </form>
    </div>
  );
}
