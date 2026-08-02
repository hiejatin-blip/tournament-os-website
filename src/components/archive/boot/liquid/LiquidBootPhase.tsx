import {
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import {
  fragmentFragmentShader,
  fragmentVertexShader,
  floorFragmentShader,
  floorVertexShader,
  occluderFragmentShader,
  occluderVertexShader,
  particleFragmentShader,
  particleVertexShader,
  rayFragmentShader,
  rayVertexShader,
  sedimentFragmentShader,
  sedimentVertexShader,
  sprayFragmentShader,
  sprayVertexShader,
  streakFragmentShader,
  waterFragmentShader,
  waterVertexShader,
} from "./shaders";

type LiquidBootPhaseProps = {
  before: ReactNode;
  after: ReactNode;
  className?: string;
  /** Total duration of the liquid transition, in milliseconds. Progress
   * ramps 0->1 linearly over this window (the existing spring-smoothing
   * loop below still applies on top, exactly as it did for scroll input —
   * only the *source* of the target value changed from scroll position to
   * elapsed time). */
  durationMs?: number;
  /** Called once progress reaches 1 and the after-content is fully
   * revealed, so the parent boot orchestrator can consider this phase
   * finished. */
  onComplete?: () => void;
  /** Skip flag — jumps progress to 1 immediately rather than animating
   * through the remaining duration. */
  skip?: boolean;
};

type Derived = {
  depth: number;
  clarity: number;
  warmth: number;
  breach: number;
  chop: number;
  occluder: number;
  streak: number;
  ascent: number;
};

type UniformSet = {
  uTime: { value: number };
  uProgress: { value: number };
  uDepth: { value: number };
  uClarity: { value: number };
  uWarmth: { value: number };
  uBreach: { value: number };
  uChop: { value: number };
  uOccluder: { value: number };
  uStreak: { value: number };
  uResolution: { value: THREE.Vector2 };
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const range = (value: number, start: number, end: number) =>
  clamp01((value - start) / (end - start));
const smooth = (value: number) => value * value * (3 - 2 * value);
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

function derive(progress: number): Derived {
  if (progress <= 0.15) {
    return {
      depth: 1,
      clarity: 0.15,
      warmth: 0.05,
      breach: 0,
      chop: 0.3,
      occluder: 0,
      streak: 0,
      ascent: 0,
    };
  }

  if (progress < 0.72) {
    const phase = smooth(range(progress, 0.15, 0.72));
    const occluder =
      smooth(range(progress, 0.4, 0.475)) * (1 - smooth(range(progress, 0.475, 0.55)));
    let chop = mix(0.3, 0.6, smooth(range(progress, 0.15, 0.62)));
    let ascent = phase * 0.78;

    // C2 is a shared compressed-spring curve: calm, near-pause, then release.
    if (progress >= 0.62 && progress < 0.68) {
      const held = smooth(range(progress, 0.62, 0.68));
      chop = mix(0.6, 0.36, Math.sin(held * Math.PI));
      ascent = 0.716 + held * 0.012;
    } else if (progress >= 0.68) {
      const release = easeOut(range(progress, 0.68, 0.72));
      chop = mix(0.6, 0.98, release);
      ascent = mix(0.728, 0.82, release);
    }

    return {
      depth: mix(1, 0.08, phase),
      clarity: mix(0.15, 0.75, phase),
      warmth: mix(0.05, 0.55, phase),
      breach: 0,
      chop,
      occluder,
      streak: 0,
      ascent,
    };
  }

  if (progress < 0.8) {
    const phase = range(progress, 0.72, 0.8);
    const rise = smooth(range(phase, 0, 0.3));
    const fall = 1 - smooth(range(phase, 0.52, 1));
    const breach = Math.min(rise, fall);
    const streakRise = smooth(range(phase, 0.16, 0.3));
    const streakFall = 1 - smooth(range(phase, 0.46, 0.72));
    const streak = Math.min(streakRise, streakFall);
    const warmth = phase < 0.33
      ? mix(0.55, 1, smooth(range(phase, 0, 0.33)))
      : mix(1, 0.6, smooth(range(phase, 0.33, 1)));
    return {
      depth: mix(0.08, 0, easeOut(range(phase, 0, 0.28))),
      clarity: mix(0.75, 1, easeOut(range(phase, 0, 0.32))),
      warmth,
      breach,
      chop: mix(0.42, 1, breach),
      occluder: 0,
      streak,
      ascent: mix(0.82, 0.96, easeOut(phase)),
    };
  }

  const phase = smooth(range(progress, 0.8, 1));
  return {
    depth: 0,
    clarity: 1,
    warmth: mix(0.6, 0.45, phase),
    breach: 0,
    chop: mix(0.42, 0.2, phase),
    occluder: 0,
    streak: 0,
    ascent: mix(0.96, 1, phase),
  };
}

function createUniforms(): UniformSet {
  return {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uDepth: { value: 1 },
    uClarity: { value: 0.15 },
    uWarmth: { value: 0.05 },
    uBreach: { value: 0 },
    uChop: { value: 0.3 },
    uOccluder: { value: 0 },
    uStreak: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  };
}

function writeUniforms(uniforms: UniformSet, elapsed: number, progress: number, values: Derived, size: THREE.Vector2) {
  uniforms.uTime.value = elapsed;
  uniforms.uProgress.value = progress;
  uniforms.uDepth.value = values.depth;
  uniforms.uClarity.value = values.clarity;
  uniforms.uWarmth.value = values.warmth;
  uniforms.uBreach.value = values.breach;
  uniforms.uChop.value = values.chop;
  uniforms.uOccluder.value = values.occluder;
  uniforms.uStreak.value = values.streak;
  uniforms.uResolution.value.copy(size);
}

function makeMaterial(vertexShader: string, fragmentShader: string, uniforms: Record<string, THREE.IUniform>) {
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  // Enable derivatives so fwidth-based anti-aliasing in the shaders works
  // on WebGL1 contexts; on WebGL2 this is a no-op (derivatives are core).
  (material as unknown as { extensions: Record<string, boolean> }).extensions = {
    derivatives: true,
    fragDepth: false,
    drawBuffers: false,
    shaderTextureLOD: false,
  };
  return material;
}

function makeLitMaterial(
  vertexShader: string,
  fragmentShader: string,
  uniforms: Record<string, THREE.IUniform>,
) {
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
  (material as unknown as { extensions: Record<string, boolean> }).extensions = {
    derivatives: true,
    fragDepth: false,
    drawBuffers: false,
    shaderTextureLOD: false,
  };
  return material;
}

function WaterSurface({ uniforms }: { uniforms: UniformSet }) {
  const material = useMemo(
    () => makeMaterial(waterVertexShader, waterFragmentShader, uniforms),
    [uniforms],
  );
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh position={[0, 2.2, -1.2]} rotation={[-Math.PI / 2, 0, 0]} material={material} renderOrder={2}>
      <planeGeometry args={[42, 42, 180, 180]} />
    </mesh>
  );
}

function GodRays({ uniforms }: { uniforms: UniformSet }) {
  const materials = useMemo(
    () => [0, 1, 2].map(() => makeMaterial(rayVertexShader, rayFragmentShader, uniforms)),
    [uniforms],
  );
  useEffect(() => () => materials.forEach((material) => material.dispose()), [materials]);
  return (
    <group position={[0, -0.4, -2.8]}>
      {materials.map((material, index) => (
        <mesh
          key={index}
          material={material}
          position={[(index - 1) * 3.6, 0, index * -1.2]}
          rotation={[0.12, index * 0.35 - 0.35, index * 0.08]}
        >
          <planeGeometry args={[7, 15, 1, 1]} />
        </mesh>
      ))}
    </group>
  );
}

type ParticleLayerProps = {
  count: number;
  size: number;
  speed: number;
  depth: number;
  uniforms: UniformSet;
};

function ParticleLayer({ count, size, speed, depth, uniforms }: ParticleLayerProps) {
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 16;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[index * 3 + 2] = (Math.random() - 0.5) * depth - 3;
      phases[index] = Math.random();
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return result;
  }, [count, depth]);
  const material = useMemo(() => {
    const particleUniforms = { ...uniforms, uSize: { value: size }, uSpeed: { value: speed } };
    const result = makeMaterial(particleVertexShader, particleFragmentShader, particleUniforms);
    result.blending = THREE.NormalBlending;
    result.premultipliedAlpha = true;
    return result;
  }, [size, speed, uniforms]);
  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);
  return <points geometry={geometry} material={material} renderOrder={4} />;
}

