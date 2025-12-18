import type { Houses, HouseSystem } from "./types";
import { normalize360 } from "./angles";

export const createEmptyHouses = (system: HouseSystem = "placidus"): Houses => ({
  system,
  cusps: Array.from({ length: 12 }, () => 0),
});

export type PlanetLon = {
  key: string;
  lon: number; // degrees
};

export type PlanetWithHouse = PlanetLon & {
  signIndex: number; // 0..11
  house: number; // 1..12
};

export const getSignIndex = (lon: number): number => {
  const normalizedLon = normalize360(lon);
  return Math.floor(normalizedLon / 30);
};

// Whole Sign houses (engine-agnostic)
// signIndex = Math.floor(normalizedLon / 30)
// house = ((planetSign - ascSign + 12) % 12) + 1
export const assignWholeSignHouses = (
  ascLon: number,
  planetsLon: PlanetLon[]
): PlanetWithHouse[] => {
  const ascSign = getSignIndex(ascLon);

  return planetsLon.map((p) => {
    const planetSign = getSignIndex(p.lon);
    const house = ((planetSign - ascSign + 12) % 12) + 1;

    return {
      ...p,
      signIndex: planetSign,
      house,
    };
  });
};
