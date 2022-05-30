import globals from "@/gis/static/globals.js";
import filepaths from "@/gis/static/filepaths.js";
import constants from "@/gis/static/constants.js";
import chroma from "chroma-js";

import mapboxgl from "@/gis/mapboxgl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl-compare";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import axios from "axios";

import { updateData, on, emit, addOcean, zoomToCountry, changeHexagonSize, add3D, changeColor } from './gisPublicFunctions'
import { onDataClick, onAdminClick } from './gisEventHandlers'

export default class Map {
  constructor(containerId, leftMapContainerId,
    // rightMapContainerId
  ) {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2ViYXN0aWFuLWNoIiwiYSI6ImNpejkxdzZ5YzAxa2gyd21udGpmaGU0dTgifQ.IrEd_tvrl6MuypVNUGU5SQ";
    this.containerId = containerId;
    this.map = new mapboxgl.Map({
      container: leftMapContainerId,
      ...constants.mapOptions,
    });
    // this.map2 = new mapboxgl.Map({
    //   container: rightMapContainerId,
    //   ...constants.mapOptions,
    // });
    this.Draw = null;
    this.drawModeDisabled = false;
    this.map.on("load", () => {
      this.map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
      this._removeUnusedLayers();
      this._bindMapClickListeners();
      this._bindRecolorListeners();
      this._addPointSources();
      this._addVectorSources();
      this.getBasemapLabels();
    });
    this.options = globals
    this.options.myBivariateScatterChart = {};
    this.events={};
    this.options.colorSCheme = {};
    this.updateData = updateData;
    this.on = on;
    this.emit = emit;
    this.addOcean = addOcean;
    this.onDataClick = onDataClick;
    this.onAdminClick = onAdminClick;
    this.zoomToCountry = zoomToCountry;
    this.changeHexagonSize = changeHexagonSize;
    this.add3D = add3D;
    this.changeColor = changeColor;
  }