function Occluder({ uniforms, progressRef }: { uniforms: UniformSet; progressRef: MutableRefObject<number> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () => makeMaterial(occluderVertexShader, occluderFragmentShader, uniforms),
    [uniforms],
  );
  useFrame(({ camera }) => {
    if (!mesh.current) return;
    const p = range(progressRef.current, 0.4, 0.55);
    mesh.current.position.set(mix(-10, 10, p), mix(-0.8, 2.4, Math.sin(p * Math.PI)), mix(0.2, -2.2, p));
    mesh.current.rotation.z = mix(-0.34, 0.22, p);
    mesh.current.lookAt(camera.position);
  });
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh ref={mesh} material={material} scale={[5.8, 4.1, 1]} renderOrder={8}>
      <planeGeometry args={[1, 1, 42, 42]} />
    </mesh>
  );
}

function BreachStreaks({ uniforms }: { uniforms: UniformSet }) {
  const { camera } = useThree();
  const group = useMemo(() => new THREE.Group(), []);
  const material = useMemo(() => {
    const result = makeMaterial(rayVertexShader, streakFragmentShader, uniforms);
    result.blending = THREE.AdditiveBlending;
    result.depthTest = false;
    return result;
  }, [uniforms]);
  useEffect(() => {
    camera.add(group);
    return () => {
      camera.remove(group);
      material.dispose();
    };
  }, [camera, group, material]);
  return (
    <primitive object={group} position={[0, 0.08, -1.1]}>
      {[
        [3.3, 0.018, 0],
        [2.2, 0.012, 0.075],
        [1.45, 0.01, -0.09],
      ].map(([width, height, y], index) => (
        <mesh key={index} material={material} position={[0, y, index * 0.006]} scale={[width, height, 1]} renderOrder={30}>
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </primitive>
  );
}

function BreachSpray({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const geometry = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const energy = 0.5 + Math.random() * 1.6;
      positions[index * 3] = (Math.random() - 0.5) * 0.25;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 0.18;
      positions[index * 3 + 2] = -1.2;
      velocities[index * 3] = Math.cos(angle) * energy;
      velocities[index * 3 + 1] = Math.abs(Math.sin(angle)) * energy + 0.4;
      velocities[index * 3 + 2] = (Math.random() - 0.5) * 0.45;
      phases[index] = Math.random();
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    result.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 3));
    result.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return result;
  }, []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uProgress: { value: 0 }, uBreach: { value: 0 }, uSize: { value: 5.5 } }),
    [],
  );
  const material = useMemo(() => {
    const result = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: sprayVertexShader,
      fragmentShader: sprayFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      premultipliedAlpha: true,
    });
    (result as unknown as { extensions: Record<string, boolean> }).extensions = {
      derivatives: true,
      fragDepth: false,
      drawBuffers: false,
      shaderTextureLOD: false,
    };
    return result;
  }, [uniforms]);
  useFrame(({ clock }) => {
    const p = progressRef.current;
    uniforms.uTime.value = clock.elapsedTime;
    uniforms.uProgress.value = p;
    uniforms.uBreach.value = derive(p).breach;
  });
  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);
  return <points geometry={geometry} material={material} position={[0, 0.2, -2]} renderOrder={20} />;
}

