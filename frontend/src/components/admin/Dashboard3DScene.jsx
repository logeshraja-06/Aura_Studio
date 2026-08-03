import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. Ambient Gold Dust Drift Particles Background
function GoldDustParticles({ count = 350 }) {
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return [pos];
  }, [count]);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(201, 162, 39, 0.9)');
    grad.addColorStop(0.6, 'rgba(168, 101, 74, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const t = state.clock.getElapsedTime();
      pointsRef.current.rotation.y = t * 0.03;
      pointsRef.current.rotation.x = Math.sin(t * 0.02) * 0.04;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        map={texture}
        transparent
        depthWrite={false}
        opacity={0.65}
      />
    </points>
  );
}

// 2. Extruded 3D Bar Mesh with Staggered Growth Animation & Emissive Hover Label
function Interactive3DBar({ index, totalBars, dataItem, hoveredBar, setHoveredBar }) {
  const meshRef = useRef();
  const [scaleY, setScaleY] = useState(0.01);
  const targetHeight = Math.max(0.6, (dataItem.count / 10) * 3.2);

  // Staggered elastic growth animation on load
  useFrame((state, delta) => {
    if (meshRef.current) {
      if (scaleY < 1) {
        const nextScale = scaleY + delta * (1.8 + index * 0.2);
        const clamped = Math.min(1, nextScale);
        setScaleY(clamped);
        meshRef.current.scale.y = clamped;
        meshRef.current.position.y = (targetHeight * clamped) / 2;
      }
    }
  });

  const isHovered = hoveredBar && hoveredBar.label === dataItem.label;
  const xPos = (index - totalBars / 2) * 0.85;

  return (
    <group position={[xPos, 0, 0]}>
      {/* Base Grid Marker */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial color="#C9A227" transparent opacity={0.15} />
      </mesh>

      {/* Extruded 3D Bar */}
      <mesh
        ref={meshRef}
        position={[0, targetHeight / 2, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredBar(dataItem);
        }}
        onPointerOut={() => setHoveredBar(null)}
      >
        <boxGeometry args={[0.55, targetHeight, 0.55]} />
        <meshStandardMaterial
          color={isHovered ? '#FFE58F' : index % 2 === 0 ? '#C9A227' : '#A8654A'}
          metalness={0.85}
          roughness={0.2}
          emissive={isHovered ? '#C9A227' : index % 2 === 0 ? '#C9A227' : '#A8654A'}
          emissiveIntensity={isHovered ? 0.8 : 0.25}
        />

        {/* Floating drei HTML Hover Label */}
        {isHovered && (
          <Html position={[0, targetHeight / 2 + 0.4, 0]} center distanceFactor={10}>
            <div className="px-3 py-1.5 rounded-xl bg-charcoal/95 border border-gold/50 text-cream text-xs font-montserrat shadow-2xl pointer-events-none whitespace-nowrap z-30">
              <span className="font-bold text-gold">{dataItem.label}:</span>{' '}
              <span className="font-bold text-cream">{dataItem.count} Bookings</span>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

// 3. Interactive Segmented 3D Torus Donut Chart with Segment Pop-out & Tooltips
function Interactive3DTorusDonut({ statusData, hoveredSegment, setHoveredSegment }) {
  const donutGroupRef = useRef();

  useFrame((_, delta) => {
    if (donutGroupRef.current) {
      donutGroupRef.current.rotation.y += delta * 0.2;
    }
  });

  const total = statusData.reduce((sum, d) => sum + d.value, 0) || 1;

  let currentAngle = 0;
  const segments = statusData.map((d) => {
    const angle = (d.value / total) * Math.PI * 2;
    const startAngle = currentAngle;
    currentAngle += angle;
    return { ...d, startAngle, angle };
  });

  return (
    <group ref={donutGroupRef} position={[3.8, 1.2, -0.5]} rotation={[0.4, 0, 0]}>
      {segments.map((seg) => {
        const midAngle = seg.startAngle + seg.angle / 2;
        const isHovered = hoveredSegment && hoveredSegment.label === seg.label;
        const offset = isHovered ? 0.25 : 0;
        const xOff = Math.cos(midAngle) * offset;
        const zOff = Math.sin(midAngle) * offset;

        return (
          <group key={seg.label} position={[xOff, 0, zOff]}>
            <mesh
              rotation={[Math.PI / 2, 0, seg.startAngle]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredSegment(seg);
              }}
              onPointerOut={() => setHoveredSegment(null)}
            >
              <torusGeometry args={[1.3, 0.25, 24, 48, seg.angle]} />
              <meshStandardMaterial
                color={seg.color}
                metalness={0.8}
                roughness={0.2}
                emissive={seg.color}
                emissiveIntensity={isHovered ? 0.75 : 0.25}
              />

              {/* Floating drei HTML Tooltip */}
              {isHovered && (
                <Html position={[Math.cos(midAngle) * 1.5, 0.6, Math.sin(midAngle) * 1.5]} center distanceFactor={9}>
                  <div className="px-3 py-1.5 rounded-xl bg-charcoal/95 border border-gold/50 text-cream text-xs font-montserrat shadow-2xl pointer-events-none whitespace-nowrap z-30 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                    <span className="font-bold text-cream">{seg.label}:</span>
                    <span className="font-bold text-gold">{seg.value}</span>
                    <span className="text-[10px] text-cream/60">({Math.round((seg.value / total) * 100)}%)</span>
                  </div>
                </Html>
              )}
            </mesh>
          </group>
        );
      })}

      {/* Central Core Metallic Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#0A0A0A" metalness={0.9} roughness={0.1} emissive="#C9A227" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

export default function Dashboard3DScene({ bookingStats }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  // Dynamic Volume Cluster by Period
  const barData = useMemo(() => {
    if (bookingStats?.byDate && bookingStats.byDate.length > 0) {
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

  // Dynamic Status Segments
  const statusData = useMemo(() => {
    return [
      { label: 'Confirmed', value: bookingStats?.confirmed || 12, color: '#C9A227' },
      { label: 'Pending', value: bookingStats?.pending || 5, color: '#A8654A' },
      { label: 'Cancelled', value: bookingStats?.cancelled || 2, color: '#EF4444' },
    ];
  }, [bookingStats]);

  return (
    <div className="relative w-full h-[420px] rounded-3xl bg-[#050505] border border-gold/30 overflow-hidden shadow-2xl">
      {/* 3D Scene Controls Header */}
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <span className="text-[10px] font-montserrat uppercase font-bold text-gold tracking-widest block">
          3D Interactive Operations Scene
        </span>
        <h3 className="text-xl font-serif font-bold text-cream">
          Live Booking Cluster & Fleet Distribution
        </h3>
        <p className="text-[11px] font-sans text-cream/50 mt-0.5">
          Drag to rotate 3D viewport • Scroll to zoom • Hover bars & torus segments for tooltips
        </p>
      </div>

      {/* R3F Canvas with OrbitControls & Gold Dust Particles */}
      <Canvas
        camera={{ position: [0, 3.5, 7.5], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#050505');
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 8]} intensity={1.6} color="#FFE58F" />
        <pointLight position={[-8, -5, -5]} intensity={0.9} color="#A8654A" />

        {/* Orbit Controls (constrained for professional UX) */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={4.5}
          maxDistance={11}
        />

        {/* Ambient Gold Dust Particles */}
        <GoldDustParticles count={350} />

        {/* Extruded 3D Bar Chart Cluster */}
        <group position={[-1.2, -0.5, 0]}>
          {barData.map((item, idx) => (
            <Interactive3DBar
              key={item.label}
              index={idx}
              totalBars={barData.length}
              dataItem={item}
              hoveredBar={hoveredBar}
              setHoveredBar={setHoveredBar}
            />
          ))}
        </group>

        {/* Segmented 3D Torus Donut Chart */}
        <Interactive3DTorusDonut
          statusData={statusData}
          hoveredSegment={hoveredSegment}
          setHoveredSegment={setHoveredSegment}
        />
      </Canvas>
    </div>
  );
}
