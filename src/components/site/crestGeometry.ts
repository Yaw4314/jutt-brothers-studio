import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";
import crestUrl from "@/assets/jb-crest.svg?url";

export type CrestGeometry = {
  geos: THREE.BufferGeometry[];
  center: THREE.Vector3;
  size: THREE.Vector3;
};

const EXTRUDE = {
  depth: 34,
  bevelEnabled: true,
  bevelThickness: 5,
  bevelSize: 3,
  bevelSegments: 4,
  curveSegments: 8,
};

/**
 * Extrudes the crest SVG paths into 3D geometries. Shared by the hero crest
 * and the Problem section shards so both use identical source shapes.
 */
export function useCrestGeometry(): CrestGeometry {
  const data = useLoader(SVGLoader, crestUrl);

  return useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    data.paths.forEach((path) => {
      const shapes = (path.toShapes as (isCCW?: boolean) => THREE.Shape[])(true);
      shapes.forEach((shape) => {
        geos.push(new THREE.ExtrudeGeometry(shape, EXTRUDE));
      });
    });
    const group = new THREE.Group();
    geos.forEach((g) => group.add(new THREE.Mesh(g)));
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    return { geos, center, size };
  }, [data]);
}

/**
 * Individually centred and unit-normalised copies of the crest pieces —
 * used as free-floating shards.
 */
export function useCrestShardGeometries(): THREE.BufferGeometry[] {
  const { geos } = useCrestGeometry();
  return useMemo(
    () =>
      geos.map((g) => {
        const clone = g.clone();
        clone.center();
        clone.computeBoundingSphere();
        const r = clone.boundingSphere?.radius ?? 1;
        clone.scale(1 / r, -1 / r, 1 / r);
        clone.computeVertexNormals();
        return clone;
      }),
    [geos],
  );
}
