import { ChineseZodiacMeanings } from "../numerology/aw/constants";
import { Level, NumerologyMeanings } from "../numerology/constants";

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
  const normalizedLevel = level.trim();
  const zodiacMeaning =
    ChineseZodiacMeanings[
      normalizedLevel as keyof typeof ChineseZodiacMeanings
    ];
  const meaning = numerologyMeanings ?? zodiacMeaning;
  return (
    <div className="rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-500 border-slate-700">
      <p className="font-bold text-sm  text-slate-500  dark:text-slate-400 rounded-t-md p-2 border-b border-slate-700 dark:border-slate-500">
        {level} {description} {levelLabels[level as Level]}
      </p>
      <div className="p-2">
        <p>
          {inputString?.toUpperCase()} → {output}
        </p>
        {meaning && (
          <>
            <p className="font-light rounded-md uppercase text-sm  mt-4 mb-1 p-1 px-2 bg-slate-100  dark:bg-slate-800 w-fit">
              {" "}
              {meaning.meaning}
            </p>{" "}
            <p> {meaning.description}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Level;
