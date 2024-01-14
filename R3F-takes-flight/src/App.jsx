import React, { useEffect, useState } from "react";
import { PerspectiveCamera, Environment, Float, OrbitControls } from "@react-three/drei";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { SphereEnv } from "./SphereEnv";
import { Airplane } from "./Airplane";
import { Targets } from "./Targets";
import { MotionBlur } from "./MotionBlur";
import { LittlePrincePlanet } from "./LittlePrincePlanet";

function App() {

  const [isOmnicient, setIsOmnicient] = useState(false);

  useEffect(() => {
    function keydownHandler(e) {
      if (e.key == 'k') {
        console.log('k pressed');
        setIsOmnicient(!isOmnicient);
        console.log('isOmnicient: ', isOmnicient);
      }
    }

    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, [isOmnicient]);


  return (
    <>
      <OrbitControls/>
      <SphereEnv />
      <Environment background={false} files={"assets/textures/envmap.hdr"} backgroundIntensity={0.5} />

      <PerspectiveCamera fov={40} />

      {isOmnicient && (
        <PerspectiveCamera makeDefault position={[-6, 7.5, 6.21]} fov={80} />
      )}
      <Float floatIntensity={0.3} speed={0.6} rotationIntensity={0.001}>
        <Airplane isOmnicient={isOmnicient} />
      </Float>

      <Targets />

      <LittlePrincePlanet />

      <directionalLight
        castShadow
        color={"#fffbd6"}
        intensity={3}
        position={[10, 5, 4]}
        shadow-bias={-0.0005}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.01}
        shadow-camera-far={20}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-left={-6.2}
        shadow-camera-right={6.4}
      />

      <ambientLight
        color={"#ffb5f6"} // 필요에 따라 색상 조정
        intensity={1} // 필요에 따라 강도 조정
        position={[10, 5, 4]} // 필요에 따라 위치 조정
      />
    </>
  );
}

export default App;
