import clsx from "clsx";
import {
  elementNumberMap,
  getDrainingElement,
  getNourishingElement,
  Star,
} from "./charts";

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
        "text-xs rounded-md p-1 border-2 m-auto",
        element === "fire" && "border-yellow-200",
        element === "earth" && "border-orange-200",
        element === "wood" && "border-green-200",
        element === "metal" && "border-gray-200",
        element === "water" && "border-blue-200"
      )}
    >
      {isAuspicious ? "--" : "++"} {element}
    </p>
  );
};

const CurrentElement = ({ star, chart }: { star: Star; chart: string }) => {
  const el = elementNumberMap[star];
  const nourish = getNourishingElement(el?.element);
  const drain = getDrainingElement(el?.element);
  return (
    <div className="flex flex-col">
      <p className="text-xs rounded-md pb-1 text-slate-500"> {chart} </p>
      <div
        className={clsx(
          "text-xs p-4 rounded-md bg-opacity-20 grid grid-flow-col md:grid-cols-3 border-l-4",
          el?.color === "black" && " border-gray-400",
          el?.color === "jade" && " border-green-400",
          el?.color === "green" && " border-green-400",
          el?.color === "yellow" && " border-yellow-400",
          el?.color === "white" && " border-slate-200",
          el?.color === "red" && " border-red-400",
          el?.color === "purple" && " border-purple-400"
        )}
      >
        <div>
          <p className="px-1 flex">
            {star}
            {el?.auspicious ? "⭐️" : "🧂"}
          </p>
          <p className="px-1 flex">
            {el?.element} {el?.elementIcon}{" "}
          </p>
          <p className="px-1 flex"> {el?.color} </p>
        </div>
        <ColouredElement element={nourish} isAuspicious={!el?.auspicious} />
        <ColouredElement element={drain} isAuspicious={el?.auspicious} />
      </div>
    </div>
  );
};

export default CurrentElement;
