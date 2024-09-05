"use client";
import { useState } from "react";
import { currentYear, directions, period9, Star } from "./charts";
import Intro from "./intro";
import CurrentElement from "./currentElement";

export default function Home() {
  const [homeChart, setHomeChart] = useState<Star[][]>([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);

  const [showPeriod, setShowPeriod] = useState(true);
  const [showYear, setShowYear] = useState(true);

  const onChangeChartValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [i, j] = e.target.id.split(" ");
    const newChart: Star[][] = [...homeChart];
    const currRow: Star[] = newChart[parseInt(i)];
    currRow[parseInt(j)] = parseInt(e.target.value) as Star;
    setHomeChart(newChart);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex flex-col space-y-8">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-slate-900 dark:via-slate-900 lg:static lg:size-auto lg:bg-none">
          <p className="dark:text-slate-200">
            Flying Star Feng Shui Calculator by nivaaz 2024
          </p>
        </div>

        <Intro />

        <div className="flex flex-col md:flex-row w-full bg-slate-50 p-8 rounded-xl">
          <div>
            <h2 className="text-lg">Flying Star Charts - your home</h2>
            <p> Add the chart for the year you moved into your home </p>
          </div>
          <div className="w-fit m-auto">
            <div className="grid grid-cols-3">
              {directions.map((row, i) =>
                row.map((cell, j) => (
                  <label className="p-1 m-0" key={row + cell}>
                    <p className="absolute text-blue-500 pl-1 pt-1"> {cell} </p>{" "}
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
          </div>
        </div>

        <div className="bg-slate-50 p-8 w-full">
          <div>
            <h2 className="text-xl "> Your chart</h2>
            <p>
              Here is the combined chart with Period 9, 2024 and the chart of
              your home chart.
            </p>
          </div>
          <div className="py-8">
            <p className="text-lg"> Chat view options </p>
            <button
              className="border bg-slate-100 p-2 rounded-lg"
              onClick={() => {
                setShowYear(!showYear);
              }}
            >
              {showYear ? "Show" : "Hide"} current year
            </button>
            <button
              className="border bg-slate-100 p-2 rounded-lg"
              onClick={() => {
                setShowPeriod(!showPeriod);
              }}
            >
              {showPeriod ? "Show" : "Hide"} current period{" "}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 w-full">
            {period9.map((row, i) =>
              row.map((_, j) => (
                <div
                  key={i + j}
                  className="p-4 space-y-4 border border-slate-200 m-1 rounded-sm"
                >
                  <p className="text-center text-lg">{directions[i][j]} </p>
                  {showPeriod && (
                    <CurrentElement
                      chart="current period (9)"
                      star={period9[i][j]}
                    />
                  )}
                  {showYear && (
                    <CurrentElement
                      chart="current year (2024)"
                      star={currentYear[i][j]}
                    />
                  )}
                  <CurrentElement chart="home" star={homeChart[i][j]} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
