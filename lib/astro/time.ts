import type { JulianDay } from "./types";

// Placeholder implementations; replace once we plug in an ephemeris.

export const toJulianDay = (date: Date): JulianDay => {
  // This is intentionally a stub.
  // A real implementation should convert UTC date-time to Julian Day.
  return date.getTime() / 86400000 + 2440587.5;
};

export const fromJulianDay = (jd: JulianDay): Date => {
  // Inverse of the stub above.
  return new Date((jd - 2440587.5) * 86400000);
};
