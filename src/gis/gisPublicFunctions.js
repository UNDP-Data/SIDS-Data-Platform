import colors from "@/gis/static/colors.js";
import constants from "@/gis/static/constants.js";
import mapboxgl from "@/gis/mapboxgl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

export function updateData(
  activeDataset,
  activeLayer,
  comparison = false
)
{
  this.emit('loadingStart')
  let map = !comparison ? this.map : this.map2; //
  let cls = !comparison
    ? this.options.currentLayerState
    : this.options.comparisonLayerState;
  let layerId = activeLayer.layerId;
  let self = this;
  this.removeLayer(cls.hexSize, comparison)
  this.removeLayer(cls.hexSize+'-3d', comparison)
  this.removeSource(cls.hexSize, comparison)
  if(comparison) {
    this.secondDataset = activeDataset;
    this.secondLayer = activeLayer;
  } else {
    this.activeDataset = activeDataset;
    this.activeLayer = activeLayer;
  }
  this._handleOceanData(activeDataset, activeLayer, comparison)
  this.clearHexHighlight();
  // this.remove3d();

  cls.dataLayer = layerId; //update global to reflect selected datalayer
  if(activeLayer.years) {
    cls.dataLayer = `${layerId}-${activeLayer.activeYear}`
  }
  //-------------------------------------------
  this._addDataVectorSource(comparison, cls.dataLayer, cls.hexSize)
  if (!map.getLayer(cls.hexSize)) {
    map.addLayer({
      id: cls.hexSize,
      type: "fill",
      source: cls.hexSize+cls.dataLayer,
      filter: [">=", "mean", 0],
      "source-layer": cls.hexSize+'_'+cls.dataLayer,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.0,
      },
    });

    if (map.getLayer(this.options.firstSymbolId)) {
      map.moveLayer(cls.hexSize, this.options.firstSymbolId);
    }
  }
  let callback = function (e) {
    if(e.dataType === 'source' && e.sourceDataType !== 'visibility' && e.sourceDataType !== "metadata" && e.sourceId === cls.hexSize+cls.dataLayer && e.isSourceLoaded) {
      self.renderFeatures.apply(self,[map, cls, comparison])
      map.off('sourcedata', callback);
    }
  }
  map.on('sourcedata', callback)
  this._moveServiceLayersToTop(comparison)
}

export function addOcean(activeDataset, activeLayer, comparison = false) {

  this.emit('loadingStart')
  let map = !comparison ? this.map : this.map2; //
  let cls = !comparison
    ? this.options.currentLayerState
    : this.options.comparisonLayerState;
  this.clearHexHighlight();
  // this.remove3d();

  cls.dataLayer = activeLayer.layerId; //corresponds to the attributeId
  cls.hexSize = "ocean";

  cls.breaks = [-4841, -3805, -2608, -1090, 0];
  cls.color = colors.colorNatural["ocean-depth"];

  for (var layer in constants.userLayers) {
    if (map.getLayer(constants.userLayers[layer])) {
      map.removeLayer(constants.userLayers[layer]);
    }
  }

  let layerOptions = {
    id: "ocean",
    type: "fill",
    source: "ocean",
    "source-layer": "oceans",
    layout: {
      visibility: "visible",
    },
    filter: ["<", "depth", 0],
    paint: {
      "fill-color": [
        "interpolate",
        ["linear"],
        ["get", "depth"], //TODO remove this hardcoding
        -4841,
        "#08519c",
        -3805,
        "#3182bd",
        -2608,
        "#6baed6",
        -1090,
        "#bdd7e7",
        1322,
        "#e ff3ff",
      ],
      "fill-opacity": this.options.opacity, //0.8,
    },
  };

  map.addLayer(layerOptions, this.options.firstSymbolId);

  if (!comparison) {
    let waitInterval = 1000;
    setTimeout(() => {
      if (map.areTilesLoaded()) {
        let features = map.queryRenderedFeatures({
          layers: ["ocean"],
        });
        if (features && features.length) {
          let uniFeatures;
          uniFeatures = this.getUniqueFeatures(features, "depth");
          let selectedData = uniFeatures.map((x) => x.properties["depth"]);
          this.emit('layerUpdate', {
            activeLayer,
            colorRamp: cls.color,
            breaks: cls.breaks,
            selectedData: selectedData,
            precision: this.options.precision
          });
        }
      }
      this.emit('loadingEnd')
    }, waitInterval);
  }
}

