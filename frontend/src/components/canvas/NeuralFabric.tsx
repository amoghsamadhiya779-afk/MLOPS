'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function NeuralFabric() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random telemetry points
  const positions = useMemo(() => {
    const pts = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 20;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // Push back slightly
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      pointsRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00d4ff"
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}
