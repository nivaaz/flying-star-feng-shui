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

export function chaldeanNumerologyCalculator(inputString: string) {

  // Remove all spaces from the input
  let fromattedInput = inputString.replace(/\s+/g, '');

  // Calculate the Chaldean number by summing the mapped values
  let total = 0;
  for (let char of fromattedInput as string) {
    console.log(Number(char), char)
    if (!isNaN(Number(char))) {
      total += Number(char);
    } else {
      total += chaldeanMapping[char.toUpperCase()] || 0;
    }
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

const chineseZodiac = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

export function getChineseZodiac(year: number): string {
  const startYear = 1924; // Starting year of the cycle
  const index = (year - startYear) % 12;
  return chineseZodiac[index];
}

const zodiacCompatibility: { [key: string]: string[] } = {
  Rat: ['Ox', 'Dragon', 'Monkey'],
  Ox: ['Rat', 'Snake', 'Rooster'],
  Tiger: ['Dragon', 'Horse', 'Pig'],
  Rabbit: ['Sheep', 'Monkey', 'Dog', 'Pig'],
  Dragon: ['Rat', 'Tiger', 'Snake'],
  Snake: ['Ox', 'Rooster'],
  Horse: ['Tiger', 'Goat', 'Dog'],
  Goat: ['Rabbit', 'Horse', 'Pig'],
  Monkey: ['Rat', 'Dragon', 'Rabbit'],
  Rooster: ['Ox', 'Snake'],
  Dog: ['Rabbit', 'Tiger', 'Horse'],
  Pig: ['Tiger', 'Rabbit', 'Goat']
};

export function areZodiacsCompatible(zodiac1: string, zodiac2: string): string {
  if (zodiacCompatibility[zodiac1]?.includes(zodiac2)) {
    return 'comptible';
  } else if (zodiacCompatibility[zodiac2]?.includes(zodiac1)) {
    return 'comptible';
  } else if (zodiacCompatibility[zodiac1] && zodiacCompatibility[zodiac2]) {
    return 'not comptible';
  } else {
    return 'unknown';
  }
}
