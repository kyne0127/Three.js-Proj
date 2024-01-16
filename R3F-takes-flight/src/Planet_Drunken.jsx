import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";

export const Planet_Drunken_position = new Vector3(5.7, 0, 0.3);

export function Planet_Drunken({explorebuttonClicked}) {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/drunk_planet.glb');
  const { nodes: textNodes, materials: textMaterials } = useGLTF('assets/models/drunk_planet_text.glb'); // 'nodes' 및 'materials' 객체를 분리하여 가져옵니다.
  const [land, setLand] = useState(false);
  const [showText, setShowText] = useState(false); // 텍스트 표시 여부를 상태로 관리

  useFrame(() => {
    const v = planePosition.clone().sub(Planet_Drunken_position);
    if (v.length() < 0.5) {
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
        if (findClosestPlanet().position == Planet_Drunken_position && !explorebuttonClicked) {
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
        <group dispose={null} scale = {0.1} position={[5.7, 0.03, 0.3]}>
          <mesh geometry={nodes.Beercup.geometry} material={materials['material']} />
          <mesh geometry={nodes.Body.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Bottle.geometry} material={materials['Probka']} />
          <mesh geometry={nodes.Cap.geometry} material={materials['Probka']} />
          <mesh geometry={nodes.Desk.geometry} material={materials['01_-_Default']} />
          <mesh geometry={nodes.Eyes.geometry} material={materials['Material.003']} />
          <mesh geometry={nodes.Hat.geometry} material={materials['Cubo']} />
          <mesh geometry={nodes.Nose.geometry} material={materials['Material.002']} />
          <mesh geometry={nodes.Object_49.geometry} material={materials['MoonCrust2']} />
          <mesh geometry={nodes.Pants.geometry} material={materials['blinn3SG']} />
          <mesh geometry={nodes.Planet.geometry} material={materials['Moon']} />
          <mesh geometry={nodes.Planetcore.geometry} material={materials['MoonCore']} />
          <mesh geometry={nodes.Planetcore2.geometry} material={materials['Core']} />
          <mesh geometry={nodes.Shirt.geometry} material={materials['blinn2SG']} />
          {showText && (
          <group scale={0.5} position={[0, 0.03, 2.1]} rotation-x={Math.PI / 2}>
            <mesh geometry={textNodes.Text.geometry} />
          </group>
        )}
        </group>
      </group>
    </>
  );
}

useGLTF.preload('assets/models/drunk_planet.glb');
useGLTF.preload('assets/models/drunk_planet_text.glb');

