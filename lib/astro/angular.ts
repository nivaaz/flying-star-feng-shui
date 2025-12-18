import type { AngleKey, Angles, AngularHit, PlanetKey } from "./types";
import { normalize360 } from "./angles";

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
