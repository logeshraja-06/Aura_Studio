import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// 650 Soft Gold/Amber Bokeh Dust Particles over Light Cream
function GoldDustParticles({ count = 650, mousePos }) {
  const meshRef = useRef();

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return [pos];
  }, [count]);

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(201, 162, 39, 0.95)'); // Antique Gold #C9A227
    grad.addColorStop(0.5, 'rgba(168, 101, 74, 0.6)'); // Warm Rust #A8654A
    grad.addColorStop(1, 'rgba(253, 248, 243, 0)'); // Soft Cream #FDF8F3
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Continuous light drift
    meshRef.current.rotation.y = time * 0.05 + mousePos.current.x * 0.15;
    meshRef.current.rotation.x = Math.sin(time * 0.03) * 0.05 + mousePos.current.y * 0.15;
  });

  return (
    <points ref={meshRef}>
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
        map={particleTexture}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        opacity={0.8}
      />
    </points>
  );
}

// 3 Large Ambient Glass Spheres Floating Briskly & Reacting to Cursor
function FloatingGlassSpheres({ mousePos }) {
  const sphere1 = useRef();
  const sphere2 = useRef();
  const sphere3 = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mx = mousePos.current.x * 0.8;
    const my = mousePos.current.y * 0.8;

    if (sphere1.current) {
      // Brisk upward drift, gentle sway side-to-side
      sphere1.current.position.y = Math.sin(t * 1.8) * 2.0 + 0.6 + my;
      sphere1.current.position.x = Math.cos(t * 1.2) * 1.5 - 2.8 + mx;
      sphere1.current.rotation.x = t * 0.3;
      sphere1.current.rotation.y = t * 0.35;
    }

    if (sphere2.current) {
      sphere2.current.position.y = Math.cos(t * 2.0 + 1) * 2.4 - 0.2 - my;
      sphere2.current.position.x = Math.sin(t * 1.3 + 1) * 1.8 + 3.2 + mx;
      sphere2.current.rotation.x = -t * 0.35;
      sphere2.current.rotation.z = t * 0.3;
    }

    if (sphere3.current) {
      sphere3.current.position.y = Math.sin(t * 1.6 + 2) * 1.8 - 2.5 + my;
      sphere3.current.position.x = Math.sin(t * 1.0 + 2) * 1.4 + 0.4 - mx;
      sphere3.current.rotation.y = t * 0.25;
    }
  });

  return (
    <group>
      {/* Sphere 1: Left Soft Gold Glass Orb */}
      <mesh ref={sphere1} position={[-2.8, 0, -1]}>
        <sphereGeometry args={[1.3, 48, 48]} />
        <meshPhysicalMaterial
          roughness={0.1}
          transmission={0.9}
          thickness={1.2}
          ior={1.35}
          color="#C9A227"
          emissive="#A8654A"
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Sphere 2: Right Warm Terracotta Glass Orb */}
      <mesh ref={sphere2} position={[3.2, 0, -2]}>
        <sphereGeometry args={[1.7, 48, 48]} />
        <meshPhysicalMaterial
          roughness={0.08}
          transmission={0.92}
          thickness={1.5}
          ior={1.4}
          color="#A8654A"
          emissive="#B4735A"
          emissiveIntensity={0.25}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Sphere 3: Center Light Amber Glass Orb */}
      <mesh ref={sphere3} position={[0.4, -2.5, -3]}>
        <sphereGeometry args={[1.5, 48, 48]} />
        <meshPhysicalMaterial
          roughness={0.15}
          transmission={0.88}
          thickness={1.1}
          ior={1.3}
          color="#E9C08C"
          emissive="#C9A227"
          emissiveIntensity={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

export default function HeroCanvas() {
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePos.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ scene }) => {
          scene.background = null; // Let CSS container #FDF8F3 soft cream show through
        }}
      >
        <ambientLight intensity={1.2} color="#FDF8F3" />
        <directionalLight position={[5, 8, 5]} intensity={1.5} color="#C9A227" />
        <pointLight position={[-8, -5, -5]} intensity={1.0} color="#A8654A" />

        {/* Soft Gold/Rust Bokeh Dust Particles */}
        <GoldDustParticles count={650} mousePos={mousePos} />
      </Canvas>
    </div>
  );
}


