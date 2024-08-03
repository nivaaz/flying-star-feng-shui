"use client";
import { useState } from "react";
import { currentYear, directions, period9, Star } from "./charts";
import clsx from "clsx";
import Intro from "./intro";
import CurrentElement from "./currentElement";

export default function Home() {
  const [homeChart, setHomeChart] = useState<Star[][]>([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ]);

  const onChangeChartValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [i, j] = e.target.id.split(" ");
    const newChart: Star[][] = [...homeChart];
    const currRow: Star[] = newChart[parseInt(i)];
    currRow[parseInt(j)] = parseInt(e.target.value) as Star;
    setHomeChart(newChart);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 font-mukta">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex flex-col lg:space-y-16">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-slate-900 dark:via-slate-900 lg:static lg:size-auto lg:bg-none">
          <p className="dark:text-slate-200">
            {" "}
            Flying Star Feng Shui Calculator by nivaaz 2024
          </p>
        </div>

        <Intro />

        <div>
          <p> Add the chart for the year you moved into your home </p>
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

        <div>
          <p className="py-8">
            Here is the combined chart with Period 9, 2024 and the chart of your
            home chart.
          </p>
          <div className="grid lg:grid-cols-3 w-full">
            {period9.map((row, i) =>
              row.map((_, j) => (
                <div
                  key={i + j}
                  className={`p-4 space-y-4 border border-gray-300 dark:border-neutral-800 `}
                >
                  <p className="text-center">{directions[i][j]} </p>
                  <CurrentElement chart="period" star={period9[i][j]} />
                  <CurrentElement chart="2024" star={currentYear[i][j]} />
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
