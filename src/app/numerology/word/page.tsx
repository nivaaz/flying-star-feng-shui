"use client";
import { ReactNode, useMemo, useState } from "react";
import clsx from "clsx";
import Container from "../../components/container";
import { chaldeanNumerologyCalculator } from "../utils";
import { NumerologyMeanings } from "../constants";

const numerologyBadgeColors: Record<number, string> = {
  1: "bg-indigo-100",
  2: "bg-emerald-100",
  3: "bg-amber-100",
  4: "bg-lime-100",
  5: "bg-green-100",
  6: "bg-orange-100",
  7: "bg-sky-100",
  8: "bg-blue-100",
  9: "bg-red-100",
  11: "bg-purple-100",
  22: "bg-pink-100",
  33: "bg-rose-100",
};

const WordNumerology = () => {
  const [inputValue, setInputValue] = useState("");
  const result = useMemo(() => {
    const trimmed = inputValue.trim();
    return trimmed ? chaldeanNumerologyCalculator([trimmed]) : null;
  }, [inputValue]);

  const resultKey = result?.toString() ?? "";
  const numerologyMeaning =
    resultKey &&
    (
      NumerologyMeanings as Record<
        string,
        (typeof NumerologyMeanings)[keyof typeof NumerologyMeanings]
      >
    )[resultKey]
      ? (
          NumerologyMeanings as Record<
            string,
            (typeof NumerologyMeanings)[keyof typeof NumerologyMeanings]
          >
        )[resultKey]
      : null;

  const badgeClassName = clsx(
    "font-light rounded-md uppercase text-sm mt-4 mb-1 p-1 px-2 w-fit dark:bg-slate-800",
    result !== null
      ? numerologyBadgeColors[result] ?? "bg-slate-100"
      : "bg-slate-100"
  );

  return (
    <div className="w-full flex flex-col p-1 justify-center pb-32">
      <h1 className="text-xl text-center py-8 font-extrabold uppercase">
        Word Numerology
      </h1>
      <div className="m-auto w-full lg:w-2/3 p-4 space-y-8">
        <Container>
          <Banner>Find the Chaldean number</Banner>
          <form className="w-full rounded p-4 dark:text-white space-y-4">
            <InputWord value={inputValue} onChange={setInputValue} />
          </form>
          {inputValue.trim() ? (
            <div className="rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-500 border-slate-700 p-4 space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {inputValue.toUpperCase()} → {resultKey}
              </p>
              <b className={badgeClassName}>
                {numerologyMeaning?.meaning ?? "Numerology Result"}
              </b>
              {numerologyMeaning?.description && (
                <p className="text-slate-700 dark:text-slate-200 text-sm">
                  {numerologyMeaning.description}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-center p-4 opacity-80">
              Enter a word or number to calculate its Chaldean value.
            </p>
          )}
        </Container>
      </div>
    </div>
  );
};

export default WordNumerology;

const InputWord = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) => (
  <div className="p-4">
    <label className="text-xs text-slate-400 absolute bg-white px-1 rounded dark:bg-slate-800 dark:text-white">
      Word or Number
    </label>
    <input
      className="rounded-md p-2 mt-2 border border-slate-200 dark:text-white dark:bg-slate-900 w-full"
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Type here"
    />
  </div>
);

const Banner = ({ children }: { children: ReactNode }) => (
  <div className="text-center text-lg rounded-t-lg p-4 text-slate-900 dark:text-slate-100 font-bold">
    {children}
  </div>
);
