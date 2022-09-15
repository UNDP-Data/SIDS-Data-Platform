import globals from "@/gis/static/globals.js";
import filepaths from "@/gis/static/filepaths.js";
import constants from "@/gis/static/constants.js";
import chroma from "chroma-js";

import mapboxgl from "@/gis/mapboxgl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import MapboxCompare from "mapbox-gl-compare";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import booleanIntersects from "@turf/boolean-intersects";
import bbox from "@turf/bbox";
import axios from "axios";

import { updateData, on, emit, addOcean, zoomToCountry, changeHexagonSize, add3D, off, changeColor, changeOpacity, changeBasemap, toggleLabels, startRegionAnalisys, toggleBivariateComponents, createBivariate, toggleMapboxGLCompare } from './gisPublicFunctions'
import { onDataClick, onAdminClick, onBivariateClick } from './gisEventHandlers'

export default class Map {
  constructor(containerId, leftMapContainerId, rightMapContainerId
  ) {
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
    this.draw = null;
    this.drawModeDisabled = false;
    this.options = JSON.parse(JSON.stringify(globals))
    this.events={};
    this.options.colorSCheme = {};
    this.options.bivarConfig = {};
    this.updateData = updateData;
    this.on = on;
    this.emit = emit;
    this.off = off;
    this.addOcean = addOcean;
    this.onDataClick = onDataClick;
    this.onAdminClick = onAdminClick;
    this.zoomToCountry = zoomToCountry;
    this.changeHexagonSize = changeHexagonSize;
    this.add3D = add3D;
    this.changeColor = changeColor;
    this.changeOpacity = changeOpacity;
    this.changeBasemap = changeBasemap;
    this.toggleLabels = toggleLabels;
    this.startRegionAnalisys = startRegionAnalisys;
    this.toggleBivariateComponents = toggleBivariateComponents;
    this.createBivariate = createBivariate;
    this.onBivariateClick = onBivariateClick;
    this.toggleMapboxGLCompare = toggleMapboxGLCompare;
    let self = this;
    this.map.on("load", () => {
      this.map.addControl(new mapboxgl.ScaleControl(), "bottom-right");
      this._removeUnusedLayers();
      this._bindMapClickListeners();
      this._bindRecolorListeners();
      this._addPointSources();
      this._addVectorSources();
      this._addVectorSources(true)
      this.getBasemapLabels();
      this.createComparison(containerId, this.map, this.map2);
      this.removeComparison();
      self.map.once('idle', () => {
        self.emit('loadingEnd')
      })
    });
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
    constants.unwantedMapboxLayers.forEach((name) =>{
      if(this.map.getLayer(name)) {
        this.map.removeLayer(name)
      }
      if(this.map2.getLayer(name)) {
        this.map2.removeLayer(name)
      }
    });
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

  _addDataVectorSource(comparison = false, layerId, resolution) {
    let map = !comparison ? this.map : this.map2;
    if (!map.getSource(resolution + layerId)) {
      map.addSource(resolution + layerId, {
        type: "vector",
        promoteId: 'mean',
        tiles: [`https://data.undpgeohub.org/sids-data/${resolution}_${layerId}/{z}/{x}/{y}.pbf`],
        //'minzoom': 3,
        maxzoom: 20, //13.5,
      });
    }
  }
  _removeDataVectorSource(comparison = false, layerId, resolution) {
    let map = !comparison ? this.map : this.map2;
    if (map.getSource(resolution + layerId)) {
      map.removeSource(resolution + layerId);
    }
  }
  _addVectorSources(comparison = false) {
    let map = !comparison ? this.map : this.map2;
    //
    for (let idString of Object.keys(this.options.sources)) {
      console.log(idString)
      if(!map.getSource(idString))
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
    let layerId = activeLayer.layerId;
    if (map.getLayer("ocean")) {
      if (!layerId.includes("fl")) {

        map.removeLayer("ocean");

        cls.hexSize = "hex5";

        let lastSymbol;
        if(this.options.labelsDisabled) {
          lastSymbol =  this.options.firstSymbolId
        }
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
          lastSymbol
        );
      }
    } else if (
      activeLayer.Name === "Ocean Data" &&
      !(activeLayer.layerId === "depths")
    ) {

      cls.hexSize = "ocean";

      for (var layer in constants.userLayers) {
        if (map.getLayer(constants.userLayers[layer])) {
          map.removeLayer(constants.userLayers[layer]);
        }
      }
      let lastSymbol;
      if(this.options.labelsDisabled) {
        lastSymbol =  this.options.firstSymbolId
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
        lastSymbol
      );
    }
  }

  _bindMapClickListeners() {
    let instance = this;
    this.map.on("click", "hex-5km", (e) => {
      instance.clearOnClickQuery(instance.map);
      instance.onDataClick(e, false);
    });

    this.map.on("click", "hex-10km", function (e) {
      instance.clearOnClickQuery(instance.map);
      instance.onDataClick(e, false);
    });

    this.map.on("click", "hex-1km", function (e) {
      instance.clearOnClickQuery(instance.map);
      instance.onDataClick(e, false);
    });

    this.map.on("click", "admin1", function (e) {
      instance.clearOnClickQuery(instance.map);
      instance.onAdminClick(e, false);
    });

    this.map.on("click", "admin2", function (e ) {
        instance.clearOnClickQuery(instance.map);
        instance.onAdminClick(e, false);
      }
    );

    this.map.on("click", "bivariate", function (e) {
        instance.clearOnClickQuery(instance.map);
        instance.onBivariateClick(e, instance.map);
      }
    );

    this.map2.on("click", "hex-5km", (e) => {
      instance.clearOnClickQuery(instance.map2);
      instance.onDataClick(e, true);
    });

    this.map2.on("click", "hex-10km", function (e) {
      instance.clearOnClickQuery(instance.map2);
      instance.onDataClick(e, true);
    });

    this.map2.on("click", "hex-1km", function (e) {
      instance.clearOnClickQuery(instance.map2);
      instance.onDataClick(e, true);
    });

    this.map2.on("click", "hex5clipped", function (e) {
        instance.clearOnClickQuery(instance.map2);
        instance.onDataClick(e, true);
      }
    );

    this.map2.on("click", "ocean", function (e) {
      instance.clearOnClickQuery(instance.map2);
      instance.onDataClick(e, true);
    });

    this.map2.on("click", "admin1", function (e) {
      instance.clearOnClickQuery(instance.map2);
      instance.onAdminClick(e, "admin1", true);
    });

    this.map2.on("click", "admin2", function (e ) {
        instance.clearOnClickQuery(instance.map2);
        instance.onAdminClick(e, "admin2", true);
      }
    );

    this.map2.on("click", "bivariate", function (e) {
        instance.clearOnClickQuery(instance.map2);
        instance.onBivariateClick(e, instance.map);
      }
    );
  }

  clearOnClickQuery() {
    let maps = [this.map]
    if(this.options.compareModeEnabled) {
      maps.push(this.map2)
    }
    maps.map(map => {
      if (this.getLayer("iso", map)) {
        this.removeLayer("iso", map);
        this.removeSource("iso", map);
      }
      for (let id of ["clickedone", "highlightS", "joined"]) {
        if (this.getSource(id, map)) {
          if (id === "highlightS") {
            this.removeLayer("highlight", map);
            this.removeSource(id, map);
          } else {
            if (this.getLayer(id, map)) {
              this.removeLayer(id, map);
            }
            if (this.getSource(id, map)) {
              this.removeSource(id, map);
            }
          }
        }
      }
    })
  }
  getLayer(layerName, comparison = false) {
    let map = comparison ? this.map2 : this.map
    return map.getLayer(layerName)
  }
  removeLayer(layerName, comparison = false) {
    let map = comparison ? this.map2 : this.map
    if(map.getLayer(layerName)){
      return map.removeLayer(layerName)
    }
  }
  getSource(sourceName, comparison = false) {
    let map = comparison ? this.map2 : this.map
    return map.getSource(sourceName)
  }
  removeSource(sourceName, comparison = false) {
    let map = comparison ? this.map2 : this.map
    if(map.getSource(sourceName)){
      return map.removeSource(sourceName)
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
    this.emit('selectionPolyUpdate',
      null
    )
    this.emit('selectionUpdate', {
      value: null
    })
    this.emit('bivariateClick', null)
  }

  recolorBasedOnWhatsOnPage(recolorComparison = false) {
    let map = !recolorComparison ? this.map : this.map2; //this.map;
    let cls = !recolorComparison
      ? this.options.currentLayerState
      : this.options.comparisonLayerState;
    if (!map.getLayer(cls.hexSize)) {
      return;
    }

    var features = map.queryRenderedFeatures({
      layers: [cls.hexSize],
    });

    if (!features || !features.length || !features.some(f => typeof f.properties.mean !== 'undefined')) {
      if (!recolorComparison) {
        this.addNoDataLegend();
      }
    } else {
      var uniFeatures;
      uniFeatures = this.getUniqueFeatures(features, "fid");

      var selectedData = uniFeatures.map((x) => x.properties.mean);
      var breaks = chroma.limits(selectedData, "q", 4);

      var breaks_new = [];
      this.options.precision = 1;

      do {
        self.options.precision++;
        for (let i = 0; i < breaks.length; i++) {
          breaks_new[i] = parseFloat(
            breaks[i].toPrecision(this.options.precision)
          );
        }
        if(self.options.precision > 4)  {
          breaks_new = chroma.limits(selectedData, "e", 4);
          self.options.precision = 1;
          if(self.checkForDuplicates(breaks_new)) {
            breaks_new = breaks_new.map((currentValue, index, array) => {
              if(index === array.length - 1) {
                return currentValue
              }
              array.map((dCurrentValue, dIndex) => {
                if(dIndex <= index) {
                  return
                }
                if(currentValue === dCurrentValue) {
                  breaks_new[dIndex] +=1
                }
              })
              return currentValue
            })
          }
        }
      } while (self.checkForDuplicates(breaks_new));
      breaks = breaks_new;
      cls.breaks = breaks;

      map.setPaintProperty(cls.hexSize, "fill-color", [
        "interpolate",
        ["linear"],
        ["get", 'mean'],
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

      let self = this;
      if (isNaN(breaks[3]) || breaks[1] == 0) {
        map.setPaintProperty(
          cls.hexSize,
          "fill-opacity",
          0.0 //globals.opacity
        );
        setTimeout(() => {
          map.setFilter(cls.hexSize, null);
          if(self.options.mode3d) {
            map.setFilter(cls.hexSize + '-3d', null);
          }
        }, 1000);
        if (!recolorComparison) {
          this.addNoDataLegend();
        }
      } else {
        let filterCondition = cls.dataLayer === "depth" ? "<" : ">=";
        map.setFilter(cls.hexSize, [
          //">=",
          filterCondition,
          'mean',
          0,
        ]);
        if(self.options.mode3d) {
          map.setPaintProperty(cls.hexSize + '-3d', "fill-extrusion-color", [
            "interpolate",
            ["linear"],
            ["get", 'mean'],
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
          map.setFilter(cls.hexSize + '-3d',
          [filterCondition,
          'mean',
          0]);

        }
        this.emit('layerUpdate', {
          activeLayer: this.activeLayer,
          colorRamp: cls.color,
          breaks,
          selectedData,
          precision: this.options.precision
        });

        setTimeout(() => {
          map.setPaintProperty(
            cls.hexSize,
            "fill-opacity",
            this.options.opacity // 0.8
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
          mapClassInstance.createBivariate(
            null,
            this.activeLayer,
            null,
            this.bivarLayer
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
  addNoDataLegend(activeLayer) {
    this.emit('layerUpdate', {
      activeLayer,
      noData:true
    });
  }
  add3dLayer(map, layerState, id) {
    if(map.getLayer(id)) {
      map.removeLayer(id);
    }
    let lastSymbol
    if(this.options.labelsDisabled) {
      lastSymbol =  this.options.firstSymbolId
    }
    map.addLayer(
      {
        id: id,
        type: "fill-extrusion",
        source: layerState.hexSize+layerState.dataLayer,
        "source-layer": layerState.hexSize+'_'+layerState.dataLayer,
        layout: {
          visibility: "visible",
        },

        paint: {
          "fill-extrusion-color": [
            "interpolate",
            ["linear"],
            ["get", 'mean'],
            layerState.breaks[0],
            layerState.color[0],
            layerState.breaks[1],
            layerState.color[1],
            layerState.breaks[2],
            layerState.color[2],
            layerState.breaks[3],
            layerState.color[3],
            layerState.breaks[4],
            layerState.color[4],
          ],
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["get", 'mean'],
            layerState.breaks[0],
            0,
            layerState.breaks[1],
            500,
            layerState.breaks[2],
            5000,
            layerState.breaks[3],
            11000,
            layerState.breaks[4],
            50000,
          ],

          "fill-extrusion-base": !(
            layerState.dataLayer === "depth"
          )
            ? 0
            : 0,
          "fill-extrusion-opacity": 1,
        },
      },
      lastSymbol
    );

    if (map.getLayer(layerState.hexSize)) {
      map.moveLayer(layerState.hexSize, id);
    }

    let filterString =
      layerState.dataLayer === "depth" ? "<" : ">=";

    map.setFilter(id, [
      filterString, // ">="
      'mean',
      0,
    ]);
  }
  _moveServiceLayersToTop(comparison = false) {
    let map = !comparison ? this.map : this.map2; //
    let cls = !comparison
      ? this.options.currentLayerState
      : this.options.comparisonLayerState;
    map.moveLayer(cls.hexSize, "allsids");
    if(this.getLayer('admin1-overlay', comparison)) {
      map.moveLayer(cls.hexSize, 'admin1-overlay');
    }
    if(this.getLayer('admin2-overlay', comparison)) {
      map.moveLayer(cls.hexSize, 'admin2-overlay');
    }
  }
  computeBreaksAndColorRamp(
    data,
    colors
  ) {
    let limitsLength = data.filter((v,i) => { return i==data.lastIndexOf(v); }).length;
    limitsLength = limitsLength > 4 ? 4 : limitsLength;
    var breaks = chroma.limits(data, "q", limitsLength);
    var breaks_new = [];
    this.options.precision = 1;
    do {
      this.options.precision++;
      for (let i = 0; i < breaks.length; i++) {
        breaks_new[i] = parseFloat(
          breaks[i].toPrecision(this.options.precision)
        );
        if(this.options.precision > 4) {
          breaks_new = chroma.limits(data, "l", 4);
          this.options.precision = 1;
        }
      }
    } while (self.checkForDuplicates(breaks_new));
    breaks = breaks_new;
    return {
      colorRamp: colors,
      histogramBreaks: breaks,
    };
  }

  _addDrawListeners() {
    //taken from oldcode implementation in drawFunc.js
    this.map.on("draw.create", drawCreate);
    this.map.on("draw.delete", drawDelete);
    this.map.on("draw.modechange", drawModeChange);
    let self = this;
    function drawModeChange(e) {
      self.emit('selectionPolyUpdate',
        null
      )
      if (e.mode === "simple_select") {
        self.draw.deleteAll();
      }
    }

    function drawDelete() {
      self.map.setFilter(self.options.currentLayerState.hexSize, null); //map.setFilter(currentGeojsonLayers.hexSize, null);
      if(self.options.mode3d) {
        self.map.setFilter(self.options.currentLayerState.hexSize+'-3d', null);
      }
      self.recolorBasedOnWhatsOnPage()
      self.draw.deleteAll(); //delete all drawn features ie. polygons
      self.emit('selectionPolyUpdate',
        null
      )
    }

    function drawCreate(e) {
      self.map.setFilter(self.options.currentLayerState.hexSize, null);
      if(self.options.mode3d) {
        self.map.setFilter(self.options.currentLayerState.hexSize+'-3d', null);
      }
      let createdPolygon = e.features[0];
      let boundBox = bbox(createdPolygon);

      let SW = [boundBox[0], boundBox[1]];
      let NE = [boundBox[2], boundBox[3]];

      let NEPointPixel = self.map.project(NE);
      let SWPointPixel = self.map.project(SW);

      //use mapbox function to first cull features to those within the boundBox of the drawn polygon
      let features3d;
      let features = self.map.queryRenderedFeatures(
        [SWPointPixel, NEPointPixel],
        {
          layers: [self.options.currentLayerState.hexSize],
        }
      );

      if(self.options.mode3d) {
        features3d = self.map.queryRenderedFeatures(
          [SWPointPixel, NEPointPixel],
          {
            layers: [self.options.currentLayerState.hexSize+'-3d'],
          }
        );
      }
      if (features.length > 0) {
        var filter = features.reduce(
          function (memo, feature) {
            if (booleanIntersects(feature, createdPolygon)) {
              memo.push(feature.properties.fid);
            }
            return memo;
          },
          ["in", "fid"] //callback function using reduce - checks if the boundBox rendered features are "in" the array of "hexid"s
        );
        self.map.setFilter(
          self.options.currentLayerState.hexSize,
          filter
        );
        if(self.options.mode3d) {
          var filter3d = features3d.reduce(
            function (memo, feature) {
              if (booleanIntersects(feature, createdPolygon)) {
                memo.push(feature.properties.fid);
              }
              return memo;
            },
            ["in", "fid"] //callback function using reduce - checks if the boundBox rendered features are "in" the array of "hexid"s
          );
          self.map.setFilter(
            self.options.currentLayerState.hexSize+'-3d',
            filter3d
          );
        }
        self.map.once("idle", function () //e
        {
          let info = [];
          let onscreenFeatures = self.map.queryRenderedFeatures({
            layers: [self.options.currentLayerState.hexSize],
          });

          onscreenFeatures.forEach(function (x) {
            info.push(x.properties.mean);
          });
          let max = Math.max(...info);
          let min = Math.min(...info);
          let total = 0;
          for (let i = 0; i < info.length; i++) {
            total += info[i];
          }
          let mean = total / info.length;
          self.emit('selectionPolyUpdate', {
            max,
            min,
            mean
          })
          self.map.once("zoomend", () => {
            self.emit('selectionPolyUpdate', null)
          }).once('dragend', () => {
            self.emit('selectionPolyUpdate', null)
          })
        });
      }
    }
  }
  removeBivariateLayer() {
    if (this.map.getLayer("bivariate")) {
      this.map.removeLayer("bivariate");
      this.map.removeSource("bivariate");
    }
  }
  createComparison(containerId, map1Instance, map2Instance) {
    document.getElementById("map2").classList.remove("d-none"); //enabling show the comparison map
    console.log(MapboxCompare)
    this.mapCompare = new mapboxgl.Compare(
      map1Instance,
      map2Instance,
      containerId,
    );
    map2Instance.setPitch(map1Instance.getPitch());
    map2Instance.setCenter(map1Instance.getCenter());
    map2Instance.setZoom(map1Instance.getZoom());

    map2Instance.resize();
  }
  removeComparison() {
    this.mapCompare.remove();
    document.getElementById("map2").classList.add("d-none");
  }
}
