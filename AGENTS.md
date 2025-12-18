# Goal
Integrate Swiss Ephemeris WASM into a Next.js app in client-only mode.

# Constraints
- Must not import WASM/Swiss Ephemeris in server components or API routes.
- WASM must load only in the browser.
- Provide an async initializer: await initEphemeris() before calculations.
- Ephemeris data should be served from /public/ephe.
- Provide clean TypeScript interfaces and pure calculation functions.

# Deliverables
1) src/lib/astro/ephemeris/swephClient.ts
   - initEphemeris(): Promise<void>
   - getPlanetLongitudes(jdUT: number): Promise<Record<Planet, number>>
   - getAngles(jdUT: number, lat: number, lon: number): Promise<{asc:number, mc:number, dsc:number, ic:number}>

2) Update existing astrocartography page to use:
   - birthLocalToUtcDate() + utcDateToJulianDay()
   - swephClient functions
   - existing whole-sign + angular logic

3) Add a minimal “smoke test” page or script that logs ASC/MC + Sun/Moon for a known input.
