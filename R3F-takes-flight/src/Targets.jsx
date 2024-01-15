import { useState, useMemo } from "react";
import { Mesh, SphereGeometry, MeshStandardMaterial, Vector3 } from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import { planePosition } from "./Airplane";

function randomPoint(scale) {
  return new Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).multiply(scale || new Vector3(1, 1, 1));
}

const TARGET_RAD = 0.05;

export function Targets() {
  const [targets, setTargets] = useState(() => {
    const arr = [];
    for (let i = 0; i < 200; i++) {
      arr.push({
        center: randomPoint(new Vector3(20, 20, 20)),
        direction: randomPoint().normalize(),
      });
    }

    return arr;
  });

  const geometry = useMemo(() => {
    let geo;

    targets.forEach((target) => {
      const torusGeo = new SphereGeometry(TARGET_RAD, 32, 32);
      torusGeo.translate(target.center.x, target.center.y, target.center.z);

      if (!geo) geo = torusGeo;
      else geo = mergeBufferGeometries([geo, torusGeo]);
    });

    return geo;
  }, [targets]);

  // useFrame(() => {
  //   targets.forEach((target, i) => {
  //     const v = planePosition.clone().sub(target.center);
  //     const dist = target.direction.dot(v);
  //     const projected = planePosition
  //       .clone()
  //       .sub(target.direction.clone().multiplyScalar(dist));

  //     const hitDist = projected.distanceTo(target.center);
  //     if (hitDist < TARGET_RAD) {
  //       target.hit = true;
  //     }
  //   });

  //   const atLeastOneHit = targets.find((target) => target.hit);
  //   if (atLeastOneHit) {
  //     setTargets(targets.filter((target) => !target.hit));
  //   }
  // });

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial emissive={"#ff0000"} emissiveIntensity={100} roughness={0} metalness={0} />
    </mesh>
  );
}
