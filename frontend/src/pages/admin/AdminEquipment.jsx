import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Sparkles,
  RefreshCw,
  Search,
  SlidersHorizontal,
  FileSpreadsheet,
} from 'lucide-react';
import Equipment3DShape from '../../components/admin/Equipment3DShape';
import DarkConfirmationModal from '../../components/admin/DarkConfirmationModal';
import { fetchEquipment, createEquipment, updateEquipment, deleteEquipment, fetchBookings } from '../../utils/api';
import { exportEquipmentExcel } from '../../utils/exportExcel';

const INITIAL_SEED_EQUIPMENT = [
  {
    _id: 'eq1',
    name: 'Sony Alpha A1 Master Body',
    category: 'camera',
    status: 'in-use',
    assignedBookingId: { _id: 'b101', name: 'Aarav Sharma & Meera Kapoor', eventDate: '2026-09-15' },
    notes: '50.1MP Flagship, 8K 30p / 4K 120p, Dual SanDisk CFexpress',
  },
  {
    _id: 'eq2',
    name: 'RED V-Raptor 8K VV Cinema Camera',
    category: 'camera',
    status: 'available',
    assignedBookingId: null,
    notes: '8K VV 120fps Cinema Spec, Atlas Anamorphic Primes',
  },
  {
    _id: 'eq3',
    name: 'Sony FX3 Cinema Line Camera',
    category: 'camera',
    status: 'in-use',
    assignedBookingId: { _id: 'b102', name: 'Siddharth Varma', eventDate: '2026-10-04' },
    notes: 'Full-Frame 4K 120p, S-Cinetone, XLR Audio Handle',
  },
  {
    _id: 'eq4',
    name: 'DJI Mavic 3 Cine (Apple ProRes 422 HQ)',
    category: 'drone',
    status: 'in-use',
    assignedBookingId: { _id: 'b101', name: 'Aarav Sharma & Meera Kapoor', eventDate: '2026-09-15' },
    notes: 'Dual Hasselblad L2D-20c system, 1TB Built-in SSD',
  },
  {
    _id: 'eq5',
    name: 'DJI Inspire 2 with Zenmuse X7 6K',
    category: 'drone',
    status: 'available',
    assignedBookingId: null,
    notes: 'Super 35mm Cinema Camera, Dual Operator Setup',
  },
  {
    _id: 'eq6',
    name: '32-Bit Float Sound Recorder & Wireless Lav Mics',
    category: 'audio',
    status: 'in-use',
    assignedBookingId: { _id: 'b104', name: 'Karthik & Revathi', eventDate: '2026-08-28' },
    notes: 'Zoom F6 Multitrack, Sennheiser AVX Digital Wireless Set',
  },
  {
    _id: 'eq7',
    name: 'Profoto A10 Off-Camera Studio Strobe Kit',
    category: 'lighting',
    status: 'available',
    assignedBookingId: null,
    notes: 'AirTTL Transceiver, High-Speed Sync, Round Head Diffuser',
  },
  {
    _id: 'eq8',
    name: 'Leica M11 Rangefinder (Black Chrome)',
    category: 'camera',
    status: 'maintenance',
    assignedBookingId: null,
    notes: 'Sensor cleaning and lens calibration scheduled.',
  },
];

