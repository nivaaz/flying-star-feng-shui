"use client";
import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
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
  const [customPeriod, setCustomPeriod] = useState<boolean>(true);

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

      html2pdf().set(options).from(clonedPage).save();
    }
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "auto"; // Reset height
    target.style.height = target.scrollHeight + "px"; // Set new height
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
                className="border rounded-lg px-4 py-2"
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
        <Container>
          <div className="print:hidden">
            <p>When you&apos;re happy with your design, print as a pdf.</p>
            <button
              onClick={handleExportPDF} // Modified to export the current page
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

const StarThemes = () => {
  return (
    <Container>
      <h2 className="font-bold text-lg"> Star Themes </h2>
      <div className="grid grid-cols-3 gap-2">
        {starThemes.map((theme) => (
          <div key={theme.starId} className="pb-4">
            <p className="font-bold"> {theme.starId} </p>
            {theme.themes.map((t) => (
              <li className="text-sm" key={t}>
                {" "}
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
