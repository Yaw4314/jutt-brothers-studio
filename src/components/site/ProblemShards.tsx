import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";
import type { DepthOfFieldEffect } from "postprocessing";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCrestShardGeometries } from "./crestGeometry";
import dmSansBold from "@/assets/DMSans-Bold.ttf?url";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export const PROBLEM_LINES = [
  { text: "Fifty thousand followers.", color: "#ece7dc" },
  { text: "No way to book a table.", color: "#b8b3a7" },
  { text: "No way to place an order.", color: "#8d8878" },
  { text: "Every scroll on Instagram", color: "#ece7dc" },
  { text: "leaks straight to a delivery app", color: "#CFAA5C" },
  { text: "that owns your customer.", color: "#CFAA5C" },
];

type ShardSpec = {
  geo: number;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  speed: number;
  phase: number;
};

// Fixed, hand-tuned scatter so the composition is stable between renders.
const SHARDS: ShardSpec[] = [
  { geo: 0, pos: [-2.1, 2.2, 1.6], rot: [0.4, 0.8, -0.3], scale: 0.38, speed: 0.14, phase: 0.0 },
  { geo: 1, pos: [1.9, 2.6, -1.4], rot: [-0.6, 0.3, 0.9], scale: 0.55, speed: 0.09, phase: 1.1 },
  { geo: 2, pos: [-1.6, -2.1, 2.2], rot: [0.9, -0.5, 0.2], scale: 0.3, speed: 0.19, phase: 2.3 },
  { geo: 4, pos: [-2.4, 0.4, -2.0], rot: [-0.3, -0.9, 0.4], scale: 0.6, speed: 0.07, phase: 4.2 },
  { geo: 0, pos: [2.5, 0.8, -0.6], rot: [1.1, -0.4, 0.5], scale: 0.44, speed: 0.16, phase: 0.7 },
];

// Lightweight device gate: skip postprocessing on phones and low-core machines.
function useLowPowerDevice() {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    setLow(window.innerWidth < 900 || cores <= 4);
  }, []);
  return low;
}

