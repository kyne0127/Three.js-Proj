import React, { useRef, useState, useEffect } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { updatePlaneAxis } from './controls';
import { planePosition } from './Airplane';

export const Planet_LittlePrince_position = new Vector3(-3.3, -0.1, 5.4);

export function Planet_LittlePrince({explorebuttonClicked}) {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/little_prince_planet.glb');
  const [land, setLand] = useState(false);

  useFrame(() => {
    const v = planePosition.clone().sub(Planet_LittlePrince_position);
    if ( v && v.length() < 0.55) {
      setLand(true);
    } else {
      setLand(false);
    }
  });


  useEffect(() => {
    const exploreButton = document.getElementById('exploreButton');
    const leaveButton = document.getElementById('leaveButton');
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
      } else {
        exploreButton.style.display = 'none'; // 랜딩 상태가 아닐 때 이미지 숨김
        leaveButton.style.display = 'none';
      }
    }
  }, [land, explorebuttonClicked]);

  return (
    <>
      <group ref={groupRef}>
        <group dispose={null} scale = {0.1} position={[-3.3, -0.1, 5.4]}>
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

