import clsx from "clsx";
import {
  elementNumberMap,
  getDrainingElement,
  getNourishingElement,
  Star,
} from "./charts";

const CurrentElement = ({ star, chart }: { star: Star; chart: string }) => {
  const el = elementNumberMap[star];
  const nourish = getNourishingElement(el?.element);
  const drain = getDrainingElement(el?.element);
  return (
    <div className="flex flex-col">
      <p className="text-xs rounded-md pb-1"> {chart} </p>
      <div
        className={clsx(
          "text-xs p-4 rounded-md bg-opacity-20 grid grid-flow-col md:grid-cols-3",
          el?.color === "black" && "bg-gray-400",
          el?.color === "jade" && "bg-green-400",
          el?.color === "green" && "bg-green-400",
          el?.color === "yellow" && "bg-yellow-400",
          el?.color === "white" && "bg-slate-200",
          el?.color === "red" && "bg-red-400",
          el?.color === "purple" && "bg-purple-400"
        )}
      >
        <p className="px-1 flex">
          {el?.auspicious ? "⭐️" : "🧂"} {star}
        </p>
        <p className="px-1 flex">
          {" "}
          {el?.element} {el?.elementIcon}{" "}
        </p>
        <p className="px-1 flex"> {el?.color} </p>
        <p
          className={clsx(
            "font-bold",
            nourish === "fire" && "text-yellow-400",
            nourish === "earth" && "text-orange-400",
            nourish === "wood" && "text-green-400",
            nourish === "metal" && "text-gray-400",
            nourish === "water" && "text-blue-400"
          )}
        >
          {el?.auspicious ? "++" : "--"}
          {nourish}
        </p>
        <p
          className={clsx(
            "font-bold",
            drain === "fire" && "text-yellow-400",
            drain === "earth" && "text-orange-400",
            drain === "wood" && "text-green-400",
            drain === "metal" && "text-gray-400",
            drain === "water" && "text-blue-400"
          )}
        >
          {el?.auspicious ? "--" : "++"}
          {drain}
        </p>
      </div>
    </div>
  );
};

export default CurrentElement;
