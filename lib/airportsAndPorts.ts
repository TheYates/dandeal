// Airports and Ports data for major countries
export interface AirportOrPort {
  name: string;
  code: string;
  type: "airport" | "port";
  city: string;
}

export interface CountryData {
  name: string;
  code: string;
  flag: string;
  locations: AirportOrPort[];
}

export const countriesData: CountryData[] = [
  {
    name: "Nigeria",
    code: "NG",
    flag: "🇳🇬",
    locations: [
      { name: "Apapa", code: "APAPA", type: "port", city: "Lagos" },
      { name: "Tincan", code: "TINCAN", type: "port", city: "Lagos" },
      { name: "Onne", code: "ONNE", type: "port", city: "Port Harcourt" },
      { name: "Lagos", code: "LAGOS", type: "port", city: "Lagos" },
      { name: "Murtala Muhammed International Airport", code: "LOS", type: "airport", city: "Lagos" },
      { name: "Nnamdi Azikiwe International Airport", code: "ABV", type: "airport", city: "Abuja" },
    ],
  },
  {
    name: "Ghana",
    code: "GH",
    flag: "🇬🇭",
    locations: [
      { name: "Tema Port", code: "TEMA", type: "port", city: "Tema" },
      { name: "Takoradi Port", code: "TAKORADI", type: "port", city: "Takoradi" },
      { name: "Kotoka International Airport", code: "ACC", type: "airport", city: "Accra" },
      { name: "Kumasi Airport", code: "KMS", type: "airport", city: "Kumasi" },
    ],
  },
  {
    name: "Niger",
    code: "NE",
    flag: "🇳🇪",
    locations: [
      { name: "Niamey Airport", code: "NIM", type: "airport", city: "Niamey" },
    ],
  },
  {
    name: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    locations: [
      { name: "Port of Santos", code: "SANTOS", type: "port", city: "Santos" },
      { name: "Port of Rio de Janeiro", code: "RIOJ", type: "port", city: "Rio de Janeiro" },
      { name: "São Paulo/Guarulhos International Airport", code: "GRU", type: "airport", city: "São Paulo" },
      { name: "Rio de Janeiro International Airport", code: "GIG", type: "airport", city: "Rio de Janeiro" },
    ],
  },
  {
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    locations: [
      { name: "Port of Mumbai", code: "MUMBAI", type: "port", city: "Mumbai" },
      { name: "Port of Chennai", code: "CHENNAI", type: "port", city: "Chennai" },
      { name: "Indira Gandhi International Airport", code: "DEL", type: "airport", city: "Delhi" },
      { name: "Bombay High International Airport", code: "BOM", type: "airport", city: "Mumbai" },
    ],
  },
  {
    name: "Tanzania",
    code: "TZ",
    flag: "🇹🇿",
    locations: [
      { name: "Port of Dar es Salaam", code: "DARES", type: "port", city: "Dar es Salaam" },
      { name: "Julius Nyerere International Airport", code: "DAR", type: "airport", city: "Dar es Salaam" },
    ],
  },
  {
    name: "Mali",
    code: "ML",
    flag: "🇲🇱",
    locations: [
      { name: "Bamako-Sénou International Airport", code: "BKO", type: "airport", city: "Bamako" },
    ],
  },
  {
    name: "Burkina Faso",
    code: "BF",
    flag: "🇧🇫",
    locations: [
      { name: "Ouagadougou Airport", code: "OUA", type: "airport", city: "Ouagadougou" },
    ],
  },
  {
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    locations: [
      { name: "Port of Shanghai", code: "SHANGHAI", type: "port", city: "Shanghai" },
      { name: "Port of Shenzhen", code: "SHENZHEN", type: "port", city: "Shenzhen" },
      { name: "Shanghai Pudong International Airport", code: "PVG", type: "airport", city: "Shanghai" },
      { name: "Guangzhou Baiyun International Airport", code: "CAN", type: "airport", city: "Guangzhou" },
    ],
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    flag: "🇦🇪",
    locations: [
      { name: "Port of Dubai", code: "DUBAI", type: "port", city: "Dubai" },
      { name: "Port of Jebel Ali", code: "JEBALI", type: "port", city: "Dubai" },
      { name: "Dubai International Airport", code: "DXB", type: "airport", city: "Dubai" },
      { name: "Abu Dhabi International Airport", code: "AUH", type: "airport", city: "Abu Dhabi" },
    ],
  },
];

export function getCountryByCode(code: string): CountryData | undefined {
  return countriesData.find((c) => c.code === code);
}

export function searchCountries(query: string): CountryData[] {
  const lowerQuery = query.toLowerCase();
  return countriesData.filter(
    (country) =>
      country.name.toLowerCase().includes(lowerQuery) ||
      country.code.toLowerCase().includes(lowerQuery)
  );
}

