import type { AngleKey, Angles } from "./types";

export const ANGLES: readonly AngleKey[] = ["ASC", "DSC", "MC", "IC"] as const;

export const normalize360 = (deg: number): number => {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
};

export const buildAngles = (asc: number, mc: number): Angles => {
  const a = normalize360(asc);
  const m = normalize360(mc);
  return {
    asc: a,
    dsc: normalize360(a + 180),
    mc: m,
    ic: normalize360(m + 180),
  };
};
