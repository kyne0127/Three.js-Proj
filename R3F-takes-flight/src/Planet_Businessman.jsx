import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";

export const Planet_Businessman_position = new Vector3(4.8, 0, -5.5);

export function Planet_Businessman({explorebuttonClicked}) {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/businessman_planet.glb');
  const { nodes: textNodes, materials: textMaterials } = useGLTF('assets/models/businessman_planet_text.glb'); // 'nodes' 및 'materials' 객체를 분리하여 가져옵니다.
  const [showText, setShowText] = useState(false); // 텍스트 표시 여부를 상태로 관리
  const [land, setLand] = useState(false);

  useFrame(() => {
    const v = planePosition.clone().sub(Planet_Businessman_position);
    if (v.length() < 0.7) {
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
        <group dispose={null} scale = {0.15} position={[4.8, -0.1, -5.5]}>
          <mesh geometry={nodes.Chair.geometry} material={materials['default']} />
          <mesh geometry={nodes.Coat.geometry} material={materials['Coat']} />
          <mesh geometry={nodes.Desk.geometry} material={materials['bureau']} />
          <mesh geometry={nodes.Glasses.geometry} material={materials['glasses']} />
          <mesh geometry={nodes.Hair.geometry} material={materials['initialShadingGroup.007']} />
          <mesh geometry={nodes.Glasses.geometry} material={materials['glasses']} />
          <mesh geometry={nodes.Nose.geometry} material={materials['Material.002']} />
          <mesh geometry={nodes.Pants.geometry} material={materials['Pant']} />
          <mesh geometry={nodes.Paper.geometry} material={materials['lambert3SG']} />
          <mesh geometry={nodes.Planet.geometry} material={materials['lambert2']} />
          <mesh geometry={nodes.Stationery.geometry} material={materials['props']} />
          <mesh geometry={nodes.Vest.geometry} material={materials['Shirt']} />
        </group>
        {showText && (
          <group scale={0.05} position={[4.8, -0.1, -5.2]} rotation-x={Math.PI / 2}>
            <mesh geometry={textNodes.Text.geometry} />
          </group>
        )}
      </group>
    </>
  );
}

useGLTF.preload('assets/models/businessman_planet.glb');
useGLTF.preload('assets/models/businessman_planet_text.glb');