// -------------------------------------------------------------------------
// Environmental object layer (Part 2)
// -------------------------------------------------------------------------
//
// Real, lit low-poly geometry distributed across a range of depths and sizes
// to give the scene the sense of being a genuinely inhabited body of water.
// These are *not* billboards — they are actual meshes with normals and
// shader-based lighting matching the scene's directional / caustic look.
//
// Noise-driven surface displacement on these objects uses the same
// low-frequency `fbmSoft` and derivative-based smoothing discipline as the
// water surface fix in Part 1, so they cannot reintroduce pixel shimmer.

type LitUniformSet = Record<string, THREE.IUniform> & {
  uTime: { value: number };
  uProgress: { value: number };
  uClarity: { value: number };
  uWarmth: { value: number };
  uLightDir: { value: THREE.Vector3 };
};

function createLitUniforms(): LitUniformSet {
  return {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uClarity: { value: 0.15 },
    uWarmth: { value: 0.05 },
    uLightDir: { value: new THREE.Vector3(0.35, 0.92, 0.2).normalize() },
  };
}

type SedimentInstance = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  drift: [number, number, number];
  seed: number;
};

// A stable set of layouts so the environment reads the same on every load
// (predictable = cinematic; per-load random = distracting).
const sedimentInstances: SedimentInstance[] = [
  { position: [-3.2, -1.4, -2.8], rotation: [0.4, 0.6, 0.1], scale: 0.42, drift: [0.14, 0.05, 0.02], seed: 0.11 },
  { position: [2.6, -0.6, -3.4], rotation: [0.1, -0.3, 0.4], scale: 0.35, drift: [-0.10, 0.06, 0.01], seed: 0.27 },
  { position: [-1.8, 0.4, -4.8], rotation: [0.7, 0.1, -0.2], scale: 0.55, drift: [0.08, 0.04, -0.03], seed: 0.44 },
  { position: [3.6, 1.2, -5.8], rotation: [-0.2, 0.9, 0.3], scale: 0.32, drift: [-0.06, 0.03, 0.02], seed: 0.62 },
  { position: [0.4, -2.2, -3.0], rotation: [0.3, -0.7, 0.5], scale: 0.28, drift: [0.05, 0.07, 0.01], seed: 0.72 },
  { position: [-4.4, -0.4, -6.4], rotation: [0.5, 0.2, -0.4], scale: 0.62, drift: [0.09, 0.02, -0.01], seed: 0.81 },
  { position: [1.9, 1.8, -6.8], rotation: [-0.6, 0.4, 0.2], scale: 0.38, drift: [-0.11, 0.05, 0.02], seed: 0.05 },
  { position: [-2.4, 2.4, -7.6], rotation: [0.2, 0.5, -0.3], scale: 0.44, drift: [0.07, 0.03, -0.02], seed: 0.19 },
  { position: [4.8, -1.0, -8.2], rotation: [0.6, -0.2, 0.1], scale: 0.48, drift: [-0.08, 0.06, 0.01], seed: 0.34 },
  { position: [-3.6, 0.9, -9.4], rotation: [0.3, 0.7, 0.4], scale: 0.30, drift: [0.06, 0.04, -0.02], seed: 0.51 },
  { position: [0.9, -1.8, -9.8], rotation: [-0.4, 0.2, 0.6], scale: 0.36, drift: [-0.05, 0.03, 0.01], seed: 0.68 },
  { position: [-1.2, 2.1, -10.6], rotation: [0.5, -0.6, -0.1], scale: 0.52, drift: [0.09, 0.02, -0.01], seed: 0.88 },
  { position: [2.2, 0.1, -11.4], rotation: [0.1, 0.4, 0.7], scale: 0.40, drift: [-0.07, 0.05, 0.02], seed: 0.13 },
  { position: [-4.8, 1.4, -12.2], rotation: [0.4, 0.3, -0.5], scale: 0.34, drift: [0.06, 0.03, -0.01], seed: 0.29 },
];

function SedimentClusters({ litUniforms }: { litUniforms: LitUniformSet }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 1);
    const count = geo.attributes.position.count;
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) seeds[i] = Math.random();
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, []);
  const material = useMemo(
    () => makeLitMaterial(sedimentVertexShader, sedimentFragmentShader, litUniforms),
    [litUniforms],
  );
  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.children.forEach((child, index) => {
      const seed = sedimentInstances[index];
      if (!seed) return;
      const [bx, by, bz] = seed.position;
      const [dx, dy, dz] = seed.drift;
      child.position.set(
        bx + Math.sin(t * 0.12 + seed.seed * 6) * dx,
        by + Math.sin(t * 0.09 + seed.seed * 4) * dy * 3,
        bz + Math.cos(t * 0.07 + seed.seed * 5) * dz,
      );
      child.rotation.x = seed.rotation[0] + Math.sin(t * 0.06 + seed.seed) * 0.08;
      child.rotation.y = seed.rotation[1] + t * 0.02 * (seed.seed - 0.5);
      child.rotation.z = seed.rotation[2] + Math.cos(t * 0.05 + seed.seed) * 0.05;
    });
  });
  return (
    <group ref={groupRef} renderOrder={3}>
      {sedimentInstances.map((inst, index) => (
        <mesh
          key={index}
          geometry={geometry}
          material={material}
          position={inst.position}
          rotation={inst.rotation}
          scale={inst.scale}
        />
      ))}
    </group>
  );
}

type FragmentInstance = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  spin: number;
  seed: number;
};

