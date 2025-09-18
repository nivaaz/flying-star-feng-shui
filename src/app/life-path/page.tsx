"use client";
import { useState } from "react";
import Banner from "../components/banner";
import Container from "../components/container";
import InputAddressComponent from "../components/inputComponent";
import {
  chaldeanNumerologyCalculator,
  getChineseZodiac,
  personalYearNumber,
} from "../numerology/utils";
import Level from "../components/level";

const LifePath = () => {
  const [formData, setFormData] = useState({
    bday: "",
    isDirtyForm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
      isDirtyForm: name !== "bday",
    };

    setFormData(newFormData);
  };
  return (
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
            inputString={formatPersonalYearNumber(formData.bday)}
            output={personalYearNumber(formData.bday).toString()}
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
  );
};
export default LifePath;

// change the year of the bday to the current year 
const formatPersonalYearNumber = (bday: string): string => {
  const currentYear = new Date().getFullYear();

  return `${currentYear}${bday.substring(5, 10)}`;
}
