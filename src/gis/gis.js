import globals from "@/gis/static/globals.js";
import filepaths from "@/gis/static/filepaths.js";
import constants from "@/gis/static/constants.js";

import mapboxgl from "@/gis/mapboxgl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "mapbox-gl-compare";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import axios from "axios";

import { updateData, on, emit } from './gisPublicFunctions'

export default class Map {
  constructor(containerId, leftMapContainerId, rightMapContainerId) {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2ViYXN0aWFuLWNoIiwiYSI6ImNpejkxdzZ5YzAxa2gyd21udGpmaGU0dTgifQ.IrEd_tvrl6MuypVNUGU5SQ";
    this.containerId = containerId;
    this.map = new mapboxgl.Map({
      container: leftMapContainerId,
      ...constants.mapOptions,
    });
    this.map2 = new mapboxgl.Map({
      container: rightMapContainerId,
      ...constants.mapOptions,
    });
    this.Draw = null;
    this.drawModeDisabled = false;
    this.map.on("load", () => {
      this.map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
      this._removeUnusedLayers();
      // this._initOnClickControl();
      // this._bindMapClickListeners(this);
      // this._bindRecolorListeners(this);
      this._addPointSources();
      this._addVectorSources();
      this.getBasemapLabels();
    });
    this.options = globals
    this.options.myBivariateScatterChart = {};
    this.events={};
    this.updateData = updateData;
    this.on = on;
    this.emit = emit;
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
}
