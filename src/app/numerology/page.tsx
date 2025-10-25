"use client";
import { ReactNode, useEffect, useState } from "react";
import {
  areZodiacsCompatible,
  chaldeanNumerologyCalculator,
  getChineseZodiac,
  getLevelsArrayPublic,
} from "./utils";
import { addressFields, levelLabels, NumerologyMeanings } from "./constants";
import Container from "../components/container";
import { FormDataType, Levels, LevelType } from "./types";
import clsx from "clsx";

const Numerology = () => {
  const [formData, setFormData] = useState<FormDataType>({
    streetNumber: "",
    streetName: "",
    buildingNumberAndName: "",
    unitNumber: "",
    postalCode: "",
    homeYear: "",
    bornYear: "",
    bday: "",
    isDirtyForm: false,
  });

  const [levels, setLevels] = useState<LevelType[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
      isDirtyForm: name !== "bday",
    };

    setFormData(newFormData);
    setLevels(getLevelsArrayPublic(newFormData));
  };

  return (
    <div className="w-full flex flex-col p-1 justify-center pb-32">
      <h1 className="text-xl text-center py-8  font-extrabold uppercase">
        Numerology
      </h1>
      <div className="m-auto w-full lg:w-2/3 p-4 space-y-8">
        <Container>
          <Banner>Let&apos;s start with your info</Banner>
          <form className="w-full rounded p-4 dark:text-white  space-y-4">
            <p className="text-center text-sm text-slate-700 dark:text-slate-300">
              Addresses vary between countries & cities, so might have empty
              fields, and that&apos;s ok!
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 m-auto">
              {addressFields.map((element) => {
                return (
                  <InputAddressComponent
                    key={element.currentId}
                    handleChange={handleChange}
                    label={element.label}
                    example={element.example}
                    warning={element?.warning}
                    currentId={element.currentId}
                  />
                );
              })}
            </div>
          </form>

          <div className="m-auto p-4 w-full  space-y-8">
            {!formData.isDirtyForm && (
              <p className="text-xs text-center p-4 opacity-80">
                {" "}
                Start filling in your address to populate
              </p>
            )}
            {levels.map((l: LevelType) => {
              return (
                <Level
                  key={l.value + l.name}
                  level={l.level}
                  description={l.name}
                  inputString={l.value}
                  output={chaldeanNumerologyCalculator(l.value).toString()}
                />
              );
            })}

            {formData.homeYear && (
              <Level
                level="Bonus 1"
                description="Chinese zodiac of Home build year"
                inputString={formData.homeYear.toString()}
                output={getChineseZodiac(Number(formData.homeYear))}
              />
            )}
            {formData.bornYear && (
              <Level
                level="Bonus 2"
                description="Chinese zodiac of birth year"
                inputString={formData.bornYear.toString()}
                output={getChineseZodiac(Number(formData.bornYear))}
              />
            )}
            {formData.bornYear?.length === 4 &&
              formData.homeYear?.length === 4 && (
                <Level
                  level="Bonus 1 & Bonus 2"
                  description="Compatibility between home build year and birth year"
                  inputString={
                    formData.bornYear +
                    " → " +
                    getChineseZodiac(Number(formData.bornYear.substring(0, 4)))
                  }
                  output={areZodiacsCompatible(
                    getChineseZodiac(Number(formData.homeYear)),
                    getChineseZodiac(Number(formData.bornYear.substring(0, 4)))
                  )}
                />
              )}
          </div>
        </Container>
        <hr />
        <Container>
          <Banner> Life Path </Banner>

          <InputAddressComponent
            handleChange={handleChange}
            label="birthday"
            example="DD/MM/YYYY"
            currentId="bday"
            type="date"
          />
          {formData.bday !== "" ? (
            <div className="p-4 space-y-4">
              <Level
                level="Life Path Number"
                description=""
                inputString={formData.bday}
                output={chaldeanNumerologyCalculator(formData.bday).toString()}
              />
              <Level
                level="Personal Year Number"
                description=""
                inputString={formData.bday}
                output={personaYearNumber(formData.bday).toString()}
              />
              <Level
                level="Chinese Zodiac"
                description=""
                inputString={formData.bday}
                output={getChineseZodiac(Number(formData.bday.substring(0, 4)))}
              />
            </div>
          ) : (
            <p className="text-xs text-center p-4 opacity-80">
              {" "}
              Add your birthday to see your lifepath & personal year number{" "}
            </p>
          )}
        </Container>
      </div>
    </div>
  );
};
export default Numerology;

const personaYearNumber = (bday: string) => {
  console.log(bday);
  const x = bday.split("-");
  const year = new Date().getFullYear();
  x[0] = year.toString();
  return chaldeanNumerologyCalculator(x.join("-"));
};

const InputAddressComponent = ({
  handleChange,
  label,
  example,
  warning,
  currentId,
  type = "text",
}: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  example: string;
  warning?: string[];
  currentId: string;
  type?: string;
}) => {
  return (
    <div className="p-4 ">
      <label
        className=" text-xs text-slate-400 absolute bg-white px-1 rounded dark:bg-slate-800 dark:text-white "
        htmlFor={currentId}
      >
        {label}
      </label>
      <input
        className="rounded-md p-2 mt-2 border border-slate-200 dark:text-white dark:bg-slate-900"
        type={type}
        id={currentId}
        name={currentId}
        onChange={handleChange}
      />
      <p className="text-xs opacity-75 text-slate-500 p-0.5"> {example}</p>

      {warning?.map((w) => (
        <p
          key={w}
          className="bg-red-100 dark:bg-red-900 text-xs w-fit px-0.5 m-0.5 rounded"
        >
          {w}
        </p>
      ))}
    </div>
  );
};

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

const Level = ({
  level,
  description,
  inputString,
  output,
}: {
  level: string;
  description: string;
  inputString?: string;
  output: string;
}) => {
  const numerologyMeanings =
    NumerologyMeanings[output as keyof typeof NumerologyMeanings] ?? null;
  const numericOutput = Number(output);
  const badgeClassName = clsx(
    "font-light rounded-md uppercase text-sm mt-4 mb-1 p-1 px-2 w-fit dark:bg-slate-800",
    numerologyMeanings
      ? numerologyBadgeColors[numericOutput] ?? "bg-slate-100"
      : "bg-slate-100"
  );
  const isLevelType = (value: unknown): value is Levels =>
    typeof value === "string" && value in levelLabels;

  const displayLevel = isLevelType(level) ? levelLabels[level] : level;

  console.log(numerologyMeanings);
  return (
    <div className="rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-500 border-slate-300">
      <p className="font-bold text-sm  text-slate-500  dark:text-slate-400 rounded-t-md p-2 border-b border-slate-300 dark:border-slate-500">
        {level} {description} {displayLevel}
      </p>
      <div className="p-2">
        <p>
          {inputString?.toUpperCase()} → {output}{" "}
          <b className={badgeClassName}>{numerologyMeanings?.meaning}</b>
        </p>
        {numerologyMeanings && (
          <>
            <p> {numerologyMeanings?.description}</p>
          </>
        )}
      </div>
    </div>
  );
};

const Banner = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-center text-lg rounded-t-lg p-4  text-slate-900 dark:text-slate-100 font-bold ">
      {children}
    </div>
  );
};
