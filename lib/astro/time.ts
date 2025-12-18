import { Temporal } from "@js-temporal/polyfill";
import type { JulianDay } from "./types";

const JD_AT_UNIX_EPOCH = 2440587.5;
const MS_PER_DAY = 86400000;

type BirthDateTimeInput = {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm or HH:mm:ss
  timeZone: string; // IANA, e.g. "America/New_York"
};

const parseDate = (date: string) => {
  const [year, month, day] = date.split("-").map((v) => Number(v));
  if ([year, month, day].some((v) => Number.isNaN(v))) {
    throw new Error(`Invalid date: ${date}`);
  }
  return { year, month, day };
};

const parseTime = (time: string) => {
  const [hour, minute, second = 0] = time.split(":").map((v) => Number(v));
  if ([hour, minute, second].some((v) => Number.isNaN(v))) {
    throw new Error(`Invalid time: ${time}`);
  }
  return { hour, minute, second };
};

/**
 * Convert a local birth date+time in an IANA timezone into a UTC Date.
 * Temporal's default disambiguation is "compatible" (typically desired for civil times).
 */
export const birthLocalToUtcDate = (input: BirthDateTimeInput): Date => {
  const { date, time, timeZone } = input;
  const { year, month, day } = parseDate(date);
  const { hour, minute, second } = parseTime(time);

  const zdt = Temporal.ZonedDateTime.from({
    timeZone,
    year,
    month,
    day,
    hour,
    minute,
    second,
  });

  const instant = zdt.toInstant();
  return new Date(instant.epochMilliseconds);
};

/** Julian Day from a UTC Date. */
export const toJulianDay = (utcDate: Date): JulianDay =>
  utcDate.getTime() / MS_PER_DAY + JD_AT_UNIX_EPOCH;

/** UTC Date from a Julian Day. */
export const fromJulianDay = (jd: JulianDay): Date =>
  new Date((jd - JD_AT_UNIX_EPOCH) * MS_PER_DAY);

/** Convenience: local birth input -> UTC Date -> Julian Day */
export const birthLocalToJulianDay = (input: BirthDateTimeInput): JulianDay =>
  toJulianDay(birthLocalToUtcDate(input));
