import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { updatePlaneAxis } from './controls';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";

export const Planet_Vanity_position = new Vector3(3.15, 0.1, 2.4);

export function Planet_Vanity({explorebuttonClicked}) {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/vanity_planet.glb');
  const { nodes: textNodes, materials: textMaterials } = useGLTF('assets/models/vanity_planet_text.glb'); // 'nodes' 및 'materials' 객체를 분리하여 가져옵니다.

  const [land, setLand] = useState(false);
  const [showText, setShowText] = useState(false); // 텍스트 표시 여부를 상태로 관리


  useFrame(() => {
    const v = planePosition.clone().sub(Planet_Vanity_position);
    if (v.length() < 0.4) {
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
        if (findClosestPlanet().position == Planet_Vanity_position && !explorebuttonClicked) {
          exploreButton.style.display = 'none';
          leaveButton.style.display = 'none';
        }
      }
    }
  }, [land, explorebuttonClicked]);

  function handleGroupClick(event) {
    if (land) {
      // 텍스트 표시 상태를 토글
      setShowText(true);

      // 텍스트를 표시한 뒤, 5초 후에 숨김
      setTimeout(() => {
        setShowText(false);
      }, 3000);
    }
  }

  return (
    <>
      <group ref={groupRef} onClick={handleGroupClick}>
        <group dispose={null} scale = {0.2} position={[3.15, 0.1, 2.4]}>
          <mesh geometry={nodes.body.geometry} material={materials['mat0.005']} />
          <mesh geometry={nodes.Eyebrow.geometry} material={materials['PEARL-GOLD']} />
          <mesh geometry={nodes.Eyes.geometry} material={materials['Material']} />
          <mesh geometry={nodes.Face.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Flower.geometry} material={materials['Material']} />
          <mesh geometry={nodes.Grass.geometry} material={materials['cloversMat']} />
          <mesh geometry={nodes.Hair.geometry} material={materials['PEARL-GOLD']} />
          <mesh geometry={nodes.Hat.geometry} material={materials['mat0.005']} />
          <mesh geometry={nodes.Pants.geometry} material={materials['mat0.002']} />
          <mesh geometry={nodes.Shoes.geometry} material={materials['mat0.004']} />
          <mesh geometry={nodes.Planet.geometry} material={materials['lambert1']} />
          <mesh geometry={nodes.Planetring.geometry} material={materials['lambert4']} />
        </group>
        {showText && (
          <group scale={0.06} position={[3.15, -0.08, 2.6]} rotation-x={Math.PI / 2}>
            <mesh geometry={textNodes.Text.geometry} />
          </group>
        )}
      </group>
    </>
  );
}

useGLTF.preload('assets/models/little_prince_planet.glb');
useGLTF.preload('assets/models/vanity_planet_text.glb');

