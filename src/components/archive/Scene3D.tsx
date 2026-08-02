import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, Ring, Sparkles, Line, Octahedron } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";

/* ---- Orbiting particles (instanced for perf) ---- */
function OrbitingParticles({ count = 120 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 1.6 + Math.random() * 1.4,
      y: (Math.random() - 0.5) * 1.8,
      speed: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      size: 0.01 + Math.random() * 0.025,
    })), [count]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    particles.forEach((p, i) => {
      const a = p.angle + t * p.speed;
      dummy.position.set(Math.cos(a) * p.radius, p.y + Math.sin(t * p.speed + p.phase) * 0.15, Math.sin(a) * p.radius);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#22d3ee" transparent opacity={0.9} />
    </instancedMesh>
  );
}

/* ---- Core icosahedron with wireframe ---- */
function SystemCore() {
  const innerRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    mouse.current.x += (pointer.x - mouse.current.x) * 0.05;
    mouse.current.y += (pointer.y - mouse.current.y) * 0.05;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25 + mouse.current.x * 0.4;
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.15 - mouse.current.y * 0.25;
    }
    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.4;
      innerRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = -t * 0.4;
      wireRef.current.rotation.z = t * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner pulsing core */}
      <Icosahedron ref={innerRef} args={[0.55, 1]}>
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#22d3ee"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </Icosahedron>

      {/* Outer wireframe shell */}
      <Icosahedron ref={wireRef} args={[0.95, 1]}>
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
      </Icosahedron>

      {/* Second larger wireframe */}
      <Icosahedron args={[1.25, 0]}>
        <meshBasicMaterial color="#a5f3fc" wireframe transparent opacity={0.12} />
      </Icosahedron>

      {/* Orbital ring */}
      <Ring ref={ringRef} args={[1.5, 1.52, 64]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.4} side={THREE.DoubleSide} />
      </Ring>

      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* ---- Orbital Satellites shooting laser transmission beams ---- */
function OrbitalSatellites() {
  const satGroupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!satGroupRef.current) return;
    const t = state.clock.elapsedTime;
    satGroupRef.current.rotation.y = t * 0.35;
    satGroupRef.current.rotation.x = Math.sin(t * 0.2) * 0.25;
  });

  const sats = [
    { pos: [2.1, 0.4, 0] as [number, number, number], color: "#22d3ee", speed: 1 },
    { pos: [-1.9, -0.6, 0.8] as [number, number, number], color: "#fbbf24", speed: 1.2 },
    { pos: [0.5, 2.2, -0.6] as [number, number, number], color: "#38bdf8", speed: 0.8 },
    { pos: [-0.8, -2.1, -0.5] as [number, number, number], color: "#10b981", speed: 1.4 },
  ];

  return (
    <group ref={satGroupRef}>
      {sats.map((sat, idx) => (
        <group key={idx} position={sat.pos}>
          <Octahedron args={[0.12, 0]}>
            <meshStandardMaterial color={sat.color} emissive={sat.color} emissiveIntensity={1.5} />
          </Octahedron>
          <Line points={[[0, 0, 0], [0 - sat.pos[0], 0 - sat.pos[1], 0 - sat.pos[2]]]} color={sat.color} lineWidth={1.2} transparent opacity={0.4} />
        </group>
      ))}
    </group>
  );
}

/* ---- Slow cinematic camera drift ---- */
function CameraRig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.12) * 0.4;
    state.camera.position.y = Math.cos(t * 0.1) * 0.25;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function Scene3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={2} color="#22d3ee" />
          <pointLight position={[-5, -3, 2]} intensity={1.5} color="#fbbf24" />
          <pointLight position={[0, 0, 3]} intensity={1.8} color="#a5f3fc" />
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
            <SystemCore />
            <OrbitalSatellites />
          </Float>
          <OrbitingParticles count={140} />
          <Sparkles count={80} scale={5} size={2} speed={0.3} color="#22d3ee" />
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
