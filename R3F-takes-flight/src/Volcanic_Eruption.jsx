import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from 'react-three-fiber';
import { useGui } from 'lil-gui';
import * as THREE from 'three';

const Fountain = () => {
  const [fountainHeight, setFountainHeight] = useState(50);
  const [xVelocityRange, setXVelocityRange] = useState(0.5);
  const [zVelocityRange, setZVelocityRange] = useState(0.5);
  const [particleCount, setParticleCount] = useState(2000);
  const [yVelocityRange, setYVelocityRange] = useState({ min: 0.1, max: 2 });
  const [particleRadiusRange, setParticleRadiusRange] = useState({ min: 0.1, max: 0.6 });

  const particles = useRef([]);

  const createParticles = () => {
    const colorStart = new THREE.Color(0xffff00); // Yellow
    const colorEnd = new THREE.Color(0xffa500); // Orange

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * (particleRadiusRange.max - particleRadiusRange.min) + particleRadiusRange.min;
      const geometry = new THREE.SphereGeometry(radius);
      const material = new THREE.MeshBasicMaterial({ color: colorStart.clone().lerp(colorEnd, Math.random()) });
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(0, 0, 0);
      particle.velocity = new THREE.Vector3(
        Math.random() * xVelocityRange - xVelocityRange / 2,
        Math.random() * (yVelocityRange.max - yVelocityRange.min) + yVelocityRange.min,
        Math.random() * zVelocityRange - zVelocityRange / 2
      );

      particles.current.push(particle);
    }
  };

  const updateParticles = () => {
    for (let i = 0; i < particles.current.length; i++) {
      const particle = particles.current[i];
      particle.velocity.y -= 0.01 + Math.random() * 0.1;
      particle.position.add(particle.velocity);

      if (particle.position.y < -fountainHeight) {
        particle.position.set(0, 0, 0);
        const x = Math.random() * xVelocityRange - xVelocityRange / 2;
        const z = Math.random() * zVelocityRange - zVelocityRange / 2;
        particle.velocity.set(x, Math.random() * (yVelocityRange.max - yVelocityRange.min) + yVelocityRange.min, z);
      }
    }
  };

  useGui((gui) => {
    // Add GUI controls here
    gui.addSlider(fountainHeight, 'Fountain Height', 1, 10, 0.25).onChange((value) => {
      setFountainHeight(value);
      particles.current.forEach((particle) => (particle.position.y = 0)); // Reset particle positions when changing fountain height
    });
    gui.addSlider(xVelocityRange, 'X Velocity Range', 0.1, 1, 0.1).onChange(setXVelocityRange);
    gui.addSlider(zVelocityRange, 'Z Velocity Range', 0.1, 1, 0.1).onChange(setZVelocityRange);
    gui.addSlider(particleCount, 'Particle Count', 1000, 20000, 1000).onChange((value) => {
      setParticleCount(value);
      particles.current.forEach((particle) => scene.remove(particle));
      particles.current = [];
      createParticles();
    });
    gui.addSlider(yVelocityRange.max, 'Y Velocity Range', 0.1, 5, 0.1).onChange((value) => setYVelocityRange({ ...yVelocityRange, max: value }));
    gui.addSlider(particleRadiusRange.max, 'Particle Radius Range', 0.1, 1, 0.1).onChange((value) => setParticleRadiusRange({ ...particleRadiusRange, max: value }));
  });
};

export default Fountain;
