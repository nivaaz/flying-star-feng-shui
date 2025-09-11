"use client";
import { useState } from "react";

const signs = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

// Houses are always 1-12, starting from the rising sign as 1st house
function getHouses(risingSign: string) {
  const idx = signs.indexOf(risingSign);
  if (idx === -1) return [];
  // Rotate signs array so risingSign is first
  const rotated = [...signs.slice(idx), ...signs.slice(0, idx)];
  return rotated.map((sign, i) => ({
    house: i + 1,
    sign,
  }));
}

export default function TransitsPage() {
  const [rising, setRising] = useState<string>("");

  const houses = rising ? getHouses(rising) : [];

  return (
    <main className="max-w-3xl mx-auto p-4">
      <div className="bg-white p-4 rounded-md mb-4 w-full">
        <h1 className="text-2xl font-bold mb-2 py-4">
          Find Your Houses by Rising Sign
        </h1>
        <label>
          Select your rising sign:
          <select
            className=" block border rounded p-2 mt-2 w-full"
            value={rising}
            onChange={(e) => setRising(e.target.value)}
          >
            <option value="">--Choose--</option>
            {signs.map((sign) => (
              <option key={sign} value={sign}>
                {sign}
              </option>
            ))}
          </select>
        </label>
        {/* {houses.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2>Your Houses & Signs</h2>
          <ul>
            {houses.map((h) => (
              <li key={h.house}>
                <strong>House {h.house}:</strong> {h.sign}
              </li>
            ))}
          </ul>
        </div>
      )} */}
      </div>
      {rising && (
        <div className="border-t-2 w-full space-y-4">
          {planetTransits.map((transit) => {
            return (
              <div
                className="border-t-2 bg-white p-4 rounded-md"
                key="transit.planet"
              >
                <p className="font-bold text-lg border-b ">{transit.planet} </p>
                <div>
                  <p className="font-bold pt-2"> Current Transit</p>
                  <p className="text-sm">
                    {transit.current.start} - {transit.current.end}
                  </p>
                  <p className="text-sm pt-1"> Theme: {transit.theme}</p>
                  <p className="text-sm pt-1">
                    {" "}
                    Themes | {transit.current.sign} |
                  </p>
                  <p className="text-sm pt-1">
                    In the house area of:{" "}
                    {
                      houseThemes[
                        houses.findIndex((h) => h.sign === transit.current.sign)
                      ]
                    }
                  </p>
                </div>
                <div>
                  <p className="font-bold pt-2"> Past Transit</p>
                  <p className="text-sm">
                    {transit.past.start} - {transit.past.end}
                  </p>
                  <p className="text-sm pt-1"> Theme: {transit.theme}</p>
                  <p className="text-sm pt-1">
                    {" "}
                    Themes | {transit.past.sign} |
                  </p>
                  <p className="text-sm pt-1">
                    In the house area of:{" "}
                    {
                      houseThemes[
                        houses.findIndex((h) => h.sign === transit.past.sign)
                      ]
                    }
                  </p>
                </div>
                <br />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

const planetTransits = [
  {
    planet: "Pluto",
    theme:
      "transformation, power, destruction/regeneration, collective evolution",
    current: {
      sign: "Aquarius",
      start: "March 23, 2023",
      end: "January 19, 2044",
      themes: "innovation, technology, humanity, systems, freedom, revolution",
    },
    past: {
      sign: "Capricorn",
      start: "January 25, 2008",
      end: "January 20, 2024",
      themes: "authority, structures, government, career, ambition",
    },
  },
  {
    planet: "Neptune",
    theme:
      "dreams, illusions, spirituality, mysticism, creativity, dissolving boundaries",
    current: {
      sign: "Aries",
      start: "March 30, 2025",
      end: "April 20, 2039",
      themes:
        "individuality, pioneering, courage, identity dissolutions, self-assertion",
    },
    past: {
      sign: "Pisces",
      start: "April 4, 2011",
      end: "March 30, 2025",
      themes:
        "spirituality, compassion, empathy, sacrifice, dissolving structures",
    },
  },
  {
    planet: "Saturn",
    theme: "discipline, responsibility, karma, structures, mastery",
    current: {
      sign: "Pisces",
      start: "March 7, 2023",
      end: "February 13, 2026",
      themes:
        "spirituality, compassion, sacrifice, boundaries, dissolution of structures",
    },
    past: {
      sign: "Aquarius",
      start: "December 17, 2020",
      end: "March 7, 2023",
      themes:
        "innovation, community, progress, technology, collective structures",
    },
  },
  {
    planet: "Uranus",
    theme: "sudden change, liberation, rebellion, innovation, awakening",
    current: {
      sign: "Taurus",
      start: "May 15, 2018",
      end: "April 26, 2026",
      themes: "stability, resources, money, values, body, earth",
    },
    past: {
      sign: "Aries",
      start: "March 11, 2011",
      end: "May 15, 2018",
      themes: "individuality, pioneering, courage, radical self-expression",
    },
  },
];

const houseThemes = [
  "self, identity, appearance",
  "money, values, possessions",
  "communication, learning, siblings",
  "home, family, roots",
  "creativity, romance, children",
  "work, health, daily routine",
  "partnerships, marriage, contracts",
  "intimacy, shared resources, transformation",
  "philosophy, travel, higher learning",
  "career, reputation, public life",
  "friendships, groups, vision",
  "spirituality, subconscious, endings",
];
