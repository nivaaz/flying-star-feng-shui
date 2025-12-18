import type { AngleKey, Angles, AngularHit, PlanetKey } from "./types";
import { normalize360 } from "./angles";
import type { PlanetWithHouse } from "./houses";

const smallestAngleDiff = (a: number, b: number): number => {
  // Returns signed difference a-b in range [-180, 180)
  const d = normalize360(a - b);
  return d >= 180 ? d - 360 : d;
};

export const computeAngularHits = (input: {
  angles: Angles;
  planetLongitudes: Record<PlanetKey, number>;
  orbDegrees?: number;
}): AngularHit[] => {
  const { angles, planetLongitudes, orbDegrees = 1 } = input;

  const angleEntries: Array<[AngleKey, number]> = [
    ["ASC", angles.asc],
    ["DSC", angles.dsc],
    ["MC", angles.mc],
    ["IC", angles.ic],
  ];

  const hits: AngularHit[] = [];

  (Object.keys(planetLongitudes) as PlanetKey[]).forEach((planet) => {
    const lon = planetLongitudes[planet];
    angleEntries.forEach(([angle, angleLon]) => {
      const orb = smallestAngleDiff(lon, angleLon);
      if (Math.abs(orb) <= orbDegrees) {
        hits.push({ planet, angle, orbDegrees: orb });
      }
    });
  });

  return hits;
};

export type AngularHouseHit = {
  key: string;
  house: 1 | 4 | 7 | 10;
  angle: AngleKey;
};

const angleByAngularHouse = (house: 1 | 4 | 7 | 10): AngleKey => {
  switch (house) {
    case 1:
      return "ASC";
    case 4:
      return "IC";
    case 7:
      return "DSC";
    case 10:
      return "MC";
  }
};

// Angular houses: {1,4,7,10}
export const getAngularByHouse = (
  planetsWithHouse: PlanetWithHouse[]
): AngularHouseHit[] => {
  return planetsWithHouse
    .filter((p): p is PlanetWithHouse & { house: 1 | 4 | 7 | 10 } =>
      [1, 4, 7, 10].includes(p.house)
    )
    .map((p) => ({
      key: p.key,
      house: p.house,
      angle: angleByAngularHouse(p.house),
    }));
};
