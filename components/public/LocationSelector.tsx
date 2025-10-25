"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { searchCountries, getCountryByCode, type CountryData, type AirportOrPort } from "@/lib/airportsAndPorts";

interface Location {
  name: string;
  lat: number;
  lng: number;
  code?: string;
  type?: "airport" | "port";
}

interface LocationSelectorProps {
  value: Location | null;
  onChange: (location: Location | null) => void;
  placeholder?: string;
  label?: string;
}

export default function LocationSelector({
  value,
  onChange,
  placeholder = "City, terminal, zip code etc.",
  label,
}: LocationSelectorProps) {
  const [inputValue, setInputValue] = useState(value?.name || "");
  const [step, setStep] = useState<"country" | "location">("country");
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [countrySearchResults, setCountrySearchResults] = useState<CountryData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySearch = (query: string) => {
    setInputValue(query);
    if (query.length > 0) {
      const results = searchCountries(query);
      setCountrySearchResults(results);
      setShowDropdown(true);
    } else {
      setCountrySearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectCountry = (country: CountryData) => {
    setSelectedCountry(country);
    setInputValue(country.name);
    setStep("location");
    setShowDropdown(false);
    setCountrySearchResults([]);
  };

  const handleSelectLocation = (location: AirportOrPort) => {
    const fullName = `${location.name}, ${selectedCountry?.name}`;
    const newLocation: Location = {
      name: fullName,
      lat: 0, // These would need to be fetched from a geocoding API
      lng: 0,
      code: location.code,
      type: location.type,
    };
    setInputValue(fullName);
    onChange(newLocation);
    setShowDropdown(false);
  };

  const handleBackToCountry = () => {
    setStep("country");
    setSelectedCountry(null);
    setInputValue("");
    setCountrySearchResults([]);
  };

  const handleClear = () => {
    setInputValue("");
    setStep("country");
    setSelectedCountry(null);
    onChange(null);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label && <Label className="text-gray-700 text-sm mb-2 block">{label}</Label>}

      <div className="relative">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => {
            if (step === "country") {
              handleCountrySearch(e.target.value);
            }
          }}
          onFocus={() => {
            if (step === "country" && inputValue.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          className="border-gray-300 bg-white text-gray-900"
          autoComplete="off"
        />
      </div>

      {/* Dropdown */}
      {showDropdown && step === "country" && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {countrySearchResults.length > 0 ? (
            countrySearchResults.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelectCountry(country)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-gray-900 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
              >
                <span className="text-lg">{country.flag}</span>
                <div>
                  <div className="font-medium">{country.name}</div>
                  <div className="text-xs text-gray-500">{country.code}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500">No countries found</div>
          )}
        </div>
      )}

      {/* Locations List (after country selection) */}
      {step === "location" && selectedCountry && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-2">
            <button
              type="button"
              onClick={handleBackToCountry}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to countries
            </button>
          </div>
          {selectedCountry.locations.map((location) => (
            <button
              key={location.code}
              type="button"
              onClick={() => handleSelectLocation(location)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-gray-900 border-b border-gray-100 last:border-b-0 flex items-center gap-2"
            >
              <span className="text-lg">
                {location.type === "airport" ? "✈️" : "⚓"}
              </span>
              <div>
                <div className="font-medium">{location.name}</div>
                <div className="text-xs text-gray-500">
                  {location.city} • {location.code}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

