import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { updatePlaneAxis } from './controls';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";

export const Planet_Geographer_position = new Vector3(-0.3, 0, 1.65);

export function Planet_Geographer({explorebuttonClicked}) {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/geographer_planet.glb');
  const [land, setLand] = useState(false);

  useFrame(() => {
    const v = planePosition.clone().sub(Planet_Geographer_position);
    if (v.length() < 0.2) {
      setLand(true);
    } else {
      setLand(false);
    }
  });

  useEffect(() => {
    const exploreButton = document.getElementById('exploreButton');
    const leaveButton = document.getElementById('leaveButton');

    console.log('little_prince', explorebuttonClicked);
    if (exploreButton) {
      if (land) {
        if (!explorebuttonClicked){
          exploreButton.style.display = 'block'; // 랜딩 상태일 때 이미지 표시
          leaveButton.style.display = 'none';
        }
        else{
          exploreButton.style.display = 'none';
          leaveButton.style.display = 'block';
        }
      } else{
        if (findClosestPlanet().position == Planet_Geographer_position && !explorebuttonClicked) {
          exploreButton.style.display = 'none';
          leaveButton.style.display = 'none';
        }
      }
    }
  }, [land, explorebuttonClicked]);

  return (
    <>
      <group ref={groupRef}>
        <group dispose={null} scale = {0.1} position={[-0.3, -0.1, 1.65]}>
          <mesh geometry={nodes.Beard.geometry} material={materials['Material']} />
          <mesh geometry={nodes.Belt.geometry} material={materials['Material.003']} />
          <mesh geometry={nodes.Body.geometry} material={materials['Material.004']} />
          <mesh geometry={nodes.Carpet.geometry} material={materials['Plane002_mtl']} />
          <mesh geometry={nodes.Chair.geometry} material={materials['Object008_mtl']} />
          <mesh geometry={nodes.crator.geometry} material={materials['DefaultMaterial']} />
          <mesh geometry={nodes.Eyes.geometry} material={materials['Material.005']} />
          <mesh geometry={nodes.Floor.geometry} material={materials['Box009_mtl']} />
          <mesh geometry={nodes.Inner.geometry} material={materials['Material.006']} />
          <mesh geometry={nodes.Lantern.geometry} material={materials['lantern_mtl']} />
          <mesh geometry={nodes.LavaPlanet.geometry} material={materials['DefaultMaterial']} />
          <mesh geometry={nodes.Outer.geometry} material={materials['Material.007']} />
          <mesh geometry={nodes.Paper.geometry} material={materials['Line047_mtl']} />
          <mesh geometry={nodes.Paper2.geometry} material={materials['Line048_mtl']} />
          <mesh geometry={nodes.Paper3.geometry} material={materials['Line054_mtl']} />
          <mesh geometry={nodes.Table.geometry} material={materials['Object006_mtl']} />
          <mesh geometry={nodes.Tyrano_bone.geometry} material={materials['Material.006']} />
          <mesh geometry={nodes.Volcano_0.geometry} material={materials['DefaultMaterial']} />
          <mesh geometry={nodes.Volcano_1.geometry} material={materials['DefaultMaterial']} />
        </group>
      </group>
    </>
  );
}

useGLTF.preload('assets/models/little_prince_planet.glb');

