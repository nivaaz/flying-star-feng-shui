import type { Houses, HouseSystem } from "./types";

export const createEmptyHouses = (system: HouseSystem = "placidus"): Houses => ({
  system,
  cusps: Array.from({ length: 12 }, () => 0),
});
