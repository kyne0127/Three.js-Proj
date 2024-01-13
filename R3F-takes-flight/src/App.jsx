import React, { useEffect, useState } from "react";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { EffectComposer, HueSaturation } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { SphereEnv } from "./SphereEnv";
import { Airplane } from "./Airplane";
import { Targets } from "./Targets";
import { MotionBlur } from "./MotionBlur";
import { isThirdPerson } from "./controls";

function App() {
  const [isThirdPerson, setIsThirdPerson] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([-6, 3.9, 6.21]);

  useEffect(() => {
    function keydownHandler(e) {
      if (e.key == 'k') {
        if(isThirdPerson) setCameraPosition([-6, 3.9, 6.21 + Math.random() + 0.01]);
        setIsThirdPerson(!isThirdPerson);
      }
    }

    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, [isThirdPerson]);

  return (
    <>
      <SphereEnv />
      <Environment background={false} files={"assets/textures/envmap.hdr"} />

      <PerspectiveCamera makeDefault position={[0, 10, 10]} fov={40} />

      <Airplane />
      <Targets />

      <directionalLight
        castShadow
        color={"#ffb5f6"}
        intensity={6}
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
