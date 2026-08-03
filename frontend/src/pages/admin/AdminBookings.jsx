import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Trash2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Users,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowUpDown,
  RefreshCw,
  FileSpreadsheet,
  FileText as PdfIcon,
  DollarSign,
  UserCheck,
  Plus,
  LayoutList,
} from 'lucide-react';
import { fetchBookings, updateBookingStatus, deleteBookingApi, updateBookingPaymentAndCrewApi } from '../../utils/api';
import DarkConfirmationModal from '../../components/admin/DarkConfirmationModal';
import BookingCalendarView from '../../components/admin/BookingCalendarView';
import { exportBookingsPDF } from '../../utils/exportPdf';
import { exportBookingsExcel } from '../../utils/exportExcel';

const INITIAL_SEED_BOOKINGS = [
  {
    _id: 'b101',
    serviceId: 'wedding-photography',
    packageName: 'Classic Signature',
    name: 'Aarav Sharma & Meera Kapoor',
    email: 'aarav.meera@luxuryweddings.com',
    phone: '+91 98765 43210',
    eventDate: '2026-09-15',
    location: 'Leela Palace, Chennai',
    guestCount: '300 - 500 Guests',
    notes: 'Require drone coverage for outdoor Varmala ceremony on beachfront lawn.',
    status: 'confirmed',
    totalAmount: 180000,
    advanceAmount: 50000,
    balanceDue: 130000,
    assignedCrew: [{ name: 'Rajesh Master', role: 'Lead Master Photographer', phone: '+91 98765 00001' }],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    _id: 'b102',
    serviceId: 'cinematic-films',
    packageName: 'Grand Hollywood Feature',
    name: 'Siddharth Varma',
    email: 'siddharth@varmastudio.org',
    phone: '+91 98111 22334',
    eventDate: '2026-10-04',
    location: 'Mahabalipuram Beach Resort',
    guestCount: '200 - 300 Guests',
    notes: 'Focus on 8K RED V-Raptor slow motion shots and live audio multi-track for Nadaswaram.',
    status: 'pending',
    totalAmount: 320000,
    advanceAmount: 100000,
    balanceDue: 220000,
    assignedCrew: [],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    _id: 'b103',
    serviceId: 'destination-wedding',
    packageName: 'Classic Global Heritage',
    name: 'Ananya Ramesh',
    email: 'ananya.ramesh@globe.net',
    phone: '+1 (555) 019-2834',
    eventDate: '2026-11-20',
    location: 'Udaipur City Palace',
    guestCount: '500+ Royal Guests',
    notes: '3-Day travel shoot team required. Pre-wedding sunset shoot on Lake Pichola.',
    status: 'confirmed',
    totalAmount: 880000,
    advanceAmount: 300000,
    balanceDue: 580000,
    assignedCrew: [
      { name: 'Vikram Director', role: 'Cinematographer Director', phone: '+91 98765 00002' },
      { name: 'Priya Drone Pilot', role: 'Senior Drone Pilot', phone: '+91 98765 00003' },
    ],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    _id: 'b104',
    serviceId: 'muhurtham',
    packageName: 'Grand Royal Muhurtham',
    name: 'Karthik & Revathi',
    email: 'karthik.revathi@tamilwed.in',
    phone: '+91 94440 12345',
    eventDate: '2026-08-28',
    location: 'Mayor Ramanathan Hall, Chennai',
    guestCount: '800 Guests',
    notes: 'Silent shutter technology mandatory inside Mandap for Thali Kattu ritual.',
    status: 'pending',
    totalAmount: 280000,
    advanceAmount: 80000,
    balanceDue: 200000,
    assignedCrew: [],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    _id: 'b105',
    serviceId: 'pre-wedding',
    packageName: 'Classic Destination',
    name: 'Vikram Seth',
    email: 'vikram.seth@corporate.com',
    phone: '+91 99887 76655',
    eventDate: '2026-09-02',
    location: 'Ooty Tea Estates & Botanical Gardens',
    guestCount: 'Couple Only',
    notes: 'Client requested reschedule due to monsoon forecast.',
    status: 'cancelled',
    totalAmount: 110000,
    advanceAmount: 0,
    balanceDue: 110000,
    assignedCrew: [],
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
  },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState(INITIAL_SEED_BOOKINGS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedId, setExpandedId] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'

  // Payment edit state per booking
  const [paymentInputs, setPaymentInputs] = useState({});

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBookingForDelete, setSelectedBookingForDelete] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetchBookings();
      if (res.data && res.data.length > 0) {
        setBookings(res.data);
      }
    } catch (err) {
      console.log('Using local fallback bookings data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch (err) {
      console.log('Status updated in local UI state');
    }

    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleSavePayment = async (bookingId) => {
    const inputs = paymentInputs[bookingId] || {};
    const tot = inputs.totalAmount !== undefined ? Number(inputs.totalAmount) : 0;
    const adv = inputs.advanceAmount !== undefined ? Number(inputs.advanceAmount) : 0;
    const bal = Math.max(0, tot - adv);

    try {
      await updateBookingPaymentAndCrewApi(bookingId, {
        totalAmount: tot,
        advanceAmount: adv,
      });
    } catch (err) {
      console.log('Payment updated in local state');
    }

    setBookings((prev) =>
      prev.map((b) =>
        b._id === bookingId
          ? { ...b, totalAmount: tot, advanceAmount: adv, balanceDue: bal }
          : b
      )
    );
  };

  const promptDelete = (booking) => {
    setSelectedBookingForDelete(booking);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBookingForDelete) return;
    const id = selectedBookingForDelete._id;

    try {
      await deleteBookingApi(id);
    } catch (err) {
      console.log('Booking deleted locally');
    }

    setBookings((prev) => prev.filter((b) => b._id !== id));
    setDeleteModalOpen(false);
    setSelectedBookingForDelete(null);
  };

  // Filter & Search Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === 'All' || b.status?.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      (b.name && b.name.toLowerCase().includes(query)) ||
      (b.email && b.email.toLowerCase().includes(query)) ||
      (b.packageName && b.packageName.toLowerCase().includes(query)) ||
      (b.location && b.location.toLowerCase().includes(query));

    return matchesStatus && matchesQuery;
  });

  // Sort Logic
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';

    if (sortField === 'eventDate' || sortField === 'createdAt') {
      valA = new Date(valA).getTime() || 0;
      valB = new Date(valB).getTime() || 0;
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-montserrat uppercase font-bold text-gold tracking-widest block">
            Client Reservations & Payment Audits
          </span>
          <h1 className="text-3xl font-serif font-bold text-cream">
            Manage Bookings
          </h1>
        </div>

        {/* Action Buttons: View Switcher & PDF / Excel Exporters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Switcher Toggle */}
          <div className="bg-[#1F140D] p-1 rounded-2xl border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-gold text-black shadow-md'
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-montserrat font-bold transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'calendar'
                  ? 'bg-gold text-black shadow-md'
                  : 'text-cream/70 hover:text-cream'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={() => exportBookingsPDF(filteredBookings, statusFilter)}
            className="px-3.5 py-2 rounded-2xl bg-rust/20 border border-rust/40 text-rust hover:bg-rust hover:text-cream text-xs font-montserrat font-bold transition-all flex items-center gap-2"
          >
            <PdfIcon className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          {/* Export Excel Button */}
          <button
            onClick={() => exportBookingsExcel(filteredBookings, statusFilter)}
            className="px-3.5 py-2 rounded-2xl bg-gold/20 border border-gold/40 text-gold hover:bg-gold hover:text-black text-xs font-montserrat font-bold transition-all flex items-center gap-2 shadow-gold-glow-shadow"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={loadBookings}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gold transition-colors"
            title="Refresh Bookings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Controls Bar: Search & Status Filter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-4 rounded-3xl border border-rust/15 shadow-luxury">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gold absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by customer name, email, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#FAF2EA] border border-rust/15 text-xs font-sans text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {['All', 'Pending', 'Confirmed', 'Cancelled'].map((tab) => {
            const isActive = statusFilter === tab;
            const count =
              tab === 'All'
                ? bookings.length
                : bookings.filter((b) => b.status?.toLowerCase() === tab.toLowerCase()).length;

            return (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-2xl text-xs font-montserrat font-bold transition-all duration-200 flex items-center gap-2 shrink-0 border ${
                  isActive
                    ? 'bg-gold/20 text-gold-dark border-gold/50 shadow-gold-glow-shadow'
                    : 'bg-[#FAF2EA] text-charcoal/70 border-rust/10 hover:text-charcoal'
                }`}
              >
                <span>{tab}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                  isActive ? 'bg-gold text-white' : 'bg-charcoal/10 text-charcoal/70'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render View Mode */}
      {viewMode === 'calendar' ? (
        <BookingCalendarView
          bookings={filteredBookings}
          onSelectBooking={(b) => {
            setViewMode('table');
            setExpandedId(b._id);
          }}
        />
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-rust/15 overflow-hidden shadow-luxury">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#FAF2EA] text-charcoal/80 font-montserrat uppercase font-bold text-[10px] tracking-wider border-b border-rust/15">
                <tr>
                  <th className="py-4 px-6 cursor-pointer select-none" onClick={() => toggleSort('name')}>
                    <div className="flex items-center gap-1.5">
                      <span>Customer & Contact</span>
                      <ArrowUpDown className="w-3 h-3 text-charcoal/40" />
                    </div>
                  </th>
                  <th className="py-4 px-6 cursor-pointer select-none">Package</th>
                  <th className="py-4 px-6 cursor-pointer select-none" onClick={() => toggleSort('eventDate')}>
                    <div className="flex items-center gap-1.5">
                      <span>Event Date</span>
                      <ArrowUpDown className="w-3 h-3 text-charcoal/40" />
                    </div>
                  </th>
                  <th className="py-4 px-6 cursor-pointer select-none" onClick={() => toggleSort('status')}>
                    <div className="flex items-center gap-1.5">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3 text-charcoal/40" />
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rust/10">
                {sortedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-charcoal/50 font-serif italic">
                      No bookings found matching query "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  sortedBookings.map((b) => {
                    const isExpanded = expandedId === b._id;
                    const pInputs = paymentInputs[b._id] || {
                      totalAmount: b.totalAmount || 0,
                      advanceAmount: b.advanceAmount || 0,
                    };

                    return (
                      <React.Fragment key={b._id}>
                        <tr className={`hover:bg-[#FAF2EA]/50 transition-colors ${isExpanded ? 'bg-[#FAF2EA]/50' : ''}`}>
                          <td className="py-4 px-6 font-montserrat font-bold text-charcoal">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : b._id)}
                                className="p-1 rounded-lg bg-[#FAF2EA] text-rust hover:bg-gold/20"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                              <div>
                                <span className="block text-sm text-charcoal">{b.name}</span>
                                <span className="text-[11px] font-sans font-normal text-charcoal/60">{b.email}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-charcoal/80 font-medium">
                            {b.packageName || b.serviceId || 'Wedding Collection'}
                          </td>

                          <td className="py-4 px-6 text-rust font-mono font-semibold">
                            {b.eventDate || 'Date Unspecified'}
                          </td>

                          <td className="py-4 px-6">
                            <select
                              value={b.status || 'pending'}
                              onChange={(e) => handleStatusChange(b._id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-[10px] font-montserrat font-bold uppercase cursor-pointer outline-none border transition-colors ${
                                b.status === 'confirmed'
                                  ? 'bg-gold/15 text-gold-dark border-gold/40'
                                  : b.status === 'pending'
                                  ? 'bg-clay/15 text-clay-dark border-clay/40'
                                  : 'bg-rust/15 text-rust-dark border-rust/40'
                              }`}
                            >
                              <option value="pending" className="bg-white text-clay-dark">Pending</option>
                              <option value="confirmed" className="bg-white text-gold-dark">Confirmed</option>
                              <option value="cancelled" className="bg-white text-rust-dark">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => promptDelete(b)}
                              className="p-2 rounded-xl bg-rust/10 border border-rust/30 text-rust hover:bg-rust hover:text-cream transition-colors"
                              title="Cancel / Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Slide-Down Panel */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="bg-[#2B1B12]/90 p-6 border-b border-white/10">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6 text-xs font-sans"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  {/* Contact Info */}
                                  <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                                    <span className="text-[10px] font-montserrat font-bold uppercase text-gold tracking-widest block">
                                      Client Contact & Location
                                    </span>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-cream/80">
                                        <Phone className="w-4 h-4 text-gold shrink-0" />
                                        <span>{b.phone || 'No phone provided'}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-cream/80">
                                        <Mail className="w-4 h-4 text-gold shrink-0" />
                                        <span>{b.email}</span>
                                      </div>
                                      <div className="flex items-start gap-2 text-cream/80">
                                        <MapPin className="w-4 h-4 text-rust shrink-0 mt-0.5" />
                                        <span>{b.location || 'Venue Not Specified'}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Payment & Advance Tracking Section */}
                                  <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                                    <span className="text-[10px] font-montserrat font-bold uppercase text-gold tracking-widest block flex items-center gap-1.5">
                                      <DollarSign className="w-3.5 h-3.5 text-gold" />
                                      Payment & Advance Tracking
                                    </span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="text-[10px] text-cream/60 block mb-1">Total Contract (₹)</label>
                                        <input
                                          type="number"
                                          value={pInputs.totalAmount}
                                          onChange={(e) =>
                                            setPaymentInputs({
                                              ...paymentInputs,
                                              [b._id]: { ...pInputs, totalAmount: e.target.value },
                                            })
                                          }
                                          className="w-full px-3 py-1.5 rounded-xl bg-[#2B1B12] border border-white/15 text-cream"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] text-cream/60 block mb-1">Advance Deposit (₹)</label>
                                        <input
                                          type="number"
                                          value={pInputs.advanceAmount}
                                          onChange={(e) =>
                                            setPaymentInputs({
                                              ...paymentInputs,
                                              [b._id]: { ...pInputs, advanceAmount: e.target.value },
                                            })
                                          }
                                          className="w-full px-3 py-1.5 rounded-xl bg-[#2B1B12] border border-white/15 text-cream"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                      <span className="text-[11px] text-rust font-bold">
                                        Balance Due: ₹{(b.balanceDue || 0).toLocaleString()}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleSavePayment(b._id)}
                                        className="px-3 py-1 rounded-xl bg-gold/20 text-gold border border-gold/40 text-[10px] font-montserrat font-bold uppercase"
                                      >
                                        Save Payments
                                      </button>
                                    </div>
                                  </div>

                                  {/* Special Vision & Notes */}
                                  <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                                    <span className="text-[10px] font-montserrat font-bold uppercase text-gold tracking-widest block">
                                      Client Vision & Notes
                                    </span>
                                    <p className="text-cream/70 leading-relaxed italic bg-black/50 p-3 rounded-xl border border-white/5">
                                      "{b.notes || 'No special requirements specified.'}"
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Action Confirmation Modal */}
      <DarkConfirmationModal
        isOpen={deleteModalOpen}
        title="Cancel & Delete Booking"
        message={`Are you sure you want to permanently delete the reservation for "${selectedBookingForDelete?.name}"?`}
        confirmText="Confirm Delete"
        cancelText="Keep Booking"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
}
