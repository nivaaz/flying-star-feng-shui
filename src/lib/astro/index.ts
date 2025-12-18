export type CalculateRelocationParams = {
  birth: {
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    timezone: string; // IANA tz, e.g. "America/New_York"
    place:
      | { mode: "city"; cityId: string }
      | { mode: "latlon"; lat: number; lon: number };
  };
  destination: {
    cityId: string;
  };
};

export type CalculateRelocationResult = {
  // Placeholder angles in degrees (0..360)
  asc: number;
  mc: number;

  // Placeholder planet longitudes in degrees (0..360)
  planets: Array<{
    key: string;
    lon: number;
  }>;
};

export const calculateRelocation = (
  _params: CalculateRelocationParams
): CalculateRelocationResult => {
  // TODO: replace with real ephemeris + house/angle calculations.
  return {
    asc: 123.45,
    mc: 210.0,
    planets: [
      { key: "Sun", lon: 10.0 },
      { key: "Moon", lon: 42.0 },
      { key: "Mercury", lon: 88.0 },
      { key: "Venus", lon: 123.0 },
      { key: "Mars", lon: 250.0 },
    ],
  };
};