export function on(eventName, callback) {
  if(this.events[eventName]) {
    this.events[eventName].push(callback)
  }
  else {
    this.events[eventName] = [callback]
  }
}

export function off(eventName, callback) {
  if(this.events[eventName]) {
    var index = this.events[eventName].indexOf(callback);
    if (index !== -1) {
      this.events[eventName].splice(index, 1);
    }
  }
}

export function emit(eventName, event) {
  if(this.events[eventName]){
    this.events[eventName].map(callback => {
      callback(event);
    });
  }
}

export function zoomToCountry(selection) {
    var v2 = new mapboxgl.LngLatBounds(selection.bb);
    this.map.fitBounds(v2, {
      linear: true,
      padding: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },
      pitch: 0,
    });

    // this.remove3d();
    let self = this;
    //contextual recolor hexes
    this.map.once("idle", () => {
      if (!self.map.getLayer("ocean")) {
          self.recolorBasedOnWhatsOnPage()
      }
    });
    // this.map2.once("idle", function () {
    //   if (!self.map2.getLayer("ocean")) {
    //     setTimeout(() => {
    //       self.recolorBasedOnWhatsOnPage(self.map2), 1000;
    //     }); //timeout added to allow data to load in before triggering recolor+legend update
    //   }
    // });
}

export function changeHexagonSize(resolution) {

  let cls = this.options.currentLayerState;
  this.clearHexHighlight();
  this.removeBivariateLayer()
  this.removeLayer(cls.hexSize)
  this.removeLayer(cls.hexSize + "-3d")
  this._removeDataVectorSource(false, cls.dataLayer, cls.hexSize)

  this.options.currentLayerState.hexSize = resolution;

  if(this.activeLayer){
    this.updateData(this.activeDataset, this.activeLayer)
  }
  if(this.options.bivariateMode && this.options.bivarConfig.firstLayer && this.options.bivarConfig.secondLayer) {
    this.createBivariate(
      this.options.bivarConfig.firstDataset,
      this.options.bivarConfig.firstLayer,
      this.options.bivarConfig.secondDataset,
      this.options.bivarConfig.secondLayer
    )
  }

  if (this.options.compareModeEnabled) {
    cls = this.options.comparisonLayerState;
    this.removeLayer(cls.hexSize, true)
    this.removeLayer(cls.hexSize + "-3d", true)
    this._removeDataVectorSource(true, cls.dataLayer, cls.hexSize)
    this.options.comparisonLayerState.hexSize = resolution;
    //get source name
    if(this.secondLayer){
      this.updateData(this.secondDataset, this.secondLayer, true)
    }
  }

  this.options.currentLayerState.hexSize = resolution;
  this.options.comparisonLayerState.hexSize = resolution;
}

export function add3D() {
  let map = this.map;
  let map2 = this.map2;
  let cls = this.options.currentLayerState

  // this.clearHexHighlight();

  let id = cls.hexSize + "-3d";
  if (this.options.mode3d) {
    map.easeTo({
      center: map.getCenter(),
      pitch: 0,
    })
    if(map.getLayer(id)) {
      map.removeLayer(id);
    }
  } else {
    if(map.getLayer(cls.hexSize)) {
      this.add3dLayer(map, this.options.currentLayerState, id)
    }
    map.easeTo({
      center: map.getCenter(),
      pitch: 55,
    });
  }
  id = this.options.comparisonLayerState.hexSize + "-3d";
  if (this.options.mode3d) {
    if(map2.getLayer(id)){
      map2.removeLayer(id);
    }
  } else {
    if(map2.getLayer(this.options.comparisonLayerState.hexSize)) {
      this.add3dLayer(map2, this.options.comparisonLayerState, id)
    }
  }

  this.options.mode3d = !this.options.mode3d;
  // map.once("idle", () => {
  //   this.hideSpinner();
  // });
}


