"use client";
import Link from "next/link";
import { useState } from "react";

// Signs with their corresponding pastel aura gradient colors
const signColors = {
  Aries: "linear-gradient(135deg, #FFCBC8 0%, #FFDDD8 100%)", // soft pastel red gradient
  Taurus: "linear-gradient(135deg, #D6EFC0 0%, #E9F5DC 100%)", // soft pastel green gradient
  Gemini: "linear-gradient(135deg, #FFF9C4 0%, #FFFDE7 100%)", // soft pastel yellow gradient
  Cancer: "linear-gradient(135deg, #DAEAFF 0%, #E8F1FF 100%)", // soft pastel blue gradient
  Leo: "linear-gradient(135deg, #FFE8CC 0%, #FFF3E6 100%)", // soft pastel orange gradient
  Virgo: "linear-gradient(135deg, #E2F5D3 0%, #F1FAE9 100%)", // soft pastel lime gradient
  Libra: "linear-gradient(135deg, #FFE6FF 0%, #FFF0FF 100%)", // soft pastel pink gradient
  Scorpio: "linear-gradient(135deg, #D9F5F5 0%, #E8FAFA 100%)", // soft pastel teal gradient
  Sagittarius: "linear-gradient(135deg, #FFDAE6 0%, #FFE9F0 100%)", // soft pastel magenta gradient
  Capricorn: "linear-gradient(135deg, #E1ECFF 0%, #EDF4FF 100%)", // soft pastel light blue gradient
  Aquarius: "linear-gradient(135deg, #E8D6FF 0%, #F2E6FF 100%)", // soft pastel purple gradient
  Pisces: "linear-gradient(135deg, #D6FFE8 0%, #E6FFF0 100%)", // soft pastel mint gradient
};

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
function getHouses(risingSign: string): House[] {
  const idx = signs.indexOf(risingSign);
  if (idx === -1) return [];
  // Rotate signs array so risingSign is first
  const rotated = [...signs.slice(idx), ...signs.slice(0, idx)];
  return rotated.map((sign, i) => ({
    house: i + 1,
    sign,
  }));
}

// Function to get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
}

type House = {
  house: number;
  sign: string;
};

