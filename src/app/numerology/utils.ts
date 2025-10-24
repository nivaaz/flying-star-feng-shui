import { FormDataType, LevelType } from "./types";

// Chaldean mapping of letters to numbers
const chaldeanMapping: { [key: string]: number } = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

export const getLevelsArrayPublic = (formData: FormDataType): LevelType[] => {
  const unit = formData.unitNumber ? { level: 'L1', value: formData.unitNumber, name: 'Unit Number' } : null;

  const building = (formData.buildingNumberAndName) ? { level: 'L2', value: formData.buildingNumberAndName, name: 'Building Name & Number' } : null;

  let L2AddOn = {
    level: 'L2',
    value: (formData.buildingNumberAndName ? formData.streetNumber : formData.streetName + ' ' + formData.streetNumber),
    name: formData.buildingNumberAndName ? 'Building Name & Number' : 'Street Name'
  };

  let L2 = {
    level: 'L2',
    value: L2AddOn.value + ' ' + (building?.value ?? ''),
    name: 'Street Number'
  }

  const combined = unit && L2 ? {
    level: 'L1L2',
    value: `${L2.value} + ${unit.value}`,
    name: `${L2.name} + ${unit.name}`
  } : null;

  const street = formData.streetName
    ? {
      level: 'L3',
      value: [formData.streetName].filter(Boolean).join(' '),
      name: 'Street Name',
    }
    : null;
  const zipcode = formData.postalCode ? { level: 'L4', value: formData.postalCode, name: 'ZipCode' } : null;

  return [unit, L2, combined, street, zipcode].filter(Boolean) as LevelType[];
}


export const getLevelsArray = (formData: FormDataType): LevelType[] => {
  let levelsArray = [];
  if (formData.unitNumber !== "") {
    levelsArray.push({ value: (formData.unitNumber), name: "Unit Number" });
  }
  if (formData.buildingNumberAndName !== "") {
    levelsArray.push({ value: (formData.buildingNumberAndName), name: "Building Name and Number" })
  }
  if (levelsArray.length === 0) {
    if (formData.streetNumber !== "") {
      levelsArray.push({ value: (formData.streetNumber), name: "Street Number" });
    }
    if (formData.streetName !== "") {
      levelsArray.push({ value: (formData.streetName), name: "Street Name" });
    }
  } else if (formData.streetNumber !== "" && formData.streetName !== "") {
    levelsArray.push({ value: (formData.streetNumber + " " + formData.streetName), name: "Street Number & Name" });
  }


  console.log(levelsArray);
  if (levelsArray.length >= 3) {
    return [
      { level: 'L1', ...levelsArray[0] },
      { level: 'L2', ...levelsArray[1] },
      { level: 'L1L2', value: levelsArray[1].value + ' ' + levelsArray[0].value, name: levelsArray[1].name + ' ' + levelsArray[0].name },
      { level: 'L3', ...levelsArray[2] },
    ]
  } else if (levelsArray.length === 2) {
    return [
      { level: 'L1', ...levelsArray[0] },
      { level: 'L2', ...levelsArray[1] },
      { level: 'L1L2', value: levelsArray[1].value + ' ' + levelsArray[0].value, name: levelsArray[1].name + ' ' + levelsArray[0].name },
    ]
  } else {
    return levelsArray.map((level, index) => ({ level: `L${index + 1}`, ...level }));
  }

}

export function chaldeanNumerologyCalculator(inputString: string) {
  if (inputString === '11' || inputString === '22' || inputString === '33') {
    return Number(inputString);
  }
  // Remove all spaces from the input
  let formattedInput = inputString.replace(/\s+/g, '');

  // Calculate the Chaldean number by summing the mapped values
  let total = 0;
  for (let char of formattedInput as string) {
    if (!isNaN(Number(char))) {
      total += Number(char);
    } else {
      total += chaldeanMapping[char.toUpperCase()] || 0;
    }
  }
  if (total === 11 || total === 22 || total === 33) {
    return total;
  }
  return reduceToSingleDigit(total);
}
// Function to reduce the total to a single-digit or 11, 22, or 33 (Master Numbers)
function reduceToSingleDigit(numIn: number) {
  let num = numIn;
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    let sum = 0;
    while (num) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
  }
  return num;
}

const chineseZodiac: Zodiacs[] = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

export function getChineseZodiac(year: number): Zodiacs {
  const index = (year - 4) % 12;
  console.log(year, index, chineseZodiac[index])
  return chineseZodiac[index];
}

export type Zodiacs = 'Ox' | 'Tiger' | 'Rabbit' | 'Dragon' | 'Snake' | 'Horse' | 'Goat' | 'Monkey' | 'Rooster' | 'Dog' | 'Pig' | 'Rat';
const ZodiacMapping = [
  "Ox",
  "Tiger",
  "Rabbit",
  "Dragon",
  "Snake",
  "Horse",
  "Goat",
  "Monkey",
  "Rooster",
  "Dog",
  "Pig",
  "Rat",
]
type ranks = '-' | 'x' | 'd' | '?' | 't' | 'h';

const compatabilityRanking = {
  '-': 'average',
  'x': 'worst',
  'd': 'above average',
  '?': 'good match OR enemy',
  't': 'good match',
  'h': 'perfect match',
}
const IsZodiacCompatible: ranks[][] = [
  ["-", "x", "d", "x", "d", "x", "x", "h", "h", "d", "?", "h"],
  ["x", "x", "-", "h", "x", "h", "t", "x", "d", "d", "h", "-"],
  ["d", "-", "-", "-", "x", "-", "h", "h", "x", "h", "h", "h"],
  ["x", "h", "-", "t", "h", "-", "x", "d", "d", "x", "t", "h"],
  ["d", "x", "x", "h", "x", "t", "x", "t", "h", "-", "x", "t"],
  ["x", "h", "-", "-", "t", "x", "h", "-", "x", "-", "d", "x"],
  ["x", "t", "h", "x", "x", "h", "d", "d", "-", "x", "h", "?"],
  ["h", "x", "h", "d", "t", "-", "d", "t", "-", "d", "x", "h"],
  ["h", "d", "x", "d", "h", "x", "-", "-", "x", "x", "-", "x"],
  ["d", "d", "h", "x", "-", "-", "x", "d", "x", "-", "d", "d"],
  ["?", "h", "h", "t", "x", "d", "h", "x", "-", "d", "t", "d"],
  ["h", "-", "h", "h", "t", "x", "?", "h", "x", "d", "d", "-"]
]
export function areZodiacsCompatible(zodiac1: Zodiacs, zodiac2: Zodiacs): string {
  return compatabilityRanking[IsZodiacCompatible[ZodiacMapping.indexOf(zodiac1)][ZodiacMapping.indexOf(zodiac2)]];
}


export const personalYearNumber = (bday: string) => {
  console.log(bday);
  const x = bday.split("-");
  const year = new Date().getFullYear();
  x[0] = year.toString();
  return chaldeanNumerologyCalculator(x.join("-"));
};

