import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";

export const Planet_Lamplighter_position = new Vector3(2.1, 0, -1.8);

export function Planet_Lamplighter({explorebuttonClicked}) {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/lamplighter_planet.glb');
  const [land, setLand] = useState(false);

  useFrame(() => {
    const v = planePosition.clone().sub(Planet_Lamplighter_position);
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
        if (findClosestPlanet().position == Planet_Lamplighter_position && !explorebuttonClicked) {
          exploreButton.style.display = 'none';
          leaveButton.style.display = 'none';
        }
      }
    }
  }, [land, explorebuttonClicked]);

  return (
    <>
      <group ref={groupRef}>
        <group dispose={null} scale = {0.05} position={[2.1, 0, -1.8]}>
          <mesh geometry={nodes.Eyes.geometry} material={materials['Material.008']} />
          <mesh geometry={nodes.Ground_01_0.geometry} material={materials['Ground_01']} />
          <mesh geometry={nodes.Ground_01_1.geometry} material={materials['Gravel']} />
          <mesh geometry={nodes.Ground_01_2.geometry} material={materials['Grass']} />
          <mesh geometry={nodes.Ground_02_0.geometry} material={materials['Ground_02']} />
          <mesh geometry={nodes.Hair.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.LampLight.geometry} material={materials['mat0_Pole_mat0_Pole', 'mat0_Pole_mat0_Base', 'mat0_Box_mat0_Box', 'mat0_Box_mat1_Box', 'mat0_Box_mat2_Box', 'mat0_Top_mat0_Top', 'mat0_Tube_mat0_Tube']} />
          <mesh geometry={nodes.Nose.geometry} material={materials['Material']} />
          <mesh geometry={nodes.Overalls.geometry} material={materials['Overalls']} />
          <mesh geometry={nodes.Rock.geometry} material={materials['Cloud']} />
          <mesh geometry={nodes.Shirt.geometry} material={materials['blinn2SG']} />
          <mesh geometry={nodes.Stick.geometry} material={materials['Pole', 'Embelishments']} />
          <mesh geometry={nodes.Tree_Leaf_0.geometry} material={materials['Treee_Leaf']} />
          <mesh geometry={nodes.Tree_Root_0.geometry} material={materials['Tree_Trunk']} />
        </group>
      </group>
    </>
  );
}

useGLTF.preload('assets/models/lamplighter_planet.glb');