const getSignStyle = (sign: string) => ({
  background: signColors[sign as keyof typeof signColors],
  padding: "4px 10px",
  borderRadius: "6px",
  display: "inline-block",
  fontWeight: "bold",
  color: "#333",
  margin: "0 4px",
});
export default function TransitsPage() {
  const [rising, setRising] = useState<string>("");
  const houses = rising ? getHouses(rising) : [];

  // Function to style signs with their aura gradients

  return (
    <main
      className="max-w-3xl mx-auto p-4 mb-60"
      style={{
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        borderRadius: "24px",
        padding: "24px",
      }}
    >
      <div className="bg-white bg-opacity-80 p-6  mb-6 w-full backdrop-blur-sm ">
        <h1
          className="text-2xl font-bold mb-4  text-center py-8"
          style={{
            backgroundImage:
              "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Transits by Rising Sign
        </h1>
        <Link
          className="text-blue-600 underline mb-4 inline-block"
          href="https://horoscopes.astro-seek.com/ascendant-rising-sign-calculator"
          target="_blank"
          rel="noopener noreferrer"
        >
          1. Click here to find your rising sign
        </Link>
        <label className="block">
          2. Select your rising sign:
          <select
            className="block border -xl p-2 mt-2 w-full bg-opacity-70 bg-white backdrop-blur-sm"
            value={rising}
            onChange={(e) => setRising(e.target.value)}
            style={{
              transition: "all 0.3s ease",
              borderColor: "#e2e8f0",
            }}
          >
            <option value="">--Choose--</option>
            {signs.map((sign) => (
              <option key={sign} value={sign}>
                {sign}
              </option>
            ))}
          </select>
        </label>
      </div>

      {rising && (
        <div className="space-y-5">
          {planetTransits.map((transit) => (
            <div
              key={transit.planet}
              className="bg-white bg-opacity-90 p-6 -2xl backdrop-blur-md"
              style={{
                borderTop: "3px solid",
                borderImage:
                  signColors[transit.current.sign as keyof typeof signColors] +
                  " 1",
              }}
            >
              <h3
                className="text-xl font-bold mb-3"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #6a9eda, #b19cd9, #f7a6c6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {transit.planet}
              </h3>

              <p className="text-sm mb-3 italic bg-gray-50 p-2 -md">
                <span className="font-medium">{transit.planet} </span>{" "}
                {planetThemes[transit.planet as keyof typeof planetThemes]}
              </p>

              <div className="grid gap-4">
                {/* Current Transit */}
                <Transit
                  planet={transit.planet}
                  placement={transit.current}
                  houses={houses}
                  title="Current Transit →"
                  isPast={false}
                />
                {/* Past Transit */}
                <Transit
                  planet={transit.planet}
                  placement={transit.past}
                  houses={houses}
                  title="Past Transit →"
                  isPast={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const Transit = ({
  planet,
  placement,
  houses,
  title,
  isPast = false,
}: {
  planet: string;
  placement: Placement;
  houses: House[];
  title: string;
  isPast?: boolean;
}) => {
  return (
    <div
      className={`bg-white p-4 border-l-4 ${
        isPast ? "border-blue-300" : "border-purple-300"
      }`}
    >
      <p className="font-bold pb-2">
        {title}
        <span style={getSignStyle(placement.sign)}>{placement.sign}</span>
      </p>

      {houses.length > 0 && (
        <p className="text-xs text-gray-600 italic mb-2 bg-gray-50 py-1 px-2 ">
          {planet} transited {placement.sign} in your{" "}
          {houses.findIndex((h) => h.sign === placement.sign) + 1}
          {getOrdinalSuffix(
            houses.findIndex((h) => h.sign === placement.sign) + 1
          )}{" "}
          house <br /> from {placement.start} - {placement.end}
        </p>
      )}
      <Houses houses={houses} placement={placement} isPast={isPast} />
    </div>
  );
};

const Houses = ({
  houses,
  placement,
  isPast = false,
}: {
  houses: House[];
  placement: Placement;
  isPast?: boolean;
}) => {
  const currHouse = houses.findIndex((h) => h.sign === placement.sign) + 1;
  return (
    <div
      className={`mt-2 ${
        isPast ? "bg-blue-50" : "bg-purple-50"
      } p-2 grid sm:grid-cols-5 sm:gap-2 gap-1`}
    >
      <p className="col-span-1 text-sm capitalize text-slate-600">
        House {currHouse}:{" "}
        <b className="block text-xs text-slate-400"> (area of life) </b>
      </p>
      <p className="col-span-4 text-sm "> {houseThemes[currHouse - 1]}</p>
      <p className="col-span-1 text-sm capitalize text-slate-600 "> Gifts: </p>
      <p className="col-span-4 text-sm">{placement.high}</p>
      <p className="col-span-1 text-sm capitalize text-slate-600">
        {" "}
        Challenges:{" "}
      </p>
      <p className="col-span-4 text-sm">{placement.low}</p>
    </div>
  );
};

type Placement = {
  sign: string;
  start: string;
  end: string;
  high: string;
  low: string;
};
type trasitPlacement = {
  planet: string;
  current: Placement;
  past: Placement;
};
const planetTransits: trasitPlacement[] = [
  {
    planet: "Pluto",
    past: {
      sign: "Capricorn",
      start: "2008",
      end: "2023",
      high: "mastery of structures, long-term legacy, responsible power",
      low: "control, corruption, fear of failure, rigidity",
    },
    current: {
      sign: "Aquarius",
      start: "2023",
      end: "2043",
      high: "collective innovation, freedom, future systems, social empowerment",
      low: "chaos in tech, detachment, rebellion without cause, alienation",
    },
  },
  {
    planet: "Neptune",
    past: {
      sign: "Pisces",
      start: "2011",
      end: "2025",
      high: "compassion, spiritual awakening, creativity, unity consciousness",
      low: "escapism, confusion, victimhood, illusions",
    },
    current: {
      sign: "Aries",
      start: "2025",
      end: "2039",
      high: "courageous vision, spiritual self-leadership, pioneering compassion",
      low: "self-delusion, ego-driven martyrdom, blurred identity",
    },
  },
  {
    planet: "Saturn",
    past: {
      sign: "Pisces",
      start: "2023",
      end: "2026",
      high: "spiritual discipline, boundaries in compassion, practical creativity",
      low: "avoidance, self-pity, blurred limits, victim mindset",
    },
    current: {
      sign: "Aries",
      start: "2026",
      end: "2028",
      high: "self-mastery, courage to take responsibility, disciplined leadership",
      low: "impatience, aggression, fear of failure, ego rigidity",
    },
  },
  {
    planet: "Uranus",
    past: {
      sign: "Taurus",
      start: "2018",
      end: "2025",
      high: "innovative resources, sustainable values, embodied freedom",
      low: "financial chaos, stubborn resistance, insecurity",
    },
    current: {
      sign: "Gemini",
      start: "2025",
      end: "2033",
      high: "breakthroughs in communication, learning, tech, networks",
      low: "scattered attention, shallow rebellion, information chaos",
    },
  },
  {
    planet: "North Node",
    past: {
      sign: "Aries",
      start: "2023",
      end: "2025",
      high: "independence, courage, pioneering destiny",
      low: "selfishness, recklessness, conflict",
    },
    current: {
      sign: "Pisces",
      start: "2025",
      end: "2026",
      high: "spiritual growth, compassion, surrender to higher flow",
      low: "escapism, victimhood, lack of boundaries",
    },
  },
  {
    planet: "South Node",
    past: {
      sign: "Libra",
      start: "2023",
      end: "2025",
      high: "harmony, fairness, relationship wisdom",
      low: "people-pleasing, indecision, dependency",
    },
    current: {
      sign: "Virgo",
      start: "2025",
      end: "2026",
      high: "discernment, service, practical wisdom",
      low: "over-analysis, perfectionism, burnout",
    },
  },
];

const houseThemes = [
  "identity, self, appearance, personal approach",
  "money, values, possessions, self-worth",
  "communication, siblings, learning, local environment",
  "home, family, roots, inner foundation",
  "creativity, romance, children, joy",
  "work, health, service, daily routine",
  "partnerships, marriage, contracts, balance",
  "intimacy, shared resources, transformation, taboo",
  "higher learning, travel, philosophy, beliefs",
  "career, public image, status, authority",
  "friendships, community, future goals",
  "spirituality, subconscious, endings, hidden realms",
];

const signTheme = {
  Aries: "independence, courage, initiative, self-assertion, pioneering spirit",
  Taurus: "stability, material security, values, sensuality, possessions",
  Gemini: "communication, curiosity, ideas, networking, duality",
  Cancer: "emotions, nurturing, family, roots, safety",
  Leo: "creativity, self-expression, leadership, pride, recognition",
  Virgo: "service, work, health, detail, improvement",
  Libra: "relationships, harmony, justice, aesthetics, balance",
  Scorpio: "intimacy, power, transformation, secrecy, intensity",
  Sagittarius: "exploration, philosophy, expansion, truth, travel",
  Capricorn: "ambition, authority, structure, discipline, achievement",
  Aquarius: "innovation, rebellion, humanity, freedom, collective vision",
  Pisces: "spirituality, compassion, dreams, illusions, transcendence",
};
const planetThemes = {
  Pluto:
    "transforms, intensifies, destroys & rebuilds, empowers, exposes, regenerates",
  Neptune:
    "dissolves, spiritualizes, confuses, idealizes, inspires, transcends, mystifies",
  Saturn:
    "structures, disciplines, restricts, tests, grounds, matures, crystallizes",
  Uranus: "disrupts, liberates, shocks, awakens, innovates, revolutionizes",
  "North Node":
    "directs, guides, grows, evolves, pushes toward destiny, expands purpose",
  "South Node":
    "releases, depletes, drains, pulls back, exposes past patterns, lets go",
};
