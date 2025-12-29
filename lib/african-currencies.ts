export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

export const africanCurrencies: Record<string, CurrencyInfo> = {
  "Algeria": { code: "DZD", symbol: "DA", name: "Algerian Dinar" },
  "Angola": { code: "AOA", symbol: "Kz", name: "Angolan Kwanza" },
  "Benin": { code: "XOF", symbol: "CFA", name: "West African CFA franc" },
  "Botswana": { code: "BWP", symbol: "P", name: "Botswana Pula" },
  "Burkina Faso": { code: "XOF", symbol: "CFA", name: "West African CFA franc" },
  "Burundi": { code: "BIF", symbol: "FBu", name: "Burundian Franc" },
  "Cameroon": { code: "XAF", symbol: "FCFA", name: "Central African CFA franc" },
  "Cape Verde": { code: "CVE", symbol: "CVE", name: "Cape Verdean Escudo" },
  "Central African Republic": { code: "XAF", symbol: "FCFA", name: "Central African CFA franc" },
  "Chad": { code: "XAF", symbol: "FCFA", name: "Central African CFA franc" },
  "Comoros": { code: "KMF", symbol: "CF", name: "Comorian Franc" },
  "Djibouti": { code: "DJF", symbol: "Fdj", name: "Djiboutian Franc" },
  "Egypt": { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  "Equatorial Guinea": { code: "XAF", symbol: "FCFA", name: "Central African CFA franc" },
  "Eritrea": { code: "ERN", symbol: "Nfk", name: "Eritrean Nakfa" },
  "Eswatini": { code: "SZL", symbol: "L", name: "Swazi Lilangeni" },
  "Ethiopia": { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  "Gabon": { code: "XAF", symbol: "FCFA", name: "Central African CFA franc" },
  "Gambia": { code: "GMD", symbol: "D", name: "Gambian Dalasi" },
  "Ghana": { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  "Guinea": { code: "GNF", symbol: "FG", name: "Guinean Franc" },
  "Guinea-Bissau": { code: "XOF", symbol: "CFA", name: "West African CFA franc" },
  "Ivory Coast": { code: "XOF", symbol: "CFA", name: "West African CFA franc" },
  "Kenya": { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  "Lesotho": { code: "LSL", symbol: "L", name: "Lesotho Loti" },
  "Liberia": { code: "LRD", symbol: "L$", name: "Liberian Dollar" },
  "Libya": { code: "LYD", symbol: "LD", name: "Libyan Dinar" },
  "Madagascar": { code: "MGA", symbol: "Ar", name: "Malagasy Ariary" },
  "Malawi": { code: "MWK", symbol: "MK", name: "Malawian Kwacha" },
  "Mali": { code: "XOF", symbol: "CFA", name: "West African CFA franc" },
  "Mauritania": { code: "MRU", symbol: "UM", name: "Mauritanian Ouguiya" },
  "Mauritius": { code: "MUR", symbol: "₨", name: "Mauritian Rupee" },
  "Morocco": { code: "MAD", symbol: "DH", name: "Moroccan Dirham" },
  "Mozambique": { code: "MZN", symbol: "MT", name: "Mozambican Metical" },
  "Namibia": { code: "NAD", symbol: "N$", name: "Namibian Dollar" },
  "Niger": { code: "XOF", symbol: "CFA", name: "West African CFA franc" },
  "Nigeria": { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  "Rwanda": { code: "RWF", symbol: "FRw", name: "Rwandan Franc" },
  "Senegal": { code: "XOF", symbol: "CFA", name: "West African CFA franc" },
  "Seychelles": { code: "SCR", symbol: "₨", name: "Seychellois Rupee" },
  "Sierra Leone": { code: "SLL", symbol: "Le", name: "Sierra Leonean Leone" },
  "Somalia": { code: "SOS", symbol: "Sh.So.", name: "Somali Shilling" },
  "South Africa": { code: "ZAR", symbol: "R", name: "South African Rand" },
  "Sudan": { code: "SDG", symbol: "SDG", name: "Sudanese Pound" },
  "Tanzania": { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  "Togo": { code: "XOF", symbol: "CFA", name: "West African CFA franc" },
  "Tunisia": { code: "TND", symbol: "DT", name: "Tunisian Dinar" },
  "Uganda": { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  "Zambia": { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  "Zimbabwe": { code: "ZWL", symbol: "Z$", name: "Zimbabwean Dollar" },
};

export function getCurrencyByCountry(countryName: string): CurrencyInfo {
  return africanCurrencies[countryName] || { code: "USD", symbol: "$", name: "US Dollar" };
}

export function getCurrencyByLocation(location: string): CurrencyInfo {
  const country = location.split(",").pop()?.trim() || "Nigeria";
  return getCurrencyByCountry(country);
}
