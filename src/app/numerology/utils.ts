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
  const L1 = formData.unitNumber ? { level: 'L1', value: formData.unitNumber, name: '' } : null;

  let L2 = {
    level: 'L2',
    value: formData.streetName,
    name: ''
  }

  const combined = L1 && L2 ? {
    level: 'L3',
    value: `${L2.value} + ${L1.value}`,
    name: `(L2 + L1)`
  } : null;

  const zipcode = formData.postalCode ? { level: 'L4', value: formData.postalCode, name: 'ZipCode' } : null;

  return [L1, L2, combined, zipcode].filter(Boolean) as LevelType[];
}


export const getLevelsArray = (formData: FormDataType): LevelType[] => {
  const levelsArray: Array<{ value: string; name: string }> = [];

  const L1 = formData.unitNumber
    ? { value: formData.unitNumber, name: "Unit Number" }
    : null;
  const L2A = formData.buildingNumberAndName
    ? { value: formData.buildingNumberAndName, name: "Building/House Name and Number" }
    : null;
  const L2B = formData.streetNumber
    ? { value: formData.streetNumber, name: "House Number" }
    : null;
  const L3 = formData.streetName
    ? { value: formData.streetName, name: "Street Name" }
    : null;
  const L4 = formData.postalCode
    ? { value: formData.postalCode, name: "Postal Code" }
    : null;

  if (L1?.value) levelsArray.push(L1);
  if (L2A?.value) levelsArray.push(L2A);
  if (L2B?.value) levelsArray.push(L2B);
  if (L3?.value) levelsArray.push(L3);
  if (L4?.value) levelsArray.push(L4);

  let unconsciousValue: string[] | null = null;
  if (L1?.value && L2A?.value && L2B?.value && L3?.value) {
    unconsciousValue = [L1.value, L2A.value, L2B.value, L3.value];
  } else if (L1?.value && L2A?.value) {
    unconsciousValue = [L1.value, L2A.value];
  } else if (L1?.value && L2B?.value && L3?.value) {
    unconsciousValue = [L1.value, L2B.value, L3.value];
  } else if (L1?.value && L2B?.value) {
    unconsciousValue = [L1.value, L2B.value];
  } else if (L2B?.value && L3?.value) {
    unconsciousValue = [L2B.value, L3.value];
  }

  if (unconsciousValue) {
    const unconsciousLabel = unconsciousValue.join(" + ");
    levelsArray.push({
      value: unconsciousLabel,
      name: "Level",
    });
  }

  console.log(levelsArray);
  return levelsArray.map((level, index) => ({ level: `L${index + 1} `, ...level }));
};

const isMasterNumber = (value: number | string) =>
  value === 11 || value === 22 || value === 33;


// Calculate the Chaldean number by summing the mapped values
const findNumerology = (inputString: string): number => {
  if (inputString === '11' || inputString === '22' || inputString === '33') {
    return Number(inputString);
  }

  let total = 0;
  for (let char of inputString as string) {
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

// takes in an array of strings 
export function chaldeanNumerologyCalculator(inputStrings: string[]): number {
  console.log("inputStrings", inputStrings)


  const output = inputStrings?.reduce((acc, curr): number => {
    const currentString = curr.split(" "); // split by spaces 
    console.log("currentString", currentString)
    const currNumerology = currentString.reduce((p, c) => findNumerology(c) + p, 0)
    console.log("currNumerology", currNumerology)

    return findNumerology(String(acc + currNumerology))
  }, 0)

  console.log(output)
  console.log(inputStrings)
  return output;
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
  return chaldeanNumerologyCalculator([x.join("-")]);
};
