import React, { useEffect, useState } from "react";
import { PerspectiveCamera, Environment, Float, OrbitControls } from "@react-three/drei";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { SphereEnv } from "./SphereEnv";
import { Airplane } from "./Airplane";
import { Targets } from "./Targets";
import { MotionBlur } from "./MotionBlur";
import { LittlePrincePlanet } from "./LittlePrincePlanet";
import { Planet_King } from "./Planet_King";
import { Planet_Drunken } from "./Planet_Drunken";
import { Planet_Lamplighter } from "./Planet_Lamplighter";
import { Planet_Businessman } from "./Planet_Businessman";
import { Planet_Geographer } from "./Planet_Geographer";
import { Planet_Vanity } from "./Planet_Vanity";

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
        <PerspectiveCamera makeDefault position={[-6.539644387045074, 7.079071754608387, -2.948639921064562]} fov={60} rotation={[-1.8260317071299612, -0.6032098080001514, -2.0018962883147546]}/>
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
      <Planet_King />
      <Planet_Drunken />
      <Planet_Lamplighter />
      <Planet_Businessman />
      <Planet_Geographer />
      <Planet_Vanity />

    </>
  );
}

export default App;
