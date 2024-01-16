import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";

export const Planet_Businessman_position = new Vector3(4.8, 0, -5.5);

export function Planet_Businessman({explorebuttonClicked}) {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/little_prince_planet.glb');
  const [land, setLand] = useState(false);

  useFrame(() => {
    const v = planePosition.clone().sub(Planet_Businessman_position);
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
        if (findClosestPlanet().position == Planet_Businessman_position && !explorebuttonClicked) {
          exploreButton.style.display = 'none';
          leaveButton.style.display = 'none';
        }
      }
    }
  }, [land, explorebuttonClicked]);

  return (
    <>
      <group ref={groupRef}>
        <group dispose={null} scale = {0.1} position={[4.8, -0.1, -5.5]}>
          <mesh geometry={nodes.Fences.geometry} material={materials['Material.006']} />
          <mesh geometry={nodes.Clouds.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Rose.geometry} material={materials['Material.005']} />
          <mesh geometry={nodes.Stem.geometry} material={materials['Material.007']} />
          <mesh geometry={nodes.Sparkle.geometry} />
          <mesh geometry={nodes.Sphere.geometry} material={materials['Material.003']} />
        </group>
      </group>
    </>
  );
}

useGLTF.preload('assets/models/little_prince_planet.glb');

