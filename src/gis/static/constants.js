const constants = {
  filepath: {
    //dirpath + attributeID + resolution+pathtemplate + sas = mvt tile path
    vectorTilesDirPath:
      "https://data.undpgeohub.org/sids-data/",
    vectorTilesPathTemplate: "{z}/{x}/{y}.pbf",
    SAS: "",
  },
  sourceURLs: {
  //   hex1: "https://data.undpgeohub.org/sids-data/hex1/{z}/{x}/{y}.pbf",
  //   hex5: "https://data.undpgeohub.org/sids-data/hex5/{z}/{x}/{y}.pbf",
  //   hex10:
  //     "https://data.undpgeohub.org/sids-data/hex10/{z}/{x}/{y}.pbf",
  //   hex5clipped:
  //     "https://data.undpgeohub.org/sids-data/hex5clipped/{z}/{x}/{y}.pbf",
  //   admin1:
  //     "https://data.undpgeohub.org/sids-data/admin1/{z}/{x}/{y}.pbf",
  //   admin2:
  //     "https://data.undpgeohub.org/sids-data/admin2/{z}/{x}/{y}.pbf",
  //   ocean:
  //     "https://data.undpgeohub.org/sids-data/oceans/{z}/{x}/{y}.pbf",
    allSids:
      "https://data.undpgeohub.org/sids-data/allsids/{z}/{x}/{y}.pbf",
  },
  hexes: ["hex-1km", "hex-5km", "hex-10km", "hex5clipped"],
  admins: ["admin1", "admin2"],
  userLayers: [
    //user interactive data layers
    "hex1",
    "hex5",
    "hex10",
    "hex5clipped",
    "admin1",
    "admin2",
    "ocean",
  ],
  nogos: [
    //EXTRACTED FROM WITHIN randomStart()//was used to randomize starting country in view in legacy code
    0,
    1, 2, 4, 12, 16, 24, 25, 26, 27, 28, 29, 31, 32, 41, 43, 45, 47, 48, 50, 52,
  ],
  mapOptions: {
    style: "mapbox://styles/mapbox/satellite-streets-v11", //"mapbox://styles/mapbox/light-v10", //
    center: [-71.5, 19.0],
    zoom: 7,
    maxZoom: 20, //13.5,
    minZoom: 1,
    maxBounds: [
      [-270, -45],
      [+270, +45],
    ],
  },
  map2Options: {
    style: "mapbox://styles/mapbox/light-v10", //"mapbox://styles/mapbox/satellite-streets-v11",
    center: [-71.5, 19.0],
    zoom: 7,
    maxZoom: 20, //13.5,
    minZoom: 1,
    maxBounds: [
      [-270, -45],
      [+270, +45],
    ],
  },
  styles: [
    {
      name: "Satellite Imagery", //"Mapbox Satellite Streets",
      // title: "Satellite With Labels",
      uri: "mapbox://styles/mapbox/satellite-streets-v11",
    },
    {
      name: "Light Theme", //"Mapbox Light",
      // title: "Light",
      uri: "mapbox://styles/mapbox/light-v10",
    },
    {
      name: "Satellite Imagery old", //double check for correct name
      // title: "Satellite Imagery",
      uri: "mapbox://styles/mapbox/satellite-v9",
    },
    {
      name: "Dark Theme", //"Mapbox Dark",
      // title: "Mapbox Dark",
      uri: "mapbox://styles/mapbox/dark-v10",
    },
  ],
  unwantedMapboxLayers: [
    "admin-1-boundary",
    "admin-1-boundary-bg",
    "road-label",
    "road-number-shield",
    "road-exit-shield",
    "airport-label",
  ],
};
export default constants;
