import React, { useRef, useState, useMemo, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. WebGL Error Boundary Fallback Guard (Restyled for Light Cream Theme)
class ThreeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[Dashboard3DScene WebGL Error Boundary Caught]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF2EA] text-charcoal/80 p-6 text-center">
          <span className="text-rust font-serif font-bold text-lg mb-1">AURA 3D Cinematic Engine</span>
          <span className="text-xs text-charcoal/60">Fallback 2D Operations View Active (WebGL Context Guard)</span>
        </div>
      );
    }
    return this.props.children;
  }
}

// 2. Ambient Gold Dust Particles on Light Cream Canvas
function GoldDustParticles({ count = 200 }) {
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const t = state.clock.elapsedTime || 0;
      pointsRef.current.rotation.y = t * 0.02;
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
        size={0.18}
        color="#C9A227"
        transparent
        opacity={0.5}
      />
    </points>
  );
}

// 3. Interactive Floating "Cinematic Aperture & Film Reel" Engine on Cream Background
function CinematicApertureEngine({ totalVolume = 10, hoveredCore, setHoveredCore }) {
  const outerRingRef = useRef();
  const innerApertureRef = useRef();
  const coreMeshRef = useRef();

  const rotationSpeed = Math.min(1.2, 0.2 + totalVolume * 0.04);

  useFrame((state, delta) => {
    const elapsedTime = state.clock.elapsedTime || 0;
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * rotationSpeed;
      outerRingRef.current.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
    }
    if (innerApertureRef.current) {
      innerApertureRef.current.rotation.z -= delta * (rotationSpeed * 1.5);
    }
    if (coreMeshRef.current) {
      const pulse = 1 + Math.sin(elapsedTime * 2) * 0.06;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const blades = useMemo(() => {
    const bladeArr = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      bladeArr.push({
        id: i,
        angle,
        x: Math.cos(angle) * 0.9,
        y: Math.sin(angle) * 0.9,
      });
    }
    return bladeArr;
  }, []);

  return (
    <group position={[3.6, 0.4, 0]}>
      {/* Outer Metallic Film Reel Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[1.65, 0.12, 16, 64]} />
          <meshStandardMaterial color="#C9A227" metalness={0.9} roughness={0.15} emissive="#C9A227" emissiveIntensity={0.35} />
        </mesh>
        {blades.map((b) => (
          <mesh key={`node-${b.id}`} position={[b.x * 1.8, b.y * 1.8, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.2, 16]} />
            <meshStandardMaterial color="#B4735A" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Counter-rotating Inner Aperture Blades */}
      <group ref={innerApertureRef}>
        {blades.map((b) => (
          <mesh key={`blade-${b.id}`} position={[b.x * 0.65, b.y * 0.65, 0]} rotation={[0, 0, b.angle + Math.PI / 4]}>
            <boxGeometry args={[0.7, 0.12, 0.04]} />
            <meshStandardMaterial color="#A8654A" metalness={0.75} roughness={0.25} emissive="#A8654A" emissiveIntensity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Central Glowing Core Lens */}
      <mesh
        ref={coreMeshRef}
        position={[0, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredCore(true);
        }}
        onPointerOut={() => setHoveredCore(false)}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={hoveredCore ? '#E9C08C' : '#C9A227'}
          metalness={0.95}
          roughness={0.05}
          emissive="#C9A227"
          emissiveIntensity={hoveredCore ? 0.95 : 0.45}
        />
        {hoveredCore && (
          <Html position={[0, 0.9, 0]} center distanceFactor={9}>
            <div className="px-3 py-1.5 rounded-xl bg-white/95 border border-gold/60 text-charcoal text-xs font-montserrat shadow-luxury pointer-events-none whitespace-nowrap z-30">
              <span className="font-bold text-rust">AURA Aperture Engine:</span>{' '}
              <span className="font-bold text-gold">{totalVolume} Active Studio Workflows</span>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

// 4. Orbiting Status Particles Layer
function OrbitingStatusParticles({ confirmed = 0, pending = 0, cancelled = 0 }) {
  const particlesRef = useRef();

  const particleData = useMemo(() => {
    const items = [];
    const addGroup = (count, color, radiusBase) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = radiusBase + (Math.random() - 0.5) * 0.6;
        const height = (Math.random() - 0.5) * 1.8;
        const speed = 0.2 + Math.random() * 0.3;
        items.push({ angle, radius, height, speed, color });
      }
    };
    addGroup(Math.min(18, Math.max(6, confirmed)), '#C9A227', 2.3); // Gold for confirmed
    addGroup(Math.min(12, Math.max(4, pending)), '#B4735A', 2.8);   // Clay for pending
    addGroup(Math.min(8, Math.max(2, cancelled)), '#A8654A', 3.3);  // Rust for cancelled
    return items;
  }, [confirmed, pending, cancelled]);

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, idx) => {
        const data = particleData[idx];
        if (data) {
          data.angle += delta * data.speed;
          child.position.x = Math.cos(data.angle) * data.radius;
          child.position.z = Math.sin(data.angle) * data.radius;
          child.position.y = data.height + Math.sin(data.angle * 2) * 0.15;
        }
      });
    }
  });

  return (
    <group ref={particlesRef} position={[3.6, 0.4, 0]}>
      {particleData.map((p, idx) => (
        <mesh key={idx} position={[Math.cos(p.angle) * p.radius, p.height, Math.sin(p.angle) * p.radius]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// 5. Extruded 3D Bar Mesh with Staggered Growth Animation & Light-Mode Hover Label
function Interactive3DBar({ index, totalBars, dataItem, hoveredBar, setHoveredBar }) {
  const meshRef = useRef();
  const [scaleY, setScaleY] = useState(0.01);
  const targetHeight = Math.max(0.6, ((dataItem?.count || 1) / 10) * 3.2);

  useFrame((_, delta) => {
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

  const isHovered = hoveredBar && hoveredBar.label === dataItem?.label;
  const xPos = (index - totalBars / 2) * 0.85;

  return (
    <group position={[xPos, 0, 0]}>
      {/* Base Grid Marker */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial color="#A8654A" transparent opacity={0.25} />
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
          color={isHovered ? '#E9C08C' : index % 2 === 0 ? '#C9A227' : '#A8654A'}
          metalness={0.8}
          roughness={0.2}
          emissive={isHovered ? '#C9A227' : index % 2 === 0 ? '#C9A227' : '#A8654A'}
          emissiveIntensity={isHovered ? 0.85 : 0.3}
        />

        {/* Floating drei HTML Hover Label */}
        {isHovered && (
          <Html position={[0, targetHeight / 2 + 0.4, 0]} center distanceFactor={10}>
            <div className="px-3 py-1.5 rounded-xl bg-white/95 border border-gold/60 text-charcoal text-xs font-montserrat shadow-luxury pointer-events-none whitespace-nowrap z-30">
              <span className="font-bold text-rust">{dataItem?.label}:</span>{' '}
              <span className="font-bold text-gold">{dataItem?.count} Bookings</span>
            </div>
          </Html>
        )}
      </mesh>
    </group>
  );
}

// 6. Idle Camera Sway Controller
function IdleCameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime || 0;
    state.camera.position.x = Math.sin(t * 0.25) * 0.4;
    state.camera.position.y = 3.5 + Math.cos(t * 0.2) * 0.25;
    state.camera.lookAt(0, 0.5, 0);
  });
  return null;
}

export default function Dashboard3DScene({ bookingStats }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredCore, setHoveredCore] = useState(false);

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

  const totalBookings = bookingStats?.total || 10;
  const confirmed = bookingStats?.confirmed || 6;
  const pending = bookingStats?.pending || 3;
  const cancelled = bookingStats?.cancelled || 1;

  return (
    <div className="relative w-full h-[420px] rounded-3xl bg-[#FAF2EA] border border-rust/15 overflow-hidden shadow-luxury">
      {/* 3D Scene Header Overlay */}
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <span className="text-[10px] font-montserrat uppercase font-bold text-rust tracking-widest block">
          3D Interactive Operations Viewport
        </span>
        <h3 className="text-xl font-serif font-bold text-charcoal">
          Live Booking Aperture & Volume Cluster
        </h3>
        <p className="text-[11px] font-sans text-charcoal/70 mt-0.5">
          Drag to rotate • Scroll to zoom • Gold particles = Confirmed, Clay = Pending, Rust = Cancelled
        </p>
      </div>

      <ThreeErrorBoundary>
        <Canvas
          camera={{ position: [0, 3.5, 7.5], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ scene }) => {
            scene.background = new THREE.Color('#FAF2EA');
          }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[10, 15, 8]} intensity={1.8} color="#FFE58F" />
          <pointLight position={[-8, -5, -5]} intensity={1.2} color="#A8654A" />

          <IdleCameraRig />
          <GoldDustParticles count={200} />

          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2.1}
            minDistance={4.5}
            maxDistance={11}
          />

          <group position={[-1.4, -0.4, 0]}>
            {barData.map((item, idx) => (
              <Interactive3DBar
                key={item.label || idx}
                index={idx}
                totalBars={barData.length}
                dataItem={item}
                hoveredBar={hoveredBar}
                setHoveredBar={setHoveredBar}
              />
            ))}
          </group>

          <CinematicApertureEngine
            totalVolume={totalBookings}
            hoveredCore={hoveredCore}
            setHoveredCore={setHoveredCore}
          />

          <OrbitingStatusParticles
            confirmed={confirmed}
            pending={pending}
            cancelled={cancelled}
          />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
}
