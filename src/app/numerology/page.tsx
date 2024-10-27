"use client";
import { ReactNode, useState } from "react";
import {
  areZodiacsCompatible,
  chaldeanNumerologyCalculator,
  getChineseZodiac,
} from "./utils";
import { addressFields, NumerologyMeanings } from "./constants";
import Container from "../components/container";

const Numerology = () => {
  const [formData, setFormData] = useState({
    streetNumber: "",
    unitNumber: "",
    streetName: "",
    postalCode: "",
    homeYear: "",
    bornYear: "",
    bday: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="w-full flex flex-col p-1 justify-center">
      <h1 className="text-xl text-center py-8  font-extrabold uppercase">
        Numerology
      </h1>
      <div className="m-auto w-full lg:w-2/3 p-4 space-y-8">
        <Container>
          <Banner>Let&apos;s start with your info</Banner>
          <form
            className="w-full  rounded p-4 dark:text-white dark:bg-slate-900 space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="grid sm:grid-cols-2 md:grid-cols-3">
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
        </Container>
        <Container>
          <Banner>
            <p> Your real estate numerology</p>{" "}
          </Banner>
          <p className="text-xs text-center p-4 opacity-80">
            {" "}
            Start filling in your address to populate
          </p>
          <div className="m-auto p-4 w-full  dark:bg-slate-800 rounded space-y-8">
            {formData.unitNumber && (
              <Level
                level="L0"
                description="Unit"
                inputString={formData.unitNumber}
                output={chaldeanNumerologyCalculator(
                  formData.unitNumber
                ).toString()}
              />
            )}
            {formData.streetNumber && (
              <Level
                level="L1"
                description="Street Number"
                inputString={formData.streetNumber}
                output={chaldeanNumerologyCalculator(
                  formData.streetNumber
                ).toString()}
              />
            )}
            {formData.streetName && (
              <Level
                level="L1 + L2"
                description="Street Name + Street Number"
                inputString={
                  formData.streetNumber + " & " + formData.unitNumber
                }
                output={chaldeanNumerologyCalculator(
                  formData.unitNumber + formData.streetNumber
                ).toString()}
              />
            )}
            {formData.streetName && (
              <Level
                level="L3"
                description="Street Name"
                inputString={formData.streetName}
                output={chaldeanNumerologyCalculator(
                  formData.streetName
                ).toString()}
              />
            )}
            {formData.postalCode && (
              <Level
                level="L3"
                description="Post Code"
                inputString={formData.postalCode}
                output={chaldeanNumerologyCalculator(
                  formData.postalCode
                ).toString()}
              />
            )}
            {formData.homeYear && (
              <Level
                level="L4"
                description=" Home build year vs your birth year"
                inputString={formData.homeYear.toString()}
                output={getChineseZodiac(Number(formData.homeYear))}
              />
            )}
            {formData.bornYear && formData.homeYear && (
              <Level
                level="L4"
                description="Compatibility between home build year and birth year"
                inputString={
                  formData.bornYear +
                  " " +
                  getChineseZodiac(Number(formData.bornYear))
                }
                output={areZodiacsCompatible(
                  getChineseZodiac(Number(formData.homeYear)),
                  getChineseZodiac(Number(formData.bornYear))
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
            example=""
            currentId="bday"
            type="date"
          />
          <Level
            level="personal numerology"
            description=""
            inputString={formData.bday}
            output={chaldeanNumerologyCalculator(formData.bday).toString()}
          />
        </Container>
      </div>
    </div>
  );
};
export default Numerology;

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
  warning?: string;
  currentId: string;
  type?: string;
}) => {
  return (
    <div className="p-4">
      <label
        className="text-xs absolute bg-white px-1 rounded dark:bg-slate-900 dark:text-white "
        htmlFor={currentId}
      >
        {label}
      </label>
      <input
        className="rounded-md p-2 mt-2 border border-yellow-200 dark:text-white dark:bg-slate-900"
        type={type}
        id={currentId}
        name={currentId}
        onChange={handleChange}
      />
      <p className="text-xs"> {example}</p>
      <p className="bg-red-100 text-xs w-fit px-0.5 m-0.5 rounded">
        {" "}
        {warning}
      </p>
    </div>
  );
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
  const numberOutput = Number(output);
  const isOutputCharacter = isNaN(numberOutput);
  const numerologyMeanings =
    NumerologyMeanings[output as keyof typeof NumerologyMeanings] ?? null;
  return (
    <div className="border border-yellow-50 dark:border-yellow-950">
      <p className="font-bold text-sm bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100 text-yellow-700 rounded-t-md p-2">
        {level} {description}
      </p>
      <div className="p-2">
        <p>
          {inputString?.toUpperCase()} → {output}
        </p>
        {numerologyMeanings && (
          <>
            <p> {numerologyMeanings?.meaning}</p>{" "}
            <p> {numerologyMeanings?.description}</p>
          </>
        )}
      </div>
    </div>
  );
};

const Banner = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-center bg-yellow-50 rounded-t-lg p-4 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-bold">
      {children}
    </div>
  );
};
