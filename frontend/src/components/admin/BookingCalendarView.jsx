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
    <div className="bg-white p-6 rounded-3xl border border-rust/15 shadow-luxury space-y-6">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 text-gold flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-charcoal">
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
            className="p-2.5 rounded-2xl bg-[#FAF2EA] border border-rust/15 text-charcoal/70 hover:bg-rust/10 hover:text-rust transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3.5 py-2 rounded-2xl bg-gold/15 text-gold border border-gold/40 text-xs font-montserrat font-bold uppercase hover:bg-gold/25 transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2.5 rounded-2xl bg-[#FAF2EA] border border-rust/15 text-charcoal/70 hover:bg-rust/10 hover:text-rust transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-montserrat font-bold uppercase text-rust">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
          <div key={w} className="py-2 bg-[#FAF2EA] rounded-xl border border-rust/10">
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysGrid.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-28 rounded-2xl bg-[#FAF2EA]/40" />;
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
                  : 'bg-white border-rust/10 hover:border-rust/30'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-montserrat">
                <span className={`font-bold ${isToday ? 'text-rust' : 'text-charcoal/80'}`}>
                  {day}
                </span>
                {dayBookings.length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/20 text-charcoal font-bold border border-gold/40">
                    {dayBookings.length}
                  </span>
                )}
              </div>

              {/* Event Cards Stack */}
              <div className="space-y-1 overflow-y-auto max-h-16 pr-1">
                {dayBookings.map((b) => (
                  <motion.div
                    key={b._id}
                    whileHover={{ opacity: 0.85 }}
                    onClick={() => onSelectBooking && onSelectBooking(b)}
                    className={`p-1.5 rounded-xl text-[10px] font-sans font-medium cursor-pointer truncate border flex items-center gap-1.5 ${
                      b.status === 'confirmed'
                        ? 'bg-gold/20 text-charcoal font-semibold border-gold/40'
                        : b.status === 'pending'
                        ? 'bg-gold/20 text-charcoal font-semibold border-gold/40'
                        : 'bg-rust/15 text-rust font-semibold border-rust/30'
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
