"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface LocationAutocompleteProps {
  value: Location | null;
  onChange: (location: Location | null) => void;
  placeholder?: string;
  label?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  address?: {
    country?: string;
    country_code?: string;
    city?: string;
    town?: string;
    village?: string;
  };
  type?: string;
  class?: string;
}

// Convert country code to flag emoji
function countryCodeToFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Format display name with flag
function formatLocationDisplay(result: NominatimResult): string {
  const countryCode = result.address?.country_code?.toUpperCase() || "";
  const flag = countryCode ? countryCodeToFlag(countryCode) : "";
  const cityName =
    result.address?.city ||
    result.address?.town ||
    result.address?.village ||
    result.display_name.split(",")[0];
  const country = result.address?.country || "";

  if (country) {
    const displayFlag = flag || countryCode;
    return `${displayFlag} ${cityName}, ${country}`;
  }

  return result.display_name;
}

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Enter location",
  label,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value?.name || "");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search locations with debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (inputValue.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Single search query for major cities
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            `q=${encodeURIComponent(inputValue)}` +
            `&format=json` +
            `&limit=10` +
            `&addressdetails=1` +
            `&featuretype=city` +
            `&accept-language=en`,
          {
            headers: {
              "User-Agent": "DandealLogistics/1.0",
            },
          }
        );

        const data = (await response.json()) as NominatimResult[];

        // Filter for city-level results (major cities likely have airports/ports)
        const filteredResults = data
          .filter((result) => {
            // Filter for city-level administrative divisions
            const hasCity =
              result.address?.city ||
              result.address?.town ||
              result.type === "city" ||
              result.type === "administrative" ||
              result.class === "place";
            return hasCity;
          })
          .slice(0, 5);

        setSuggestions(filteredResults);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (!newValue) {
      onChange(null);
    }
  };

  const handleSelectLocation = (suggestion: NominatimResult) => {
    const formattedName = formatLocationDisplay(suggestion);
    const location: Location = {
      name: formattedName,
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    };
    setInputValue(formattedName);
    onChange(location);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <Label className="text-gray-700 text-sm mb-2 block">{label}</Label>
      )}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="border-gray-300 bg-white text-gray-900"
        autoComplete="off"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {isLoading ? (
            <div className="p-3 text-sm text-gray-500">
              Searching locations...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => {
              const countryCode =
                suggestion.address?.country_code?.toUpperCase() || "";
              const flag = countryCode ? countryCodeToFlag(countryCode) : "";
              const cityName =
                suggestion.address?.city ||
                suggestion.address?.town ||
                suggestion.address?.village ||
                suggestion.display_name.split(",")[0];
              const country = suggestion.address?.country || "";

              return (
                <button
                  key={suggestion.place_id}
                  type="button"
                  onClick={() => handleSelectLocation(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-gray-900 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                >
                  <span
                    className="text-lg min-w-[2rem]"
                    role="img"
                    aria-label={country}
                  >
                    {flag || countryCode}
                  </span>
                  <span>
                    {cityName}, {country}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-3 text-sm text-gray-500">No locations found</div>
          )}
        </div>
      )}
    </div>
  );
}
