import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { updatePlaneAxis } from './controls';

const x = new Vector3(1, 0, 0);
const y = new Vector3(0, 1, 0);
const z = new Vector3(0, 0, 1);
export const planePosition = new Vector3(-2.7, 0, 5.4);

const delayedRotMatrix = new Matrix4();
const delayedQuaternion = new Quaternion();

export function Airplane({ isOmnicient, explorebuttonClicked }) {
  const { nodes, materials } = useGLTF('assets/models/airplane.glb');
  const groupRef = useRef();
  const planeRef = useRef();
  const helixMeshRef = useRef();

  useFrame(({ camera }) => {
    updatePlaneAxis(x, y, z, planePosition, camera, planeRef);

    const rotMatrix = new Matrix4().makeBasis(x, y, z);

    const matrix = new Matrix4()
      .multiply(new Matrix4().makeTranslation(planePosition.x, planePosition.y, planePosition.z))
      .multiply(rotMatrix);

    groupRef.current.matrixAutoUpdate = false;
    groupRef.current.matrix.copy(matrix);
    groupRef.current.matrixWorldNeedsUpdate = true;


    var quaternionA = new Quaternion().copy(delayedQuaternion);

    // warning! setting the quaternion from the rotation matrix will cause
    // issues that resemble gimbal locks, instead, always use the quaternion notation
    // throughout the slerping phase
    // quaternionA.setFromRotationMatrix(delayedRotMatrix);

    var quaternionB = new Quaternion();
    quaternionB.setFromRotationMatrix(rotMatrix);

    var interpolationFactor = 0.175;
    var interpolatedQuaternion = new Quaternion().copy(quaternionA);
    interpolatedQuaternion.slerp(quaternionB, interpolationFactor);
    delayedQuaternion.copy(interpolatedQuaternion);

    delayedRotMatrix.identity();
    delayedRotMatrix.makeRotationFromQuaternion(delayedQuaternion);

    // console.log(camera.position);
    // console.log(camera.rotation);

    // console.log('view updated; isOmnicient:', isOmnicient, 'explorebuttonClicked:', explorebuttonClicked);
    // console.log(!isOmnicient && !explorebuttonClicked);

    if (!isOmnicient && !explorebuttonClicked) {
      // console.log('view updated; isOmnicient:', isOmnicient);
      const cameraMatrix = new Matrix4()
        .multiply(new Matrix4().makeTranslation(planePosition.x, planePosition.y, planePosition.z))
        .multiply(delayedRotMatrix)
        .multiply(new Matrix4().makeRotationX(-0.2))
        .multiply(
          new Matrix4().makeTranslation(0, 0.015, 0.6)
        );

      camera.matrixAutoUpdate = false;
      camera.matrix.copy(cameraMatrix);
      camera.matrixWorldNeedsUpdate = true;
    }

    helixMeshRef.current.rotation.z -= 1.0;
  });

  return (
    <>
      <group ref={groupRef}>
        <group ref={planeRef} dispose={null} scale={0.03} rotation-y={Math.PI}>
          <mesh geometry={nodes.supports.geometry} material={materials['Material.004']} />
          <mesh geometry={nodes.chassis.geometry} material={materials['Material.005']} />
          <mesh geometry={nodes.face.geometry} material={materials['Material.007']} />
          <mesh geometry={nodes.scarf.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.eyes.geometry} material={materials['Material.002']} />
          <mesh geometry={nodes.eyebrow.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.belt.geometry} material={materials['Material.005']} />
          <mesh geometry={nodes.upperbody.geometry} material={materials['Material.008']} />
          <mesh geometry={nodes.hair.geometry} material={materials['Material.003']} />
          <mesh geometry={nodes.helix.geometry} material={materials['Material.006']} ref={helixMeshRef} />
        </group>
      </group>
    </>
  );
}

useGLTF.preload('assets/models/airplane.glb');

