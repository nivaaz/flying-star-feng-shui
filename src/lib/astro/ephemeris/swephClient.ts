// RULE OF THUMB: Do not import this module from server code.
// Only load it from client components ("use client") via dynamic import.

type Planet =
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

type Angles = { asc: number; mc: number; dsc: number; ic: number };

type SwissEPHType = {
  SEFLG_SWIEPH: number;
  SEFLG_SPEED: number;

  SE_SUN: number;
  SE_MOON: number;
  SE_MERCURY: number;
  SE_VENUS: number;
  SE_MARS: number;
  SE_JUPITER: number;
  SE_SATURN: number;
  SE_URANUS: number;
  SE_NEPTUNE: number;
  SE_PLUTO: number;

  swe_calc_ut: (jdUT: number, ipl: number, iflag: number) => (number | null)[];
  swe_houses: (
    jdUT: number,
    lat: number,
    lon: number,
    hsys: string
  ) => { cusps: (number | null)[]; ascmc: (number | null)[] };

  swe_set_ephe_path: (baseUrl?: string, files?: string[]) => Promise<void>;
};

let swe: SwissEPHType | null = null;
let initPromise: Promise<void> | null = null;

// Ephemeris files must be placed in `public/ephe/*` and will be served by Next.js at `/ephe/*`.
const EPHE_BASE_URL = "/ephe";

// Minimal set of files required for planets + houses.
// You can add more files here (or make this configurable) as needed.
const EPHE_FILES = ["seas_18.se1", "sepl_18.se1", "semo_18.se1"];

const assertBrowser = () => {
  if (typeof window === "undefined") {
    throw new Error(
      "swephClient.ts was called during SSR. Use dynamic import in a client component and guard with typeof window !== 'undefined'."
    );
  }
};

const planetToIpl = (s: SwissEPHType): Record<Planet, number> => ({
  Sun: s.SE_SUN,
  Moon: s.SE_MOON,
  Mercury: s.SE_MERCURY,
  Venus: s.SE_VENUS,
  Mars: s.SE_MARS,
  Jupiter: s.SE_JUPITER,
  Saturn: s.SE_SATURN,
  Uranus: s.SE_URANUS,
  Neptune: s.SE_NEPTUNE,
  Pluto: s.SE_PLUTO,
});

const normalize360 = (deg: number) => {
  const x = deg % 360;
  return x < 0 ? x + 360 : x;
};

/**
 * Loads the WASM module and ephemeris files. Must be called in the browser.
 * Ephemeris files are expected to be served from `/public/ephe` => `/ephe/*`.
 */
export const initEphemeris = async (): Promise<void> => {
  assertBrowser();

  if (swe) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const mod = await import("sweph-wasm");
    const SwissEPH = mod.default;

    // Initialize the wasm runtime (locates swisseph.wasm via the bundler).
    // We rely on sweph-wasm's browser build.
    const instance = (await SwissEPH.init()) as SwissEPHType;

    // Load ephemeris data into the WASM virtual filesystem.
    // sweph-wasm implements this by fetching files from EPHE_BASE_URL and mounting them under /ephe.
    // Important: call this BEFORE any swe_calc_ut / swe_houses calls.
    await instance.swe_set_ephe_path(EPHE_BASE_URL, EPHE_FILES);

    swe = instance;
  })();

  return initPromise;
};

export const getPlanetLongitudes = async (
  jdUT: number
): Promise<Record<Planet, number>> => {
  assertBrowser();
  await initEphemeris();
  if (!swe) throw new Error("Ephemeris not initialized");

  const iflag = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;
  const map = planetToIpl(swe);

  const planets: Planet[] = [
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
  ];

  const out = {} as Record<Planet, number>;

  for (const p of planets) {
    const data = swe.swe_calc_ut(jdUT, map[p], iflag);
    const lon = data[0];
    if (typeof lon !== "number") {
      throw new Error(`Swiss Ephemeris returned invalid longitude for ${p}`);
    }
    out[p] = normalize360(lon);
  }

  return out;
};

export const getAngles = async (
  jdUT: number,
  lat: number,
  lon: number
): Promise<Angles> => {
  assertBrowser();
  await initEphemeris();
  if (!swe) throw new Error("Ephemeris not initialized");

  // House system here is only used to retrieve ASC/MC.
  // Whole-sign house assignment is handled separately in engine-agnostic code.
  const res = swe.swe_houses(jdUT, lat, lon, "P");

  const asc = res.ascmc?.[0];
  const mc = res.ascmc?.[1];

  if (typeof asc !== "number" || typeof mc !== "number") {
    throw new Error("Swiss Ephemeris returned invalid angles");
  }

  const ascN = normalize360(asc);
  const mcN = normalize360(mc);

  return {
    asc: ascN,
    mc: mcN,
    dsc: normalize360(ascN + 180),
    ic: normalize360(mcN + 180),
  };
};
