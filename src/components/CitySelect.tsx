"use client";

import React, { useEffect, useMemo, useState } from "react";

export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  timeZone: string;
  population?: number;
  admin1?: string;
};

let citiesCache: City[] | null = null;

const loadCities = async (): Promise<City[]> => {
  if (citiesCache) return citiesCache;

  const mod = await import("@/lib/data/cities.generated.json");
  const data = (mod.default ?? mod) as City[];
  citiesCache = data;
  return data;
};

export type CitySelectProps = {
  label?: string;
  placeholder?: string;
  value?: City | null;
  onChange: (city: City | null) => void;
  id?: string;
  className?: string;
  /**
   * If true (default), cities are loaded lazily when the input is first
   * focused. If false, the cities JSON is loaded as soon as the component
   * mounts on the client.
   */
  loadOnFocus?: boolean;
};

const normalize = (value: string) =>
  value
    // Use NFD + explicit combining-diacritic range instead of
    // Unicode property escapes so this works on older JS targets.
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatCityLabel = (city: City) => {
  if (!city) return "";
  const parts = [city.name];
  if (city.admin1) parts.push(city.admin1);
  if (city.country) parts.push(city.country);
  return parts.join(", ");
};

const matchCities = (query: string, cities: City[] | null): City[] => {
  if (!cities || cities.length === 0) return [];

  const trimmed = query.trim();
  if (!trimmed) return [];

  const q = normalize(trimmed);

  const matches: { city: City; startsWith: boolean }[] = [];

  for (const city of cities) {
    const name = normalize(city.name);
    const country = normalize(city.country);
    const nameCountry = `${name} ${country}`;

    const nameIncludes = name.includes(q);
    const comboIncludes = nameCountry.includes(q);

    if (!nameIncludes && !comboIncludes) continue;

    const startsWith = name.startsWith(q) || nameCountry.startsWith(q);

    matches.push({ city, startsWith });
  }

  matches.sort((a, b) => {
    if (a.startsWith !== b.startsWith) {
      return a.startsWith ? -1 : 1;
    }

    const popA = a.city.population ?? 0;
    const popB = b.city.population ?? 0;

    if (popA !== popB) {
      return popB - popA; // higher population first
    }

    return a.city.name.localeCompare(b.city.name);
  });

  return matches.slice(0, 10).map((m) => m.city);
};

const CitySelect: React.FC<CitySelectProps> = ({
  label,
  placeholder = "Search city...",
  value,
  onChange,
  id,
  className = "",
  loadOnFocus = true,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(
    null
  );
  const [cities, setCities] = useState<City[] | null>(null);

  // Optionally preload cities when the component mounts (non-lazy mode).
  useEffect(() => {
    if (!loadOnFocus && !cities) {
      void loadCities().then(setCities).catch((error) => {
        console.error("Failed to load cities dataset", error);
      });
    }
  }, [loadOnFocus, cities]);

  useEffect(() => {
    if (value) {
      setInputValue(formatCityLabel(value));
    }
  }, [value]);

  const suggestions = useMemo(
    () => matchCities(inputValue, cities),
    [inputValue, cities]
  );

  const showDropdown = isFocused && suggestions.length > 0;

  const handleSelect = (city: City) => {
    setInputValue(formatCityLabel(city));
    setIsFocused(false);
    setHighlightedIndex(null);
    onChange(city);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setInputValue(next);

    if (!next.trim()) {
      onChange(null);
      setHighlightedIndex(null);
      return;
    }

    setHighlightedIndex(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) => {
        if (current === null) return 0;
        return (current + 1) % suggestions.length;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => {
        if (current === null) return suggestions.length - 1;
        return (current - 1 + suggestions.length) % suggestions.length;
      });
    } else if (event.key === "Enter") {
      event.preventDefault();
      const index = highlightedIndex ?? 0;
      const city = suggestions[index];
      if (city) {
        handleSelect(city);
      }
    } else if (event.key === "Escape") {
      setIsFocused(false);
      setHighlightedIndex(null);
    }
  };

  const inputId = id ?? (label ? `${label.replace(/\s+/g, "-").toLowerCase()}-city` : undefined);

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={() => {
          setIsFocused(true);
          if (!cities) {
            void loadCities().then(setCities).catch((error) => {
              console.error("Failed to load cities dataset", error);
            });
          }
        }}
        onBlur={() => {
          // Delay blur handling slightly so click events on suggestions can register
          setTimeout(() => setIsFocused(false), 100);
        }}
        onKeyDown={handleKeyDown}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        autoComplete="off"
      />
      {showDropdown && (
        <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-slate-200 bg-white text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {suggestions.map((city, index) => {
            const isActive = index === highlightedIndex;
            return (
              <li
                key={city.id}
                className={`cursor-pointer px-3 py-2 hover:bg-emerald-50 dark:hover:bg-slate-800 ${
                  isActive ? "bg-emerald-50 dark:bg-slate-800" : ""
                }`}
                onMouseDown={(event) => {
                  // prevent input blur before click
                  event.preventDefault();
                  handleSelect(city);
                }}
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {city.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {[city.admin1, city.country].filter(Boolean).join(", ")}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CitySelect;
