import { useFrame } from "@react-three/fiber";
import { planePosition } from "./Airplane";
import { Planet_LittlePrince, Planet_LittlePrince_position } from "./LittlePrincePlanet";
import { Planet_Businessman, Planet_Businessman_position } from "./Planet_Businessman";
import { Planet_Drunken, Planet_Drunken_position } from "./Planet_Drunken";
import { Planet_Geographer, Planet_Geographer_position } from "./Planet_Geographer";
import { Planet_King, Planet_King_position } from "./Planet_King";
import { Planet_Lamplighter, Planet_Lamplighter_position } from "./Planet_Lamplighter";
import { Planet_Vanity, Planet_Vanity_position } from "./Planet_Vanity";


function calculateDistance(position1, position2) {
    // 두 지점 간의 거리를 계산하는 함수
    return position1.distanceTo(position2);
  }
  
function findClosestPlanet() {
    const planets = [
        // 행성들의 위치 정보
        {name: Planet_LittlePrince, position: Planet_LittlePrince_position},
        {name: Planet_Businessman, position: Planet_Businessman_position},
        {name: Planet_Drunken, position: Planet_Drunken_position},
        {name: Planet_Geographer, position: Planet_Geographer_position},
        {name: Planet_King, position: Planet_King_position},
        {name: Planet_Lamplighter, position: Planet_Lamplighter_position},
        {name: Planet_Vanity, position: Planet_Vanity_position}
    ];

    let closestPlanet = null;
    let closestDistance = Number.MAX_VALUE;

    for (const planet of planets) {
        const distance = calculateDistance(planePosition, planet.position);
        if (distance < closestDistance) {
        closestDistance = distance;
        closestPlanet = planet;
        }
    }

    return closestPlanet;
}

function handleExploreButtonClick() {
    const closestPlanet = findClosestPlanet();
    if (closestPlanet) {
        // closestPlanet를 사용하여 원하는 작업 수행
        console.log(`가장 가까운 행성은 ${closestPlanet.name} 입니다.`);
        // OrbitControls를 사용하여 카메라를 해당 행성으로 이동시키는 로직을 추가할 수 있습니다.
    }
}

export { findClosestPlanet, handleExploreButtonClick };