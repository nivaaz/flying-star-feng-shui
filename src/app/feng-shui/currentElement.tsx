import clsx from "clsx";
import { elementNumberMap } from "./charts";
import { getDrainingElement, getNourishingElement } from "./utils";
import { Star, Element } from "./types";

const ColouredElement = ({
  isAuspicious,
  element,
}: {
  isAuspicious: boolean;
  element: string;
}) => {
  return (
    <p
      className={clsx(
        "text-xs rounded-md p-1 m-auto text-black dark:text-white font-bold border",
        element === Element.fire && "border-yellow-200",
        element === Element.earth && "border-orange-200",
        element === Element.wood && "border-green-200",
        element === Element.metal && "border-gray-200",
        element === Element.water && "border-blue-200"
      )}
    >
      {isAuspicious ? "--" : "++"} {element}
    </p>
  );
};

const CurrentElement = ({
  star,
  chart,
  goal,
}: {
  star: Star;
  chart: string;
  goal: boolean;
}) => {
  const el = elementNumberMap[star];
  const nourish = getNourishingElement(el.element);
  const drain = getDrainingElement(el.element);
  return (
    <div className="flex flex-col">
      <p
        className={clsx([
          "uppercase font-extralight text-xxs text-slate-400 p-0.5 rounded-lg",
          goal && "font-light text-slate-700 px-2 mr-auto bg-slate-200",
          !el?.auspicious &&
            "🧂" &&
            "font-light text-slate-700 dark:text-slate-100 bg-white dark:bg-black px-2 mr-auto",
        ])}
      >
        {goal && "🎯"} {!el?.auspicious && "🧂"} {chart}{" "}
      </p>
      <div
        className={clsx(
          "text-xs lg:p-4 rounded-md bg-opacity-20 grid grid-flow-col md:grid-cols-3 border-l-4",
          el?.color === "black" && " border-gray-400",
          el?.color === "jade" && " border-green-400",
          el?.color === "green" && " border-green-400",
          el?.color === "yellow" && " border-yellow-400",
          el?.color === "white" && " border-slate-200",
          el?.color === "red" && " border-red-400",
          el?.color === "purple" && " border-purple-400"
        )}
      >
        <p className="px-1 flex text-slate-400 text-xxs">
          {el?.auspicious ? "⭐️ " : "🧂 "} {star} <br/> {el?.elementIcon}{" "}
          {el?.element} <br/> {el?.color}
        </p>
        <ColouredElement element={nourish} isAuspicious={!el?.auspicious} />
        <ColouredElement element={drain} isAuspicious={el?.auspicious} />
      </div>
    </div>
  );
};

export default CurrentElement;
