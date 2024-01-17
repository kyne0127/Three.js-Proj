import React, { useRef, useState, useEffect } from 'react'
import { MeshTransmissionMaterial, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Vector3, PointLight, SphereGeometry, MeshBasicMaterial, Mesh, Color } from 'three';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";
import GUI from 'lil-gui';
import { NodeToyMaterial } from "@nodetoy/react-nodetoy";
import { data } from "./meteor_shader";

export const Planet_Lamplighter_position = new Vector3(2.1, 0, -1.8);
var gui = null;

export function Planet_Lamplighter({explorebuttonClicked}) {
  const groupRef = useRef();
  const lightMeshRef = useRef();
  const sphereMeshRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/lamplighter_planet.glb');
  const { nodes: textNodes, materials: textMaterials } = useGLTF('assets/models/lamplighter_planet_text.glb'); // 'nodes' 및 'materials' 객체를 분리하여 가져옵니다.
  const [showText, setShowText] = useState(false); // 텍스트 표시 여부를 상태로 관리
  const [land, setLand] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1.0);
  const [lightColor, setLightColor] = useState(new Color(0xf6ff00));

  const [normalMap] = useTexture(["assets/textures/meteor_normals.png"]);

  const light = new PointLight(lightColor, 1, 100);
  light.position.set(2.068, 0.083, -1.652);

  // 구 형태의 메쉬 생성
  const sphereGeometry = new SphereGeometry(0.005, 16, 16);
  const sphereMaterial = new MeshBasicMaterial({ color: 0xf6ff00 });
  sphereMeshRef.current = new Mesh(sphereGeometry, sphereMaterial);
  sphereMeshRef.current.position.set(2.068, 0.083, -1.652);


  useEffect(() => {
    if (land) {
      gui = new GUI();
      
      gui.add(light, 'intensity')
        .name("light intensity")
        .min(0)
        .max(10)
        .step(0.1)
        .onChange((value) => {
          // intensity 값이 변경될 때 상태 업데이트
          setLightIntensity(value);
        });
      gui.addColor(light, 'color')
        .name("color")
        .onChange((value) => {
          setLightColor(value);
        })
    } else if (land == false) {
      if (gui) {
        gui.destroy();
      }
    }
  }, [land]);

  useFrame(() => {
    const v = planePosition.clone().sub(Planet_Lamplighter_position);
    if (v.length() < 0.3) {
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

  // intensity 값이 변경될 때 lightMeshRef를 사용하여 pointLight의 intensity 업데이트
  useEffect(() => {
    if (lightMeshRef.current) {
      lightMeshRef.current.children[0].intensity = lightIntensity;
    }
  }, [lightIntensity]);
  useEffect(() => {
    if (lightMeshRef.current) {
      lightMeshRef.current.children[0].color = lightColor;
    }
  }, [lightColor]);

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
        <group dispose={null} scale = {0.05} position={[2.1, 0, -1.8]}>
          <mesh geometry={nodes.Eyes.geometry} material={materials['Material.008']} />
          <mesh geometry={nodes.Ground_01_0.geometry} material={materials['Ground_01']} />
          <mesh geometry={nodes.Ground_01_1.geometry} material={materials['Gravel']} />
          <mesh geometry={nodes.Ground_01_2.geometry} material={materials['Grass']} />
          <mesh geometry={nodes.Ground_02_0.geometry} material={materials['Ground_02']} />
          <mesh geometry={nodes.Hair.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Lamp.geometry} material={materials['Material.009']} />
          <mesh geometry={nodes.Nose.geometry} material={materials['Material']} />
          <mesh geometry={nodes.Overalls.geometry} material={materials['Overalls']} />
          <mesh geometry={nodes.Rock.geometry} material={materials['Cloud']} />
          <mesh geometry={nodes.Shirt.geometry} material={materials['blinn2SG']} />
          <mesh geometry={nodes.Stick.geometry} material={materials['Material.009']} />
          <mesh geometry={nodes.Stickhead.geometry} material={materials['Material.010']} />
          <mesh geometry={nodes.Tree_Leaf_0.geometry} material={materials['Treee_Leaf']} />
          <mesh geometry={nodes.Tree_Root_0.geometry} material={materials['Tree_Trunk']} />
        </group>
        {showText && (
          <group scale={0.05} position={[2.1, 0, -1.685]} rotation-x={Math.PI / 2}>
            <mesh geometry={textNodes.Text.geometry} />
          </group>
        )}
        <group ref={lightMeshRef}>
          <primitive object={light} />
          <primitive object={sphereMeshRef.current}>
            <MeshTransmissionMaterial
                normalMap={normalMap}
                normalScale={[0.3, 0.3]}
                roughness={0}
                ior={1.5}
                thickness={0.035}
                transmission={1}
                chromaticAberration={1}
                anisotropy={20}
                distortion={0}
                distortionScale={0}
                samples={10}
                backside={true}
                color={"#fff"}
                attenuationDistance={0.2}
                attenuationColor={"#e2ae5b"} />
            </primitive>
            <primitive object={sphereMeshRef.current}
              scale={[1.02, 1.02, 1.02]}
            />
            <NodeToyMaterial data={data}/>
        </group>
      </group>
    </>
  );
}

useGLTF.preload('assets/models/lamplighter_planet.glb');
useGLTF.preload('assets/models/lamplighter_planet_text.glb');