const fragmentInstances: FragmentInstance[] = [
  { position: [-5.4, 0.2, -7.5], rotation: [0.3, 0.7, 0.1], scale: [1.1, 0.7, 0.9], spin: 0.02, seed: 0.15 },
  { position: [4.6, -1.2, -8.8], rotation: [-0.4, 0.2, 0.5], scale: [0.9, 1.2, 0.8], spin: -0.015, seed: 0.42 },
  { position: [0.6, 2.4, -11.6], rotation: [0.2, 1.1, -0.3], scale: [1.4, 0.6, 1.0], spin: 0.012, seed: 0.63 },
  { position: [-3.8, -0.6, -13.2], rotation: [0.5, -0.4, 0.2], scale: [1.0, 0.9, 1.2], spin: 0.018, seed: 0.78 },
  { position: [3.0, 1.6, -15.4], rotation: [-0.2, 0.5, 0.7], scale: [1.3, 1.0, 0.9], spin: -0.010, seed: 0.91 },
];

function DriftingFragments({ litUniforms }: { litUniforms: LitUniformSet }) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(1, 0);
    const count = geo.attributes.position.count;
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) seeds[i] = Math.random();
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, []);
  const material = useMemo(
    () => makeLitMaterial(fragmentVertexShader, fragmentFragmentShader, litUniforms),
    [litUniforms],
  );
  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.children.forEach((child, index) => {
      const inst = fragmentInstances[index];
      if (!inst) return;
      const [bx, by, bz] = inst.position;
      child.position.set(
        bx + Math.sin(t * 0.05 + inst.seed * 3) * 0.18,
        by + Math.sin(t * 0.07 + inst.seed * 4) * 0.22,
        bz + Math.cos(t * 0.04 + inst.seed * 2) * 0.12,
      );
      child.rotation.y += inst.spin * 0.5;
      child.rotation.x = inst.rotation[0] + Math.sin(t * 0.03 + inst.seed) * 0.04;
    });
  });
  return (
    <group ref={groupRef} renderOrder={3}>
      {fragmentInstances.map((inst, index) => (
        <mesh
          key={index}
          geometry={geometry}
          material={material}
          position={inst.position}
          rotation={inst.rotation}
          scale={inst.scale}
        />
      ))}
    </group>
  );
}

function Seafloor({ litUniforms }: { litUniforms: LitUniformSet }) {
  const material = useMemo(
    () => makeLitMaterial(floorVertexShader, floorFragmentShader, litUniforms),
    [litUniforms],
  );
  useEffect(() => () => material.dispose(), [material]);
  return (
    <mesh position={[0, -6.5, -8]} rotation={[-Math.PI / 2, 0, 0]} material={material} renderOrder={1}>
      <planeGeometry args={[42, 36, 48, 40]} />
    </mesh>
  );
}

type FishInstance = {
  position: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
  direction: 1 | -1;
};

// Two restrained schools give the ascent a living sense of scale. They remain
// intentionally secondary to the single C1 occluder pass.
const fishInstances: FishInstance[] = [
  { position: [-3.8, 0.6, -4.2], scale: 0.26, speed: 0.28, phase: 0.1, direction: 1 },
  { position: [-2.7, 0.2, -5.0], scale: 0.2, speed: 0.33, phase: 0.28, direction: 1 },
  { position: [-1.8, 0.85, -5.8], scale: 0.18, speed: 0.3, phase: 0.44, direction: 1 },
  { position: [-0.8, 0.35, -6.6], scale: 0.24, speed: 0.25, phase: 0.62, direction: 1 },
  { position: [0.2, 1.1, -7.4], scale: 0.16, speed: 0.36, phase: 0.78, direction: 1 },
  { position: [1.1, 0.55, -8.3], scale: 0.22, speed: 0.27, phase: 0.94, direction: 1 },
  { position: [4.6, -0.6, -6.2], scale: 0.28, speed: 0.22, phase: 0.2, direction: -1 },
  { position: [3.6, -0.1, -7.0], scale: 0.19, speed: 0.31, phase: 0.39, direction: -1 },
  { position: [2.8, 0.4, -8.1], scale: 0.23, speed: 0.26, phase: 0.58, direction: -1 },
  { position: [1.9, -0.25, -9.3], scale: 0.17, speed: 0.35, phase: 0.72, direction: -1 },
  { position: [1.0, 0.7, -10.4], scale: 0.2, speed: 0.29, phase: 0.88, direction: -1 },
];

