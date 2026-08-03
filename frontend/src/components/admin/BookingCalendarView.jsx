import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, MapPin, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function BookingCalendarView({ bookings, onSelectBooking }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Map bookings to day numbers
  const bookingsByDay = {};
  bookings.forEach((b) => {
    if (!b.eventDate) return;
    const d = new Date(b.eventDate);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const dayNum = d.getDate();
      if (!bookingsByDay[dayNum]) bookingsByDay[dayNum] = [];
      bookingsByDay[dayNum].push(b);
    }
  });

  const daysGrid = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d);
  }

  return (
    <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 text-gold flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-cream">
              {monthNames[month]} {year}
            </h2>
            <span className="text-[10px] font-montserrat uppercase font-bold text-rust tracking-widest block">
              Event Schedule Grid
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-cream/80 hover:text-gold transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3.5 py-2 rounded-2xl bg-gold/15 text-gold border border-gold/40 text-xs font-montserrat font-bold uppercase"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-cream/80 hover:text-gold transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-montserrat font-bold uppercase text-gold">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
          <div key={w} className="py-2 bg-[#121212] rounded-xl border border-white/5">
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysGrid.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-28 rounded-2xl bg-white/[0.02]" />;
          }

          const dayBookings = bookingsByDay[day] || [];
          const isToday =
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year;

          return (
            <div
              key={day}
              className={`h-28 p-2 rounded-2xl border flex flex-col justify-between transition-all duration-200 overflow-hidden ${
                isToday
                  ? 'bg-gold/10 border-gold shadow-gold-glow-shadow'
                  : 'bg-[#121212]/80 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-montserrat">
                <span className={`font-bold ${isToday ? 'text-gold' : 'text-cream/80'}`}>
                  {day}
                </span>
                {dayBookings.length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold font-bold">
                    {dayBookings.length}
                  </span>
                )}
              </div>

              {/* Event Cards Stack */}
              <div className="space-y-1 overflow-y-auto max-h-16 pr-1">
                {dayBookings.map((b) => (
                  <motion.div
                    key={b._id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onSelectBooking && onSelectBooking(b)}
                    className={`p-1.5 rounded-xl text-[10px] font-sans font-medium cursor-pointer truncate border flex items-center gap-1.5 ${
                      b.status === 'confirmed'
                        ? 'bg-gold/20 text-gold border-gold/40'
                        : b.status === 'pending'
                        ? 'bg-gold/20 text-gold border-gold/40'
                        : 'bg-rust/20 text-rust border-rust/40'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      b.status === 'confirmed' ? 'bg-gold' : b.status === 'pending' ? 'bg-gold' : 'bg-rust'
                    }`} />
                    <span className="truncate">{b.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
