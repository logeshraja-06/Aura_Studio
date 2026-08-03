import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ApertureRings() {
  const groupRef = useRef();
  const outerRingRef = useRef();
  const innerRingRef = useRef();
  const bladesRef = useRef([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.35;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.5;
    }
  });

  const numBlades = 8;
  const bladeAngles = Array.from({ length: numBlades }, (_, i) => (i * 2 * Math.PI) / numBlades);

  return (
    <group ref={groupRef}>
      {/* Outer Golden Metallic Ring */}
      <mesh ref={outerRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[2.5, 0.08, 16, 100]} />
        <meshStandardMaterial
          color="#C9A227"
          metalness={0.9}
          roughness={0.2}
          emissive="#C9A227"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Inner Rust Metallic Accent Ring */}
      <mesh ref={innerRingRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.8, 0.05, 16, 80]} />
        <meshStandardMaterial
          color="#A8654A"
          metalness={0.8}
          roughness={0.3}
          emissive="#A8654A"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 8 Spiraling Camera Aperture Blades */}
      {bladeAngles.map((angle, index) => (
        <group key={index} rotation={[0, 0, angle]}>
          <mesh position={[1.1, 0.4, 0]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[1.2, 0.25, 0.02]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? '#C9A227' : '#A8654A'}
              metalness={0.85}
              roughness={0.25}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}

      {/* Central Glowing Aperture Core Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#FFE58F"
          emissive="#C9A227"
          emissiveIntensity={0.8}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Ambient particles surrounding ring */}
      {Array.from({ length: 24 }).map((_, i) => {
        const radius = 2.8 + (i % 5) * 0.3;
        const a = (i * 2 * Math.PI) / 24;
        return (
          <mesh key={`p-${i}`} position={[Math.cos(a) * radius, Math.sin(a) * radius, (i % 3) * 0.2 - 0.2]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#C9A227' : '#A8654A'} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Aperture3DBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFE58F" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#A8654A" />
        <ApertureRings />
      </Canvas>
    </div>
  );
}
