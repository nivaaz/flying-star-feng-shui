"use client";
import { useState } from "react";
import {
  currentYear,
  directions,
  elementNumberMap,
  getDrainingElement,
  getNourishingElement,
  period9,
  Star,
} from "./charts";
import clsx from "clsx";
import Intro from "./intro";

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
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-slate-900 dark:via-slate-900 lg:static lg:size-auto lg:bg-none">
          <p className="dark:text-slate-200">
            {" "}
            Flying Star Feng shui by nivaaz 2024
          </p>
        </div>
        <Intro />

        <div className="mb-32 my-16 space-y-32">
          <div>
            <p> Add the chart for the year you moved into your home </p>
            <div className="w-fit m-auto">
              <div className="grid grid-cols-3">
                {directions.map((row, i) =>
                  row.map((cell, j) => (
                    <label className="p-1 m-0" key={row + cell}>
                      <p className="absolute text-blue-500 pl-1 pt-1">
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
            </div>
          </div>
          <div>
            <p>
              {" "}
              Here is the combined chart with Period 9, 2024 and your home's
              chart.
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
      </div>
    </main>
  );
}

const CurrentElement = ({ star, chart }: { star: Star; chart: string }) => {
  const el = elementNumberMap[star];
  const nourish = getNourishingElement(el?.element);
  const drain = getDrainingElement(el?.element);
  return (
    <div className="flex flex-col">
      <p className="text-xs rounded-md pb-1"> {chart} </p>
      <div
        className={clsx(
          "text-xs p-4 rounded-md bg-opacity-20 grid grid-flow-col md:grid-cols-3",
          el?.color === "black" && "bg-gray-400",
          el?.color === "jade" && "bg-green-400",
          el?.color === "green" && "bg-green-400",
          el?.color === "yellow" && "bg-yellow-400",
          el?.color === "white" && "bg-slate-200",
          el?.color === "red" && "bg-red-400",
          el?.color === "purple" && "bg-purple-400"
        )}
      >
        <p className="px-1 flex">
          {el?.auspicious ? "⭐️": "🧂"} {star}
        </p>
        <p className="px-1 flex">
          {" "}
          {el?.element} {el?.elementIcon}{" "}
        </p>
        <p className="px-1 flex"> {el?.color} </p>
        <p
          className={clsx(
            "font-bold",
            nourish === "fire" && "text-yellow-400",
            nourish === "earth" && "text-orange-400",
            nourish === "wood" && "text-green-400",
            nourish === "metal" && "text-gray-400",
            nourish === "water" && "text-blue-400"
          )}
        >
          {el?.auspicious ? "++" : "--"}{nourish}
        </p>
        <p
          className={clsx(
            "font-bold",
            drain === "fire" && "text-yellow-400",
            drain === "earth" && "text-orange-400",
            drain === "wood" && "text-green-400",
            drain === "metal" && "text-gray-400",
            drain === "water" && "text-blue-400"
          )}
        >
          {el?.auspicious ? "--" : "++"}{drain}
        </p>
      </div>
    </div>
  );
};
