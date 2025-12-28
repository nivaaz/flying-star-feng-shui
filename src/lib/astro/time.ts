import { Temporal } from "@js-temporal/polyfill";

export type BirthLocalInput = {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  timeZone: string; // IANA, e.g. "America/New_York"
};

/**
 * Converts a local birth date+time in a given IANA timezone to a JavaScript
 * Date in UTC.
 */
export const birthLocalToUtcDate = ({
  date,
  time,
  timeZone,
}: BirthLocalInput): Date => {
  if (!date || !time || !timeZone) {
    throw new Error("birthLocalToUtcDate: date, time and timeZone are required");
  }

  const [year, month, day] = date.split("-").map((part) => Number(part));
  const [hour, minute] = time.split(":").map((part) => Number(part));

  if ([year, month, day, hour, minute].some((value) => Number.isNaN(value))) {
    throw new Error(
      `birthLocalToUtcDate: invalid date/time. date="${date}", time="${time}"`
    );
  }

  const plain = new Temporal.PlainDateTime(year, month, day, hour, minute, 0, 0, 0);
  const tz = Temporal.TimeZone.from(timeZone);
  const instant = tz.getInstantFor(plain);

  return new Date(Number(instant.epochMilliseconds));
};

/**
 * Converts a UTC Date to Julian Day (UT).
 *
 * Algorithm from Jean Meeus, "Astronomical Algorithms".
 */
export const utcDateToJulianDay = (date: Date): number => {
  const year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1; // 1-12
  const day = date.getUTCDate();

  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  const millisecond = date.getUTCMilliseconds();

  // Fractional day in UT
  const dayFraction =
    (hour + (minute + (second + millisecond / 1000) / 60) / 60) / 24;

  let Y = year;
  let M = month;

  if (M <= 2) {
    Y -= 1;
    M += 12;
  }

  const D = day + dayFraction;

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const jd =
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    D +
    B -
    1524.5;

  return jd;
};
