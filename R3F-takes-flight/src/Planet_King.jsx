import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { updatePlaneAxis } from './controls';
import { planePosition } from './Airplane';
import GUI from 'lil-gui';

export const Planet_King_position = new Vector3(0.45, -0.4, 3.9);
const Planet_King_center = new Vector3(0.45, 0, -1.35);
const planetRadius = 1.7;

export function Planet_King(props) {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/king_planet.glb');
  const { nodes: textNodes, materials: textMaterials } = useGLTF('assets/models/king_planet_text.glb'); // 'nodes' 및 'materials' 객체를 분리하여 가져옵니다.

  const [land, setLand] = useState(false);
  const [mouseCount, setMouseCount] = useState(0);
  const [mousePositions, setMousePositions] = useState([]);
  const [showText, setShowText] = useState(false); // 텍스트 표시 여부를 상태로 관리


  useEffect(() => {
    if (land) {
      const gui = new GUI();
      
      const mouseNumber = {
        mouse_number: 0
      };
  
      gui.add(mouseNumber, 'mouse_number')
        .min(0)
        .max(10)
        .step(1)
        .name("mouse count")
        .onChange((value) => setMouseCount(value));
    }
  }, [land]);

  useFrame(() => {

    const v = planePosition.clone().sub(Planet_King_position);
    if (v.length() < 0.6) {
      setLand(true);
    } else {
      setLand(false);
    }
    const newMousePositions = mousePositions.map((mouse) => {
      const { position, latitude, longitude } = mouse;

      // 쥐의 현재 위치와 각도
      let currentLatitude = latitude;
      let currentLongitude = longitude;

      // 무작위로 위도와 경도를 조절하여 방향 변경
      currentLatitude -= Math.random() * 0.05; // 위도 변화 (-0.05에서 0.05 범위 내에서 무작위 값)
      currentLongitude -= Math.random() * 0.05; // 경도 변화 (-0.05에서 0.05 범위 내에서 무작위 값)

      // 경도 각도 조절
      if (currentLongitude > Math.PI * 2) {
        currentLongitude -= Math.PI * 2;
      }
      if (currentLongitude < 0) {
        currentLongitude += Math.PI * 2;
      }

      // 새로운 위치 계산
      const x = Planet_King_center.x + planetRadius * Math.cos(currentLongitude);
      const y = Planet_King_center.y + planetRadius * Math.sin(currentLatitude);
      const z = Planet_King_center.z + planetRadius * Math.sin(currentLongitude);

      const currentPos = new Vector3(x, y, z);

      return {
        position: currentPos,
        latitude: currentLatitude,
        longitude: currentLongitude,
      };
    });

    setMousePositions(newMousePositions);
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

    // 생쥐 초기 위치 및 방향 설정
    useEffect(() => {
      const newMousePositions = [];
      for (let i = 0; i < mouseCount; i++) {
        const randomPhi = Math.random() * Math.PI * 2; // 랜덤한 경도
        const randomTheta = Math.random() * Math.PI; // 랜덤한 위도
        const x = Planet_King_center.x + planetRadius * Math.cos(randomPhi);
        const y = Planet_King_center.y + planetRadius * Math.sin(randomTheta);
        const z = Planet_King_center.z + planetRadius * Math.sin(randomPhi);
        newMousePositions.push({
          position: new Vector3(x, y, z),
          latitude: randomTheta,
          longitude: randomPhi,
        });
      }
      setMousePositions(newMousePositions);
    }, [mouseCount]);

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

    const textFadeStyle = {
      opacity: showText ? 1 : 0,
      transition: 'opacity 1s ease-in-out'
    };

  return (
    <>
      <group ref={groupRef} onClick={handleGroupClick}>
        <group {...props} dispose={null} scale = {0.1} position={[0.45, -0.4, 3.9]}>
          <mesh geometry={nodes.body.geometry} material={materials['Material']} />
          <mesh geometry={nodes.Chair.geometry} material={materials['UV1304']} />
          <mesh geometry={nodes.Chair_back.geometry} material={materials['UV1305']} />
          <mesh geometry={nodes.Cloak.geometry} material={materials['King']} />
          <mesh geometry={nodes.Crown.geometry} material={materials['Material.005']}/>
          <mesh geometry={nodes.Eyebrow.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Eyes.geometry} material={materials['Material.002']} />
          <mesh geometry={nodes.Hair.geometry} material={materials['Material.001']} />
          <mesh geometry={nodes.Nose.geometry} material={materials['Material']} />
          <mesh geometry={nodes.Planet.geometry} material={materials['Material.004']} />
          <mesh geometry={nodes.Platform.geometry} material={materials['platform']} />
          <mesh geometry={nodes.Shield.geometry} material={materials['Material.003']} />
          {mousePositions.map((mouse, index) => (
            <mesh
              key={index}
              position={mouse.position}
              geometry={nodes.Mouse.geometry}
              scale={0.05}
            />
          ))}
        </group>
        {showText && (
          <group scale={0.03} position={[0.05, -0.93, 4.1]} rotation-x={Math.PI / 2} style={textFadeStyle}>
            <mesh geometry={textNodes.Text.geometry} />
          </group>
        )}
      </group>
    </>
  );
}

useGLTF.preload('assets/models/king_planet.glb');
useGLTF.preload('assets/models/king_planet_text.glb');
