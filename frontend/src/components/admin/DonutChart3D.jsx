import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

function ChartGroup({ data, activeSegment, setActiveSegment }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;

  // Extruded 3D Bar representation or Torus segment
  let currentAngle = 0;
  const segments = data.map((item) => {
    const angle = (item.value / total) * Math.PI * 2;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...item, startAngle, angle };
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      {segments.map((seg, idx) => {
        const midAngle = seg.startAngle + seg.angle / 2;
        const x = Math.cos(midAngle) * 0.15;
        const z = Math.sin(midAngle) * 0.15;
        const isHovered = activeSegment && activeSegment.label === seg.label;

        return (
          <group
            key={seg.label}
            position={[isHovered ? x : 0, 0, isHovered ? z : 0]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setActiveSegment(seg);
            }}
            onPointerOut={() => setActiveSegment(null)}
          >
            {/* Extruded Bar / Cylinder segment */}
            <mesh
              position={[
                Math.cos(midAngle) * 1.4,
                0,
                Math.sin(midAngle) * 1.4,
              ]}
              rotation={[0, -midAngle, 0]}
            >
              <boxGeometry args={[0.5, Math.max(0.4, (seg.value / total) * 3.5), 0.5]} />
              <meshStandardMaterial
                color={seg.color}
                metalness={0.8}
                roughness={0.2}
                emissive={seg.color}
                emissiveIntensity={isHovered ? 0.6 : 0.2}
              />
            </mesh>

            {/* Torus Segment Ring Indicator */}
            <mesh rotation={[Math.PI / 2, 0, seg.startAngle]}>
              <torusGeometry args={[1.5, 0.18, 16, 32, seg.angle]} />
              <meshStandardMaterial
                color={seg.color}
                metalness={0.7}
                roughness={0.3}
                emissive={seg.color}
                emissiveIntensity={isHovered ? 0.5 : 0.15}
              />
            </mesh>
          </group>
        );
      })}

      {/* Center Core Metallic Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.65, 32, 32]} />
        <meshStandardMaterial
          color="#121212"
          metalness={0.9}
          roughness={0.1}
          emissive="#C9A227"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

export default function DonutChart3D({ pendingCount = 5, confirmedCount = 12, cancelledCount = 2 }) {
  const [activeSegment, setActiveSegment] = useState(null);

  const chartData = [
    { label: 'Confirmed', value: confirmedCount, color: '#C9A227', textClass: 'text-gold' },
    { label: 'Pending', value: pendingCount, color: '#A8654A', textClass: 'text-rust' },
    { label: 'Cancelled', value: cancelledCount, color: '#EF4444', textClass: 'text-red-400' },
  ];

  const totalBookings = pendingCount + confirmedCount + cancelledCount;

  return (
    <div className="relative w-full h-72 rounded-3xl bg-[#0A0A0A]/80 border border-gold/20 backdrop-blur-xl p-4 overflow-hidden flex flex-col justify-between">
      {/* Header Info */}
      <div className="flex items-center justify-between z-10">
        <div>
          <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-gold block">
            3D Analytics Engine
          </span>
          <h3 className="text-lg font-serif font-bold text-cream">
            Bookings Distribution
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-montserrat font-bold border border-gold/30">
          Total: {totalBookings}
        </span>
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full h-44 cursor-pointer">
        <Canvas camera={{ position: [0, 2.5, 4.5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#FFE58F" />
          <pointLight position={[-5, -5, -5]} intensity={0.8} color="#A8654A" />
          <ChartGroup
            data={chartData}
            activeSegment={activeSegment}
            setActiveSegment={setActiveSegment}
          />
        </Canvas>

        {/* Hover Tooltip Overlay */}
        {activeSegment && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-charcoal/95 border border-gold/40 text-cream text-xs font-montserrat shadow-xl pointer-events-none z-20 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeSegment.color }} />
            <span className="font-bold">{activeSegment.label}:</span>
            <span className="text-gold font-bold">{activeSegment.value}</span>
            <span className="text-[10px] text-cream/60">({Math.round((activeSegment.value / (totalBookings || 1)) * 100)}%)</span>
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="flex items-center justify-around pt-2 border-t border-white/10 text-xs font-montserrat z-10">
        {chartData.map((item) => (
          <div
            key={item.label}
            onMouseEnter={() => setActiveSegment(item)}
            onMouseLeave={() => setActiveSegment(null)}
            className={`flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg transition-colors ${
              activeSegment?.label === item.label ? 'bg-white/10' : ''
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-cream/80 text-[11px]">{item.label}:</span>
            <span className={`font-bold ${item.textClass}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
