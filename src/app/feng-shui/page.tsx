"use client";
import { useState } from "react";
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

export default function Home() {
  const [homeChart, setHomeChart] = useState<Star[][]>([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);
  const [customPeriod, setCustomPeriod] = useState<Boolean>(true);

  const [showPeriod, setShowPeriod] = useState(true);
  const [showYear, setShowYear] = useState(true);
  const [showHomePeriod, setShowHomePeriod] = useState(true);
  const [goals, setGoals] = useState<Boolean[]>([
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
    useState<YearSquares>("2024");

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 lg:p-24 pb-40">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex flex-col space-y-8">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-slate-900 dark:via-slate-900 lg:static lg:size-auto lg:bg-none">
          <p className="dark:text-slate-200">
            Flying Star Feng Shui Calculator by nivaaz 2024
          </p>
        </div>

        <Intro />
        <Container>
          <div>
            <p className="text-lg"> What are your goals?</p>
            <div className="grid grid-cols-3">
              {Array.from(Array(9).keys()).map((_, index) => (
                <label
                  key={index}
                  className="m-0.5 flex items-center space-x-2 p-1 border border-green-300 bg-green-100 rounded-md"
                >
                  <input
                    type="checkbox"
                    value={index + 1}
                    className="rounded-md"
                    onChange={onChangeGoals}
                  />
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
                className="flex space-x-2 p-1 border border-green-300 bg-green-100 rounded-md"
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
                    className="flex items-center space-x-2 p-1 border border-green-300 bg-green-100 rounded-md"
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
                          <p className="absolute text-green-500  pl-1 pt-1">
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
            <h2 className="text-xl "> Your chart</h2>
            <p>
              Here is the combined chart with Period 9, 2024 and the chart of
              your home chart.
            </p>
          </div>
          <div className="py-8 print:hidden">
            <p className="text-xl"> Chat view options </p>

            <button
              className="border border-green-300 bg-green-100 p-2 rounded-lg dark:bg-green-900 dark:text-green-100 m-1"
              onClick={() => {
                setShowYear(!showYear);
              }}
            >
              {showYear ? "Hide" : "Show"} current year{" "}
              {"(" + currentYearSquare + ")"}
            </button>
            <button
              className="border border-green-300 bg-green-100 p-2 rounded-lg dark:bg-green-900 dark:text-green-100 m-1"
              onClick={() => {
                setShowPeriod(!showPeriod);
              }}
            >
              {showPeriod ? "Hide" : "Show"} current period (9)
            </button>
            <button
              className="border border-green-300 bg-green-100 p-2 rounded-lg dark:bg-green-900 dark:text-green-100 m-1"
              onClick={() => {
                setShowHomePeriod(!showHomePeriod);
              }}
            >
              {showHomePeriod ? "Hide" : "Show"} home chart{" "}
            </button>
          </div>

          <div className="grid md:grid-cols-3 w-full">
            {period9.map((row, i) =>
              row.map((_, j) => (
                <div
                  key={i + j}
                  className="p-4 space-y-4 border border-green-200 m-1 rounded-sm"
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
                      chart="current period (9)"
                      star={period9[i][j]}
                    />
                  )}
                  {showYear && (
                    <CurrentElement
                      chart={"current year " + currentYearSquare}
                      star={currentYear[currentYearSquare][i][j]}
                    />
                  )}
                  {showHomePeriod && (
                    <CurrentElement chart="home" star={homeChart[i][j]} />
                  )}
                  <textarea
                    className="w-full dark:bg-slate-800 dark:text-slate-100 py-1 text-slate-900"
                    placeholder="notes"
                  />{" "}
                </div>
              ))
            )}
          </div>
        </Container>
        <Container>
          <div className="print:hidden">
            <p>When you&apos;re happy with your design, print as a pdf.</p>
            <button
              onClick={() => {
                window.print();
              }}
              className="border border-green-300 bg-green-100 p-2 rounded-lg dark:bg-green-900 dark:text-green-100 m-1"
            >
              {" "}
              Save Design{" "}
            </button>
          </div>
        </Container>
      </div>
    </main>
  );
}
