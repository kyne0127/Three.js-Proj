import React, { useRef, useState, useEffect, useMemo } from 'react'
import { MeshTransmissionMaterial, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Vector3, DoubleSide, Color, SphereGeometry, MeshBasicMaterial, Mesh, Group } from 'three';
import { planePosition } from './Airplane';
import { findClosestPlanet } from "./clickHandler";
import { NodeToyMaterial } from "@nodetoy/react-nodetoy";
import { data } from "./meteor_shader";
import GUI from 'lil-gui';

export const Planet_Geographer_position = new Vector3(-0.3, 0, 1.65);
var gui = null;
var particles = [];


export function Planet_Geographer({ explorebuttonClicked }) {
  const groupRef = useRef();
  const { nodes, materials } = useGLTF('assets/models/geographer_planet.glb');
  const [land, setLand] = useState(false);

  const [normalMap] = useTexture(["assets/textures/meteor_normals.png"]);

  const [beams_mask] = useTexture(["assets/textures/beams_mask.png"]);
  const beamsGeometries = [
    nodes.beam0.geometry,
    nodes.beam1.geometry,
    nodes.beam2.geometry,
    nodes.beam3.geometry,
    nodes.beam4.geometry,
    nodes.beam5.geometry,
    nodes.beam6.geometry,
  ];

  const [fountainHeight, setFountainHeight] = useState(0.1);
  const [xVelocityRange, setXVelocityRange] = useState(0.01);
  const [zVelocityRange, setZVelocityRange] = useState(0.01);
  const [particleCount, setParticleCount] = useState(2000);
  const [yVelocityRange, setYVelocityRange] = useState({ min: -0.1, max: -0.01 });
  const [particleRadiusRange, setParticleRadiusRange] = useState({ min: 0.001, max: 0.01 });

  useEffect(() => {
    if (land) {
      gui = new GUI();
      // Add GUI controls here
      // gui.add(fountainHeight, 'Fountain Height', 1, 10, 0.25).onChange((value) => {
      //   setFountainHeight(value);
      //   particles.current.forEach((particle) => (particle.position.y = 0)); // Reset particle positions when changing fountain height
      // });
      // gui.add(xVelocityRange, 'X Velocity Range', 0.1, 1, 0.1).onChange(setXVelocityRange);
      // gui.add(zVelocityRange, 'Z Velocity Range', 0.1, 1, 0.1).onChange(setZVelocityRange);
      const fountain = {
        moreFountain: () => {
          let f = new Fountain();
          f.createParticles();
          particles.push(f);
        }
      };
      gui.add(fountain, 'moreFountain')
        .name("explode!");
      // gui.add(yVelocityRange.max, 'Y Velocity Range', 0.1, 5, 0.1).onChange((value) => setYVelocityRange({ ...yVelocityRange, max: value }));
      // gui.add(particleRadiusRange.max, 'Particle Radius Range', 0.1, 1, 0.1).onChange((value) => setParticleRadiusRange({ ...particleRadiusRange, max: value }));

      
    } else if (land == false) {
      if (gui) {
        gui.destroy();
      }
    }
  }, [land]);
  

  function Fountain() {
    this.particleGroup = new Group();
    this.explosion = false;
  
    this.createParticles = function () {
      const colorStart = new Color(0xffff00); // Yellow
      const colorEnd = new Color(0xffa500); // Orange
  
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * (particleRadiusRange.max - particleRadiusRange.min) + particleRadiusRange.min;
        const geo = new SphereGeometry(radius);
        const mat = new MeshBasicMaterial({ color: colorStart.clone().lerp(colorEnd, Math.random()) });
        const particle = new Mesh(geo, mat);
        particle.position.set(
          Math.random() * 0.1 - 2, // X 좌표 범위 내에서 랜덤
          Math.random() * 0.1 - 0.2, // Y 좌표 범위 내에서 랜덤
          Math.random() * 0.1 + 1.5  // Z 좌표 범위 내에서 랜덤
        );
        particle.userData.velocity = new Vector3(
          Math.random() * (yVelocityRange.max - yVelocityRange.min) + yVelocityRange.min,
          Math.random() * xVelocityRange - xVelocityRange / 2,
          Math.random() * zVelocityRange - zVelocityRange / 2
        );

        this.particleGroup.add(particle);
      }
        groupRef.current.attach(this.particleGroup);
        this.explosion = true;
    }

    this.updateParticles = function () {
      
      this.particleGroup.children.forEach((child) => {
        child.userData.velocity.y -= 0.01 + Math.random() * 0.01;
        child.position.add(child.userData.velocity);
      })

      this.particleGroup.children = this.particleGroup.children.filter((child) => child.position.y > -fountainHeight);
      if (this.particleGroup.children.length === 0) {
        this.explosion = false;
      }

      particles = particles.filter((exp) => exp.explosion);
    }
  }

  useFrame(() => {
    const v = planePosition.clone().sub(Planet_Geographer_position);
    if (v.length() < 1.5) {
      setLand(true);
    } else {
      setLand(false);
    }
    if (particles.length > 0) {
      particles.forEach((f) => f.updateParticles());
    }
  });

  useEffect(() => {
    const exploreButton = document.getElementById('exploreButton');
    const leaveButton = document.getElementById('leaveButton');

    if (exploreButton) {
      if (land) {
        if (!explorebuttonClicked) {
          exploreButton.style.display = 'block'; // 랜딩 상태일 때 이미지 표시
          leaveButton.style.display = 'none';
        }
        else {
          exploreButton.style.display = 'none';
          leaveButton.style.display = 'block';
        }
      } else {
        if (findClosestPlanet().position == Planet_Geographer_position && !explorebuttonClicked) {
          exploreButton.style.display = 'none';
          leaveButton.style.display = 'none';
        }
      }
    }
  }, [land, explorebuttonClicked]);

  return (
    <>
      <group ref={groupRef}>
        <group dispose={null} scale={0.05} position={[-0.3, -0.8, 1.65]}>
          <mesh geometry={nodes.Beard.geometry} material={materials['Material']} />
          <mesh geometry={nodes.Belt.geometry} material={materials['Material.003']} />
          <mesh geometry={nodes.Body.geometry} material={materials['Material.004']} />
          <mesh geometry={nodes.Carpet.geometry} material={materials['Plane002_mtl']} />
          <mesh geometry={nodes.Chair.geometry} material={materials['Object008_mtl']} />
          <mesh geometry={nodes.crator.geometry} material={materials['DefaultMaterial']} />
          <mesh geometry={nodes.debris.geometry} material={materials['DefaultMaterial']} />
          <mesh geometry={nodes.Eyes.geometry} material={materials['Material.005']} />
          <mesh geometry={nodes.Floor.geometry} material={materials['Box009_mtl']} />
          <mesh geometry={nodes.Inner.geometry} material={materials['Material.006']} />
          <mesh geometry={nodes.meteor.geometry}>
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
              attenuationColor={"#e2ae5b"}
            />
          </mesh>
          <mesh
            geometry={nodes.meteor.geometry}
            scale={[1.02, 1.02, 1.02]}
          >
            <NodeToyMaterial data={data} />
          </mesh>
          <mesh geometry={nodes.lava.geometry} material={materials['Lava']} />
          <mesh geometry={nodes.lava2.geometry} material={materials['Lava']} />
          <mesh geometry={nodes.Lantern.geometry} material={materials['lantern_mtl']} />
          <mesh geometry={nodes.LavaPlanet.geometry} material={materials['DefaultMaterial']} />
          <mesh geometry={nodes.Outer.geometry} material={materials['Material.007']} />
          <mesh geometry={nodes.Paper.geometry} material={materials['Line047_mtl']} />
          <mesh geometry={nodes.Paper2.geometry} material={materials['Line048_mtl']} />
          <mesh geometry={nodes.Paper3.geometry} material={materials['Line054_mtl']} />
          <mesh geometry={nodes.Table.geometry} material={materials['Object006_mtl']} />
          <mesh geometry={nodes.Tyrano_bone.geometry} material={materials['Material.006']} />
          <mesh geometry={nodes.Volcano_0.geometry} material={materials['DefaultMaterial']} />
          <mesh geometry={nodes.Volcano_1.geometry} material={materials['DefaultMaterial']} />
          {beamsGeometries.map((geometry, i) => (
        <Beam
          geometry={geometry}
          beams_mask={beams_mask}
          beam_index={i}
          key={i}
        />
      ))}
        </group>
      </group>
    </>
  );
}

