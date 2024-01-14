import React from "react";
import { Mesh, SphereGeometry, MeshStandardMaterial, Vector3 } from "three";

export function Star1() {
  // 원하는 위치를 설정합니다.
  const desiredPosition = new Vector3(0, 0, 30); // 원하는 위치로 수정하세요.

  // 구형 메쉬를 생성합니다.
  const geometry = new SphereGeometry(5, 32, 32); // 원하는 지름과 세분화 수를 지정하세요.
  const material = new MeshStandardMaterial({ emissive: "#ff0000", emissiveIntensity: 100, roughness: 0, metalness: 0 });
  const sphereMesh = new Mesh(geometry, material);

  // 구형 메쉬를 원하는 위치로 이동합니다.
  sphereMesh.position.copy(desiredPosition);

  return <primitive object={sphereMesh} />;
}