  getBasemapLabels() {
    this.options.basemapLabels = [];
    let layers = this.map.getStyle().layers;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === "symbol") {
        this.options.firstSymbolId = layers[i].id;
        break;
      }
    }
    for (var x in layers) {
      if (layers[x].type === "symbol" || layers[x].type === "line") {
        this.options.basemapLabels.push(layers[x]);
      }
    }
  }

  getUniqueFeatures(array, comparatorProperty) {
    var existingFeatureKeys = {};
    var uniqueFeatures = array.filter(function (el) {
      if (existingFeatureKeys[el.properties[comparatorProperty]]) {
        return false;
      } else {
        existingFeatureKeys[el.properties[comparatorProperty]] = true;
        return true;
      }
    });

    return uniqueFeatures;
  }

  checkForDuplicates(array) {
    return array.some((item,index) => {
      return array.indexOf(item) !== index
    })
  }

  _removeUnusedLayers() {
    constants.unwantedMapboxLayers.forEach((name) =>
      this.map.removeLayer(name)
    );
  }

  _addPointSources() {
    let map = this.map;
    axios.get(filepaths.pointdataFilePath).then(function ({data}) {
      map.addSource("points-source", {
        type: "geojson",
        data: data,
      });
    });
  }

  _addVectorSources(comparison = false) {
    let map = !comparison ? this.map : this.map2;

    for (let idString of Object.keys(this.options.sources)) {
      map.addSource(idString, this.options.sources[idString]);
    }

    if (!map.getLayer("allsids")) {
      map.addLayer(
        {
          id: "allsids",
          type: "line",
          source: "allsids",
          "source-layer": "allSids",
          layout: {
            visibility: "visible",
          },
          paint: {
            "line-color": "orange",
            "line-width": 1,
          },
        }
      );
    }
  }

  _handleOceanData (
    activeDataset,
    activeLayer,
    comparison = false
  ) {
    let map = !comparison ? this.map : this.map2; //
    let cls = !comparison
      ? this.options.currentLayerState
      : this.options.comparisonLayerState;
    let Field_Name = activeLayer.Field_Name;
    if (map.getLayer("ocean")) {
      if (!Field_Name.includes("fl")) {

        map.removeLayer("ocean");

        cls.hexSize = "hex5";

        map.addLayer(
          {
            id: "hex5",
            type: "fill",
            source: "hex5",
            "source-layer": "hex5",
            layout: {
              visibility: "visible",
            },
            paint: {
              "fill-color": "blue",
              "fill-opacity": 0.0,
            },
          },
          this.options.firstSymbolId
        );
      }
    } else if (
      activeLayer.Name === "Ocean Data" &&
      !(activeLayer.Field_Name === "depths")
    ) {

      cls.hexSize = "ocean";

      for (var layer in constants.userLayers) {
        if (map.getLayer(constants.userLayers[layer])) {
          map.removeLayer(constants.userLayers[layer]);
        }
      }

      map.addLayer(
        {
          id: "ocean",
          type: "fill",
          source: "ocean",
          "source-layer": "oceans",
          layout: {
            visibility: "visible",
          },
          paint: {
            "fill-color": "blue",
            "fill-opacity": 0.0, //globals.opacity, //
          },
        },
        globals.firstSymbolId
      );
    }
  }

  _bindMapClickListeners() {
    let instance = this;
    this.map.on("click", "hex5", (e) => {
      instance.clearOnClickQuery();
      instance.onDataClick(e);
    });

    this.map.on("click", "hex10", function (e) {
      instance.clearOnClickQuery();
      instance.onDataClick(e);
    });

    this.map.on("click", "hex1", function (e) {
      instance.clearOnClickQuery();
      instance.onDataClick(e);
    });

    this.map.on("click", "hex5clipped", function (e) {
        instance.clearOnClickQuery();
        instance.onDataClick(e);
      }
    );

    this.map.on("click", "ocean", function (e) {
      instance.clearOnClickQuery();
      instance.onDataClick(e);
    });

    this.map.on("click", "admin1", function (e) {
      instance.clearOnClickQuery();
      instance.onAdminClick(e, "admin1");
    });

    this.map.on("click", "admin2", function (e ) {
        instance.clearOnClickQuery();
        instance.onAdminClick(e, "admin2");
      }
    );

    // this.map.on("click", "bivariate", function (e) {
    //     instance.clearOnClickQuery();
    //     instance.onBivariateClick(e);
    //   }
    // );

    // this.map2.on("click", "hex5", function (e, mapClassInstance = instance) {
    //   mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
    //   mapClassInstance.onDataClick(e, mapClassInstance.map2);
    // });
    //
    // this.map2.on("click", "hex10", function (e, mapClassInstance = instance) {
    //   mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
    //   mapClassInstance.onDataClick(e, mapClassInstance.map2);
    // });
    //
    // this.map2.on("click", "hex1", function (e, mapClassInstance = instance) {
    //   mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
    //   mapClassInstance.onDataClick(e, mapClassInstance.map2);
    // });
    //
    // this.map2.on(
    //   "click",
    //   "hex5clipped",
    //   function (e, mapClassInstance = instance) {
    //     mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
    //     mapClassInstance.onDataClick(e, mapClassInstance.map2);
    //   }
    // );
    //
    // this.map2.on("click", "ocean", function (e, mapClassInstance = instance) {
    //   mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
    //   mapClassInstance.onDataClick(e, mapClassInstance.map2);
    // });
    //
    // this.map2.on("click", "admin1", function (e, mapClassInstance = instance) {
    //   mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
    //   mapClassInstance.addAdminClick(e, "admin1", mapClassInstance.map2);
    // });
    //
    // this.map2.on(
    //   "click",
    //   "admin2",
    //   function (e, mapClassInstance = instance, debug = false) {
    //
    //     mapClassInstance.clearOnClickQuery(mapClassInstance.map2);
    //     mapClassInstance.addAdminClick(e, "admin2", mapClassInstance.map2);
    //   }
    // );
  }

  clearOnClickQuery() {
    if (this.getLayer("iso")) {
      this.removeLayer("iso");
      this.removeSource("iso");
    }
    for (let id of ["clickedone", "highlightS", "joined"]) {
      if (this.getSource(id)) {
        if (id === "highlightS") {
          this.removeLayer("highlight");
          this.removeSource(id);
        } else {
          if (this.getLayer(id)) {
            this.removeLayer(id);
          }
          if (this.getSource(id)) {
              console.log(`removeSource:`, id);
            this.removeSource(id);
          }
        }
      }
    }
  }
  getLayer(layerName) {
    return this.map.getLayer(layerName)
  }
  removeLayer(layerName) {
    if(this.map.getLayer(layerName)){
      return this.map.removeLayer(layerName)
    }
  }
  getSource(sourceName) {
    return this.map.getSource(sourceName)
  }
  removeSource(sourceName) {
    if(this.map.getSource(sourceName)){
      return this.map.removeSource(sourceName)
    }
  }

  clearHexHighlight() {
    if (this.map.getLayer("clickedone")) {
      this.map.removeLayer("clickedone");
      this.clearOnClickQuery();
    }
    if (this.map.getLayer("highlight")) {
      this.map.removeLayer("highlight");
      this.clearOnClickQuery();
    }

    this.emit('selectionUpdate', {
      value: null
    })
  }

  recolorBasedOnWhatsOnPage(recolorComparison = false) {
    let map = !recolorComparison ? this.map : this.map2; //this.map;
    let cls = !recolorComparison
      ? this.options.currentLayerState
      : this.options.comparisonLayerState;
    console.log(map.getLayer(cls.hexSize))
    if (!map.getLayer(cls.hexSize)) {
      return;
    }

    var features = map.queryRenderedFeatures({
      layers: [cls.hexSize],
    });

    if (!features) {
      if (!recolorComparison) {
        this.addNoDataLegend();
      }
    } else {
      var uniFeatures;
      if (cls.hexSize === "admin1") {
        uniFeatures = this.getUniqueFeatures(features, "GID_1");
      } else if (cls.hexSize === "admin2") {
        uniFeatures = this.getUniqueFeatures(features, "GID_2");
      } else {
        uniFeatures = this.getUniqueFeatures(features, "hexid");
      }

      var selectedData = uniFeatures.map((x) => x.properties[cls.dataLayer]);

      var breaks = chroma.limits(selectedData, "q", 4);

      var breaks_new = [];
      globals.precision = 1;
      do {
        globals.precision++;
        for (let i = 0; i < 5; i++) {
          breaks_new[i] = parseFloat(breaks[i].toPrecision(globals.precision));
        }
      } while (this.checkForDuplicates(breaks_new) && globals.precision < 10);
      breaks = breaks_new;

      cls.breaks = breaks;

      map.setPaintProperty(cls.hexSize, "fill-color", [
        "interpolate",
        ["linear"],
        ["get", cls.dataLayer],
        breaks[0],
        cls.color[0],
        breaks[1],
        cls.color[1],
        breaks[2],
        cls.color[2],
        breaks[3],
        cls.color[3],
        breaks[4],
        cls.color[4],
      ]);

      if (isNaN(breaks[3]) || breaks[1] == 0) {
        map.setPaintProperty(
          cls.hexSize,
          "fill-opacity",
          0.0 //globals.opacity
        );
        setTimeout(() => {
          map.setFilter(cls.hexSize, null);
        }, 1000);
        if (!recolorComparison) {
          this.addNoDataLegend();
        }
      } else {
        let filterCondition = cls.dataLayer === "depth" ? "<" : ">=";
        map.setFilter(cls.hexSize, [
          //">=",
          filterCondition,
          cls.dataLayer,
          0,
        ]);

        this.emit('layerUpdate', {
          colorRamp: cls.color,
          breaks,
          selectedData,
          precision: this.options.precision
        });

        setTimeout(() => {
          map.setPaintProperty(
            cls.hexSize,
            "fill-opacity",
            globals.opacity // 0.8
          );
        }, 400);
      }
    }
  }
  _bindRecolorListeners() {
    let mapClassInstance = this;
    for (const eventType of ["zoomend", "dragend"]) {
      this.map.on(eventType, () => {
        if (!mapClassInstance.options.bivariateMode) {
          mapClassInstance.recolorBasedOnWhatsOnPage();
        } else {
          let bvls = globals.bivariateLayerState;
          mapClassInstance.createBivariate(
            null,
            bvls.dataLayer[0],
            null,
            bvls.dataLayer[1]
          );
        }
      });
      //
      // //add listener for the comparison map i.e map2
      // this.map2.on(eventType, function (e, mapClassInstance = instance) {
      //   //this. in here would ref the mapboxmap and not our mapClass which has the recolor method
      //   if (debug) {
      //     console.log(
      //       "_bindRecolorListeners",
      //       "event is:",
      //       e,
      //       "instance is:",
      //       instance
      //     );
      //   }
      //
      //   if (!globals.bivariateMode) {
      //     let recolorComparison = true;
      //     mapClassInstance.recolorBasedOnWhatsOnPage(recolorComparison);
      //
      //     mapClassInstance.updateOverlayLegend("main");
      //     mapClassInstance.updateOverlayLegend("comparison");
      //   } else {
      //     console.log("bivariateMode enabled - skipping recolor");
      //   }
      // });
    }
  }
  addNoDataLegend() {
    this.emit('layerUpdate', {
      noData:true
    });
  }
  add3dLayer(map, id) {
    let current = Object.values(globals.sourceData).find((o) => {
      return o.name === globals.currentLayerState.hexSize;
    });
    if(map.getLayer(id)) {
      map.removeLayer(id);
    }
    map.addLayer(
      {
        id: id,
        type: "fill-extrusion",
        source: this.options.currentLayerState.hexSize,
        "source-layer": current.layer,
        layout: {
          visibility: "visible",
        },

        paint: {
          "fill-extrusion-color": [
            "interpolate",
            ["linear"],
            ["get", this.options.currentLayerState.dataLayer],
            this.options.currentLayerState.breaks[0],
            this.options.currentLayerState.color[0],
            this.options.currentLayerState.breaks[1],
            this.options.currentLayerState.color[1],
            this.options.currentLayerState.breaks[2],
            this.options.currentLayerState.color[2],
            this.options.currentLayerState.breaks[3],
            this.options.currentLayerState.color[3],
            this.options.currentLayerState.breaks[4],
            this.options.currentLayerState.color[4],
          ],
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["get", this.options.currentLayerState.dataLayer],
            this.options.currentLayerState.breaks[0],
            0,
            this.options.currentLayerState.breaks[1],
            500,
            this.options.currentLayerState.breaks[2],
            5000,
            this.options.currentLayerState.breaks[3],
            11000,
            this.options.currentLayerState.breaks[4],
            50000,
          ],

          "fill-extrusion-base": !(
            this.options.currentLayerState.dataLayer === "depth"
          )
            ? 0
            : 0,
          "fill-extrusion-opacity": 1,
        },
      },
      this.options.firstSymbolId
    );

    let filterString =
      this.options.currentLayerState.dataLayer === "depth" ? "<" : ">=";

    map.setFilter(id, [
      filterString, // ">="
      this.options.currentLayerState.dataLayer,
      0,
    ]);
  }

  computeBreaksAndColorRamp(
    data,
    colors,
    breakMode,
    numGroups,
    currentBreaks,
  ) {

    let numBreaks = 4; //TODO: DETERMINE THIS IMPLICIT SOURCE
    //calculate breaks and counts for use in histogram
    let histogram_breaks = chroma.limits(data, breakMode, numGroups);
    let break_index = 0;
    let break_counters = Array(numBreaks).fill(0);
    for (let i = 0; i < numGroups; i++) {
      if (histogram_breaks[i] > currentBreaks[break_index + 1]) {
        break_index++;
      }
      break_counters[break_index]++; //increment the counter at current break
    }

    let colorRampNew = [];
    for (let i = 0; i < numBreaks; i++) {
      let colorRampPart = chroma
        .scale([colors[i], colors[i + 1]]) //scale maps numeric values to a color palette
        .mode("lch") //interpolation mode in which the colors are interpolated; affects color output results
        .colors(break_counters[i]); //how many colors to generate in the palette
      colorRampNew = colorRampNew.concat(colorRampPart);
    }

    return {
      colorRamp: colorRampNew,
      histogramBreaks: histogram_breaks,
    };
  }
}
