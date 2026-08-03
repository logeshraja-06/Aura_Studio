import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-[#1F140D] border border-[#B87352]/40 p-2.5 rounded-xl shadow-xl text-xs font-sans text-cream">
        <p className="font-montserrat font-bold" style={{ color: data.payload.color }}>
          {data.name}
        </p>
        <p className="text-cream/90 font-medium">
          Count: <span className="font-bold">{data.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function DonutChart3D({ pendingCount = 5, confirmedCount = 12, cancelledCount = 2 }) {
  const data = [
    { name: 'Confirmed', value: confirmedCount, color: '#4C8C5A' },
    { name: 'Pending', value: pendingCount, color: '#8B5E3C' },
    { name: 'Cancelled', value: cancelledCount, color: '#B87352' },
  ];

  const total = confirmedCount + pendingCount + cancelledCount;

  return (
    <div className="relative w-full h-72 rounded-3xl bg-white border border-rust/15 p-4 shadow-luxury flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-montserrat uppercase font-bold text-rust tracking-widest">
          Reservation Mix
        </span>
        <span className="text-xs font-serif font-bold text-charcoal">
          {total} Total
        </span>
      </div>

      {/* Donut Chart with Center Text */}
      <div className="relative h-44 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Central Metric Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl font-serif font-bold text-charcoal">{confirmedCount}</span>
          <span className="text-[9px] font-montserrat uppercase text-rust font-bold">Confirmed</span>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-around border-t border-rust/10 pt-3 text-[11px] font-sans">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-charcoal/80">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
