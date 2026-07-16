import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";
import crestUrl from "@/assets/jb-crest.svg?url";

function CrestMesh() {
  const data = useLoader(SVGLoader, crestUrl);
  const groupRef = useRef<THREE.Group>(null);

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
      path.toShapes(true).forEach((shape) => {
        geos.push(new THREE.ExtrudeGeometry(shape, extrude));
      });
    });
    // Center + normalize scale
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

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.25;
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
