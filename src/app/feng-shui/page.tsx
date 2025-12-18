"use client";
import { useState, useRef } from "react";
import {
  currentYear,
  directions,
  elementNumberMap,
  loShuSquareByPeriod,
  period9,
} from "./charts";
import Intro from "./intro";
import CurrentElement from "./currentElement";
import Container from "../components/container";
import { Star, YearSquares } from "./types";
import { ElementExamples, generateFengShuiTemplate } from "./utils";
import { crystals, starThemes } from "./constants";
import html2canvas from "html2canvas";
import Image from "next/image";
import { useEffect } from "react";
import Numerology from "../numerology/aw/page";

const periods = [
  "period 9 (2024-2043)",
  "period 8 (2004-2023)",
  "period 7 (1984-2003)",
  "custom",
];

const defaultLoShuSquare: Star[][] = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];
const defaultText: string[][] = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

type FloorPlan = { id: string; name: string; src: string };

const AddTextField = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  return (
    <div>
      {isOpen ? (
        <div>
          <input
            className="dark:bg-slate-700 dark:text-slate-100 text-slate-900 rounded-md p-1 w-full"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="bg-gray-100" onClick={() => setIsOpen(false)}>
            -
          </button>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)}>+</button>
      )}
    </div>
  );
};

export default function Home() {
  const [homeChart, setHomeChart] = useState<Star[][]>(defaultLoShuSquare);
  const [clientName, setClientName] = useState(""); // State for client name
  const [error, setError] = useState(false); // State for error popup
  const pageRef = useRef<HTMLDivElement>(null); // Ref for the page to export
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customPeriod, setCustomPeriod] = useState<boolean>(true);

  useEffect(() => {
    console.log(
      "[floor-plans] file input mounted?",
      Boolean(fileInputRef.current)
    );
  }, []);

  const [showPeriod, setShowPeriod] = useState(false);
  const [showYear, setShowYear] = useState(true);
  const [showHomePeriod, setShowHomePeriod] = useState(true);
  const [goals, setGoals] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [currentYearSquare, setCurrentYearSquare] =
    useState<YearSquares>("2025");

  const [defaultValues, setDefaultValues] = useState<string[][]>(defaultText);
  const [showNumerology, setShowNumerology] = useState(false);
  const [showAstrocartography, setShowAstrocartography] = useState(false);
  const [astroLinks, setAstroLinks] = useState<
    { url: string; label: string }[]
  >([
    { url: "", label: "" },
    { url: "", label: "" },
    { url: "", label: "" },
  ]);

  const generateDefaultText = () => {
    console.log("generateDefaultText");
    const dv: string[][] = defaultText;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        dv[i][j] = generateFengShuiTemplate(
          homeChart[i][j],
          currentYear[currentYearSquare][i][j]
        );
      }
    }
    setDefaultValues(dv);
  };

  const onChangeGoals = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    const newGoals = [...goals];
    newGoals[index] = !newGoals[index];
    setGoals(newGoals);
  };

  const onChangeChartValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [i, j] = e.target.id.split(" ");
    const newChart: Star[][] = [...homeChart];
    const currRow: Star[] = newChart[parseInt(i)];
    currRow[parseInt(j)] = parseInt(e.target.value) as Star;
    setHomeChart(newChart);
  };

  const onSelectPeriod = (e: React.ChangeEvent<HTMLInputElement>) => {
    const periodIndex = e.target.value;
    if (periodIndex === "periodIndex3") {
      setHomeChart(defaultLoShuSquare);
      setCustomPeriod(true);
    } else {
      setCustomPeriod(false);
      const period = parseInt(periodIndex.slice(-1));
      setHomeChart(loShuSquareByPeriod[period]);
    }
  };

  const handleExportPDF = async () => {
    console.log("clocl");
    if (!clientName.trim()) {
      setError(true); // Show error if client name is empty
      return;
    }

    if (pageRef.current) {
      const date = new Date().toISOString().split("T")[0];
      const fileName = `${clientName || "client"}-${date}-fengshui.pdf`;

      const options = {
        margin: 0,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      // Clone the page and inline Tailwind CSS styles
      const clonedPage = pageRef.current.cloneNode(true) as HTMLElement;
      const tailwindStyles = document.querySelector(
        "style[data-tailwind]"
      )?.innerHTML;

      if (tailwindStyles) {
        const styleElement = document.createElement("style");
        styleElement.innerHTML = tailwindStyles;
        clonedPage.prepend(styleElement);
      }
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto"; // Reset height
    target.style.height = target.scrollHeight + "px"; // Set new height
  };

  const handleFiles = async (fileList: FileList | File[] | null) => {
    if (!fileList || !fileList.length) return;
    console.log("[floor-plans] handling files", fileList.length);
    const fileArray = Array.isArray(fileList) ? fileList : Array.from(fileList);
    const readers = fileArray.map(
      (file) =>
        new Promise<FloorPlan>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: `${file.name}-${file.size}-${Date.now()}`,
              name: file.name,
              src: reader.result as string,
            });
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        })
    );
    const loadedPlans = await Promise.all(readers);
  };

  const handleAstroUrlBlur = (idx: number, raw: string) => {
    const value = raw.trim();
    if (!value) {
      const next = [...astroLinks];
      next[idx] = { url: "", label: "" };
      setAstroLinks(next);
      return;
    }
    let href = value;
    if (!/^https?:\/\//i.test(href)) {
      href = `https://${href}`;
    }
    try {
      const u = new URL(href);
      const shortLabel = u.host + (u.pathname !== "/" ? u.pathname : "");
      const next = [...astroLinks];
      next[idx] = { url: u.toString(), label: shortLabel };
      setAstroLinks(next);
    } catch {
      const next = [...astroLinks];
      next[idx] = { url: "", label: "" };
      setAstroLinks(next);
    }
  };

  return (
    <main
      ref={pageRef} // Attach the ref to the main container
      className="flex min-h-screen flex-col items-center justify-between p-4 pb-40"
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex flex-col space-y-8">
        <Intro />
        <Container>
          <div>
            <label htmlFor="clientName" className="block text-lg">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => {
                setClientName(e.target.value);
                setError(false); // Clear error when client name is updated
              }}
              className="p-2 mt-1 block w-full dark:text-slate-200 dark:bg-slate-900 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter client name"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">
                Please enter the client name before saving.
              </p>
            )}
          </div>
          <div className="py-4">
            <label className="block text-lg ">Astrocartography</label>
            <textarea
              id="Astrocartography"
              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:text-slate-200 dark:bg-slate-900"
              placeholder="location"
              rows={1}
              style={{ overflow: "hidden", resize: "none" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>
          <div>
            <p className="text-lg"> What are your goals?</p>
            <div className="grid grid-cols-3">
              {Array.from(Array(9).keys()).map((_, index) => (
                <label
                  key={index}
                  className="m-0.5 flex items-center space-x-2 p-1  hover:bg-white dark:hover:bg-black dark:bg-slate-900 rounded-md"
                >
                  <input
                    type="checkbox"
                    value={index + 1}
                    className="rounded-md min-h-10"
                    onChange={onChangeGoals}
                  />
                  <AddTextField />
                  <p>
                    {"(" + (index + 1) + ") "}
                    {!elementNumberMap[(index + 1) as Star].auspicious &&
                      "reduce "}
                    {elementNumberMap[(index + 1) as Star].theme}
                  </p>
                </label>
              ))}
            </div>
          </div>
        </Container>
        <Container>
          <div>
            <h2 className="text-xl pb-4">Flying Star Charts - your home</h2>
          </div>
          <p className="text-lg">
            {" "}
            What year do you want to create a chart for?
          </p>
          <div className="flex space-x-4">
            {[...Object.keys(currentYear)].map((year) => (
              <label
                className="flex space-x-2 p-1 border  bg-slate-100 dark:bg-slate-900 rounded-md"
                key={year}
              >
                <input
                  type="radio"
                  name="year"
                  value={year}
                  onChange={(e) =>
                    setCurrentYearSquare(e.target.value as YearSquares)
                  }
                  defaultChecked={currentYearSquare === year}
                />
                <span>{year}</span>
              </label>
            ))}
          </div>
          <div className="w-fit">
            <p className="pt-8 text-lg"> When did you move into your home?</p>
            <div>
              <div className="flex justify-center space-x-4">
                {periods.map((period, i) => (
                  <label
                    className="flex items-center space-x-2 p-1 border border-slate-300 bg-slate-100 dark:bg-slate-900 rounded-md"
                    key={period}
                  >
                    <input
                      type="radio"
                      name="periodIndex"
                      value={"periodIndex" + i}
                      onChange={onSelectPeriod}
                      defaultChecked={i === 3}
                    />
                    <span>{period}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="w-fit mr-auto">
              {customPeriod && (
                <>
                  <p className="py-4 text-lg">
                    {" "}
                    Add the period chart for your home
                  </p>
                  <div className="grid grid-cols-3">
                    {directions.map((row, i) =>
                      row.map((cell, j) => (
                        <label className="p-1 m-0" key={row + cell}>
                          <p className="absolute text-slate-500  pl-1 pt-1">
                            {" "}
                            {cell}{" "}
                          </p>{" "}
                          <input
                            id={i + " " + j}
                            pattern="[0-9]*"
                            onChange={onChangeChartValue}
                            type="number"
                            maxLength={1}
                            className="dark:bg-slate-700 dark:text-slate-100 text-center text-xl w-16 h-16 text-slate-900 rounded-md"
                          />
                        </label>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>

        <Container>
          <div>
            <div className="flex justify-between w-full">
              <h2 className="text-xl "> Your chart</h2>
              <button
                className="border rounded-lg px-4 py-2 print:hidden"
                onClick={generateDefaultText}
              >
                {" "}
                Set default values{" "}
              </button>
            </div>
            <p>
              {" "}
              Here is the chart for your home move in period, and selected year.{" "}
            </p>
          </div>
          <div className="py-8 print:hidden">
            <p className="text-lg"> Chat view options </p>
            <button
              className="border  bg-slate-100 p-2 rounded-lg dark:bg-slate-900 dark:text-slate-100 m-1"
              onClick={() => {
                setShowYear(!showYear);
              }}
            >
              {showYear ? "Hide" : "Show"} current year{" "}
              {"(" + currentYearSquare + ")"}
            </button>
            <button
              className="border  bg-slate-100 p-2 rounded-lg dark:bg-slate-900 dark:text-slate-100 m-1"
              onClick={() => {
                setShowPeriod(!showPeriod);
              }}
            >
              {showPeriod ? "Hide" : "Show"} current period (9)
            </button>
            <button
              className="border  bg-slate-100 p-2 rounded-lg dark:bg-slate-900 dark:text-slate-100 m-1"
              onClick={() => {
                setShowHomePeriod(!showHomePeriod);
              }}
            >
              {showHomePeriod ? "Hide" : "Show"} home chart{" "}
            </button>
          </div>

          <div className="grid print:grid-cols-1 md:grid-cols-3 w-full">
            {period9.map((row, i) =>
              row.map((_, j) => (
                <div
                  key={i + j}
                  className="p-4 space-y-4 border dark:border-slate-400 m-1 rounded-sm"
                >
                  <div className="flex space-x-4">
                    <p className="text-center text-xl">{directions[i][j]} </p>
                    <input
                      className="w-full dark:bg-slate-800 dark:text-slate-100 text-center py-1 text-slate-900 "
                      type="text"
                      placeholder="add room name"
                    />{" "}
                  </div>
                  {showPeriod && (
                    <CurrentElement
                      goal={goals[period9[i][j]]}
                      chart="current period (9)"
                      star={period9[i][j]}
                    />
                  )}
                  {showYear && (
                    <CurrentElement
                      goal={goals[currentYear[currentYearSquare][i][j]]}
                      chart={"current year " + currentYearSquare}
                      star={currentYear[currentYearSquare][i][j]}
                    />
                  )}
                  {showHomePeriod && (
                    <CurrentElement
                      goal={goals[homeChart[i][j]]}
                      chart="home"
                      star={homeChart[i][j]}
                    />
                  )}
                  <textarea
                    className="w-full dark:bg-slate-800 dark:text-slate-100 py-1 text-slate-900 p-0.5"
                    placeholder="notes"
                    value={defaultValues[i][j]}
                    onInput={handleTextareaInput} // Adjust height dynamically
                    onChange={(e) => {
                      const newValues = [...defaultValues];
                      newValues[i][j] = e.target.value;
                      setDefaultValues(newValues);
                    }}
                    style={{ overflow: "hidden" }} // Prevent scrollbar
                  />{" "}
                </div>
              ))
            )}
          </div>
        </Container>
        <ElementExampleBlock />
        <StarThemes />
        <Crystals />
        <Cures />
        <Container>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowNumerology((prev) => !prev)}
              className="border border-slate-300 bg-slate-100 p-2 rounded-lg dark:bg-slate-900 dark:text-slate-100"
            >
              {showNumerology ? "Hide numerology" : "Add numerology"}
            </button>
            {showNumerology && (
              <div className="border-t border-slate-200 pt-4">
                <Numerology />
              </div>
            )}
          </div>
        </Container>
        <Container>
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowAstrocartography((prev) => !prev)}
              className="border border-slate-300 bg-slate-100 p-2 rounded-lg dark:bg-slate-900 dark:text-slate-100"
            >
              {showAstrocartography
                ? "Hide astrocartography"
                : "Add astrocartography"}
            </button>
            {showAstrocartography && (
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <h2 className="text-xl font-bold">Astrocartography</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Add up to three locations you&apos;re considering. Use the
                  notes to describe how each place feels in your body, work,
                  relationships, and overall luck.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((slot, idx) => {
                    const link = astroLinks[idx];

                    return (
                      <div
                        key={slot}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-2"
                      >
                        <label className="block text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Location {slot}
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-md border border-slate-200 dark:border-slate-700 p-2 text-sm dark:bg-slate-900 dark:text-slate-100"
                          placeholder="City, Country or region line"
                        />
                        <label className="block text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Location URL
                        </label>
                        <input
                          type="url"
                          className="w-full rounded-md border border-slate-200 dark:border-slate-700 p-2 text-sm dark:bg-slate-900 dark:text-slate-100"
                          placeholder="Paste map / astrocartography URL here"
                          defaultValue={link.url}
                          onBlur={(e) =>
                            handleAstroUrlBlur(idx, e.target.value)
                          }
                        />
                        {link.url && link.label && (
                          <p className="text-xs text-indigo-700 dark:text-indigo-300 break-all">
                            Link:{" "}
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              {link.label}
                            </a>
                          </p>
                        )}
                        <label className="block text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Notes (good / challenging themes)
                        </label>
                        <textarea
                          className="w-full rounded-md border border-slate-200 dark:border-slate-700 p-2 text-sm min-h-[96px] dark:bg-slate-900 dark:text-slate-100"
                          placeholder="E.g. Strong career focus, but relationships feel intense; great for study and solo projects; or feels soft, restful, more family-focused."
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Container>
        <Container>
          <div className="print:hidden">
            <p>When you&apos;re happy with your design, print as a pdf.</p>
            <button
              onClick={() => window.print()}
              className="border border-slate-300 bg-slate-100 p-2 rounded-lg dark:bg-slate-900 dark:text-slate-100 m-1"
            >
              Save Design
            </button>
          </div>
        </Container>
      </div>
    </main>
  );
}

const ElementExample = (element: string, elementTitle: string) => {
  return (
    <div>
      <p className="font-bold"> {elementTitle} </p>
      <p> {element}</p>
    </div>
  );
};
const ElementExampleBlock = () => {
  return (
    <Container>
      <h2 className="font-bold text-lg"> Element Item Examples </h2>
      <div>
        <div>
          <p className="font-black pt-4"> 🔥 Fire </p>
          <p> {ElementExamples.fire}</p>
        </div>
        <div>
          <p className="font-black pt-4"> 🌎 Earth </p>
          <p> {ElementExamples.earth}</p>
        </div>
        <div>
          <p className="font-black pt-4"> 🪙 Metal </p>
          <p> {ElementExamples.metal}</p>
        </div>
        <div>
          <p className="font-black pt-4"> 💧 Water </p>
          <p> {ElementExamples.water}</p>
        </div>
        <div>
          <p className="font-black pt-4"> 🪵 Wood </p>
          <p> {ElementExamples.wood}</p>
        </div>
      </div>
    </Container>
  );
};

const FloorPlanOverlay = ({
  plan,
  index,
}: {
  plan: FloorPlan;
  index: number;
}) => {
  const [gridScale, setGridScale] = useState(1);
  const [gridRotation, setGridRotation] = useState(0);

  const rotateDirection = (direction: string, degrees: number) => {
    if (direction === "C") return direction;
    const compass = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const currentIndex = compass.indexOf(direction);
    if (currentIndex === -1) return direction;

    const steps = Math.round(degrees / 45); // shift in 45° increments
    const normalizedIndex =
      (currentIndex + steps + compass.length) % compass.length;
    return compass[normalizedIndex];
  };

  const onScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setGridScale(next);
  };

  const onRotationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value);
    setGridRotation(next);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg">Floor plan {index + 1}</p>
        <p className="text-xs text-slate-500 truncate">{plan.name}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs text-slate-600 flex items-center space-x-2">
          <span>Grid size</span>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={gridScale}
            onChange={onScaleChange}
            className="w-full"
          />
          <span className="w-12 text-right">{gridScale.toFixed(2)}x</span>
        </label>
        <label className="text-xs text-slate-600 flex items-center space-x-2">
          <span>Rotate</span>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={gridRotation}
            onChange={onRotationChange}
            className="w-full"
          />
          <span className="w-12 text-right">{gridRotation}°</span>
        </label>
      </div>
      <div className="relative border rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={plan.src}
          alt={`Floor plan ${index + 1}`}
          width={1200}
          height={900}
          className="w-full h-auto"
        />
        <div
          className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none"
          style={{
            transform: `scale(${gridScale})`,
            transformOrigin: "center",
          }}
        >
          {directions.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${cell}-${i}-${j}`}
                className="flex items-center justify-center border border-white/70 dark:border-slate-500/70 bg-black/10 text-white font-semibold text-sm"
              >
                {rotateDirection(cell, gridRotation)}
              </div>
            ))
          )}
        </div>
      </div>
      <p className="text-xs text-slate-500">
        Align the grid with the plan&apos;s north arrow; each square shows its
        feng shui direction.
      </p>
    </div>
  );
};

const StarThemes = () => {
  return (
    <Container>
      <h2 className="font-bold text-lg"> Star Themes </h2>
      <div className="grid grid-cols-3 gap-4">
        {starThemes.map((theme) => (
          <div key={theme.starId} className="pb-4">
            <p className="font-bold"> {theme.starId} </p>
            {theme.themes.map((t) => (
              <li className="text-sm pr-2" key={t}>
                {t}
              </li>
            ))}
          </div>
        ))}
      </div>
    </Container>
  );
};

const Crystals = () => {
  const cc = crystals.map((c) => (
    <div key={c.element}>
      <p className="font-bold"> {c.element} </p>
      <p> {c.examples.join(", ")}</p>
    </div>
  ));
  return (
    <Container>
      <h2 className="font-bold text-xl pb-2"> Crystals </h2>
      <div className="grid grid-cols-3 gap-4">{cc}</div>
    </Container>
  );
};

const Cures = () => {
  return (
    <Container>
      <h2 className="font-bold text-xl pb-2">
        {" "}
        Feng Shui Cures (Expert Notes){" "}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed">
        <div>
          <p className="font-bold">🧂 Salt cure (for stubborn sha qi)</p>
          <p>
            Use a glass or ceramic jar. Add one cup coarse sea salt, place six
            clean metal coins on top (imperial side up if available), then fill
            with water to just below the rim. Set the jar on a ceramic saucer in
            the afflicted sector, undisturbed. Do not cap it.
          </p>
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            Link to salt-cure tutorial:{" "}
            <a
              href="https://www.youtube.com/watch?v=l1y7KL-VPc0"
              className="underline"
            >
              https://www.youtube.com/watch?v=l1y7KL-VPc0
            </a>
          </p>
        </div>
        <div>
          <p className="font-bold">💧 Water element cure</p>
          <p>
            Place mirrors, glass, actual water e.g. water bottle/jug of water.
            Water or ocean imagery. Blue items or fluids shapes.
          </p>
        </div>
        <div>
          <p className="font-bold">⚙️ Metal cure</p>
          <p>
            Favor dense, heavy metal: solid brass, iron, or steel weights; a
            substantial bell or singing bowl; or a compact metal statue (no
            sharp edges). One anchored piece is stronger than many trinkets. A
            large weight or scultpure made of metal is best.
          </p>
          <p className="text-xs text-indigo-700 dark:text-indigo-300">
            Recommended feng shui coins (can be found on amazon). Super small &
            thin coins approx 2 cm/ 0.8 inch, thickness is 0.8 mm/ 0.03 inch.
            <a
              href="https://www.amazon.com/Boao-Pieces-Chinese-Fortune-I-Ching/dp/B07JHJX5YD/ref=sr_1_9?crid=MIPWN0J22WAU&dib=eyJ2IjoiMSJ9.XbmSAFFF-8gTKEUZZoVrQ3cgnUnbVavALklNH7RkFhfnUGa-j-qG-7K6PwXizIxRG23cMqramwq4SmE9xbAaLoG1tkjDBYecbJqCCKNRZU6i9CJiZaRm0jge6z90CYxeTrOglAm_sZRx9-ks_t_mdJ8OdYW3LkxWg2_H6mUH1_aZBywv8NWfUfXl8bHGapmeEuVmhzGwI_3FZG8FXxyikKuHD46QuVK0LCXbRZy6TLdraV3sxJJJ5H58uYQHxWE4IIRAtBmDhrHWjCvn6775ZhdCL0ByaCic_NEAhwEYPdA.gLupYAPJ8fF45_WruEyKpyr0kUZWis4Hux2TJzd30jQ&dib_tag=se&keywords=feng%2Bshui%2Bcoins&qid=1765191512&sprefix=feng%2Bshui%2Bcoi%2Caps%2C478&sr=8-9&th=1"
              className="underline"
            >
              amazon link
            </a>
          </p>
        </div>
        <div>
          <p className="font-bold"> 🔥 Fire cure</p>
          <p>
            Lots of candles, a large light, or heat source is ideal. Lots of
            yellow/red/purple colours or triangular shapes.
          </p>
        </div>
      </div>
    </Container>
  );
};
