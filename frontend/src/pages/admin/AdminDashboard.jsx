import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  Camera,
  Activity,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import AdminTiltCard from '../../components/admin/AdminTiltCard';
import Dashboard3DScene from '../../components/admin/Dashboard3DScene';
import { fetchBookings, fetchEquipment } from '../../utils/api';

// Framer Motion Animated Count-Up Number
function CountUpNumber({ value, prefix = '', suffix = '' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = (value - start) / steps;

    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if ((increment >= 0 && current >= value) || (increment < 0 && current <= value)) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

// Fallback seed data if backend database is offline
const SEED_BOOKINGS = [
  {
    _id: 'b1',
    name: 'Aarav Sharma & Meera Kapoor',
    serviceId: 'wedding-photography',
    packageName: 'Classic Signature (₹1,80,000)',
    eventDate: '2026-09-15',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: 'b2',
    name: 'Siddharth Varma',
    serviceId: 'cinematic-films',
    packageName: 'Grand Hollywood Feature (₹3,20,000)',
    eventDate: '2026-10-04',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: 'b3',
    name: 'Ananya Ramesh',
    serviceId: 'destination-wedding',
    packageName: 'Classic Global Heritage (₹8,80,000)',
    eventDate: '2026-11-20',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: 'b4',
    name: 'Karthik & Revathi',
    serviceId: 'muhurtham',
    packageName: 'Grand Royal Muhurtham (₹2,80,000)',
    eventDate: '2026-08-28',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    _id: 'b5',
    name: 'Vikram Seth',
    serviceId: 'pre-wedding',
    packageName: 'Classic Destination (₹1,10,000)',
    eventDate: '2026-09-02',
    status: 'cancelled',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

const SEED_EQUIPMENT = [
  { _id: 'eq1', name: 'Sony Alpha A1 Master Body', category: 'camera', status: 'in-use' },
  { _id: 'eq2', name: 'RED V-Raptor 8K VV Cinema Body', category: 'camera', status: 'available' },
  { _id: 'eq3', name: 'Sony FX3 Cinema Line Camera', category: 'camera', status: 'in-use' },
  { _id: 'eq4', name: 'DJI Mavic 3 Cine (ProRes)', category: 'drone', status: 'in-use' },
  { _id: 'eq5', name: 'DJI Inspire 2 with Zenmuse 6K', category: 'drone', status: 'available' },
  { _id: 'eq6', name: 'Zoom F6 32-Bit Float Sound Suite', category: 'audio', status: 'in-use' },
  { _id: 'eq7', name: 'Profoto A10 Studio Strobes', category: 'lighting', status: 'available' },
];

function getTimeAgo(dateString) {
  if (!dateString) return 'Just now';
  const diffMinutes = Math.floor((new Date() - new Date(dateString)) / (1000 * 60));
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState(SEED_BOOKINGS);
  const [equipment, setEquipment] = useState(SEED_EQUIPMENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const bRes = await fetchBookings();
        if (bRes.data && bRes.data.length > 0) {
          setBookings(bRes.data);
        }
      } catch (err) {
        console.log('Using local fallback bookings data');
      }

      try {
        const eqRes = await fetchEquipment();
        if (eqRes.data && eqRes.data.length > 0) {
          setEquipment(eqRes.data);
        }
      } catch (err) {
        console.log('Using local fallback equipment data');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;

  const revenueEstimate = totalBookings * 210000;

  const inUseCount = equipment.filter((e) => e.status === 'in-use').length;
  const availableCount = equipment.filter((e) => e.status === 'available').length;
  const maintenanceCount = equipment.filter((e) => e.status === 'maintenance').length;
  const totalEquipment = equipment.length || 1;
  const utilizationPercent = Math.round((inUseCount / totalEquipment) * 100);

  // Dynamic 3D stats payload aggregated from real booking data
  const bookingStats = useMemo(() => {
    // Group bookings by month/period
    const dateCounts = {};
    bookings.forEach((b) => {
      if (!b.eventDate) return;
      const d = new Date(b.eventDate);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dateCounts[label] = (dateCounts[label] || 0) + 1;
    });

    const byDate = Object.keys(dateCounts).map((k) => ({
      label: k,
      count: dateCounts[k],
    }));

    return {
      total: totalBookings,
      confirmed: confirmedBookings,
      pending: pendingBookings,
      cancelled: cancelledBookings,
      byDate: byDate.length > 0 ? byDate : null,
    };
  }, [bookings, totalBookings, confirmedBookings, pendingBookings, cancelledBookings]);

  return (
    <div className="space-y-8">
      {/* Executive Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#121212] via-[#1A1A1A] to-[#121212] p-6 rounded-3xl border border-gold/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-[10px] font-montserrat uppercase font-bold text-gold tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Live Operations Control Panel
          </span>
          <h1 className="text-3xl font-serif font-bold text-cream">
            Executive Studio Overview
          </h1>
          <p className="text-xs text-cream/70 font-sans mt-1">
            Monitoring client reservations, cinematic equipment deployments, and 3D volume clusters.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-right">
            <span className="text-[10px] uppercase font-montserrat font-bold text-cream/50 block">Fleet Utilization</span>
            <span className="text-lg font-serif font-bold text-gold">{utilizationPercent}% Active</span>
          </div>
        </div>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminTiltCard glowColor="gold" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat uppercase font-bold text-cream/60 tracking-wider">
              Total Inquiries
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 text-gold flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-cream">
            <CountUpNumber value={totalBookings} />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gold font-sans font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active client database</span>
          </div>
        </AdminTiltCard>

        <AdminTiltCard glowColor="green" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat uppercase font-bold text-cream/60 tracking-wider">
              Confirmed Bookings
            </span>
            <div className="w-10 h-10 rounded-2xl bg-green-500/15 border border-green-500/40 text-green-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-green-400">
            <CountUpNumber value={confirmedBookings} />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-green-400 font-sans font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Deposit received & date locked</span>
          </div>
        </AdminTiltCard>

        <AdminTiltCard glowColor="rust" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat uppercase font-bold text-cream/60 tracking-wider">
              Pending Holds
            </span>
            <div className="w-10 h-10 rounded-2xl bg-rust/20 border border-rust/40 text-rust flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-serif font-bold text-rust">
            <CountUpNumber value={pendingBookings} />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-rust font-sans font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>Requires director response</span>
          </div>
        </AdminTiltCard>

        <AdminTiltCard glowColor="gold" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-montserrat uppercase font-bold text-cream/60 tracking-wider">
              Est. Contract Value
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 text-gold flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-gold truncate">
            <CountUpNumber value={revenueEstimate} prefix="₹" />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gold font-sans font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Gross projected studio value</span>
          </div>
        </AdminTiltCard>
      </div>

      {/* Interactive 3D Canvas Centerpiece */}
      <Dashboard3DScene bookingStats={bookingStats} />

      {/* Logistics & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Activity Feed List */}
        <div className="lg:col-span-7 bg-[#0A0A0A]/90 p-6 rounded-3xl border border-white/10 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold block">
                Recent Client Activity
              </span>
              <h3 className="text-xl font-serif font-bold text-cream">
                Latest Reservation Inquiries
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 5).map((b, idx) => (
              <motion.div
                key={b._id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-charcoal border border-gold/30 text-gold flex items-center justify-center font-serif font-bold text-base shrink-0">
                    {b.name ? b.name.charAt(0) : 'C'}
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-cream text-sm">
                      {b.name}
                    </h4>
                    <span className="text-cream/60 block text-[11px]">
                      {b.packageName || b.serviceId || 'Wedding Photography'} • Event Date: <span className="text-gold">{b.eventDate || 'TBD'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-montserrat font-bold uppercase border ${
                    b.status === 'confirmed'
                      ? 'bg-green-500/15 text-green-400 border-green-500/40'
                      : b.status === 'pending'
                      ? 'bg-gold/15 text-gold border-gold/40'
                      : 'bg-rust/20 text-rust border-rust/40'
                  }`}>
                    {b.status}
                  </span>
                  <span className="text-cream/50 text-[11px] font-serif italic">
                    {getTimeAgo(b.createdAt)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Equipment Utilization Widget */}
        <div className="lg:col-span-5 bg-[#0A0A0A]/90 p-6 rounded-3xl border border-white/10 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold block">
                Logistics Monitor
              </span>
              <h3 className="text-lg font-serif font-bold text-cream">
                Gear Fleet Status
              </h3>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <div className="flex justify-between mb-1.5 font-montserrat">
                <span className="text-cream/80 font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block" />
                  Currently In-Use on Shoot
                </span>
                <span className="text-gold font-bold">{inUseCount} items</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(inUseCount / totalEquipment) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-rust to-gold rounded-full shadow-gold-glow"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-montserrat">
                <span className="text-cream/80 font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                  Available in Studio Vault
                </span>
                <span className="text-green-400 font-bold">{availableCount} items</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(availableCount / totalEquipment) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5 font-montserrat">
                <span className="text-cream/80 font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rust inline-block" />
                  Scheduled Maintenance
                </span>
                <span className="text-rust font-bold">{maintenanceCount} items</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(maintenanceCount / totalEquipment) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                  className="h-full bg-rust rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-cream/50">
            <span>Total Logged Gear Assets: {totalEquipment}</span>
            <span className="text-gold font-bold uppercase tracking-wider">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
