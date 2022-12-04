import globals from "@/gis/static/globals.js";
import constants from "@/gis/static/constants.js";
import chroma from "chroma-js";
import colors from "@/gis/static/colors.js";
import { featureCollection } from "@turf/helpers";
import mapboxgl from "@/gis/mapboxgl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import MapboxCompare from "mapbox-gl-compare";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";
import booleanIntersects from "@turf/boolean-intersects";
import bbox from "@turf/bbox";

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
        if(map.getLayer("ocean-3d")){
          map.removeLayer("ocean-3d");
        }
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
        if(this.options.mode3d) {
          if (map.getLayer(constants.userLayers[layer]+'-3d')) {
            map.removeLayer(constants.userLayers[layer]+'-3d');
          }
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

  clearOnClickQuery(map) {
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
    if (this.map2.getLayer("clickedone")) {
      this.map2.removeLayer("clickedone");
      this.clearOnClickQuery();
    }
    if (this.map2.getLayer("highlight")) {
      this.map2.removeLayer("highlight");
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
  recolorBivarBasedOnWhatsOnPage() {
    let map = this.map,
    self = this,
    cls = this.options.currentLayerState,
    bvls = this.options.bivariateLayerState;

    let callback = function () {
      let isBothLoaded = map.isSourceLoaded(cls.hexSize+cls.dataLayer) && map.isSourceLoaded(cls.hexSize+bvls.dataLayer)
      if(isBothLoaded) {
        self.renderBivarFeatures.apply(self,[cls, bvls]);
        map.off('sourcedata', callback)
      }
    }
    map.on('sourcedata', callback)
  }
  recolorBasedOnWhatsOnPage(recolorComparison = false) {
    let map = !recolorComparison ? this.map : this.map2; //this.map;
    let cls = !recolorComparison
      ? this.options.currentLayerState
      : this.options.comparisonLayerState;
    console.log(recolorComparison, cls)
    if (!map.getLayer(cls.hexSize)) {
      return;
    }
    let self = this;
    console.log('set callback', cls.hexSize, cls.dataLayer)
    let callback = function () {
      let isloaded = map.isSourceLoaded(cls.hexSize+cls.dataLayer)
      if(isloaded) {
        console.log(cls.hexSize, recolorComparison, 'callback remove')
        self.renderFeatures.apply(self,[map, cls, recolorComparison])
        map.off('sourcedata', callback);
      }
    }
    map.on('sourcedata', callback)
  }
  _bindRecolorListeners() {
    let mapClassInstance = this;
    for (const eventType of ["zoomend", "dragend"]) {
      this.map.on(eventType, () => {
        if (!mapClassInstance.options.bivariateMode) {
          mapClassInstance.recolorBasedOnWhatsOnPage();
        } else {
          mapClassInstance.recolorBivarBasedOnWhatsOnPage()
        }
      });
      this.map.on(eventType, () => {
        if (!mapClassInstance.options.bivariateMode) {
          mapClassInstance.recolorBasedOnWhatsOnPage(true);
        }
      });
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
    map2Instance.setPitch(map1Instance.getPitch());
    map2Instance.setCenter(map1Instance.getCenter());
    map2Instance.setZoom(map1Instance.getZoom());
    document.getElementById("map2").classList.remove("d-none"); //enabling show the comparison map
    console.log(MapboxCompare)
    this.mapCompare = new mapboxgl.Compare(
      map1Instance,
      map2Instance,
      containerId,
    );

    map2Instance.resize();
    this.mapCompare = new mapboxgl.Compare(
      map1Instance,
      map2Instance,
      containerId,
    );
  }
  removeComparison() {
    let cls = this.options.comparisonLayerState;
    this.removeLayer(cls.hexSize, true)
    this.removeLayer(cls.hexSize+'-3d', true)
    this._removeDataVectorSource(true, cls.dataLayer, cls.hexSize)
    this.mapCompare.remove();
    this.removeLayer(this.options.comparisonLayerState.hexSize, this.map2);
    document.getElementById("map2").classList.add("d-none");
  }
  renderFeatures(map, cls, comparison) {
    var features = map.queryRenderedFeatures({
      layers: [cls.hexSize],
    });
    let self = this;
    if (features && features.length && features.some(f => typeof f.properties.mean !== 'undefined')) {
      let uniFeatures;
      uniFeatures = self.getUniqueFeatures(features, "fid");
      let selectedData = uniFeatures.map((x) => x.properties.mean);
      let breaks = chroma.limits(selectedData, "q", 4);
      let breaks_new = [];
      self.options.precision = 1;
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
      let colorRamp;
      if(self.options.colorSCheme.color && self.options.colorSCheme.color !=='original') {
        if (self.options.colorSCheme.color === "red") {
          colorRamp = colors.colorSeq["pinkish"];
        } else if (self.options.colorSCheme.color === "purple") {
          colorRamp = colors.colorSeq["purple"];
        } else if (self.options.colorSCheme.color === "blue") {
          colorRamp = colors.colorSeq["blues"];
        } else if (self.options.colorSCheme.color === "colorblind-safe") {
          colorRamp = colors.colorSeq["colorBlindGreen"];
        }
      } else {
        colorRamp = colors.colorSeq["yellow-blue"];
      }

      if(self.options.colorSCheme.invert) {
        colorRamp = [...colorRamp].reverse()
      }
      cls.breaks = breaks;
      cls.color = colorRamp;
      map.setPaintProperty(cls.hexSize, "fill-color", [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "yellow",
        [
          "interpolate",
          ["linear"],
          ["get", 'mean'],
          breaks[0],
          colorRamp[0],
          breaks[1],
          colorRamp[1],
          breaks[2],
          colorRamp[2],
          breaks[3],
          colorRamp[3],
          breaks[4],
          colorRamp[4],
        ],
      ]);
      map.setFilter(cls.hexSize, [">=", 'mean', 0]);
      this.emit('layerUpdate', {
        activeLayer: !comparison ? this.activeLayer : this.secondLayer,
        colorRamp,
        breaks,
        selectedData,
        precision: this.options.precision
      });
      map.setPaintProperty(
        cls.hexSize,
        "fill-opacity",
        self.options.bivariateMode ? 0 : self.options.opacity // 0.8
      );
    } else {
      self.addNoDataLegend(!comparison ? this.activeLayer : this.secondLayer);
      this.emit('loadingEnd')
    }
    map.once('idle', () => {
      if(this.options.mode3d) {
        let layerState = comparison ? this.options.comparisonLayerState : this.options.currentLayerState
        this.add3dLayer(map, layerState, layerState.hexSize + "-3d")
      }
      this.emit('loadingEnd')
    })
  }
  renderBivarFeatures(cls, bvls) {
    let self = this,
    map = this.map;
    let features = map.querySourceFeatures(cls.hexSize+cls.dataLayer, {
      sourceLayer: [cls.hexSize+'_'+cls.dataLayer]
    });
    let features2 = map.querySourceFeatures(cls.hexSize+bvls.dataLayer, {
      sourceLayer: [cls.hexSize+'_'+bvls.dataLayer]
    });


    if (features && features.length != 0 && features.some(f => typeof f.properties.mean !== 'undefined') && features2 && features2.length != 0 && features2.some(f => typeof f.properties.mean !== 'undefined')) {

      let data_1 = features.map((v) => {
        return v.properties.mean;
      });
      let data_2 = features2.map((v) => {
        return v.properties.mean;
      });

      let X_breaks = chroma.limits(data_1, "q", 3);
      let Y_breaks = chroma.limits(data_2, "q", 3);
      bvls.breaks.X = X_breaks;
      bvls.breaks.Y = Y_breaks;

      let bivar_colors = colors.colorSeqSeq3["blue-pink-purple"];
      bvls.color = bivar_colors;

      let bivarClass = Array(features.length).fill(0);
      let bivarScatter = new Array(10);
      for (let i = 0; i < 10; i++) {
        bivarScatter[i] = [];
      }

      for (let i = 0; i < features.length; i++) {

        let x_val = data_1[i];
        let y_val = data_2[i];

        let range_1, range_2;
        if (x_val < X_breaks[1]) range_1 = 1;
        else if (x_val < X_breaks[2]) range_1 = 2;
        else range_1 = 3;
        if (y_val < Y_breaks[1]) range_2 = 1;
        else if (y_val < Y_breaks[2]) range_2 = 2;
        else range_2 = 3;
        var coord = String(range_1) + String(range_2);
        if (Number.isNaN(x_val) || Number.isNaN(y_val)) {
          coord = null;
        }
        switch (coord) {
          case "11":
            bivarClass[i] = 0;
            break; //LL
          case "12":
            bivarClass[i] = 1;
            break; //LM
          case "13":
            bivarClass[i] = 2;
            break; //LH
          case "21":
            bivarClass[i] = 3;
            break; //ML
          case "22":
            bivarClass[i] = 4;
            break; //MM
          case "23":
            bivarClass[i] = 5;
            break; //MH
          case "31":
            bivarClass[i] = 6;
            break; //HL
          case "32":
            bivarClass[i] = 7;
            break; //HM
          case "33":
            bivarClass[i] = 8;
            break; //HH
          case null: //"Null":
            bivarClass[i] = 9;
            break; //NULL
        }
        bivarScatter[bivarClass[i]].push({ x: x_val, y: y_val }); //assign the bivarPairValues object to the counter of the scatterObject for hte appropriate class
        features[i]["properties"]["bivarClass"] = bivarClass[i]; //adding a property to the hex features; //TODO needs a better way especially for after switch to non-aggregated features
        features[i]["properties"].x_val = x_val
        features[i]["properties"].y_val = y_val
      }

      var fc = featureCollection(features);
      //remove preexisting bivariate layer

      const bivaeSource = map.getSource('bivariate');
      // Update the data after the GeoJSON source was created
      bivaeSource.setData(fc);
      map.setPaintProperty('bivariate', 'fill-color', [
        "step", //step operator
        ["get", "bivarClass"], //the input;retreive a number literal ie. the bivariate class;
        //values changed from Atlases code, the first output value is used if the input value is less than the first numeric-stop value i.e 1
        //his code had the first as 0, which was wrong
        bivar_colors[0],
        1,
        bivar_colors[1],
        2,
        bivar_colors[2],
        3,
        bivar_colors[3],
        4,
        bivar_colors[4],
        5,
        bivar_colors[5],
        6,
        bivar_colors[6],
        7,
        bivar_colors[7],
        8,
        bivar_colors[8],
        9,
        "rgba(255,255,255,0)",
      ]);

      let point_radius;
      if (features.length < 100) {
        point_radius = 3.3;
      } else if (features.length > 1000) {
        point_radius = 1.5;
      } else {
        point_radius = ((features.length - 100) / 100) * 0.2;
      }

      let bivarClasses = [
        "L-L",
        "L-Mid",
        "L-H",
        "Mid-L",
        "Mid-Mid",
        "Mid-H",
        "H-L",
        "H-Mid",
        "H-H",
      ];
      let bivarDatasets = [];
      for (let i = 0; i < 9; i++) {
        bivarDatasets.push({
          label: bivarClasses[i],
          data: bivarScatter[i],
          pointRadius: point_radius,
          pointHoverRadius: 3,
          backgroundColor: bivar_colors[i],
          hoverBorderColor: "rgba(0,0,0,1)",
          pointHoverBorderWidth: 2,
          borderWidth: 1.5,
        });
      }
      map.once('idle',() => {
        self.emit('loadingEnd')
      })
      this.emit('bivarDataUpdate', {
        data:bivarDatasets,
        minX: X_breaks[0], //minimum tick
        maxX: X_breaks[3],
        minY: Y_breaks[0], //minimum tick
        maxY: Y_breaks[3],
        X_breaks,
        Y_breaks
      })
    } else {
      self.removeLayer("bivariate");
      self.removeSource("bivariate");
      self.emit('bivarDataUpdate', {noData: true})
      self.emit('loadingEnd')
    }
  }
}
