import { planePosition } from "./Airplane";
import { LittlePrincePlanet, littlePrincePlanetPosition } from "./LittlePrincePlanet";

function calculateDistance(position1, position2) {
    // 두 지점 간의 거리를 계산하는 함수
    return position1.distanceTo(position2);
  }
  
function findClosestPlanet() {
    const planets = [
        // 행성들의 위치 정보
        {name: LittlePrincePlanet, position: littlePrincePlanetPosition}
        // { name: "Planet2", position: new Vector3(x2, y2, z2) },
        // ...
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

export { handleExploreButtonClick };