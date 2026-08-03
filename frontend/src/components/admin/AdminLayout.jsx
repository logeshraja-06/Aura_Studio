import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarCheck,
  Camera,
  Film,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  User,
  ArrowLeft,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { path: '/admin/equipment', label: 'Equipment', icon: Camera },
  { path: '/admin/services', label: 'Services', icon: Film },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-cream flex overflow-hidden font-sans selection:bg-gold selection:text-black">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#121212] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rust via-gold to-rust p-[1px] shadow-gold-glow">
                <div className="w-full h-full bg-charcoal rounded-2xl flex items-center justify-center">
                  <span className="font-serif font-bold text-gold text-lg">A</span>
                </div>
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg text-cream tracking-wider">
                  AURA <span className="text-gold text-xs font-montserrat">CONTROL</span>
                </h1>
                <span className="text-[9px] uppercase font-montserrat font-bold text-rust tracking-widest block">
                  Cinematic Admin
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-cream/70 hover:text-gold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === '/admin' || location.pathname === '/admin/'
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-montserrat font-semibold transition-all duration-200 border ${
                    isActive
                      ? 'bg-gold/15 text-gold border-gold/40 shadow-gold-glow-shadow'
                      : 'text-cream/70 hover:text-cream hover:bg-white/5 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold animate-pulse' : 'text-cream/50'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-sans space-y-1">
            <div className="flex items-center gap-2 text-gold font-montserrat font-bold text-[10px] uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Encrypted Session</span>
            </div>
            <p className="text-[10px] text-cream/60">
              AURA Control Room v2.4 (React 19)
            </p>
          </div>

          {/* Exit to Main Site Navigation Button */}
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate('/')}
            className="w-full py-2.5 px-4 rounded-2xl bg-white/5 border border-gold/30 text-gold hover:bg-gold/15 hover:border-gold/60 text-xs font-montserrat font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-luxury"
          >
            <ArrowLeft className="w-4 h-4 text-gold" />
            <span>Exit to Main Site</span>
          </motion.button>

          {/* Sign Out / Destroy Session Button */}
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-2xl bg-rust/10 border border-rust/30 text-rust hover:bg-rust hover:text-cream text-xs font-montserrat font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar Header */}
        <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-cream/70 hover:text-gold p-1"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <span className="text-[10px] font-montserrat uppercase font-bold text-rust tracking-widest block">
                Studio Management Portal
              </span>
              <span className="text-xs text-cream/60 font-serif italic">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Admin Avatar & Quick Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-[#121212] px-3.5 py-1.5 rounded-full border border-gold/30">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={user?.name || 'Admin'}
                className="w-7 h-7 rounded-full object-cover border border-gold"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-montserrat font-bold text-cream block leading-tight">
                  {user?.name || 'Studio Director'}
                </span>
                <span className="text-[9px] font-sans text-gold block">
                  {user?.email || 'admin@aurastudio.com'}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-rust/20 text-cream/80 hover:text-rust transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic Route Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
