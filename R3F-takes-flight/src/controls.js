import { Vector3, MathUtils } from "three";

function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

export let controls = {};

window.addEventListener("keydown", (e) => {
  controls[e.key.toLowerCase()] = true;
});
window.addEventListener("keyup", (e) => {
  controls[e.key.toLowerCase()] = false;
});

let maxVelocity = 1;
let jawVelocity = 0;
let pitchVelocity = 0;
let planeSpeed = 0;
let turboSpeed = 0;
export let turbo = 0;

export function updatePlaneAxis(x, y, z, planePosition, camera, planeRef) {
  jawVelocity *= 0.95;
  pitchVelocity *= 0.95;
  planeSpeed *= 0.95;
  turboSpeed *= 0.95;
  planeRef.current.rotation.z *= 0.95;

  if (Math.abs(jawVelocity) > maxVelocity) 
    jawVelocity = Math.sign(jawVelocity) * maxVelocity;

  if (Math.abs(pitchVelocity) > maxVelocity) 
    pitchVelocity = Math.sign(pitchVelocity) * maxVelocity;

  if (Math.abs(planeSpeed) > maxVelocity) 
    planeSpeed = Math.sign(planeSpeed) * maxVelocity;

  if (controls["a"]) {
    jawVelocity += 0.0008;
    // 현재 각도에서 목표 각도로 보간 (여기서 0.95는 보간 강도를 나타냅니다. 0에 가까울수록 천천히 변합니다.)
    planeRef.current.rotation.z = MathUtils.lerp(
      planeRef.current.rotation.z,
      -Math.PI / 6,
      0.05
    );
  }

  if (controls["d"]) {
    jawVelocity -= 0.0008;
    // 현재 각도에서 목표 각도로 보간
    planeRef.current.rotation.z = MathUtils.lerp(
      planeRef.current.rotation.z,
      Math.PI / 6,
      0.05
    );
  }

  if (controls["w"]) {
    planeSpeed -= 0.0008;
  }

  if (controls["s"]) {
    planeSpeed *= 0.95;
    turboSpeed *= 0.95;
  }

  if (controls["r"]) {
    pitchVelocity = 0;
    planeSpeed = 0;
    x.set(1, 0, 0);
    y.set(0, 1, 0);
    z.set(0, 0, 1);
    planePosition.set(-2.8, 0, 5.4);
  }

  z.applyAxisAngle(y, jawVelocity);
  x.applyAxisAngle(y, jawVelocity);

  // 이 부분을 수정하여 z 축 회전을 없애고 x, y 축으로만 회전하도록 만듭니다.
  // z.applyAxisAngle(x, pitchVelocity); // 주석 처리
  // x.applyAxisAngle(y, pitchVelocity); // 주석 처리

  x.normalize();
  y.normalize();
  z.normalize();

  // plane position & velocity
  if (controls.shift && planeSpeed < 0) {
    turboSpeed -= 0.0008;
  } else if (controls.shift && planeSpeed > 0) {
    turboSpeed += 0.0008;
  }

  camera.fov = 45;
  camera.updateProjectionMatrix();

  // 이 부분을 수정하여 x, y 축 방향으로만 움직이도록 만듭니다.
  // planePosition.add(z.clone().multiplyScalar(-planeSpeed - turboSpeed)); // 주석 처리
  planePosition.add(z.clone().multiplyScalar(planeSpeed + turboSpeed)); // y 축 방향

  // 구의 표면에서 벗어나지 않도록 수정
  const sphereCenter = new Vector3(0, 0, 0); // 구의 중심 좌표
  const distanceToSphereCenter = planePosition.distanceTo(sphereCenter);
  if (distanceToSphereCenter > 90) {
    // 비행기가 구의 표면을 벗어났다면 다시 구의 표면으로 이동
    if (planeSpeed > 0) {
      planeSpeed -= 0.008;
    } else {
      planeSpeed += 0.008;
    }
    turboSpeed = 0;
    planePosition.normalize().multiplyScalar(90);
  }
}
