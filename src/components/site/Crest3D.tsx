import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";
import gsap from "gsap";
import crestUrl from "@/assets/jb-crest.svg?url";
import { prefersReducedMotion } from "@/lib/motion";

function CrestMesh() {
  const data = useLoader(SVGLoader, crestUrl);
  const groupRef = useRef<THREE.Group>(null);
  // Target tilt offsets driven by pointer (in radians)
  const target = useRef({ x: 0, y: 0 });
  // Smoothed offsets applied on top of idle rotation
  const smoothed = useRef({ x: 0, y: 0 });

  const geometries = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    const extrude = {
      depth: 34,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 3,
      bevelSegments: 4,
      curveSegments: 8,
    };
    data.paths.forEach((path) => {
      const shapes = (path.toShapes as (isCCW?: boolean) => THREE.Shape[])(true);
      shapes.forEach((shape) => {
        geos.push(new THREE.ExtrudeGeometry(shape, extrude));
      });
    });
    const merged = new THREE.Group();
    geos.forEach((g) => merged.add(new THREE.Mesh(g)));
    const box = new THREE.Box3().setFromObject(merged);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    return { geos, center, size };
  }, [data]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xcfaa5c,
        metalness: 1,
        roughness: 0.28,
        clearcoat: 0.2,
        clearcoatRoughness: 0.3,
        envMapIntensity: 1.5,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Skip pointer tilt on touch-only devices (no fine pointer / no hover).
    if (typeof window === "undefined") return;
    const fine = window.matchMedia?.("(pointer: fine)");
    if (fine && !fine.matches) return;

    const MAX = 0.15; // radians
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.current.x = ny * MAX; // tilt up/down
      target.current.y = nx * MAX; // tilt left/right
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const reduced = prefersReducedMotion();
  const idleY = useRef(0);
  useFrame((_, dt) => {
    const g = groupRef.current;
    if (!g) return;
    // Continuous slow idle rotation
    idleY.current += dt * 0.25;
    // Smooth pointer offsets toward target
    const lerp = 1 - Math.pow(0.001, dt); // ~framerate-independent easing
    smoothed.current.x += (target.current.x - smoothed.current.x) * lerp;
    smoothed.current.y += (target.current.y - smoothed.current.y) * lerp;
    g.rotation.y = idleY.current + (reduced ? 0 : smoothed.current.y);
    g.rotation.x = reduced ? 0 : smoothed.current.x;
  });

  const targetHeight = 9;
  const scale = targetHeight / Math.max(geometries.size.x, geometries.size.y);

  return (
    <group ref={groupRef}>
      <group
        scale={[scale, -scale, scale]}
        position={[
          -geometries.center.x * scale,
          geometries.center.y * scale,
          -geometries.center.z * scale,
        ]}
      >
        {geometries.geos.map((g, i) => (
          <mesh key={i} geometry={g} material={material} />
        ))}
      </group>
    </group>
  );
}

export function Crest3D() {
  // Keep a reference to gsap so tree-shakers keep it (quickTo unused directly here
  // because tilt smoothing runs per-frame inside useFrame for stability).
  void gsap;
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 40 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={0.35} color={0x222222} />
      <directionalLight position={[5, 6, 8]} intensity={2.2} color={0xfff2d8} />
      <directionalLight position={[-6, -2, -6]} intensity={1.4} color={0xbfd4ff} />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <CrestMesh />
      </Suspense>
    </Canvas>
  );
}
