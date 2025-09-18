import { ReactNode } from "react";

const Banner = ({ children }: { children: ReactNode }) => {
  return (
    <div className="text-center text-lg rounded-t-lg p-4  text-slate-900 dark:text-slate-100 font-bold ">
      {children}
    </div>
  );
};

export default Banner;
