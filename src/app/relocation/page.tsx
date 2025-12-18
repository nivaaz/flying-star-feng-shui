"use client";

import { useMemo, useState } from "react";
import Banner from "../components/banner";
import Container from "../components/container";
import Heading from "../components/heading";
import InputAddressComponent from "../components/inputComponent";
import { CITIES } from "../../../lib/data/cities";
import { birthLocalToUtcDate, toJulianDay } from "../../../lib/astro/time";
import { assignWholeSignHouses } from "../../../lib/astro/houses";
import { getAngularByHouse } from "../../../lib/astro/angular";

type BirthPlaceMode = "city" | "latlon";

export default function RelocationPage() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthTz, setBirthTz] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
  );

  const [birthPlaceMode, setBirthPlaceMode] = useState<BirthPlaceMode>("city");
  const [birthCityId, setBirthCityId] = useState(CITIES[0]?.id ?? "");
  const [birthLat, setBirthLat] = useState("");
  const [birthLon, setBirthLon] = useState("");

  const [destinationCityId, setDestinationCityId] = useState(CITIES[0]?.id ?? "");

  const cityOptions = useMemo(
    () =>
      CITIES.map((c) => ({
        value: c.id,
        label: `${c.name}${c.country ? ` (${c.country})` : ""}`,
      })),
    []
  );

  const timeZoneOptions = useMemo(() => {
    // Small curated list for now; can be expanded or swapped for a full tz database later.
    const zones = [
      "UTC",
      "America/Los_Angeles",
      "America/Denver",
      "America/Chicago",
      "America/New_York",
      "America/Phoenix",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Asia/Dubai",
      "Asia/Kolkata",
      "Asia/Singapore",
      "Asia/Tokyo",
      "Australia/Sydney",
      "Pacific/Auckland",
    ];

    return zones.map((tz) => ({ value: tz, label: tz }));
  }, []);

  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [angularHitsResult, setAngularHitsResult] = useState<
    Array<{ key: string; angle: string; house: number }>
  >([]);

  const [businessHouseActivations, setBusinessHouseActivations] = useState<
    Array<{ key: string; house: number; nature: "benefic" | "malefic" }>
  >([]);

  const classifyPlanet = (planet: string): "benefic" | "malefic" | "neutral" => {
    if (["Venus", "Jupiter"].includes(planet)) return "benefic";
    if (["Mars", "Saturn"].includes(planet)) return "malefic";
    return "neutral";
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    setError(null);
    setResult(null);
    setAngularHitsResult([]);
    setBusinessHouseActivations([]);

    try {
      if (typeof window === "undefined") {
        throw new Error("Cannot calculate during SSR.");
      }

      const destination = CITIES.find((c) => c.id === destinationCityId);
      if (!destination) {
        throw new Error("Destination city not found.");
      }

      // Lazy-load ephemeris (client-only)
      const { initEphemeris, getPlanetLongitudes, getAngles } = await import(
        "@/lib/astro/ephemeris/swephClient"
      );

      await initEphemeris();

      // Local birth datetime -> UTC -> Julian Day (UT)
      const utcDate = birthLocalToUtcDate({
        date: birthDate,
        time: birthTime,
        timeZone: birthTz,
      });
      const jdUT = toJulianDay(utcDate);

      // Destination angles + planet longitudes
      const [planetLongitudes, angles] = await Promise.all([
        getPlanetLongitudes(jdUT),
        getAngles(jdUT, destination.location.lat, destination.location.lon),
      ]);

      // Whole-sign houses (ASC sign) + angular filtering (houses 1/4/7/10)
      const planetsLonArray = Object.entries(planetLongitudes).map(
        ([key, lon]) => ({ key, lon })
      );

      const planetsWithHouse = assignWholeSignHouses(angles.asc, planetsLonArray);
      const angularHits = getAngularByHouse(planetsWithHouse);

      setAngularHitsResult(angularHits);

      const bizHouses = [2, 6, 10];
      const biz = planetsWithHouse
        .filter((p) => bizHouses.includes(p.house))
        .map((p) => ({ key: p.key, house: p.house, nature: classifyPlanet(p.key) }))
        .filter(
          (p): p is { key: string; house: number; nature: "benefic" | "malefic" } =>
            p.nature === "benefic" || p.nature === "malefic"
        )
        .sort((a, b) => a.house - b.house || a.key.localeCompare(b.key));

      setBusinessHouseActivations(biz);

      setResult({
        inputs: {
          birth: {
            date: birthDate,
            time: birthTime,
            timeZone: birthTz,
            place:
              birthPlaceMode === "city"
                ? { mode: "city" as const, cityId: birthCityId }
                : { mode: "latlon" as const, lat: birthLat, lon: birthLon },
          },
          destination,
        },
        jdUT,
        utcDate: utcDate.toISOString(),
        angles,
        planetLongitudes,
        planetsWithHouse,
        angularHits,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Calculation failed.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="w-full flex flex-col p-1 justify-center pb-32">
      <div className="text-center py-8">
        <Heading level={1} className="uppercase">
          Relocation
        </Heading>
      </div>

      <div className="m-auto w-full lg:w-2/3 p-4 space-y-8">
        <Container>
          <Banner>Birth Information</Banner>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 m-auto">
            <InputAddressComponent
              label="Birth date"
              example="YYYY-MM-DD"
              currentId="birth-date"
              type="date"
              value={birthDate}
              handleChange={(e) => setBirthDate(e.target.value)}
            />

            <InputAddressComponent
              label="Birth time"
              example="HH:MM"
              currentId="birth-time"
              type="time"
              value={birthTime}
              handleChange={(e) => setBirthTime(e.target.value)}
            />

            <div className="p-4">
              <label
                className=" text-xs text-slate-400 absolute bg-white px-1 rounded dark:bg-slate-800 dark:text-white "
                htmlFor="birth-tz"
              >
                Birth timezone (IANA)
              </label>
              <select
                id="birth-tz"
                name="birth-tz"
                className="rounded-md p-2 mt-2 border border-slate-200 dark:text-white dark:bg-slate-900 w-full"
                value={birthTz}
                onChange={(e) => setBirthTz(e.target.value)}
              >
                {timeZoneOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs opacity-75 text-slate-500 p-0.5">
                Select your birth timezone.
              </p>
            </div>
          </div>

          <div className="px-4 pt-2">
            <p className="text-xs text-slate-500">Birth place</p>
            <div className="mt-2 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="birth-place-mode"
                  checked={birthPlaceMode === "city"}
                  onChange={() => setBirthPlaceMode("city")}
                />
                City
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="birth-place-mode"
                  checked={birthPlaceMode === "latlon"}
                  onChange={() => setBirthPlaceMode("latlon")}
                />
                Lat/Lon
              </label>
            </div>
          </div>

          {birthPlaceMode === "city" ? (
            <div className="p-4">
              <label
                className=" text-xs text-slate-400 absolute bg-white px-1 rounded dark:bg-slate-800 dark:text-white "
                htmlFor="birth-city"
              >
                Birth city
              </label>
              <select
                id="birth-city"
                name="birth-city"
                className="rounded-md p-2 mt-2 border border-slate-200 dark:text-white dark:bg-slate-900 w-full"
                value={birthCityId}
                onChange={(e) => setBirthCityId(e.target.value)}
              >
                {cityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-xs opacity-75 text-slate-500 p-0.5">
                Select a city (seed list for now).
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 m-auto">
              <InputAddressComponent
                label="Birth latitude"
                example="e.g. 40.7128"
                currentId="birth-lat"
                value={birthLat}
                handleChange={(e) => setBirthLat(e.target.value)}
              />
              <InputAddressComponent
                label="Birth longitude"
                example="e.g. -74.0060"
                currentId="birth-lon"
                value={birthLon}
                handleChange={(e) => setBirthLon(e.target.value)}
              />
              <div className="p-4" />
            </div>
          )}
        </Container>

        <Container>
          <Banner>Destination</Banner>
          <div className="p-4">
            <label
              className=" text-xs text-slate-400 absolute bg-white px-1 rounded dark:bg-slate-800 dark:text-white "
              htmlFor="dest-city"
            >
              Destination city
            </label>
            <select
              id="dest-city"
              name="dest-city"
              className="rounded-md p-2 mt-2 border border-slate-200 dark:text-white dark:bg-slate-900 w-full"
              value={destinationCityId}
              onChange={(e) => setDestinationCityId(e.target.value)}
            >
              {cityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs opacity-75 text-slate-500 p-0.5">
              Select a destination city.
            </p>
          </div>
        </Container>

        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md bg-emerald-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
            onClick={handleCalculate}
            disabled={isCalculating}
          >
            {isCalculating ? "Calculating..." : "Calculate"}
          </button>
        </div>

        {error ? (
          <Container>
            <Banner>Error</Banner>
            <pre className="text-xs whitespace-pre-wrap break-words bg-slate-950 text-slate-100 p-4 rounded">
              {error}
            </pre>
          </Container>
        ) : null}

        {businessHouseActivations.length ? (
          <Container>
            <Banner>Business house activations (2 / 6 / 10)</Banner>
            <ul className="p-4 space-y-2">
              {businessHouseActivations.map((hit) => (
                <li
                  key={`${hit.key}-${hit.house}-${hit.nature}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-200 dark:border-slate-700 px-3 py-2"
                >
                  <div className="text-sm">
                    <span className="font-semibold">{hit.key}</span>
                    <span className="opacity-70"> in </span>
                    <span className="font-semibold">house {hit.house}</span>
                  </div>
                  <div
                    className={
                      hit.nature === "benefic"
                        ? "text-xs rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 px-2 py-1"
                        : "text-xs rounded bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100 px-2 py-1"
                    }
                  >
                    {hit.nature}
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        ) : null}

        {angularHitsResult.length ? (
          <Container>
            <Banner>Angular hits</Banner>
            <ul className="p-4 space-y-2">
              {angularHitsResult.map((hit) => {
                const nature = classifyPlanet(hit.key);
                const isBizAngular = hit.house === 10;
                return (
                  <li
                    key={`${hit.key}-${hit.angle}-${hit.house}`}
                    className={
                      isBizAngular
                        ? "flex flex-wrap items-center justify-between gap-3 rounded border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 px-3 py-2"
                        : "flex flex-wrap items-center justify-between gap-3 rounded border border-slate-200 dark:border-slate-700 px-3 py-2"
                    }
                  >
                    <div className="text-sm">
                      <span className="font-semibold">{hit.key}</span>
                      <span className="opacity-70"> on </span>
                      <span className="font-semibold">{hit.angle}</span>
                      <span className="opacity-70"> (house {hit.house})</span>
                      {isBizAngular ? (
                        <span className="ml-2 text-xs rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100 px-2 py-0.5">
                          business
                        </span>
                      ) : null}
                    </div>
                    <div
                      className={
                        nature === "benefic"
                          ? "text-xs rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 px-2 py-1"
                          : nature === "malefic"
                            ? "text-xs rounded bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-100 px-2 py-1"
                            : "text-xs rounded bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 px-2 py-1"
                      }
                    >
                      {nature}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Container>
        ) : null}

        {result ? (
          <Container>
            <Banner>Output</Banner>
            <pre className="text-xs whitespace-pre-wrap break-words bg-slate-950 text-slate-100 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Container>
        ) : null}
      </div>
    </div>
  );
}
