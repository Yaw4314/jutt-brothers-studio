import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/motion";

type IconShape = "gem" | "point" | "ring";

const GOLD = new THREE.MeshPhysicalMaterial({
  color: 0xcfaa5c,
  metalness: 1,
  roughness: 0.3,
  clearcoat: 0.2,
  clearcoatRoughness: 0.3,
});

function Shape({ shape, hovered }: { shape: IconShape; hovered: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = useRef(0.35);

  useFrame((_, dt) => {
    const m = ref.current;
    if (!m || prefersReducedMotion()) return;
    // Ease rotation speed toward a faster rate on hover, slow idle otherwise.
    const targetSpeed = hovered ? 1.6 : 0.35;
    speed.current += (targetSpeed - speed.current) * Math.min(1, dt * 3);
    m.rotation.y += dt * speed.current;
    m.rotation.x += dt * speed.current * 0.4;
  });

  const geometry =
    shape === "gem" ? (
      <octahedronGeometry args={[1, 0]} />
    ) : shape === "point" ? (
      <coneGeometry args={[0.9, 1.6, 4]} />
    ) : (
      <torusGeometry args={[0.9, 0.28, 8, 24]} />
    );

  return (
    <mesh ref={ref} material={GOLD} rotation={[0.4, 0.6, 0]}>
      {geometry}
    </mesh>
  );
}

export function MiniCrestIcon({ shape, hovered }: { shape: IconShape; hovered: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} color={0x332a1a} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color={0xfff2d8} />
      <directionalLight position={[-3, -1, -3]} intensity={0.8} color={0xbfd4ff} />
      <Shape shape={shape} hovered={hovered} />
    </Canvas>
  );
}
