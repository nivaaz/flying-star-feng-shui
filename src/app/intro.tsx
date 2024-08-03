const Intro = () => {
  return (
    <div className="bg-slate-200 dark:bg-slate-800 dark:text-slate-100 text-slate-900 p-4 md:p-8 rounded-xl">
      <h1 className="text-xl py-4"> Flying Star Feng Shui By Nivaaz 📍 </h1>
      <p className="font-bold py-4"> You'll need:</p>
      <ol className="pl-8 list-decimal">
        <li>
          The date you moved into your home & flying star chart for the same
          year
        </li>
        <li> A floor plan of your home and which direction is North </li>
      </ol>
      <p className="font-bold py-4"> How to use this page</p>
      <ol className="pl-8 list-decimal">
        <li>Fill in the flying star numbers for your home below</li>
        <li>
          {" "}
          Your chart elements + elements for the current period and year will be
          populated.{" "}
        </li>
        <li> Auspicious stars will be marked with a ⭐️ </li>
        <li> Inspicious stars will be marked with a 🧂 </li>
        <li> Add salt cures to any rooms with inauspcious stars 🧂 </li>
      </ol>
    </div>
  );
};
export default Intro;
