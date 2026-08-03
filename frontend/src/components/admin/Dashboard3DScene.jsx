import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Calendar, CheckCircle2, Clock, XCircle, TrendingUp } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1F140D] border border-[#B87352]/40 p-3 rounded-2xl shadow-xl text-xs font-sans text-cream">
        <p className="font-montserrat font-bold text-[#B87352] mb-1">{label}</p>
        <p className="font-medium text-cream/90">
          Bookings: <span className="font-bold text-[#4C8C5A]">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard3DScene({ bookingStats }) {
  const barData = useMemo(() => {
    if (bookingStats?.byDate && Array.isArray(bookingStats.byDate) && bookingStats.byDate.length > 0) {
      return bookingStats.byDate;
    }
    return [
      { label: 'Jun W1', count: 4 },
      { label: 'Jun W3', count: 7 },
      { label: 'Jul W1', count: 9 },
      { label: 'Jul W3', count: 12 },
      { label: 'Aug W1', count: 15 },
      { label: 'Aug W3', count: 11 },
    ];
  }, [bookingStats]);

  const confirmed = bookingStats?.confirmed ?? 6;
  const pending = bookingStats?.pending ?? 3;
  const cancelled = bookingStats?.cancelled ?? 1;
  const total = bookingStats?.total ?? 10;

  return (
    <div className="w-full rounded-3xl bg-white p-6 border border-rust/15 shadow-luxury space-y-6">
      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-montserrat uppercase font-bold text-gold tracking-widest block">
            Booking Volume Velocity
          </span>
          <h3 className="text-xl font-serif font-bold text-charcoal">
            Studio Reservations Cluster
          </h3>
        </div>

        {/* 3 Status Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#4C8C5A]/10 border border-[#4C8C5A]/30 text-[#4C8C5A] text-xs font-montserrat font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{confirmed} Confirmed</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-rust/10 border border-rust/30 text-rust text-xs font-montserrat font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{pending} Pending</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gold/10 border border-gold/30 text-gold text-xs font-montserrat font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>{cancelled} Cancelled</span>
          </div>
        </div>
      </div>

      {/* 2D Bar Chart Container */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3E9DC" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#8A7660"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#F3E9DC' }}
            />
            <YAxis
              stroke="#8A7660"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#F3E9DC' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F7F1E8' }} />
            <Bar dataKey="count" radius={[12, 12, 0, 0]} maxBarSize={48}>
              {barData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? '#B87352' : '#8B5E3C'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