useGLTF.preload('assets/models/geographer_planet.glb');

function Beam({ geometry, beams_mask, beam_index }) {
  const { vectors, initialPositionAttribute } = useMemo(() => {
    let vectors = [];

    const initialPositionAttribute = geometry.clone().getAttribute("position");

    for (let i = 0; i < initialPositionAttribute.count; i++) {
      let vector = new Vector3();
      vector.fromBufferAttribute(initialPositionAttribute, i);

      const idx = vectors.findIndex((vec, i) => {
        if (vec.x == vector.x && vec.y == vector.y && vec.z == vector.z)
          return true;
      });

      // only add the vector if it didn't already exist in the array
      if (idx === -1) vectors.push(vector);
    }

    vectors.sort((a, b) => a.y - b.y);

    return { vectors, initialPositionAttribute };
  }, []);

  useFrame((state) => {
    const clock = state.clock;
    const elapsed = clock.getElapsedTime();

    const transformVector = new Vector3(0, 0, 1);
    transformVector.applyAxisAngle(
      new Vector3(0, 1, 0),
      elapsed * 0.25 + beam_index * 17.87975
    );
    transformVector.multiplyScalar(3.25);

    const currentPositionAttribute = geometry.getAttribute("position");

    for (let i = 0; i < currentPositionAttribute.count; i++) {
      let vector = new Vector3();
      vector.fromBufferAttribute(initialPositionAttribute, i);

      const isTopVertex =
        ( vector.x == vectors[2].x &&
          vector.y == vectors[2].y &&
          vector.z == vectors[2].z) ||
        ( vector.x == vectors[3].x &&
          vector.y == vectors[3].y &&
          vector.z == vectors[3].z);

      // only add the vector if it didn't already exist in the array
      if (isTopVertex) {
        currentPositionAttribute.array[i * 3 + 0] =
          vector.x + transformVector.x;
        currentPositionAttribute.array[i * 3 + 1] =
          vector.y + transformVector.y;
        currentPositionAttribute.array[i * 3 + 2] =
          vector.z + transformVector.z;

        currentPositionAttribute.needsUpdate = true;
      }
    }
  });

  const isEven = beam_index % 2 === 0;
  const color = isEven ? "#fff7ed" : "#feedd7";
  const emissive = isEven ? [0.025, 0.011, 0.01] : [0.035, 0.0195, 0.01];

  return (
    <mesh geometry={geometry}>
      <MeshTransmissionMaterial
        alphaToCoverage={true}
        transparent={true}
        alphaMap={beams_mask}
        side={DoubleSide}
        envMapIntensity={0}
        roughness={0.2}
        ior={1.5}
        thickness={0.205}
        transmission={1}
        chromaticAberration={1}
        anisotropy={10}
        color={color}
        emissive={emissive}
      />
    </mesh>
  );
}