export function changeColor(selectedColor) {
  let cls = this.options.currentLayerState
  let map = this.map;
  let currentColor = cls.color;
  if(selectedColor === ' invert') {
    this.options.colorSCheme.invert = true
  } else {
    this.options.colorSCheme.invert = false,
    this.options.colorSCheme.color = selectedColor
  }
  if(!this.getLayer(cls.hexSize)) {
    return;
  }
  if (selectedColor === "original") {
    cls.color = colors.colorSeq["yellow-blue"];
  }

  if (selectedColor === "invert") {
    let reverse = [...currentColor].reverse();
    this.options.currentLayerState.color = reverse;
  } else if (selectedColor === "red") {
    this.options.currentLayerState.color = colors.colorSeq["pinkish"];
  } else if (selectedColor === "purple") {
    this.options.currentLayerState.color = colors.colorSeq["purple"];
  } else if (selectedColor === "blue") {
    this.options.currentLayerState.color = colors.colorSeq["blues"];
  } else if (selectedColor === "colorblind-safe") {
    this.options.currentLayerState.color = colors.colorSeq["colorBlindGreen"];
  }
  map.setPaintProperty(cls.hexSize, "fill-color", [
    "interpolate",
    ["linear"],
    ["get", 'mean'],
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
  ]);

  if(this.options.mode3d) {
    map.setPaintProperty(cls.hexSize+'-3d', "fill-extrusion-color", [
      "interpolate",
      ["linear"],
      ["get", 'mean'],
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
    ]);
  }

  let features = map.queryRenderedFeatures({
    layers: [cls.hexSize],
  });

  let selectedData = features.map(
    (x) => x.properties.mean
  );
  if(features.length) {
    this.emit('layerUpdate', {
      activeLayer: this.activeLayer,
      colorRamp: this.options.currentLayerState.color,
      breaks: this.options.currentLayerState.breaks,
      selectedData,
      precision: this.options.precision
    });
  }
}

export function changeOpacity(opacity, noUpdate) {
  let map = this.map;
  let map2 = this.map2;
  if(!noUpdate) {
    this.options.opacity = opacity;
  }
  if(this.options.bivariateMode && map.getLayer('bivariate')) {
    return map.setPaintProperty(
      'bivariate',
      "fill-opacity",
      opacity
    );
  }

  if(!this.options.bivariateMode && map.getLayer(this.options.currentLayerState.hexSize)) {
    map.setPaintProperty(
      this.options.currentLayerState.hexSize,
      "fill-opacity",
      opacity
    );
    if (map.getLayer("ocean")) {
      map.setPaintProperty("ocean", "fill-opacity", opacity);
    }
  }

  if(this.options.compareModeEnabled && map2.getLayer(this.options.comparisonLayerState.hexSize)) {
    map2.setPaintProperty(
      this.options.comparisonLayerState.hexSize,
      "fill-opacity",
      opacity
    );
    if (map2.getLayer("ocean")) {
      map2.setPaintProperty("ocean", "fill-opacity", opacity);
    }
  }
}

export function changeBasemap (selectedBasemap) {
  let self = this;
  let map = this.map;
  let map2 = this.map2;

  let thisStyle = Object.values(constants.styles).find((style) => {
    return style.name === selectedBasemap;
  });

  map.setStyle(thisStyle.uri);
  map2.setStyle(thisStyle.uri);
  this._removeUnusedLayers();
  map.once("idle", function () {
    self.getBasemapLabels();
    self._addVectorSources();
    map.once("idle", function () {
      if(self.activeLayer) {
        self.updateData(self.activeDataset, self.activeLayer)
      }
      if(self.options.bivariateMode && self.options.bivarConfig.firstLayer && self.options.bivarConfig.secondLayer) {
        self.createBivariate(
          self.options.bivarConfig.firstDataset,
          self.options.bivarConfig.firstLayer,
          self.options.bivarConfig.secondDataset,
          self.options.bivarConfig.secondLayer,
        )
      }
    })
  })
  map2.once("idle", function () {
    self._addVectorSources(true);
    map.once("idle", function () {
      if(self.secondLayer) {
        self.updateData(self.secondDataset, self.secondLayer, true)
      }
    })
  })
}
export function toggleLabels(label) {
  let map = this.map;
  let map2 = this.map2;
  this.options.labelsDisabled = label;
  if (label == true) {
    this.options.basemapLabels.forEach((x) => {
      map.addLayer(x);
      if (x.type === "line") {
        if (map.getLayer(this.options.currentLayerState.hexSize)) {
          map.moveLayer(x.id, this.options.currentLayerState.hexSize);
        }
        if (map.getLayer(this.options.currentLayerState.hexSize + '-3d')) {
          map.moveLayer(x.id, this.options.currentLayerState.hexSize + '-3d');
        }
      }
    });
  } else {
    this.options.basemapLabels.forEach(function (x) {
      map.removeLayer(x.id);
    });
  }
  if (label == true) {
    this.options.basemapLabels.forEach((x) => {
      map2.addLayer(x);
      if (x.type === "line") {
        if (map2.getLayer(this.options.comparisonLayerState.hexSize + '-3d')) {
          map2.moveLayer(x.id, this.options.comparisonLayerState.hexSize + '-3d');
        }
      }
    });
  } else {
    this.options.basemapLabels.forEach(function (x) {
      map2.removeLayer(x.id);
    });
  }
  // map.once("idle", () => {
  //   this.hideSpinner();
  // });
}