function FishSchools({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: "#2b9dc2",
      emissive: "#061e3f",
      emissiveIntensity: 0.7,
      roughness: 0.42,
      metalness: 0.08,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    }),
    [],
  );
  const finMaterial = useMemo(
    () => new THREE.MeshPhysicalMaterial({
      color: "#8bdff2",
      emissive: "#104b72",
      emissiveIntensity: 0.42,
      roughness: 0.34,
      transparent: true,
      depthWrite: false,
      opacity: 0,
      side: THREE.DoubleSide,
    }),
    [],
  );
  useEffect(() => () => {
    bodyMaterial.dispose();
    finMaterial.dispose();
  }, [bodyMaterial, finMaterial]);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const progress = progressRef.current;
    const visibility = smooth(range(progress, 0.18, 0.36)) * (1 - smooth(range(progress, 0.73, 0.84)));
    groupRef.current.visible = visibility > 0.01;
    bodyMaterial.opacity = visibility * 0.82;
    finMaterial.opacity = visibility * 0.72;
    const t = clock.elapsedTime;
    groupRef.current.children.forEach((child, index) => {
      const fish = fishInstances[index];
      if (!fish) return;
      const swim = Math.sin(t * fish.speed * 2.5 + fish.phase * 8.0);
      child.position.set(
        fish.position[0] + fish.direction * t * fish.speed * 0.32 + swim * 0.22,
        fish.position[1] + Math.sin(t * fish.speed * 1.4 + fish.phase * 9.0) * 0.12,
        fish.position[2] + Math.cos(t * fish.speed + fish.phase * 7.0) * 0.18,
      );
      child.rotation.z = swim * 0.12;
    });
  });
  return (
    <group ref={groupRef} renderOrder={4}>
      {fishInstances.map((fish, index) => (
        <group
          key={index}
          position={fish.position}
          scale={[fish.scale * fish.direction, fish.scale, fish.scale]}
        >
          <mesh material={bodyMaterial} scale={[1.45, 0.62, 0.62]}>
            <sphereGeometry args={[1, 10, 8]} />
          </mesh>
          <mesh material={finMaterial} position={[-1.48, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.78, 1, 0.26]}>
            <coneGeometry args={[0.52, 1.18, 3]} />
          </mesh>
          <mesh material={finMaterial} position={[0.14, 0.62, 0]} rotation={[0, 0, -0.25]} scale={[0.28, 0.55, 0.16]}>
            <coneGeometry args={[0.34, 0.72, 3]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

type ShipInstance = {
  position: [number, number, number];
  scale: number;
  phase: number;
};

const shipInstances: ShipInstance[] = [
  { position: [3.3, 3.1, -7.6], scale: 0.88, phase: 0.18 },
  { position: [-4.8, 3.0, -12.8], scale: 0.56, phase: 0.67 },
];

function SurfaceShips({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const fleetRef = useRef<THREE.Group>(null);
  const hullMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#071a28",
      roughness: 0.42,
      metalness: 0.55,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    }),
    [],
  );
  const cabinMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#5ba8c3",
      emissive: "#153f5c",
      emissiveIntensity: 0.62,
      roughness: 0.28,
      metalness: 0.2,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    }),
    [],
  );
  const lampMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#d8f4ff", transparent: true, opacity: 0 }),
    [],
  );
  useEffect(() => () => {
    hullMaterial.dispose();
    cabinMaterial.dispose();
    lampMaterial.dispose();
  }, [cabinMaterial, hullMaterial, lampMaterial]);
  useFrame(({ clock }) => {
    if (!fleetRef.current) return;
    const progress = progressRef.current;
    const visibility = smooth(range(progress, 0.48, 0.64)) * (1 - smooth(range(progress, 0.76, 0.86)));
    fleetRef.current.visible = visibility > 0.01;
    hullMaterial.opacity = visibility * 0.94;
    cabinMaterial.opacity = visibility * 0.86;
    lampMaterial.opacity = visibility * 0.95;
    const t = clock.elapsedTime;
    fleetRef.current.children.forEach((child, index) => {
      const ship = shipInstances[index];
      if (!ship) return;
      child.position.set(
        ship.position[0] + Math.sin(t * 0.1 + ship.phase * 8.0) * 0.24,
        ship.position[1] + Math.sin(t * 0.45 + ship.phase * 5.0) * 0.07,
        ship.position[2],
      );
      child.rotation.z = Math.sin(t * 0.45 + ship.phase * 5.0) * 0.025;
    });
  });
  return (
    <group ref={fleetRef} renderOrder={5}>
      {shipInstances.map((ship, index) => (
        <group key={index} position={ship.position} scale={ship.scale} rotation={[0, index === 0 ? -0.18 : 0.2, 0]}>
          <mesh material={hullMaterial} position={[0, 0, 0]} scale={[1, 0.58, 0.58]}>
            <boxGeometry args={[4.2, 0.7, 1.45]} />
          </mesh>
          <mesh material={hullMaterial} position={[1.45, -0.26, 0]} rotation={[0, 0, -0.22]} scale={[0.55, 0.64, 0.62]}>
            <boxGeometry args={[1.8, 0.7, 1.45]} />
          </mesh>
          <mesh material={cabinMaterial} position={[-0.18, 0.63, 0]} scale={[0.92, 0.58, 0.74]}>
            <boxGeometry args={[1.6, 0.72, 1.0]} />
          </mesh>
          <mesh material={hullMaterial} position={[-0.6, 1.38, 0]}>
            <cylinderGeometry args={[0.055, 0.075, 1.6, 8]} />
          </mesh>
          <mesh material={lampMaterial} position={[-0.6, 2.18, 0]}>
            <sphereGeometry args={[0.13, 8, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PostProcessing({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const bloom = useRef<any>(null);
  const chromatic = useRef<any>(null);
  const dof = useRef<any>(null);
  const chromaOffset = useMemo(() => new THREE.Vector2(0.0025, 0.0014), []);

  useFrame(() => {
    const p = progressRef.current;
    const values = derive(p);
    if (bloom.current) bloom.current.intensity = 0.28 + values.clarity * 0.55 + values.breach * 3.2;
    // Baseline chroma remains a subtle underwater-lens tint, but the breach
    // peak gets a hard chromatic spike so the impact reads on a physical
    // lens level — not just brightness.
    const chroma = 0.0004 + values.depth * 0.0016 + values.breach * 0.028;
    chromaOffset.set(chroma, chroma * 0.62);

    // C4: uncertain depth, pull to surface, pull again to breach, then lock behind foreground droplets.
    let focusDistance = 0.028;
    let bokehScale = 3.2;
    if (p >= 0.28 && p < 0.62) {
      focusDistance = mix(0.028, 0.012, smooth(range(p, 0.28, 0.62)));
      bokehScale = mix(3.2, 1.65, smooth(range(p, 0.28, 0.62)));
    } else if (p >= 0.62 && p < 0.8) {
      focusDistance = mix(0.012, 0.005, smooth(range(p, 0.62, 0.8)));
      bokehScale = mix(1.65, 0.35, smooth(range(p, 0.62, 0.8)));
    } else if (p >= 0.8) {
      focusDistance = mix(0.005, 0.001, smooth(range(p, 0.8, 1)));
      bokehScale = mix(0.35, 0.08, smooth(range(p, 0.8, 1)));
    }
    if (dof.current) {
      const cocUniforms = dof.current.circleOfConfusionMaterial?.uniforms;
      if (cocUniforms?.focusDistance) cocUniforms.focusDistance.value = focusDistance;
      if (cocUniforms?.focusRange) cocUniforms.focusRange.value = mix(0.03, 0.12, values.clarity);
      dof.current.bokehScale = bokehScale;
    }
  });

  return (
    <EffectComposer multisampling={0} enableNormalPass>
      <Bloom ref={bloom} intensity={0.5} luminanceThreshold={0.35} luminanceSmoothing={0.25} mipmapBlur />
      <ChromaticAberration ref={chromatic} offset={chromaOffset} radialModulation modulationOffset={0.15} />
      <DepthOfField ref={dof} focusDistance={0.028} focusRange={0.03} bokehScale={3.2} />
      <Vignette eskil={false} offset={0.18} darkness={0.72} />
      {/* Grain reduced substantially — the previous 0.22 opacity was reading
          as visible static, compounding shader aliasing. This is now a truly
          subtle film texture. */}
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.055} />
    </EffectComposer>
  );
}

type PointerState = { x: number; y: number };

function Scene({
  progressRef,
  pointerRef,
}: {
  progressRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<PointerState>;
}) {
  const uniforms = useMemo(createUniforms, []);
  const litUniforms = useMemo(createLitUniforms, []);
  const { camera, gl, scene } = useThree();
  // Damped cursor/gyro parallax — the "camera operator" presence. Values are
  // deliberately tiny: barely noticeable, immediately felt.
  const pointerCurrent = useMemo(() => new THREE.Vector2(), []);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);
  const targetQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const lookMatrix = useMemo(() => new THREE.Matrix4(), []);
  const resolution = useMemo(() => new THREE.Vector2(), []);
  const ambient = useRef<THREE.AmbientLight>(null);
  const directional = useRef<THREE.DirectionalLight>(null);
  const breachLight = useRef<THREE.PointLight>(null);
  const deepColor = useMemo(() => new THREE.Color("#050a12"), []);
  const clearColor = useMemo(() => new THREE.Color("#1fa8b8"), []);
  const warmColor = useMemo(() => new THREE.Color("#fff4e0"), []);
  const workingColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    camera.position.set(0, -5.8, 7.5);
    camera.lookAt(0, 2.2, -1.2);
  }, [camera]);

  useFrame(({ clock }, delta) => {
    // Progress arrives pre-smoothed (velocity-aware inertia) from the DOM
    // loop, so every shader uniform and camera move inherits the same weight.
    const progress = progressRef.current;
    const values = derive(progress);
    gl.getDrawingBufferSize(resolution);
    writeUniforms(uniforms, clock.elapsedTime, progress, values, resolution);

    const sceneFog = scene.fog instanceof THREE.FogExp2 ? scene.fog : null;
    if (sceneFog) {
      sceneFog.color.copy(workingColor.lerpColors(deepColor, clearColor, values.warmth));
      sceneFog.density = mix(0.075, 0.012, values.clarity);
    }
    if (ambient.current) {
      ambient.current.color.copy(workingColor.lerpColors(deepColor, clearColor, values.warmth));
      ambient.current.intensity = mix(0.35, 1.1, values.clarity);
    }
    if (directional.current) {
      directional.current.color.copy(workingColor.lerpColors(clearColor, warmColor, values.warmth));
      directional.current.intensity = 1.2 + values.clarity * 2 + values.breach * 4;
    }
    if (breachLight.current) {
      breachLight.current.intensity = 0.4 + values.warmth * 1.4 + values.breach * 8;
    }

    // Keep the environmental-object shader lighting in sync with the scene.
    litUniforms.uTime.value = clock.elapsedTime;
    litUniforms.uProgress.value = progress;
    litUniforms.uClarity.value = values.clarity;
    litUniforms.uWarmth.value = values.warmth;

    const ascent = values.ascent;
    // Camera flies deeper into the canopy interior — closer targets amplify
    // the sense of scale as the dome curves overhead.
    targetPosition.set(0, mix(-5.8, 3.6, ascent), mix(7.5, 3.6, ascent));
    const impact = values.breach;
    // Harder physical recoil: multi-axis shake, a brief downward kick at
    // peak impact, and stronger displacement than the prior subtle values.
    targetPosition.x += Math.sin(clock.elapsedTime * 88) * impact * 0.26;
    targetPosition.y += Math.sin(clock.elapsedTime * 103) * impact * 0.18 - impact * 0.12;
    targetPosition.z += Math.cos(clock.elapsedTime * 77) * impact * 0.1;

    // Cursor / gyroscope parallax with heavy damping — a rig operator's
    // hand, not a mouse-follow gimmick. Fades slightly during the breach so
    // the impact shake stays authoritative.
    pointerCurrent.x += (pointerRef.current.x - pointerCurrent.x) * (1 - Math.exp(-delta * 2.2));
    pointerCurrent.y += (pointerRef.current.y - pointerCurrent.y) * (1 - Math.exp(-delta * 2.2));
    const parallaxWeight = 1 - impact * 0.7;
    targetPosition.x += pointerCurrent.x * 0.22 * parallaxWeight;
    targetPosition.y += -pointerCurrent.y * 0.12 * parallaxWeight;
    camera.position.lerp(targetPosition, 1 - Math.exp(-delta * (progress > 0.68 ? 7.5 : 3.3)));

    const pitchProgress = smooth(range(progress, 0.55, 0.81));
    // Brief pitch-down recoil at the breach — the camera ducks from the light
    // for a single frame before settling into the after-content's level view.
    const pitchRecoil = values.breach * 0.4;
    targetLook.set(
      pointerCurrent.x * 0.5 * parallaxWeight,
      mix(2.2, 1.3, pitchProgress) - pitchRecoil - pointerCurrent.y * 0.28 * parallaxWeight,
      mix(-1.2, -5.5, pitchProgress),
    );
    lookMatrix.lookAt(camera.position, targetLook, camera.up);
    targetQuaternion.setFromRotationMatrix(lookMatrix);
    const baselineRoll = Math.sin(clock.elapsedTime * 0.42) * THREE.MathUtils.degToRad(0.32) * mix(1, 0.2, range(progress, 0.8, 1));
    const breachRoll = Math.sin(values.breach * Math.PI) * THREE.MathUtils.degToRad(2.8);
    const roll = baselineRoll + breachRoll;
    const rollQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll);
    targetQuaternion.multiply(rollQuaternion);
    camera.quaternion.slerp(targetQuaternion, 1 - Math.exp(-delta * (values.breach > 0.1 ? 15 : 4.2)));
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#0b2d3d", 0.055]} />
      <ambientLight ref={ambient} color="#0b2d3d" intensity={0.45} />
      <directionalLight ref={directional} color="#bdf2ff" intensity={2.2} position={[1, 5, 1]} />
      <pointLight ref={breachLight} color="#fff4e0" intensity={2.5} position={[0, 2.4, -2]} />
      <Seafloor litUniforms={litUniforms} />
      <GodRays uniforms={uniforms} />
      <SedimentClusters litUniforms={litUniforms} />
      <DriftingFragments litUniforms={litUniforms} />
      <FishSchools progressRef={progressRef} />
      <SurfaceShips progressRef={progressRef} />
      <WaterSurface uniforms={uniforms} />
      <ParticleLayer count={52} size={2.1} speed={0.14} depth={12} uniforms={uniforms} />
      <ParticleLayer count={31} size={4.2} speed={0.3} depth={8} uniforms={uniforms} />
      <ParticleLayer count={13} size={8.5} speed={0.58} depth={4} uniforms={uniforms} />
      <Occluder uniforms={uniforms} progressRef={progressRef} />
      <BreachSpray progressRef={progressRef} />
      <BreachStreaks uniforms={uniforms} />
      <PostProcessing progressRef={progressRef} />
    </>
  );
}

const dropletSeeds = [
  [8, 0.02, 0.12, 1.3],
  [17, 0.08, 0.2, 0.95],
  [26, 0.14, 0.08, 1.5],
  [38, 0.04, 0.24, 1.15],
  [47, 0.18, 0.14, 0.82],
  [55, 0.1, 0.28, 1.45],
  [63, 0.2, 0.1, 1.05],
  [71, 0.06, 0.22, 1.35],
  [79, 0.16, 0.16, 0.9],
  [86, 0.12, 0.26, 1.25],
  [92, 0.22, 0.1, 1.1],
  [33, 0.24, 0.18, 0.78],
];

const lensDropSeeds = [
  [12, 14, 68, 0.01],
  [28, 8, 42, 0.08],
  [54, 19, 76, 0.16],
  [76, 11, 52, 0.23],
  [87, 32, 34, 0.31],
  [42, 43, 28, 0.37],
];

function DropletOverlay() {
  return (
    <div className="deep-current__droplets" aria-hidden="true">
      <span className="deep-current__lens-wash" />
      {lensDropSeeds.map(([left, top, size, start], index) => (
        <i
          key={`lens-${index}`}
          className="deep-current__lens-drop"
          style={
            {
              "--lens-left": `${left}%`,
              "--lens-top": `${top}%`,
              "--lens-size": `${size}px`,
              "--lens-start": start,
            } as React.CSSProperties
          }
        />
      ))}
      {dropletSeeds.map(([left, delay, duration, scale], index) => (
        <i
          key={index}
          className="deep-current__droplet"
          style={
            {
              "--drop-left": `${left}%`,
              "--drop-start": delay,
              "--drop-travel": 38 + duration * 45,
              "--drop-scale": scale,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function LiquidBootPhase({
  before,
  after,
  className = "",
  durationMs = 3500,
  onComplete,
  skip = false,
}: LiquidBootPhaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dropletsRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0 });
  const [afterInteractive, setAfterInteractive] = useState(false);
  const [beforeInteractive, setBeforeInteractive] = useState(true);

  // Time-based progress replaces the original scroll-position calculation.
  // Everything downstream (the spring-smoothing tick loop, the before/after
  // opacity curves, every shader uniform) is UNCHANGED from the original
  // scroll-driven version — they all read progressRef.current the same way
  // regardless of what drives it. Only this function's source changed.
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  // skip/durationMs are read via refs, not directly from props, inside
  // getProgress. Reason: the useEffect below that runs the tick loop has
  // an empty dependency array ([]) by design (it must only ever run once
  // — restarting the rAF loop and resetting startTimeRef on every prop
  // change would restart the whole liquid animation from scratch, which
  // is exactly wrong). But that means the tick loop's closure captures
  // whatever getProgress reference existed at MOUNT time. If getProgress
  // read `skip`/`durationMs` directly from props/args, a later change to
  // `skip` (e.g. the user tapping the skip button mid-animation) would
  // update the component's props and re-render, creating a NEW
  // getProgress closure with the new skip value — but the already-running
  // tick loop would keep calling the OLD getProgress from mount, forever,
  // since the effect that owns tick never re-runs to pick up the new one.
  // Reading through refs sidesteps this entirely: the ref's .current is
  // mutated in place, so the SAME getProgress closure (captured once at
  // mount) sees the fresh value on every call, no matter how many renders
  // happen after mount.
  const skipRef = useRef(skip);
  const durationMsRef = useRef(durationMs);
  useEffect(() => {
    skipRef.current = skip;
    durationMsRef.current = durationMs;
  }, [skip, durationMs]);

  const getProgress = () => {
    if (skipRef.current) return 1;
    if (startTimeRef.current === null) return 0;
    const elapsed = performance.now() - startTimeRef.current;
    return clamp01(elapsed / durationMsRef.current);
  };

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    startTimeRef.current = performance.now();
    let frame = 0;
    let lastBefore = true;
    let lastAfter = false;
    let smoothed = getProgress();
    let velocity = 0;
    let lastApplied = -1;

    // Velocity-aware inertia loop: the raw scrollbar value is treated as a
    // target, and the experience glides toward it with critically-damped
    // spring behaviour. Fast flicks overshoot faintly and settle; slow
    // scrolling tracks tightly. Every layer (WebGL, DOM fades, droplets)
    // reads the same smoothed value, so the whole page moves as one object.
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const target = getProgress();
      if (reduceMotion) {
        smoothed = target;
      } else {
        const spring = (target - smoothed) * 0.085;
        velocity = velocity * 0.82 + spring;
        smoothed += velocity;
        if (Math.abs(target - smoothed) < 0.0004 && Math.abs(velocity) < 0.0004) {
          smoothed = target;
          velocity = 0;
        }
      }
      smoothed = clamp01(smoothed);
      progressRef.current = smoothed;

      // Completion check placed BEFORE the early-return below on purpose:
      // that early-return skips the rest of this frame whenever smoothed
      // hasn't changed enough to matter — which is EXACTLY what happens on
      // the frame where the spring finally settles at 1.0 and stops
      // moving. Checking completion after the early-return would risk
      // onComplete silently never firing on the one frame that actually
      // reaches full completion, since that's precisely the frame most
      // likely to look "unchanged" from the previous one.
      if (!completedRef.current && smoothed >= 0.999 && target >= 0.999) {
        completedRef.current = true;
        onComplete?.();
      }

      if (Math.abs(smoothed - lastApplied) < 0.0004) return;
      lastApplied = smoothed;
      const progress = smoothed;
      const beforeOpacity = 1 - smooth(range(progress, 0.15, 0.3));
      const afterOpacity = smooth(range(progress, 0.72, 0.9));
      const canvasOpacity = progress < 0.15 ? mix(0.42, 0.58, range(progress, 0, 0.15)) : progress > 0.82 ? mix(1, 0.16, range(progress, 0.82, 1)) : 1;
      if (beforeRef.current) {
        beforeRef.current.style.opacity = `${beforeOpacity}`;
        beforeRef.current.style.filter = `blur(${range(progress, 0.15, 0.3) * 12}px)`;
        beforeRef.current.style.transform = `translate3d(0, ${-range(progress, 0.15, 0.3) * 5}vh, 0) scale(${1 + range(progress, 0.15, 0.3) * 0.04})`;
      }
      if (afterRef.current) {
        afterRef.current.style.opacity = `${afterOpacity}`;
        afterRef.current.style.filter = `blur(${(1 - smooth(range(progress, 0.72, 0.86))) * 22}px) brightness(${1 + derive(progress).breach * 1.6})`;
        afterRef.current.style.transform = `translate3d(0, ${(1 - smooth(range(progress, 0.72, 0.92))) * 3.2}vh, 0) scale(${1.045 - smooth(range(progress, 0.72, 0.94)) * 0.045})`;
      }
      if (canvasRef.current) canvasRef.current.style.opacity = `${canvasOpacity}`;
      if (dropletsRef.current) dropletsRef.current.style.setProperty("--above-progress", `${range(progress, 0.8, 1)}`);
      const nextBefore = progress < 0.155;
      const nextAfter = progress >= 0.88;
      if (nextBefore !== lastBefore) {
        lastBefore = nextBefore;
        setBeforeInteractive(nextBefore);
      }
      if (nextAfter !== lastAfter) {
        lastAfter = nextAfter;
        setAfterInteractive(nextAfter);
      }
    };
    frame = requestAnimationFrame(tick);

    // Cursor parallax (desktop) and gyroscope parallax (mobile) feed the
    // same normalized target the scene damps toward.
    const onPointerMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (reduceMotion || event.gamma == null || event.beta == null) return;
      pointerRef.current.x = Math.max(-1, Math.min(1, event.gamma / 32));
      pointerRef.current.y = Math.max(-1, Math.min(1, (event.beta - 42) / 36));
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("deviceorientation", onOrientation, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={`deep-current deep-current--boot ${className}`}
      aria-label="Liquid boot transition"
    >
      <div className="deep-current__stage">
        <div
          ref={beforeRef}
          className="deep-current__slot deep-current__slot--before"
          style={{ pointerEvents: beforeInteractive ? "auto" : "none" }}
          aria-hidden={!beforeInteractive}
        >
          {before}
        </div>
        <div
          ref={afterRef}
          className="deep-current__slot deep-current__slot--after"
          style={{ pointerEvents: afterInteractive ? "auto" : "none" }}
          aria-hidden={!afterInteractive}
        >
          {after}
        </div>
        <div ref={canvasRef} className="deep-current__canvas" aria-hidden="true">
          <Canvas
            gl={{
              alpha: true,
              antialias: true,
              premultipliedAlpha: true,
              powerPreference: "high-performance",
              stencil: false,
              depth: true,
            }}
            camera={{ fov: 58, near: 0.1, far: 80 }}
            // Cap DPR at 1.5: this matches the intended internal render
            // resolution and prevents an upscale/downsample mismatch that
            // otherwise shows up as high-frequency shimmer on the water.
            dpr={[1, 1.5]}
            eventSource={containerRef as MutableRefObject<HTMLElement>}
            onCreated={({ gl }) => {
              // Film-grade colour pipeline: ACES filmic tone mapping keeps
              // the breach highlights rolling off like camera film instead
              // of clipping, and sRGB output guarantees calibrated colour.
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.06;
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.setClearColor(0x000000, 0);
            }}
          >
            <Scene progressRef={progressRef} pointerRef={pointerRef} />
          </Canvas>
        </div>
        <div ref={dropletsRef} className="deep-current__droplet-layer">
          <DropletOverlay />
        </div>
        <div className="deep-current__grain" aria-hidden="true" />
      </div>
    </section>
  );
}