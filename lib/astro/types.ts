export type AngleKey = "ASC" | "DSC" | "MC" | "IC";

export type PlanetKey =
  | "Sun"
  | "Moon"
  | "Mercury"
  | "Venus"
  | "Mars"
  | "Jupiter"
  | "Saturn"
  | "Uranus"
  | "Neptune"
  | "Pluto";

export type LonLat = {
  lon: number; // degrees east, -180..180
  lat: number; // degrees north, -90..90
};

export type JulianDay = number;

export type PlanetPosition = {
  planet: PlanetKey;
  eclipticLongitude: number; // degrees 0..360
  eclipticLatitude?: number; // degrees
  distanceAu?: number;
};

export type Angles = {
  asc: number; // degrees 0..360
  dsc: number; // degrees 0..360
  mc: number; // degrees 0..360
  ic: number; // degrees 0..360
};

export type HouseSystem = "placidus" | "whole-sign";

export type Houses = {
  system: HouseSystem;
  cusps: number[]; // length 12, degrees 0..360
};

export type AngularHit = {
  planet: PlanetKey;
  angle: AngleKey;
  // Signed angular separation, degrees. Convention TBD by implementation.
  orbDegrees: number;
};