export function startRegionAnalisys(){
  if (this.draw === null) {
    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
      },
    });
    let drawControlsDiv = document.getElementById("drawControls");
    drawControlsDiv.appendChild(
      this.draw.onAdd(this.map)
    );
    this._addDrawListeners(this);
  } else {
    this.map.fire('draw.delete')
  }
  this.draw.changeMode("draw_polygon");
}

export function toggleBivariateComponents(e) {
  this.options.bivariateMode = e;
  if (!e) {
    this.removeBivariateLayer();
    this.changeOpacity(this.options.opacity);
    this.clearHexHighlight();
    this.updateData(this.activeDataset, this.activeLayer)
  } else {
    if(this.options.mode3d) {
      this.add3D()
    }
    this.changeOpacity(0, true);
    this.clearHexHighlight()
  }
}

export function createBivariate(
  firstDataset,
  firstLayer,
  secondDataset,
  secondLayer
) {
  let map = this.map,
  self = this,
  cls = this.options.currentLayerState,
  bvls = this.options.bivariateLayerState;
  this.bivarLayer = secondLayer;
  this.removeLayer('bivar2');
  this._removeDataVectorSource(false, bvls.dataLayer, cls.hexSize);
  this.removeLayer('bivariate');
  this.removeSource('bivariate');
  this.options.bivarConfig = {
    firstDataset,
    firstLayer,
    secondDataset,
    secondLayer
  }
  map.setPaintProperty(
    this.options.currentLayerState.hexSize,
    "fill-opacity",
    0
  );

  if(secondLayer == null || firstLayer == null) {
    return;
  }
  bvls.dataLayer = `${secondLayer.layerId}-${secondLayer.activeYear}`;
  if(
    [firstLayer.Name, secondLayer.Name].includes("Ocean Data") &&
    firstLayer.Name !== secondLayer.Name
  ) {
    return;
  } else {
    this.emit('loadingStart')
    this._addDataVectorSource(false, bvls.dataLayer, cls.hexSize)
    map.addLayer({
      id: 'bivar2',
      type: "fill",
      filter: [">", "mean", 0],
      source: cls.hexSize+bvls.dataLayer,
      "source-layer": cls.hexSize+'_'+bvls.dataLayer,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.0,
      },
    });

    let callback2 = function (e) {
      if(!map.getSource("bivariate") && e.dataType === 'source' && e.sourceDataType !== 'visibility' && e.sourceDataType !== "metadata" && (e.sourceId === cls.hexSize+bvls.dataLayer || e.sourceId === cls.hexSize+cls.dataLayer) && e.isSourceLoaded) {
        map.off('sourcedata', callback2)
        map.addSource("bivariate", {
          type: "geojson",
          data: {
            "type": "FeatureCollection",
            "features": [
            ]
          },
          promoteId: 'mean',
        });
        map.addLayer({
          id: "bivariate",
          source: "bivariate",
          type: "fill",
          filter: [">=", "mean", 0],
          paint: {
            "fill-opacity": self.options.opacity,
          },
        });
        self.renderBivarFeatures.apply(self,[cls, bvls]);
      }
    }
    map.on('sourcedata', callback2)
  }
}

export function toggleMapboxGLCompare() {
  //check for other mode eg. bivariate mode being active
  if (!this.options.compareModeEnabled) {
    this.clearHexHighlight();
    this.createComparison(this.containerId, this.map, this.map2);
  } else {
    this.removeComparison();
  }
  this.options.compareModeEnabled = !this.options.compareModeEnabled;
}