function Shard({ spec, geometry }: { spec: ShardSpec; geometry: THREE.BufferGeometry }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  useEffect(() => {
    const g = outer.current;
    if (!g) return;
    // Converged cluster start state — shards blast outward on entry.
    gsap.set(g.position, {
      x: spec.pos[0] * 0.12,
      y: spec.pos[1] * 0.12,
      z: spec.pos[2] * 0.12,
    });
    gsap.set(g.rotation, { x: 0, y: 0, z: 0 });
    gsap.set(g.scale, { x: 0.2, y: 0.2, z: 0.2 });

    const index = SHARDS.indexOf(spec);
    const tl = gsap.timeline({ paused: true, delay: index * 0.07 });
    tl.to(g.position, {
      x: spec.pos[0],
      y: spec.pos[1],
      z: spec.pos[2],
      duration: 1.6,
      ease: "expo.out",
    })
      .to(
        g.rotation,
        { x: spec.rot[0], y: spec.rot[1], z: spec.rot[2], duration: 2.1, ease: "power3.out" },
        0,
      )
      .to(
        g.scale,
        { x: spec.scale, y: spec.scale, z: spec.scale, duration: 1.4, ease: "back.out(1.6)" },
        0,
      );

    const st = ScrollTrigger.create({
      trigger: "#problem",
      start: "top 85%",
      once: true,
      onEnter: () => tl.play(),
    });
    if (st.isActive || st.progress > 0) tl.play();

    return () => {
      st.kill();
      tl.kill();
    };
  }, [spec]);

  useFrame((state) => {
    const g = inner.current;
    if (!g) return;
    const t = state.clock.elapsedTime * spec.speed + spec.phase;
    g.rotation.x = Math.sin(t * 0.9) * 0.35;
    g.rotation.y = t * 0.6;
    g.rotation.z = Math.cos(t * 0.7) * 0.25;
    g.position.y = Math.sin(t * 1.3) * 0.22;
    g.position.x = Math.cos(t * 0.8) * 0.16;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <mesh geometry={geometry}>
          <MeshTransmissionMaterial
            transmission={1}
            thickness={0.6}
            roughness={0.05}
            distortion={0.5}
            distortionScale={0.4}
            chromaticAberration={0.04}
            ior={1.4}
            color="#E8C77A"
            attenuationColor="#E8C77A"
            attenuationDistance={1.2}
            backside
            samples={6}
            envMapIntensity={1.6}
            resolution={256}
          />
        </mesh>
      </group>
    </group>
  );
}

function Headline() {
  const { viewport } = useThree();
  const fontSize = Math.min(viewport.width * 0.05, viewport.height / (PROBLEM_LINES.length * 1.6));
  const lineHeight = fontSize * 1.28;
  const x = -viewport.width / 2 + viewport.width * 0.06;
  const top = ((PROBLEM_LINES.length - 1) / 2) * lineHeight;

  return (
    <group position={[0, 0, 0]}>
      {PROBLEM_LINES.map((line, i) => (
        <Text
          key={line.text}
          font={dmSansBold}
          fontSize={fontSize}
          letterSpacing={-0.025}
          color={line.color}
          anchorX="left"
          anchorY="middle"
          position={[x, top - i * lineHeight, 0]}
        >
          {line.text}
        </Text>
      ))}
    </group>
  );
}

function Scene() {
  const geometries = useCrestShardGeometries();
  const groupRef = useRef<THREE.Group>(null);
  // Focus point for DepthOfField; mutated in place and pushed to the effect each frame.
  const focusTarget = useRef(new THREE.Vector3(0, 0, 0));
  const focusGoal = useRef({ x: 0, y: 0 });
  const dofRef = useRef<DepthOfFieldEffect>(null);

  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    if (typeof window === "undefined") return;
    const fine = window.matchMedia?.("(pointer: fine)");
    if (fine && !fine.matches) {
      console.warn(
        "[ProblemShards] pointer parallax skipped: matchMedia('(pointer: fine)') did not match",
      );
      return;
    }

    const toX = gsap.quickTo(g.position, "x", { duration: 1.1, ease: "power3.out" });
    const toY = gsap.quickTo(g.position, "y", { duration: 1.1, ease: "power3.out" });
    const toRotX = gsap.quickTo(g.rotation, "x", { duration: 1.2, ease: "power3.out" });
    const toRotY = gsap.quickTo(g.rotation, "y", { duration: 1.2, ease: "power3.out" });
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      toX(nx * 1.4);
      toY(-ny * 1.0);
      toRotX(ny * 0.12);
      toRotY(nx * 0.12);
      focusGoal.current.x = nx * 0.8;
      focusGoal.current.y = -ny * 0.8;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, dt) => {
    const lerp = 1 - Math.pow(0.002, Math.min(dt, 0.1));
    const v = focusTarget.current;
    v.x += (focusGoal.current.x - v.x) * lerp;
    v.y += (focusGoal.current.y - v.y) * lerp;
    const dof = dofRef.current;
    if (dof) dof.target = v;
  });

  return (
    <>
      <ambientLight intensity={0.4} color={0x1e1e1e} />
      {/* Angled catchlights along the facet edges */}
      <pointLight position={[4, 3.5, 5]} intensity={260} color={0xfff0d2} distance={40} decay={2} />
      <pointLight position={[-5, -2.5, 4]} intensity={160} color={0xffd9a0} distance={40} decay={2} />
      <Environment preset="studio" environmentIntensity={1.4} />
      <Headline />
      <group ref={groupRef}>
        {SHARDS.map((spec, i) => (
          <Shard key={i} spec={spec} geometry={geometries[spec.geo % geometries.length]} />
        ))}
      </group>
      <EffectComposer enableNormalPass={false}>
        {/* Headline plane sits at z = 0, camera at z = 9 */}
        <DepthOfField ref={dofRef} target={focusTarget.current} focalLength={0.2} bokehScale={2.4} height={480} />
        <Bloom intensity={0.5} luminanceThreshold={0.72} luminanceSmoothing={0.25} mipmapBlur />
      </EffectComposer>
    </>
  );
}

export function ProblemShards() {
  const gl = useMemo(
    () => ({ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }),
    [],
  );
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 42 }} gl={gl} dpr={[1, 2]}>
      <color attach="background" args={["#050505"]} />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
