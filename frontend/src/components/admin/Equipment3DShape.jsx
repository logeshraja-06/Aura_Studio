import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function CameraShape() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.8;
      ref.current.rotation.x = Math.sin(ref.current.rotation.y * 0.5) * 0.2;
    }
  });

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.5]} />
        <meshStandardMaterial color="#C9A227" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lens */}
      <mesh position={[0, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.4, 32]} />
        <meshStandardMaterial color="#A8654A" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Top Dial / Flash */}
      <mesh position={[0.3, 0.45, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#FFE58F" metalness={0.7} />
      </mesh>
    </group>
  );
}

function DroneShape() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.9;
      ref.current.rotation.z = Math.sin(ref.current.rotation.y * 0.8) * 0.15;
    }
  });

  return (
    <group ref={ref}>
      {/* Center Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.2, 0.6]} />
        <meshStandardMaterial color="#C9A227" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 4 Arms */}
      {[
        [-0.6, 0, -0.6],
        [0.6, 0, -0.6],
        [-0.6, 0, 0.6],
        [0.6, 0, 0.6],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Arm Bar */}
          <mesh position={[-pos[0] / 2, 0, -pos[1] / 2]}>
            <boxGeometry args={[Math.abs(pos[0]), 0.08, 0.08]} />
            <meshStandardMaterial color="#A8654A" metalness={0.7} />
          </mesh>
          {/* Rotor Motor */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
            <meshStandardMaterial color="#FFE58F" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AudioShape() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.7;
    }
  });

  return (
    <group ref={ref}>
      {/* Mic Body Handle */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.9, 24]} />
        <meshStandardMaterial color="#A8654A" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Mesh Grille Sphere */}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.32, 24, 24]} />
        <meshStandardMaterial color="#C9A227" metalness={0.95} roughness={0.15} wireframe={false} />
      </mesh>
      {/* Mount Ring */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.25, 0.04, 16, 32]} />
        <meshStandardMaterial color="#FFE58F" metalness={0.9} />
      </mesh>
    </group>
  );
}

function LightingShape() {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.75;
      ref.current.rotation.x = Math.cos(ref.current.rotation.y * 0.6) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {/* Octabox Cone */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.7, 0.8, 8]} />
        <meshStandardMaterial color="#A8654A" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Front Softbox Diffuser Disk */}
      <mesh position={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.68, 0.68, 0.04, 32]} />
        <meshStandardMaterial color="#FFE58F" emissive="#C9A227" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

export default function Equipment3DShape({ category = 'camera' }) {
  const renderShape = () => {
    switch (category?.toLowerCase()) {
      case 'drone':
      case 'aerial':
        return <DroneShape />;
      case 'audio':
      case 'sound':
        return <AudioShape />;
      case 'lighting':
      case 'light':
        return <LightingShape />;
      case 'camera':
      default:
        return <CameraShape />;
    }
  };

  return (
    <div className="w-12 h-12 rounded-2xl bg-black/60 border border-gold/30 overflow-hidden shrink-0 flex items-center justify-center">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={1.5} color="#FFE58F" />
        {renderShape()}
      </Canvas>
    </div>
  );
}
