const InputAddressComponent = ({
  handleChange,
  label,
  example,
  warning,
  currentId,
  type = "text",
  value,
}: {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  example: string;
  warning?: string[];
  currentId: string;
  type?: string;
  value?: string;
}) => {
  return (
    <div className="p-4 ">
      <label
        className=" text-xs text-slate-400 absolute bg-white px-1 rounded dark:bg-slate-800 dark:text-white "
        htmlFor={currentId}
      >
        {label}
      </label>
      <input
        className="rounded-md p-2 mt-2 border border-slate-200 dark:text-white dark:bg-slate-900"
        type={type}
        id={currentId}
        name={currentId}
        value={value}
        onChange={handleChange}
      />
      <p className="text-xs opacity-75 text-slate-500 p-0.5"> {example}</p>

      {warning?.map((w) => (
        <p
          key={w}
          className="bg-red-100 dark:bg-red-900 text-xs w-fit px-0.5 m-0.5 rounded"
        >
          {w}
        </p>
      ))}
    </div>
  );
};

export default InputAddressComponent;
