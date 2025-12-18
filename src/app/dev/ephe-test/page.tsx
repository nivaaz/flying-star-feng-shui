"use client";

import { useState } from "react";
import Banner from "../../components/banner";
import Container from "../../components/container";
import Heading from "../../components/heading";
import { birthLocalToUtcDate, toJulianDay } from "../../../../lib/astro/time";

type Output = {
  input: {
    birth: { date: string; time: string; timeZone: string };
    destination: { lat: number; lon: number };
  };
  utcDate: string;
  jdUT: number;
  planets: { sun: number; moon: number };
  angles: { asc: number; mc: number };
};

const HARD_CODED = {
  // Example input. Picked to be deterministic and easy to change.
  birth: {
    date: "1990-01-01",
    time: "12:00",
    timeZone: "UTC",
  },
  // Destination: New York City
  destination: {
    lat: 40.7128,
    lon: -74.006,
  },
} as const;

export default function EpheTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<Output | null>(null);

  const runTest = async () => {
    setIsRunning(true);
    setError(null);
    setOutput(null);

    try {
      if (typeof window === "undefined") {
        throw new Error("Cannot run ephemeris test during SSR.");
      }

      const { initEphemeris, getPlanetLongitudes, getAngles } = await import(
        "@/lib/astro/ephemeris/swephClient"
      );

      await initEphemeris();

      const utcDate = birthLocalToUtcDate(HARD_CODED.birth);
      const jdUT = toJulianDay(utcDate);

      const [planetLongitudes, angles] = await Promise.all([
        getPlanetLongitudes(jdUT),
        getAngles(jdUT, HARD_CODED.destination.lat, HARD_CODED.destination.lon),
      ]);

      const result: Output = {
        input: HARD_CODED,
        utcDate: utcDate.toISOString(),
        jdUT,
        planets: {
          sun: planetLongitudes.Sun,
          moon: planetLongitudes.Moon,
        },
        angles: {
          asc: angles.asc,
          mc: angles.mc,
        },
      };

      console.log("Ephemeris smoke test result:", result);
      setOutput(result);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Test failed.";
      console.error("Ephemeris smoke test error:", e);
      setError(message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full flex flex-col p-1 justify-center pb-32">
      <div className="text-center py-8">
        <Heading level={1} className="uppercase">
          Ephemeris Smoke Test
        </Heading>
      </div>

      <div className="m-auto w-full lg:w-2/3 p-4 space-y-8">
        <Container>
          <Banner>Hardcoded input</Banner>
          <pre className="text-xs whitespace-pre-wrap break-words bg-slate-950 text-slate-100 p-4 rounded">
            {JSON.stringify(HARD_CODED, null, 2)}
          </pre>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
              onClick={runTest}
              disabled={isRunning}
            >
              {isRunning ? "Running..." : "Run test"}
            </button>
          </div>
        </Container>

        {error ? (
          <Container>
            <Banner>Error</Banner>
            <pre className="text-xs whitespace-pre-wrap break-words bg-slate-950 text-slate-100 p-4 rounded">
              {error}
            </pre>
          </Container>
        ) : null}

        {output ? (
          <Container>
            <Banner>Output</Banner>
            <pre className="text-xs whitespace-pre-wrap break-words bg-slate-950 text-slate-100 p-4 rounded">
              {JSON.stringify(output, null, 2)}
            </pre>
          </Container>
        ) : null}
      </div>
    </div>
  );
}