export default function AdminEquipment() {
  const [equipmentList, setEquipmentList] = useState(INITIAL_SEED_EQUIPMENT);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // New item modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'camera',
    status: 'available',
    notes: '',
  });

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEqForDelete, setSelectedEqForDelete] = useState(null);

  // Load Equipment & Upcoming Bookings
  const loadData = async () => {
    setLoading(true);
    try {
      const eqRes = await fetchEquipment();
      if (eqRes.data && eqRes.data.length > 0) {
        setEquipmentList(eqRes.data);
      }
    } catch (err) {
      console.log('Using local fallback equipment data');
    }

    try {
      const bRes = await fetchBookings();
      if (bRes.data && bRes.data.length > 0) {
        setUpcomingBookings(bRes.data.filter((b) => b.status !== 'cancelled'));
      }
    } catch (err) {
      setUpcomingBookings([
        { _id: 'b101', name: 'Aarav Sharma & Meera Kapoor', eventDate: '2026-09-15' },
        { _id: 'b102', name: 'Siddharth Varma', eventDate: '2026-10-04' },
        { _id: 'b103', name: 'Ananya Ramesh', eventDate: '2026-11-20' },
        { _id: 'b104', name: 'Karthik & Revathi', eventDate: '2026-08-28' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Status toggle handler
  const handleStatusToggle = async (id, newStatus) => {
    try {
      await updateEquipment(id, { status: newStatus });
    } catch (err) {
      console.log('Status updated in local UI state');
    }

    setEquipmentList((prev) =>
      prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
    );
  };

  // Assignment to booking handler
  const handleAssignBooking = async (equipmentId, bookingId) => {
    const bookingObj = upcomingBookings.find((b) => b._id === bookingId) || null;
    try {
      await updateEquipment(equipmentId, {
        assignedBookingId: bookingId || null,
        status: bookingId ? 'in-use' : 'available',
      });
    } catch (err) {
      console.log('Booking assignment updated in local UI state');
    }

    setEquipmentList((prev) =>
      prev.map((e) =>
        e._id === equipmentId
          ? {
              ...e,
              assignedBookingId: bookingObj,
              status: bookingId ? 'in-use' : 'available',
            }
          : e
      )
    );
  };

  // Add New Equipment
  const handleCreateNewItem = async (e) => {
    e.preventDefault();
    if (!newItem.name) return;

    try {
      const res = await createEquipment(newItem);
      if (res.data) {
        setEquipmentList((prev) => [res.data, ...prev]);
      }
    } catch (err) {
      const localNew = { ...newItem, _id: `eq-${Date.now()}`, assignedBookingId: null };
      setEquipmentList((prev) => [localNew, ...prev]);
    }

    setAddModalOpen(false);
    setNewItem({ name: '', category: 'camera', status: 'available', notes: '' });
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!selectedEqForDelete) return;
    const id = selectedEqForDelete._id;

    try {
      await deleteEquipment(id);
    } catch (err) {
      console.log('Deleted item locally');
    }

    setEquipmentList((prev) => prev.filter((e) => e._id !== id));
    setDeleteModalOpen(false);
    setSelectedEqForDelete(null);
  };

  // Filter Logic
  const filteredEquipment = equipmentList.filter((item) => {
    const matchesCat =
      categoryFilter === 'All' || item.category?.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus =
      statusFilter === 'All' || item.status?.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.notes && item.notes.toLowerCase().includes(query));

    return matchesCat && matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] font-montserrat uppercase font-bold text-gold tracking-widest block">
            Studio Optics & Hardware Inventory
          </span>
          <h1 className="text-3xl font-serif font-bold text-cream">
            Equipment Logistics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Excel Button */}
          <button
            onClick={() => exportEquipmentExcel(filteredEquipment)}
            className="px-3.5 py-2.5 rounded-2xl bg-gold/20 border border-gold/40 text-gold hover:bg-gold hover:text-black text-xs font-montserrat font-bold transition-all flex items-center gap-2 shadow-gold-glow-shadow"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={loadData}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gold transition-colors"
            title="Refresh Equipment"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rust to-gold text-black font-montserrat font-bold text-xs uppercase tracking-wider shadow-gold-glow flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add New Equipment</span>
          </button>
        </div>
      </div>


      {/* Controls Bar: Search & Category Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-4 rounded-3xl border border-rust/15 shadow-luxury">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gold absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search gear by model or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#FAF2EA] border border-rust/15 text-xs font-sans text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-gold"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {['All', 'Camera', 'Drone', 'Audio', 'Lighting'].map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-montserrat font-bold transition-colors shrink-0 border ${
                  isActive
                    ? 'bg-gold/20 text-gold-dark border-gold/40 shadow-gold-glow-shadow'
                    : 'bg-[#FAF2EA] text-charcoal/70 border-rust/10 hover:text-charcoal'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.length === 0 ? (
          <div className="col-span-full py-16 text-center text-charcoal/50 font-serif italic">
            No equipment found matching criteria.
          </div>
        ) : (
          filteredEquipment.map((eq) => {
            const assigned = eq.assignedBookingId;

            return (
              <motion.div
                key={eq._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-3xl border border-rust/15 hover:border-gold/40 transition-all duration-300 flex flex-col justify-between space-y-5 shadow-luxury relative group overflow-hidden"
              >
                {/* Ambient Top Glow Line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                {/* Card Top: 3D Category Icon & Status Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Equipment3DShape category={eq.category} />
                    <div>
                      <h3 className="font-montserrat font-bold text-charcoal text-base leading-snug">
                        {eq.name}
                      </h3>
                      <span className="text-[10px] uppercase font-montserrat font-bold text-rust tracking-widest block mt-0.5">
                        Category: {eq.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedEqForDelete(eq);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-xl bg-rust/10 text-rust hover:bg-rust hover:text-white transition-colors"
                    title="Delete Equipment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Technical Notes / Specs */}
                <p className="text-xs text-charcoal/70 font-sans italic bg-[#FAF2EA] p-3 rounded-2xl border border-rust/10 leading-relaxed">
                  "{eq.notes || 'Standard master production kit.'}"
                </p>

                {/* Status Toggle Pills */}
                <div className="space-y-2 pt-2 border-t border-rust/10">
                  <span className="text-[10px] font-montserrat uppercase font-bold text-rust tracking-widest block">
                    Operational Status Toggle:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { status: 'available', label: 'Available', color: 'bg-gold/15 text-gold-dark border-gold/40' },
                      { status: 'in-use', label: 'In Use', color: 'bg-clay/15 text-clay-dark border-clay/40' },
                      { status: 'maintenance', label: 'Service', color: 'bg-rust/15 text-rust-dark border-rust/40' },
                    ].map((st) => {
                      const isSelected = eq.status === st.status;
                      return (
                        <button
                          key={st.status}
                          onClick={() => handleStatusToggle(eq._id, st.status)}
                          className={`py-1.5 px-2 rounded-xl text-[10px] font-montserrat font-bold uppercase transition-all duration-200 border text-center ${
                            isSelected
                              ? `${st.color} shadow-sm scale-105`
                              : 'bg-[#FAF2EA] text-charcoal/60 border-rust/5 hover:text-charcoal'
                          }`}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Booking Assignment Selector Dropdown */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <span className="text-[10px] font-montserrat uppercase font-bold text-cream/60 tracking-wider block">
                    Assigned Upcoming Booking:
                  </span>
                  <select
                    value={assigned ? assigned._id || assigned : ''}
                    onChange={(e) => handleAssignBooking(eq._id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-white/15 text-xs font-sans text-cream focus:outline-none focus:border-gold"
                  >
                    <option value="">-- No Booking Assigned (Vault) --</option>
                    {upcomingBookings.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name} ({b.eventDate || 'Upcoming'})
                      </option>
                    ))}
                  </select>

                  {assigned && (
                    <div className="flex items-center gap-1.5 text-[10px] text-gold font-sans pt-1">
                      <Calendar className="w-3 h-3 text-gold" />
                      <span>Assigned to: <strong className="text-cream">{assigned.name || 'Client Shoot'}</strong></span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add New Equipment Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setAddModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-[#121212] rounded-3xl border border-gold/40 shadow-2xl p-6 sm:p-8 space-y-6"
            >
              <h2 className="text-2xl font-serif font-bold text-cream">
                Add Studio Equipment Asset
              </h2>

              <form onSubmit={handleCreateNewItem} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-[11px] font-montserrat font-bold text-gold uppercase tracking-wider mb-1">
                    Equipment Model / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony FX6 Cinema Camera"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-montserrat font-bold text-gold uppercase tracking-wider mb-1">
                      Category
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl bg-black/60 border border-white/15 text-cream focus:outline-none focus:border-gold"
                    >
                      <option value="camera">Camera</option>
                      <option value="drone">Drone</option>
                      <option value="audio">Audio</option>
                      <option value="lighting">Lighting</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-montserrat font-bold text-gold uppercase tracking-wider mb-1">
                      Initial Status
                    </label>
                    <select
                      value={newItem.status}
                      onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl bg-black/60 border border-white/15 text-cream focus:outline-none focus:border-gold"
                    >
                      <option value="available">Available</option>
                      <option value="in-use">In Use</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-montserrat font-bold text-gold uppercase tracking-wider mb-1">
                    Technical Specifications / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 4K 120p, dual CFexpress, S-Cinetone color profile..."
                    value={newItem.notes}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-cream focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/10 text-cream font-montserrat font-bold uppercase text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rust to-gold text-black font-montserrat font-bold uppercase text-xs shadow-gold-glow"
                  >
                    Save Equipment Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DarkConfirmationModal
        isOpen={deleteModalOpen}
        title="Remove Equipment Asset"
        message={`Are you sure you want to remove "${selectedEqForDelete?.name}" from studio inventory?`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
}
