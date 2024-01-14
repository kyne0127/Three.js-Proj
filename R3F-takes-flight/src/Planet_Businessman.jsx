import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { updatePlaneAxis } from './controls';
import { planePosition } from './Airplane';

export const Planet_Businessman_position = new Vector3(-1.5, 3, 3.3);

export function Planet_Businessman(props) {
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
    const landingImage = document.getElementById('exploreButton');
    if (landingImage) {
      if (land) {
        landingImage.style.display = 'block'; // 랜딩 상태일 때 이미지 표시
      } else {
        landingImage.style.display = 'none'; // 랜딩 상태가 아닐 때 이미지 숨김
      }
    }
  }, [land]);

  return (
    <>
      <group ref={groupRef}>
        <group {...props} dispose={null} scale = {0.1} position={[4.8, -0.1, -5.5]}>
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

