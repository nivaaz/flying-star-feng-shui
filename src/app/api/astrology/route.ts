import { NextResponse } from "next/server";

const ASTROLOGY_PLANETS_ENDPOINT = "https://json.freeastrologyapi.com/western/planets";
const ASTROLOGY_ASPECTS_ENDPOINT = "https://json.freeastrologyapi.com/western/aspects";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: work out if u wanna add more aspects.
const configAspects = {
  "allowed_aspects": ["Conjunction", "Opposition", "Trine", "Square", "Sextile"],
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = process.env.FREE_ASTROLOGY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing FREE_ASTROLOGY_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const planetResponse = await fetch(ASTROLOGY_PLANETS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    await delay(2000);

    const aspectsResponse = await fetch(ASTROLOGY_ASPECTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ ...body, config: { ...configAspects } }),
    });

    if (!planetResponse.ok || !aspectsResponse.ok) {
      throw new Error(
        `Astrology API request failed: Planets status ${planetResponse.status}, Aspects status ${aspectsResponse.status}`
      );
    }

    const planetData = await planetResponse.json();
    const aspectsData = await aspectsResponse.json();

    const combinedData = {
      planets: planetData,
      aspects: aspectsData,
    };

    return NextResponse.json(combinedData, { status: 200 });
  } catch (error) {
    console.error("Astrology API error", error);
    return NextResponse.json(
      { error: "Failed to fetch natal chart." },
      { status: 500 }
    );
  }
}
