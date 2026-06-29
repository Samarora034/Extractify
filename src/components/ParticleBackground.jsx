'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function Particles() {
  const ref = useRef();
  const count = 800;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      spd[i] = 0.002 + Math.random() * 0.005;
    }
    return [pos, spd];
  }, []);

  useFrame(({ clock, pointer }) => {
    const geo = ref.current.geometry;
    const posAttr = geo.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 1] += Math.sin(t + i) * speeds[i] * 0.3;
      posAttr.array[i * 3] += Math.cos(t * 0.5 + i) * speeds[i] * 0.2;
    }
    posAttr.needsUpdate = true;
    ref.current.rotation.y += 0.0003;
    ref.current.rotation.y += pointer.x * 0.0005;
    ref.current.rotation.x += pointer.y * 0.0003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#3b82f6" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function GradientOrb() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.5;
    ref.current.position.x = Math.cos(clock.getElapsedTime() * 0.2) * 0.3;
  });
  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshBasicMaterial color="#1d4ed8" transparent opacity={0.08} />
    </mesh>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ antialias: false, alpha: true }}>
        <Particles />
        <GradientOrb />
      </Canvas>
    </div>
  );
}
