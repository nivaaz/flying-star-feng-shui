import type { LonLat } from "../astro";

export type City = {
  id: string;
  name: string;
  country?: string;
  location: LonLat;
};

export const CITIES: readonly City[] = [
  {
    id: "nyc",
    name: "New York City",
    country: "US",
    location: { lat: 40.7128, lon: -74.006 },
  },
  {
    id: "london",
    name: "London",
    country: "GB",
    location: { lat: 51.5072, lon: -0.1276 },
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "AU",
    location: { lat: -33.8688, lon: 151.2093 },
  },
] as const;
