import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Matrix4, Quaternion, Vector3, Group, TextureLoader, Color, SpriteMaterial, Sprite, AdditiveBlending } from 'three';
import { updatePlaneAxis } from './controls';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";
import GUI from 'lil-gui';

export const Planet_Vanity_position = new Vector3(3.15, 0.1, 2.4);
var gui = null;
var explosions = [];


export function Planet_Vanity({explorebuttonClicked}) {
  const groupRef = useRef();
  const {nodes, materials} = useGLTF('assets/models/vanity_planet.glb');
  const { nodes: textNodes, materials: textMaterials } = useGLTF('assets/models/vanity_planet_text.glb'); // 'nodes' 및 'materials' 객체를 분리하여 가져옵니다.

  const [land, setLand] = useState(false);
  const [showText, setShowText] = useState(false); // 텍스트 표시 여부를 상태로 관리

  //폭죽
  useEffect(() => {
    if (land) {
      gui = new GUI();
      
      const fireworks = {
        moreFireworks: () => {
          let e = new Explosion;
          e.makeParticles();
          explosions.push(e);
        }
      }; 
      gui.add(fireworks, 'moreFireworks')
        .name("Praise Me");
    } else if (land == false) {
      if (gui) {
        gui.destroy();
      }
    }
  }, [land]);

  function Explosion() {
    //random properties of each explosions
    this.particleGroup = new Group();
    this.explosion = false;
    this.particleTexture = new TextureLoader().load("assets/textures/spot.png");
    this.numberParticles = Math.random() * 200 + 100;
    this.spd = 0.01;
    this.color = new Color();

    this.makeParticles = function() {

      this.color.setHSL((Math.random()), 0.95, 0.5);

      for (let i = 0; i < this.numberParticles; i++) {

        let particleMaterial = new SpriteMaterial({map: this.particleTexture, depthTest: false});
        let sprite = new Sprite(particleMaterial);
        sprite.material.blending = AdditiveBlending;

        //particle velocity
        sprite.userData.velocity = new Vector3(
          Math.random() * this.spd - this.spd/2,
          Math.random() * this.spd - this.spd/2,
          Math.random() * this.spd - this.spd/2
        );

        sprite.userData.velocity.multiplyScalar(Math.random() * Math.random() * 3 + 2); //spread particles out

        //particle color
        sprite.material.color = this.color;

        //particle opacity
        sprite.material.opacity = Math.random() * 0.2 + 0.4;

        //particle size
        let size = Math.random() * 0.01 + 0.01;
        sprite.scale.set(size, size, size);

        this.particleGroup.add(sprite);

      }

      this.particleGroup.position.set(Math.random() - 0.5 + 3.15, Math.random() * 0.5 + 0.1, Math.random() * 0.5 - 0.25 + 2.4);
      groupRef.current.attach(this.particleGroup);
      this.explosion = true;
    }

    this.update = function () {

      this.particleGroup.children.forEach((child) => {
        child.position.add(child.userData.velocity);
        child.material.opacity -= 0.008;
      });

      this.particleGroup.children = this.particleGroup.children.filter((child) => child.material.opacity > 0);
      if (this.particleGroup.children.length === 0) {
        this.explosion = false;
      }

      explosions = explosions.filter((exp) => exp.explosion);
    }
  }


  useFrame(() => {
    const v = planePosition.clone().sub(Planet_Vanity_position);
    if (v.length() < 0.6) {
      setLand(true);
    } else {
      setLand(false);
    }
    if (explosions.length > 0) {
      explosions.forEach((e) => e.update());
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
          <group scale={0.06} position={[5.7, 0.03, 0.3]} rotation-x={Math.PI / 2}>
            <mesh geometry={textNodes.Text.geometry} />
          </group>
        )}
      </group>
    </>
  );
}

useGLTF.preload('assets/models/vanity_planet.glb');
useGLTF.preload('assets/models/vanity_planet_text.glb');

