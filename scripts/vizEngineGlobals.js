


///////////////////////////////////
//Initializations
//////////////////////




///initializations

var hues = ["b", "b", "b",]
//var hue = "g";	/* b=blue, g=green, r=red colours - from ColorBrewer */
var rateById = d3.map();
var lastActiveCountry = "";
var sidsEngineInit = 0
var firstIndicatorInit = 0
var sidsMaps;
var data;
var defaultScale = 1;	/* default scale of map - fits nicely on standard screen */
var scale = 3;		/* maximum size to zoom county */
var quantize = d3.scale.quantize()
var countryJson = [];
var sidsXML;
var wdiFull;
var wdiMeta;
var mapLocations;
var indicatorGlobal="Region";
var bboxDict = {};
var textBBoxDict = {};
var bboxInit=0;
var totalIndexRectangles =4;
var vizMode;
d3.select(self.frameElement).style("height", "650px");
/////
const vizContainerWidth = "800";
const vizContainerHeight = "580";
main_chart_svg=d3.select("#choro_map_container")
  .append("svg")
  .attr("width", vizContainerWidth)
  .attr("height", vizContainerHeight); //'800'//'auto'
choro_legend_svg=d3.select("#choro_legend_container")
  .append("svg")
  .attr("width", vizContainerWidth)
  .attr("height", vizContainerHeight);

////////
//MVI Initializations
//////////////

presetDict = {
  evi: [
    "mvi-ldc-AIN-Index-economic",
    "mvi-ldc-XCON-Index-economic",
    "mvi-ldc-XIN-Index-economic",
    "mvi-ldc-LECZ-Index-geographic",
    "popDry",
    "mvi-ldc-REM-Index-geographic",
    "mvi-ldc-VIC-Index-environmental",
    "mvi-ldc-AFF-Index-environmental",
  ],
};

///country lists, could be refactored

regionCountries = {
   
    "caribbean": ["BLZ", "JAM", "CYM", "CUB", "BMU", "BHS", "ABW", "CUW", "TCA", "HTI", "DOM",
        "KNA", "VGB", "AIA", "SXM", "ATG", "MSR", "DMA", "LCA"
        , "BRB", "VCT", "GRD", "TTO", "GUY", "SUR"] , 
        "ais": ["CPV", "GNB", "STP", "COM", "BHR", "MUS", "SYC", "MDV", "SGP"],
        "pacific": ["TLS", "PLW", "PNG", "SLB","TON",
            "FSM", "MHL", "VUT", "NRU", "KIR", "FJI", "TUV", "ABW", "NIU", "WSM", "TKL", "COK"]
}

sidsDict= {"ATG":"Antigua and Barbuda", "ABW":"Aruba","BHS":"The Bahamas","BMU":"Bermuda",
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
 
  countryListLongitude = ["BLZ","CYM","BHS", "JAM", "CUB", "HTI", "DOM","TCA","CUW", "ABW"
  ,"BMU","VGB","AIA","KNA", "SXM","ATG", "MSR", "DMA", "LCA", "BRB", "VCT", "GRD", "TTO", "GUY", "SUR",
  "CPV", "GNB", "STP", "COM", "BHR", "MUS", "SYC", "MDV", "SGP", "TLS", "PLW", "PNG", "SLB",
  "FSM", "MHL", "VUT", "NRU", "KIR", "FJI", "TUV", "TON", "NIU", "WSM","TKL", "COK"]

  //should compute this automatically
  countryListSpider = [ "HTI", "DOM","TCA","CUW", "ABW"
  ,"BMU","VGB","AIA","KNA", "SXM","ATG", "MSR", "DMA", "LCA", "BRB", "VCT", "GRD", "TTO", "GUY", "SUR",
  "CPV", "GNB", "STP", "COM", "BHR", "MUS", "SYC", "MDV", "SGP", "TLS", "PLW", "PNG", "SLB",
  "FSM", "MHL", "VUT", "NRU", "KIR", "FJI", "TUV", "TON", "NIU", "WSM","TKL", "COK","BLZ","CYM","BHS", "JAM", "CUB"]