import React, { useEffect, useState, useMemo } from "react";
import { PerspectiveCamera, Environment, OrbitControls, Float } from "@react-three/drei";
import { SphereEnv } from "./SphereEnv";
import { Airplane } from "./Airplane";
import { Targets } from "./Targets";
import { SphereGeometry, Vector3, CatmullRomCurve3 } from "three";
import { mergeBufferGeometries } from "three-stdlib";
import { Planet_Businessman } from "./Planet_Businessman";
import { Planet_Drunken } from "./Planet_Drunken";
import { Planet_Geographer } from "./Planet_Geographer";
import { Planet_King } from "./Planet_King";
import { Planet_Lamplighter } from "./Planet_Lamplighter";
import { Planet_Vanity } from "./Planet_Vanity";
import { Planet_LittlePrince } from "./LittlePrincePlanet";
import { findClosestPlanet } from "./clickHandler";
import { Planet_Geographer_position } from "./Planet_Geographer";

const LINE_NB_POINTS = 100;

function App() {
  // Guide the airplane along a path
  const curve = useMemo(() => {
    return new CatmullRomCurve3(
      [
        new Vector3(-3.3, 0, 5.4),
        new Vector3(-0.6, 0, 3.15),
        new Vector3(0.45, 0, 3.9),
        new Vector3(1.95, 0, 3.9),
        new Vector3(3.15, 0, 2.4),
        new Vector3(5.7, 0, 0.3),
        new Vector3(3.75, 0, -2.7),
        new Vector3(4.8, 0, -5.5),
        new Vector3(2.1, 0, -1.8),
        new Vector3(-0.3, 0, 1.65)
      ],
      true,
      "catmullrom",
      0.5
    );
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const geometry = useMemo(() => {
    let geo;

    linePoints.forEach((target) => {
      const torusGeo = new SphereGeometry(0.01, 32, 32);
      torusGeo.translate(target.x, target.y, target.z);

      if (!geo) geo = torusGeo;
      else geo = mergeBufferGeometries([geo, torusGeo]);
    });

    return geo;
  }, [linePoints]);

  // Omnicient view
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

  // Landing

  const [explorebuttonClicked, setExploreButtonClicked] = useState(false);

  const closestPlanet = findClosestPlanet();

  useEffect(() => {
    // Add an event listener for the custom event
    const exploreButtonClickHandler = () => {
      // Do something in response to the exploreButton click
      console.log('ExplorebuttonClicked: ', explorebuttonClicked);
      setExploreButtonClicked(!explorebuttonClicked);
      setIsOmnicient(true);
    };
  
    const leaveButtonClickHandler = () => {
      // Do something in response to the leave button click
      console.log('Leave button clicked');
      // Set the states back to their original values or perform any necessary actions
      setExploreButtonClicked(false);
      setIsOmnicient(false);
    };
  
    document.addEventListener("exploreButtonClick", exploreButtonClickHandler);
  
    // Assuming you have a reference to the leave button element
    const leaveButton = document.getElementById("leaveButton");
  
    if (leaveButton) {
      leaveButton.addEventListener("click", leaveButtonClickHandler);
    }
  
    // Clean up the event listeners when the component unmounts
    return () => {
      document.removeEventListener("exploreButtonClick", exploreButtonClickHandler);
  
      if (leaveButton) {
        leaveButton.removeEventListener("click", leaveButtonClickHandler);
      }
    };
  }, [explorebuttonClicked]);

  return (
    <>
      <OrbitControls />
      <SphereEnv />
      <Environment background={false} files={"assets/textures/envmap.hdr"} />
      <PerspectiveCamera fov={35} />

      {isOmnicient && (
        <PerspectiveCamera makeDefault position={[-6.539644387045074
          , 7.079071754608387, -2.948639921064562]} rotation={[-1.8260317071299612, -0.6032098080001514, -2.0018962883147546]} fov={35} />
      )}

      {explorebuttonClicked && (
        <OrbitControls
          target={closestPlanet.position}
          enablePan={false}
          enableZoom={true}
          maxDistance={(closestPlanet.position == Planet_Geographer_position) ? 4.5 : 1.7}
          minDistance={(closestPlanet.position == Planet_Geographer_position) ? 3 : 1}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      )}

      <Float floatIntensity={0.3} speed={0.6} rotationIntensity={0.001}>
        {!explorebuttonClicked && (<Airplane isOmnicient={isOmnicient} explorebuttonClicked={explorebuttonClicked} />)}
      </Float>
      <Targets />


      <mesh geometry={geometry}>
        <meshStandardMaterial color={0xffffff} />
      </mesh>

      <Planet_LittlePrince explorebuttonClicked={explorebuttonClicked} />
      <Planet_Businessman explorebuttonClicked={explorebuttonClicked} />
      <Planet_Drunken explorebuttonClicked={explorebuttonClicked} />
      <Planet_Geographer explorebuttonClicked={explorebuttonClicked} />
      <Planet_King explorebuttonClicked={explorebuttonClicked} />
      <Planet_Lamplighter explorebuttonClicked={explorebuttonClicked} />
      <Planet_Vanity explorebuttonClicked={explorebuttonClicked} />


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
