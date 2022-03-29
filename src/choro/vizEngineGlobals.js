
///////////////////////////////////
//Initializations
//////////////////////
//
// ///initializations
//
export const hues = ["b", "b", "b",]
export const subindexWeights={"mvi":{"Economic":1,"Geographic":1,"Environmental":1,"Financial":1}}

export const countryListLongitude = ["Belize", "Jamaica", "Cayman Islands", "Cuba", "The Bahamas", "Curaçao", "Aruba", "Haiti", "Dominican Republic",
    "St. Kitts and Nevis", "Sint Maarten","Antigua and Barbuda", "Montserrat", "Dominica", "St. Lucia"
    , "Barbados", "St. Vincent and the Grenadines", "Grenada", "Trinidad and Tobago", "Guyana", "Suriname", "", "",
    "Cabo Verde", "Guinea-Bissau",
    "São Tomé and Príncipe", "Comoros", "Bahrain", "Mauritius", "Seychelles", "Maldives", "Singapore", "", "",
    "Timor Leste", "Palau", "Papua New Guinea", "Solomon Islands",
    "Micronesia", "Marshall Islands", "Vanuatu", "Nauru", "Kiribati", "Fiji", "Tuvalu", "Tonga", "Niue", "Samoa", "Cook Islands"]
//
export const regionCountries = {
    "ais": ["CPV", "GNB", "STP", "COM", "BHR", "MUS", "SYC", "MDV", "SGP"],
    "pacific": ["TLS", "PLW", "PNG", "SLB","TON",
        "FSM", "MHL", "VUT", "NRU", "KIR", "FJI", "TUV", "NIU", "WSM", "TKL", "COK"],
    "caribbean": ["BLZ", "JAM", "CYM", "CUB", "BMU", "BHS", "ABW", "CUW", "TCA", "HTI", "DOM",
        "KNA", "VGB", "AIA", "SXM", "ATG", "MSR", "DMA", "LCA"
        , "BRB", "VCT", "GRD", "TTO", "GUY", "SUR"]
}
//
export const totalIndexRectangles =4;
export const sidsDict = {"ATG":"Antigua and Barbuda", "ABW":"Aruba","BHS":"The Bahamas","BMU":"Bermuda",
"BHR":"Bahrain","BRB": "Barbados", "BLZ":"Belize","VGB": "British Virgin Islands","CPV":"Cabo Verde",
"CYM":"Cayman Islands", "COM":"Comoros","CUB": "Cuba","CUW":"Curaçao","DMA":"Dominica","DOM": "Dominican Republic",
"FJI":"Fiji","GRD":"Grenada","GNB": "Guinea-Bissau","GUY": "Guyana", "HTI":"Haiti","JAM":"Jamaica",
"KIR":"Kiribati","MDV": "Maldives","MHL": "Marshall Islands","MUS":"Mauritius","FSM": "Micronesia, Fed. Sts.",
"NRU":"Nauru","PLW": "Palau","PNG":"Papua New Guinea","WSM": "Samoa","STP": "São Tomé and Príncipe",
"SYC":"Seychelles","SGP":"Singapore","SXM":"Sint Maarten","SLB":"Solomon Islands",
"KNA":"St. Kitts and Nevis","VCT": "St. Vincent and the Grenadines","LCA":"St. Lucia",
"SUR":"Suriname","TLS": "Timor Leste","TTO":"Trinidad and Tobago", "TON": "Tonga",
"TUV":"Tuvalu","TCA":"Turks and Caicos Islands","VUT": "Vanuatu","AIA":"Anguilla",
"COK":"Cook Islands","MSR":"Montserrat","TKL":"Tokelau","NIU": "Niue"}

export const regionsDict = {
  caribbean: 'Caribbean',
  ais: 'AIS',
  pacific: 'Pacific'
}
//
export const isoToIds= {
  "ATG": "antiguaAndBarbuda",
  "ABW": "aruba",
  "BHS": "bahamas",
  "BMU": "bermuda",
  "BHR": "bahrain",
  "BRB": "barbados",
  "BLZ": "belize",
  "VGB": "britishVirginIslands",
  "CPV": "caboVerde",
  "CYM": "caymanIslands",
  "COM": "comoros",
  "CUB": "cuba",
  "CUW": "curacao",
  "DMA": "dominica",
  "DOM": "dominicanRepublic",
  "FJI": "fiji",
  "GRD": "grenada",
  "GNB": "guineaBissau",
  "GUY": "guyana",
  "HTI": "haiti",
  "JAM": "jamaica",
  "KIR": "kiribati",
  "MDV": "maldives",
  "MHL": "marshallIslands",
  "MUS": "mauritius",
  "FSM": "micronesia",
  "NRU": "nauru",
  "PLW": "palau",
  "PNG": "papuaNewGuinea",
  "WSM": "samoa",
  "STP": "saoTomeAndPrincipe",
  "SYC": "seychelles",
  "SGP": "singapore",
  "SXM": "sintMaarten",
  "SLB": "solomonIslands",
  "KNA": "kittsAndNevis",
  "VCT": "stVincent",
  "LCA": "saintLucia",
  "SUR": "suriname",
  "TLS": "timorLeste",
  "TTO": "trinidadAndTobago",
  "TON": "tonga",
  "TUV": "tuvalu",
  "TCA": "turksAndCaicos",
  "VUT": "vanuatu",
  "AIA": "anguilla",
  "COK": "cookIslands",
  "MSR": "montserrat",
  "TKL": "tokelau",
  "NIU": "niue"
}
//
export const  countryListSpider = [
  "HTI",
  "DOM",
  "ATG",
  "KNA",
  "DMA",
  "LCA",
  "BRB",
  "VCT",
  "GRD",
  "TTO",
  "GUY",
  "SUR",
  "CPV",
  "GNB",
  "STP",
  "COM",
  "MUS",
  "SYC",
  "MDV",
  "TLS",
  "PLW",
  "PNG",
  "SLB",
  "FSM",
  "MHL",
  "VUT",
  "NRU",
  "KIR",
  "FJI",
  "TUV",
  "TON",
  "WSM",
  "BLZ",
  "JAM",
];
