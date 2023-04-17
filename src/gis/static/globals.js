import constants from "@/gis/static/constants.js";

//taken from old code

const globals = {
  bivariateMode: false, //null,
  bivariateLayerState: {
    color: null,
    /**Object {X_breaks, Y_breaks}; breaks for  the two data layers;
     * legacy code only had a few layer possibilities, mainly hex# and ocean
     */
    breaks: { X: null, Y: null },
    /**Array; ids of the two data layers;
     * legacy code only had a few layer possibilities, mainly hex# and ocean
     */
    dataLayer: [null, null],
    /**String; id of the current data layer;
     * legacy code only had a few layer possibilities, mainly hex# and ocean
     */
    hexSize: "bivariate",
    lastActive: { dataset: [null, null], layer: [null, null] },
  },
  myBivariateScatterChart: null, //store chart instance
  bivariateScaleTypes: { Y: "logarithmic", X: "linear" },
  compareMode: false, //null,
  drawingMode: null,
  firstSymbolId: "tunnel-oneway-arrow-blue",
  basemapLabels: [], //current basemap labels, for use in addLabels -> the toggling of the labels of a current basemap style
  //current layer state manager
  precision: null, //modified in changeDataOnMap and recolor etc; TODO deglobalize this
  myHistogram: null, //global storage for modifying main histogram html element by updates and recreation
  lastActive: { dataset: null, layer: null },
  lastActiveComparison: { dataset: null, layer: null },
  opacity: 0.8,
  /* //were unused; obsoleted by passing these through emits when required
  activeDataset: null,
  activeLayer: null, */
  allLayers: [], //from old code; should be obsoleted by filteredDatasets/datasets made in MapDataController.vue;
  currentLayerState: {
    color: null,
    breaks: null,
    dataLayer: null,
    /**String; id of the current data layer;
     * legacy code only had a few layer possibilities, mainly hex# and ocean
     */
    hexSize: "hex-5km",
    lastActive: { dataset: null, layer: null },
  },
  comparisonLayerState: {
    color: null,
    breaks: null,
    dataLayer: null,
    /**String; id of the current data layer;
     * legacy code only had a few layer possibilities, mainly hex# and ocean
     */
    hexSize: "hex-5km",
    lastActive: { dataset: null, layer: null },
  },
  sources: {
    admin1Overlay: {
      type: "vector",
      promoteId: "GID_1",
      tiles: [constants.sourceURLs.admin1Overlay],
      //'minzoom': 3,
      maxzoom: 20, //13.5,
    },
    admin2Overlay: {
      type: "vector",
      promoteId: "GID_2",
      tiles: [constants.sourceURLs.admin2Overlay],
      //'minzoom': 3,
      maxzoom: 20, //13.5,
    },
    allsids: {
      type: "vector",
      //'url': ocean
      tiles: [constants.sourceURLs.allSids],
      maxzoom: 20, //13.5,
    },
  },
  sourceData: {
    //managing state of all our data
    hex5Source: {
      name: "hex5",
      layer: "hex5",
      mainId: "hexid",
      data: null,
    },
    hex10Source: {
      name: "hex10",
      layer: "hex10",
      mainId: "hexid",
      data: null,
    },
    admin1Source: {
      name: "admin1",
      mainId: "GID_1",
      layer: "admin1",
      data: null,
    },
    admin2Source: {
      name: "admin2",
      mainId: "GID_2",
      layer: "admin2",
      data: null,
    },
    hex1Source: {
      name: "hex1",
      layer: "hex1",
      mainId: "hexid",
      data: null,
    },
    oceanSource: {
      name: "ocean",
      layer: "oceans",
      // mainId: null,
      mainId: "ocean",
      data: null,
    },
    hex5clippedSource: {
      name: "hex5clipped",
      layer: "hex5clipped",
      mainId: "hexid",
      data: null,
    },
  },
};
export default globals;
