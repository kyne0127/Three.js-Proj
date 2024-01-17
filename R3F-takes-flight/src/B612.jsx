import React, { useRef, useState, useEffect } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { updatePlaneAxis } from './controls';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";

export function B612() {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/B612.glb');

  return (
    <>
      <group ref={groupRef}>
        <group dispose={null} scale = {0.07} position={[1, -0.1, 10]}>
          <mesh geometry={nodes.Planet.geometry} material={materials['Material.003']} />
        </group>
      </group>
    </>
  );
}

useGLTF.preload('assets/models/B612.glb');

