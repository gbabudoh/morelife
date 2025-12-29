export interface Country {
  name: string;
  code: string;
  subdivisions: Subdivision[];
}

export interface Subdivision {
  name: string;
  code: string;
  cities?: string[];
}

export const africanCountries: Country[] = [
  {
    name: "Nigeria",
    code: "NG",
    subdivisions: [
      { name: "Abia", code: "AB", cities: ["Umuahia", "Aba", "Ohafia"] },
      { name: "Adamawa", code: "AD", cities: ["Yola", "Mubi", "Jimeta"] },
      { name: "Akwa Ibom", code: "AK", cities: ["Uyo", "Ikot Ekpene", "Eket"] },
      { name: "Anambra", code: "AN", cities: ["Awka", "Onitsha", "Nnewi"] },
      { name: "Bauchi", code: "BA", cities: ["Bauchi", "Azare", "Jama'are"] },
      { name: "Bayelsa", code: "BY", cities: ["Yenagoa", "Brass", "Nembe"] },
      { name: "Benue", code: "BE", cities: ["Makurdi", "Gboko", "Otukpo"] },
      { name: "Borno", code: "BO", cities: ["Maiduguri", "Bama", "Dikwa"] },
      { name: "Cross River", code: "CR", cities: ["Calabar", "Ugep", "Ogoja"] },
      { name: "Delta", code: "DE", cities: ["Asaba", "Warri", "Sapele"] },
      { name: "Ebonyi", code: "EB", cities: ["Abakaliki", "Afikpo", "Onueke"] },
      { name: "Edo", code: "ED", cities: ["Benin City", "Auchi", "Ekpoma"] },
      { name: "Ekiti", code: "EK", cities: ["Ado Ekiti", "Ikere", "Ise"] },
      { name: "Enugu", code: "EN", cities: ["Enugu", "Nsukka", "Oji River"] },
      { name: "Gombe", code: "GO", cities: ["Gombe", "Billiri", "Kaltungo"] },
      { name: "Imo", code: "IM", cities: ["Owerri", "Orlu", "Okigwe"] },
      { name: "Jigawa", code: "JI", cities: ["Dutse", "Kazaure", "Hadejia"] },
      { name: "Kaduna", code: "KD", cities: ["Kaduna", "Zaria", "Kafanchan"] },
      { name: "Kano", code: "KN", cities: ["Kano", "Wudil", "Gwarzo"] },
      { name: "Katsina", code: "KT", cities: ["Katsina", "Daura", "Funtua"] },
      { name: "Kebbi", code: "KE", cities: ["Birnin Kebbi", "Argungu", "Yauri"] },
      { name: "Kogi", code: "KO", cities: ["Lokoja", "Okene", "Idah"] },
      { name: "Kwara", code: "KW", cities: ["Ilorin", "Offa", "Omu-Aran"] },
      { name: "Lagos", code: "LA", cities: ["Lagos", "Ikeja", "Badagry"] },
      { name: "Nasarawa", code: "NA", cities: ["Lafia", "Keffi", "Akwanga"] },
      { name: "Niger", code: "NI", cities: ["Minna", "Suleja", "Bida"] },
      { name: "Ogun", code: "OG", cities: ["Abeokuta", "Ijebu-Ode", "Sagamu"] },
      { name: "Ondo", code: "ON", cities: ["Akure", "Ondo", "Owo"] },
      { name: "Osun", code: "OS", cities: ["Osogbo", "Ile-Ife", "Ilesa"] },
      { name: "Oyo", code: "OY", cities: ["Ibadan", "Ogbomoso", "Oyo"] },
      { name: "Plateau", code: "PL", cities: ["Jos", "Bukuru", "Pankshin"] },
      { name: "Rivers", code: "RI", cities: ["Port Harcourt", "Bonny", "Degema"] },
      { name: "Sokoto", code: "SO", cities: ["Sokoto", "Tambuwal", "Wurno"] },
      { name: "Taraba", code: "TA", cities: ["Jalingo", "Wukari", "Bali"] },
      { name: "Yobe", code: "YO", cities: ["Damaturu", "Potiskum", "Gashua"] },
      { name: "Zamfara", code: "ZA", cities: ["Gusau", "Kaura Namoda", "Anka"] },
      { name: "Federal Capital Territory", code: "FC", cities: ["Abuja", "Gwagwalada", "Kuje"] },
    ],
  },
  {
    name: "South Africa",
    code: "ZA",
    subdivisions: [
      { name: "Eastern Cape", code: "EC", cities: ["Port Elizabeth", "East London", "Mthatha"] },
      { name: "Free State", code: "FS", cities: ["Bloemfontein", "Welkom", "Kroonstad"] },
      { name: "Gauteng", code: "GP", cities: ["Johannesburg", "Pretoria", "Soweto"] },
      { name: "KwaZulu-Natal", code: "KZN", cities: ["Durban", "Pietermaritzburg", "Newcastle"] },
      { name: "Limpopo", code: "LP", cities: ["Polokwane", "Thohoyandou", "Musina"] },
      { name: "Mpumalanga", code: "MP", cities: ["Nelspruit", "Witbank", "Middelburg"] },
      { name: "Northern Cape", code: "NC", cities: ["Kimberley", "Upington", "Kuruman"] },
      { name: "North West", code: "NW", cities: ["Mahikeng", "Rustenburg", "Klerksdorp"] },
      { name: "Western Cape", code: "WC", cities: ["Cape Town", "Stellenbosch", "George"] },
    ],
  },
  {
    name: "Kenya",
    code: "KE",
    subdivisions: [
      { name: "Nairobi", code: "NAI", cities: ["Nairobi", "Westlands", "Eastleigh"] },
      { name: "Mombasa", code: "MOM", cities: ["Mombasa", "Likoni", "Nyali"] },
      { name: "Kisumu", code: "KIS", cities: ["Kisumu", "Ahero", "Muhoroni"] },
      { name: "Nakuru", code: "NAK", cities: ["Nakuru", "Naivasha", "Gilgil"] },
      { name: "Eldoret", code: "ELD", cities: ["Eldoret", "Iten", "Kapsabet"] },
      { name: "Thika", code: "THI", cities: ["Thika", "Ruiru", "Gatundu"] },
    ],
  },
  {
    name: "Ghana",
    code: "GH",
    subdivisions: [
      { name: "Greater Accra", code: "GA", cities: ["Accra", "Tema", "Madina"] },
      { name: "Ashanti", code: "AS", cities: ["Kumasi", "Obuasi", "Ejisu"] },
      { name: "Western", code: "WE", cities: ["Takoradi", "Sekondi", "Tarkwa"] },
      { name: "Eastern", code: "EA", cities: ["Koforidua", "Nkawkaw", "Aburi"] },
      { name: "Central", code: "CE", cities: ["Cape Coast", "Kasoa", "Winneba"] },
      { name: "Northern", code: "NO", cities: ["Tamale", "Yendi", "Savelugu"] },
    ],
  },
  {
    name: "Egypt",
    code: "EG",
    subdivisions: [
      { name: "Cairo", code: "CA", cities: ["Cairo", "Giza", "Shubra"] },
      { name: "Alexandria", code: "AL", cities: ["Alexandria", "Borg El Arab", "Abu Qir"] },
      { name: "Giza", code: "GZ", cities: ["Giza", "6th of October", "Sheikh Zayed"] },
      { name: "Luxor", code: "LX", cities: ["Luxor", "Esna", "Armant"] },
      { name: "Aswan", code: "AS", cities: ["Aswan", "Kom Ombo", "Edfu"] },
    ],
  },
  {
    name: "Ethiopia",
    code: "ET",
    subdivisions: [
      { name: "Addis Ababa", code: "AA", cities: ["Addis Ababa", "Bole", "Merkato"] },
      { name: "Dire Dawa", code: "DD", cities: ["Dire Dawa", "Melka Jebdu", "Gurgura"] },
      { name: "Oromia", code: "OR", cities: ["Adama", "Jimma", "Bishoftu"] },
      { name: "Amhara", code: "AM", cities: ["Bahir Dar", "Gondar", "Dessie"] },
      { name: "Tigray", code: "TI", cities: ["Mekelle", "Axum", "Adigrat"] },
    ],
  },
  {
    name: "Tanzania",
    code: "TZ",
    subdivisions: [
      { name: "Dar es Salaam", code: "DS", cities: ["Dar es Salaam", "Kinondoni", "Temeke"] },
      { name: "Arusha", code: "AR", cities: ["Arusha", "Moshi", "Karatu"] },
      { name: "Dodoma", code: "DO", cities: ["Dodoma", "Kondoa", "Mpwapwa"] },
      { name: "Mwanza", code: "MW", cities: ["Mwanza", "Geita", "Sengerema"] },
      { name: "Zanzibar", code: "ZN", cities: ["Zanzibar City", "Stone Town", "Nungwi"] },
    ],
  },
  {
    name: "Uganda",
    code: "UG",
    subdivisions: [
      { name: "Kampala", code: "KA", cities: ["Kampala", "Entebbe", "Wakiso"] },
      { name: "Jinja", code: "JI", cities: ["Jinja", "Iganga", "Kamuli"] },
      { name: "Gulu", code: "GU", cities: ["Gulu", "Lira", "Kitgum"] },
      { name: "Mbarara", code: "MB", cities: ["Mbarara", "Kabale", "Rukungiri"] },
    ],
  },
  {
    name: "Algeria",
    code: "DZ",
    subdivisions: [
      { name: "Algiers", code: "ALG", cities: ["Algiers", "Bab Ezzouar", "Hydra"] },
      { name: "Oran", code: "ORA", cities: ["Oran", "Bir El Djir", "Aïn El Turk"] },
      { name: "Constantine", code: "CON", cities: ["Constantine", "El Khroub", "Aïn Smara"] },
    ],
  },
  {
    name: "Morocco",
    code: "MA",
    subdivisions: [
      { name: "Casablanca", code: "CAS", cities: ["Casablanca", "Mohammedia", "Aïn Harrouda"] },
      { name: "Rabat", code: "RAB", cities: ["Rabat", "Salé", "Témara"] },
      { name: "Fes", code: "FES", cities: ["Fes", "Meknes", "Ifrane"] },
      { name: "Marrakech", code: "MAR", cities: ["Marrakech", "Essaouira", "Ouarzazate"] },
    ],
  },
  {
    name: "Angola",
    code: "AO",
    subdivisions: [
      { name: "Luanda", code: "LUA", cities: ["Luanda", "Viana", "Cacuaco"] },
      { name: "Huambo", code: "HUA", cities: ["Huambo", "Caála", "Longonjo"] },
      { name: "Benguela", code: "BEN", cities: ["Benguela", "Lobito", "Catumbela"] },
    ],
  },
  {
    name: "Sudan",
    code: "SD",
    subdivisions: [
      { name: "Khartoum", code: "KHA", cities: ["Khartoum", "Omdurman", "Khartoum North"] },
      { name: "Port Sudan", code: "PSU", cities: ["Port Sudan", "Suakin", "Tokar"] },
    ],
  },
  {
    name: "Mozambique",
    code: "MZ",
    subdivisions: [
      { name: "Maputo", code: "MAP", cities: ["Maputo", "Matola", "Marracuene"] },
      { name: "Beira", code: "BEI", cities: ["Beira", "Dondo", "Nhamatanda"] },
    ],
  },
  {
    name: "Madagascar",
    code: "MG",
    subdivisions: [
      { name: "Antananarivo", code: "ANT", cities: ["Antananarivo", "Ambohimanga", "Andramasina"] },
      { name: "Toamasina", code: "TOA", cities: ["Toamasina", "Foulpointe", "Mahavelona"] },
    ],
  },
  {
    name: "Cameroon",
    code: "CM",
    subdivisions: [
      { name: "Yaoundé", code: "YAO", cities: ["Yaoundé", "Mbalmayo", "Ebolowa"] },
      { name: "Douala", code: "DOU", cities: ["Douala", "Bonabéri", "Wouri"] },
      { name: "Bafoussam", code: "BAF", cities: ["Bafoussam", "Bamenda", "Dschang"] },
    ],
  },
  {
    name: "Ivory Coast",
    code: "CI",
    subdivisions: [
      { name: "Abidjan", code: "ABI", cities: ["Abidjan", "Yopougon", "Cocody"] },
      { name: "Bouaké", code: "BOU", cities: ["Bouaké", "Korhogo", "Daloa"] },
    ],
  },
  {
    name: "Niger",
    code: "NE",
    subdivisions: [
      { name: "Niamey", code: "NIA", cities: ["Niamey", "Tillabéri", "Kollo"] },
      { name: "Zinder", code: "ZIN", cities: ["Zinder", "Maradi", "Tahoua"] },
    ],
  },
  {
    name: "Burkina Faso",
    code: "BF",
    subdivisions: [
      { name: "Ouagadougou", code: "OUA", cities: ["Ouagadougou", "Koudougou", "Ouahigouya"] },
      { name: "Bobo-Dioulasso", code: "BOB", cities: ["Bobo-Dioulasso", "Banfora", "Dédougou"] },
    ],
  },
  {
    name: "Mali",
    code: "ML",
    subdivisions: [
      { name: "Bamako", code: "BAM", cities: ["Bamako", "Kati", "Koulikoro"] },
      { name: "Sikasso", code: "SIK", cities: ["Sikasso", "Koutiala", "Bougouni"] },
    ],
  },
  {
    name: "Malawi",
    code: "MW",
    subdivisions: [
      { name: "Lilongwe", code: "LIL", cities: ["Lilongwe", "Dedza", "Salima"] },
      { name: "Blantyre", code: "BLA", cities: ["Blantyre", "Zomba", "Mulanje"] },
    ],
  },
  {
    name: "Zambia",
    code: "ZM",
    subdivisions: [
      { name: "Lusaka", code: "LUS", cities: ["Lusaka", "Kafue", "Chongwe"] },
      { name: "Kitwe", code: "KIT", cities: ["Kitwe", "Ndola", "Chingola"] },
    ],
  },
  {
    name: "Zimbabwe",
    code: "ZW",
    subdivisions: [
      { name: "Harare", code: "HAR", cities: ["Harare", "Chitungwiza", "Epworth"] },
      { name: "Bulawayo", code: "BUL", cities: ["Bulawayo", "Gwanda", "Plumtree"] },
    ],
  },
  {
    name: "Senegal",
    code: "SN",
    subdivisions: [
      { name: "Dakar", code: "DAK", cities: ["Dakar", "Pikine", "Guediawaye"] },
      { name: "Thiès", code: "THI", cities: ["Thiès", "Mbour", "Tivaouane"] },
    ],
  },
  {
    name: "Chad",
    code: "TD",
    subdivisions: [
      { name: "N'Djamena", code: "NDJ", cities: ["N'Djamena", "Moundou", "Sarh"] },
    ],
  },
  {
    name: "Somalia",
    code: "SO",
    subdivisions: [
      { name: "Mogadishu", code: "MOG", cities: ["Mogadishu", "Hargeisa", "Kismayo"] },
    ],
  },
  {
    name: "Guinea",
    code: "GN",
    subdivisions: [
      { name: "Conakry", code: "CON", cities: ["Conakry", "Kindia", "Labé"] },
    ],
  },
  {
    name: "Rwanda",
    code: "RW",
    subdivisions: [
      { name: "Kigali", code: "KIG", cities: ["Kigali", "Butare", "Gitarama"] },
    ],
  },
  {
    name: "Benin",
    code: "BJ",
    subdivisions: [
      { name: "Cotonou", code: "COT", cities: ["Cotonou", "Porto-Novo", "Parakou"] },
    ],
  },
  {
    name: "Burundi",
    code: "BI",
    subdivisions: [
      { name: "Bujumbura", code: "BUJ", cities: ["Bujumbura", "Gitega", "Muyinga"] },
    ],
  },
  {
    name: "Tunisia",
    code: "TN",
    subdivisions: [
      { name: "Tunis", code: "TUN", cities: ["Tunis", "Sfax", "Sousse"] },
    ],
  },
  {
    name: "Togo",
    code: "TG",
    subdivisions: [
      { name: "Lomé", code: "LOM", cities: ["Lomé", "Sokodé", "Kara"] },
    ],
  },
  {
    name: "Sierra Leone",
    code: "SL",
    subdivisions: [
      { name: "Freetown", code: "FRE", cities: ["Freetown", "Bo", "Kenema"] },
    ],
  },
  {
    name: "Libya",
    code: "LY",
    subdivisions: [
      { name: "Tripoli", code: "TRI", cities: ["Tripoli", "Benghazi", "Misrata"] },
    ],
  },
  {
    name: "Liberia",
    code: "LR",
    subdivisions: [
      { name: "Monrovia", code: "MON", cities: ["Monrovia", "Gbarnga", "Kakata"] },
    ],
  },
  {
    name: "Central African Republic",
    code: "CF",
    subdivisions: [
      { name: "Bangui", code: "BAN", cities: ["Bangui", "Bimbo", "Berbérati"] },
    ],
  },
  {
    name: "Mauritania",
    code: "MR",
    subdivisions: [
      { name: "Nouakchott", code: "NOU", cities: ["Nouakchott", "Nouadhibou", "Rosso"] },
    ],
  },
  {
    name: "Eritrea",
    code: "ER",
    subdivisions: [
      { name: "Asmara", code: "ASM", cities: ["Asmara", "Keren", "Massawa"] },
    ],
  },
  {
    name: "Namibia",
    code: "NA",
    subdivisions: [
      { name: "Windhoek", code: "WIN", cities: ["Windhoek", "Swakopmund", "Walvis Bay"] },
    ],
  },
  {
    name: "Gambia",
    code: "GM",
    subdivisions: [
      { name: "Banjul", code: "BAN", cities: ["Banjul", "Serekunda", "Brikama"] },
    ],
  },
  {
    name: "Botswana",
    code: "BW",
    subdivisions: [
      { name: "Gaborone", code: "GAB", cities: ["Gaborone", "Francistown", "Maun"] },
    ],
  },
  {
    name: "Gabon",
    code: "GA",
    subdivisions: [
      { name: "Libreville", code: "LIB", cities: ["Libreville", "Port-Gentil", "Franceville"] },
    ],
  },
  {
    name: "Lesotho",
    code: "LS",
    subdivisions: [
      { name: "Maseru", code: "MAS", cities: ["Maseru", "Teyateyaneng", "Mafeteng"] },
    ],
  },
  {
    name: "Guinea-Bissau",
    code: "GW",
    subdivisions: [
      { name: "Bissau", code: "BIS", cities: ["Bissau", "Bafatá", "Gabú"] },
    ],
  },
  {
    name: "Equatorial Guinea",
    code: "GQ",
    subdivisions: [
      { name: "Malabo", code: "MAL", cities: ["Malabo", "Bata", "Ebebiyín"] },
    ],
  },
  {
    name: "Mauritius",
    code: "MU",
    subdivisions: [
      { name: "Port Louis", code: "PLO", cities: ["Port Louis", "Curepipe", "Quatre Bornes"] },
    ],
  },
  {
    name: "Eswatini",
    code: "SZ",
    subdivisions: [
      { name: "Mbabane", code: "MBA", cities: ["Mbabane", "Manzini", "Big Bend"] },
    ],
  },
  {
    name: "Djibouti",
    code: "DJ",
    subdivisions: [
      { name: "Djibouti", code: "DJI", cities: ["Djibouti", "Ali Sabieh", "Dikhil"] },
    ],
  },
  {
    name: "Comoros",
    code: "KM",
    subdivisions: [
      { name: "Moroni", code: "MOR", cities: ["Moroni", "Mutsamudu", "Fomboni"] },
    ],
  },
  {
    name: "Cape Verde",
    code: "CV",
    subdivisions: [
      { name: "Praia", code: "PRA", cities: ["Praia", "Mindelo", "Santa Maria"] },
    ],
  },
  {
    name: "São Tomé and Príncipe",
    code: "ST",
    subdivisions: [
      { name: "São Tomé", code: "STO", cities: ["São Tomé", "Trindade", "Neves"] },
    ],
  },
  {
    name: "Seychelles",
    code: "SC",
    subdivisions: [
      { name: "Victoria", code: "VIC", cities: ["Victoria", "Anse Boileau", "Beau Vallon"] },
    ],
  },
];

export function getCountryByName(name: string): Country | undefined {
  return africanCountries.find((country) => country.name === name);
}

export function getSubdivisionByCountryAndName(
  countryName: string,
  subdivisionName: string
): Subdivision | undefined {
  const country = getCountryByName(countryName);
  if (!country) return undefined;
  return country.subdivisions.find((sub) => sub.name === subdivisionName);
}

