import colors from "@/gis/static/colors.js";
import chroma from "chroma-js";
import constants from "@/gis/static/constants.js";
import mapboxgl from "@/gis/mapboxgl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { featureCollection } from "@turf/helpers";

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
  if(!comparison) {
    this.activeDataset = activeDataset;
    this.activeLayer = activeLayer;
  } else {
    this.secondDataset = activeDataset;
    this.secondLayer = activeLayer;
  }
  this._handleOceanData(activeDataset, activeLayer, comparison)
  this.clearHexHighlight();
  // this.remove3d();

  cls.dataLayer = layerId; //update global to reflect selected datalayer

  //-------------------------------------------
  if (!map.getSource("hex5")) {
    this._addVectorSources(comparison);
  }
  if (!map.getLayer(cls.hexSize)) {
    let currentSourceData = this.options.sourceData[`${cls.hexSize}Source`]
    map.addLayer({
      id: cls.hexSize,
      type: "fill",
      source: cls.hexSize,
      "source-layer": currentSourceData.layer,
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
  let self = this;
  setTimeout(() => {
    var features = map.queryRenderedFeatures({
      layers: [cls.hexSize],
    });
    if (features) {
      var uniFeatures;
      if (cls.hexSize === "admin1") {
        uniFeatures = self.getUniqueFeatures(features, "GID_1");
      } else if (cls.hexSize === "admin2") {
        uniFeatures = self.getUniqueFeatures(features, "GID_2");
      } else {
        uniFeatures = self.getUniqueFeatures(features, "hexid");
      }
      var selectedData = uniFeatures.map((x) => x.properties[layerId]);

      var breaks = chroma.limits(selectedData, "q", 4);

      var breaks_new = [];
      this.options.precision = 1;
      do {
        this.options.precision++;
        for (let i = 0; i < 5; i++) {
          breaks_new[i] = parseFloat(
            breaks[i].toPrecision(this.options.precision)
          );
        }
      } while (self.checkForDuplicates(breaks_new) && this.options.precision < 10);
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

        if (layerId.substring(0, 2) === "1a") {
          colorRamp = colors.colorDiv.gdpColor;
        } else if (layerId.substring(0, 2) === "1c") {
          colorRamp = colors.colorSeq["pop"];
        } else if (layerId === "7d10") {
          colorRamp = colors.colorSeq["combo"];
        } else if (layerId === "7d5") {
          colorRamp = colors.colorSeq["minty"];
        } else if (layerId === "7d7") {
          colorRamp = colors.colorSeq["blues"];
        } else if (layerId === "7d4") {
          colorRamp = colors.colorSeq["pinkish"];
        } else if (layerId === "7d8") {
          colorRamp = colors.colorSeq["silvers"];
        } else if (layerId === "d") {
          breaks = [-4841, -3805, -2608, -1090, 1322];
          colorRamp = colors.colorSeq["ocean"];
        }
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
          ["get", layerId],
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

      if (isNaN(breaks[3]) || breaks[1] == 0) {
        map.setPaintProperty(
          cls.hexSize,
          "fill-opacity",
          0.0
          //this.options.opacity
        );
        setTimeout(() => {
          map.setFilter(cls.hexSize, null);
        }, 100);
        this.addNoDataLegend(activeLayer)
      } else {
        map.setFilter(cls.hexSize, [">=", layerId, 0]);
        this.emit('layerUpdate', {
          activeLayer,
          colorRamp,
          breaks,
          selectedData,
          precision: this.options.precision
        });
        let self = this;
        setTimeout(() => {
          map.setPaintProperty(
            cls.hexSize,
            "fill-opacity",
            self.options.bivariateMode ? 0 : self.options.opacity // 0.8
          );
        }, 100);
      }
    }
    map.once('idle', () => {
      if(this.options.mode3d) {
        let layerState = comparison ? this.options.comparisonLayerState : this.options.currentLayerState
        this.add3dLayer(map, layerState, layerState.hexSize + "-3d")
      }
      this.emit('loadingEnd')
    })
  }, 1000);
  if(map.getLayer('allsids')) {
    map.moveLayer("allsids", this.options.firstSymbolId);
  }
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
        "#eff3ff",
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
        if (features) {
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
  let map = this.map;
  let map2 = this.map2;

  this.clearHexHighlight();

  if(this.options.mode3d) {
    this.removeLayer(this.options.currentLayerState.hexSize + "-3d", this.map)
  }
  if(this.options.mode3d && this.options.compareModeEnabled) {
    this.removeLayer(this.options.currentLayerState.hexSize + "-3d", this.map2)
  }

  if(this.options.bivariateMode) {
    this.removeBivariateLayer()
  }

  if(map.getLayer(this.options.currentLayerState.hexSize)) {

    this.options.currentLayerState.hexSize = resolution;
    //clear maplayers that are usercontrolled
    for (let x in constants.userLayers) {
      if (map.getLayer(constants.userLayers[x])) {
        map.removeLayer(constants.userLayers[x]);
      }
    }

    //get source name
    let currentSourceData = Object.values(this.options.sourceData).find((o) => {
      return o.name === this.options.currentLayerState.hexSize;
    });

    let options = {
      id: resolution,
      type: "fill",
      source: resolution,
      "source-layer": currentSourceData.layer,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.0, //globals.opacity, // 0
      },
    };
    map.addLayer(options, this.options.firstSymbolId);
    let self = this;
    map.once('idle', () => {
      if(this.options.mode3d) {
        self.add3dLayer(map, this.options.currentLayerState , this.options.currentLayerState.hexSize + "-3d")
      }
      if(self.options.bivariateMode) {
        self.createBivariate(
          self.options.bivarConfig.firstDataset,
          self.options.bivarConfig.firstLayer,
          self.options.bivarConfig.secondDataset,
          self.options.bivarConfig.secondLayer
        )
      }
      map.once("idle", () => {
        this.recolorBasedOnWhatsOnPage();
        map.moveLayer(resolution, "allsids");
      });
    })

    if (map.getStyle().name === "Mapbox Satellite") {
      map.moveLayer(resolution);
    }


    map.once("idle", () => {
      this.recolorBasedOnWhatsOnPage();
      map.moveLayer(resolution, "allsids");
    });
  }
  if (this.options.compareModeEnabled && map2.getLayer(this.options.comparisonLayerState.hexSize)) {
    for (let x in constants.userLayers) {
      if (map2.getLayer(constants.userLayers[x])) {
        map2.removeLayer(constants.userLayers[x]);
      }
    }
    this.options.comparisonLayerState.hexSize = resolution;
    let currentSourceData = Object.values(this.options.sourceData).find((o) => {
      return o.name === this.options.comparisonLayerState.hexSize;
    });

    let options = {
      id: resolution,
      type: "fill",
      source: resolution,
      "source-layer": currentSourceData.layer,
      layout: {
        visibility: "visible",
      },
      paint: {
        "fill-color": "blue",
        "fill-opacity": 0.0, //globals.opacity, // 0
      },
    };
    map2.addLayer(options, this.options.firstSymbolId);
    map2.once("idle", () => {
      this.recolorBasedOnWhatsOnPage(true);
      map2.moveLayer(resolution, "allsids");
    });
  }

  this.options.currentLayerState.hexSize = resolution;
  this.options.comparisonLayerState.hexSize = resolution;
  /* if (resolution === "hex1") {
      //showing loader in expectation of hex1 taking longer to display
      // $(".loader-gis").show();
      console.log("handling spinner for hex1 loading");
      this.showSpinner();

      map.once("idle", () => {
        // $(".loader-gis").hide();
        this.hideSpinner();
      });
    } */


  /*     map.once("idle", function (e) {
      console.log(`map.once on idle triggered by ${e}`);
      console.log("map idle-> recoloring");
      this.recolorBasedOnWhatsOnPage();

      //console.log('change bins');
      //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)
      map.moveLayer(resolution, "allsids");
    }); */
}

export function add3D() {
  let map = this.map;
  let map2 = this.map2;

  this.clearHexHighlight();

  let id = this.options.currentLayerState.hexSize + "-3d";
  if (this.options.mode3d) {
    map.easeTo({
      center: map.getCenter(),
      pitch: 0,
    })
    if(map.getLayer(id)) {
      map.removeLayer(id);
    }
  } else {
    if(map.getLayer(this.options.currentLayerState.hexSize)) {
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
  let map = this.map;
  let currentColor = this.options.currentLayerState.color;
  if(selectedColor === ' invert') {
    this.options.colorSCheme.invert = true
  } else {
    this.options.colorSCheme.invert = false,
    this.options.colorSCheme.color = selectedColor
  }
  if(!this.getLayer(this.options.currentLayerState.hexSize)) {
    return;
  }
  if (selectedColor === "original") {
    if (this.options.currentLayerState.dataLayer === "depth") {
      this.options.currentLayerState.color = colors.colorNatural["ocean-depth"]; //colors.colorSeq["ocean"];
    } else if (this.options.currentLayerState.dataLayer.substring(0, 2) === "1a") {
      this.options.currentLayerState.color = colors.colorDiv.gdpColor;
    } else if (this.options.currentLayerState.dataLayer.substring(0, 2) === "1c") {
      this.options.currentLayerState.color = colors.colorSeq["pop"];
    } else if (this.options.currentLayerState.dataLayer === "7d10") {
      this.options.currentLayerState.color = colors.colorSeq["combo"];
    } else if (this.options.currentLayerState.dataLayer === "7d5") {
      this.options.currentLayerState.color = colors.colorSeq["minty"];
    } else if (this.options.currentLayerState.dataLayer === "7d7") {
      this.options.currentLayerState.color = colors.colorSeq["blues"];
    } else if (this.options.currentLayerState.dataLayer === "7d4") {
      this.options.currentLayerState.color = colors.colorSeq["pinkish"];
    } else if (this.options.currentLayerState.dataLayer === "7d8") {
      this.options.currentLayerState.color = colors.colorSeq["silvers"];
    } else if (this.options.currentLayerState.dataLayer === "d") {
      //breaks = [-4841, -3805, -2608, -1090, 1322];
      this.options.currentLayerState.color = colors.colorNatural["ocean-depth"]; //colors.colorSeq["ocean"];
    } else {
      this.options.currentLayerState.color = colors.colorSeq["yellow-blue"];
    }
  }

  if (selectedColor === "invert") {
    // var reverse = currentColor.reverse();
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
  map.setPaintProperty(this.options.currentLayerState.hexSize, "fill-color", [
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
  ]);

  if(this.options.mode3d) {
    map.setPaintProperty(this.options.currentLayerState.hexSize+'-3d', "fill-extrusion-color", [
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
    ]);
  }

  let features = map.queryRenderedFeatures({
    layers: [this.options.currentLayerState.hexSize],
  });

  let selectedData = features.map(
    (x) => x.properties[this.options.currentLayerState.dataLayer]
  );

  let breaksAndColors= this.computeBreaksAndColorRamp(
    selectedData,
    this.options.currentLayerState.color,
     "q", 4,
    this.options.currentLayerState.breaks
  );

  this.emit('layerUpdate', {
    colorRamp: breaksAndColors.colorRamp,
    breaks: breaksAndColors.histogramBreaks,
    selectedData,
    precision: this.options.precision
  });
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

  // let currentBasemap = map.getStyle().name;

  let thisStyle = Object.values(constants.styles).find((style) => {
    return style.name === selectedBasemap;
  });

  map.setStyle(thisStyle.uri);
  map2.setStyle(thisStyle.uri);
  this._removeUnusedLayers();

  //when done, update: firstSymbolId, basemapLabels

  map.once("idle", function () {
    self.getBasemapLabels();
    self._addVectorSources();
    // let currentSource = Object.values(globals.sourceData).find((o) => {
    //   return o.name === globals.currentLayerState.hexSize;
    // });

    // let cls = globals.currentLayerState;

    map.once("idle", function () {
      if(self.activeLayer) {
        self.updateData(self.activeDataset, self.activeLayer)
      }
    })
    // try {
    //   map.addLayer(
    //     {
    //       id: cls.hexSize,
    //       type: "fill",
    //       source: cls.hexSize,
    //       "source-layer": currentSource.layer,
    //       layout: {
    //         visibility: "visible",
    //       },
    //       paint: {
    //         "fill-opacity": globals.opacity, //0.8
    //         "fill-color": [
    //           "interpolate",
    //           ["linear"],
    //           ["get", cls.dataLayer],
    //           cls.breaks[0],
    //           cls.color[0],
    //           cls.breaks[1],
    //           cls.color[1],
    //           cls.breaks[2],
    //           cls.color[2],
    //           cls.breaks[3],
    //           cls.color[3],
    //           cls.breaks[4],
    //           cls.color[4],
    //         ],
    //       },
    //     },
    //     globals.firstSymbolId
    //   );
    //
    //   let filterString = cls.dataLayer === "depth" ? "<=" : ">=";
    //   map.setFilter(cls.hexSize, [filterString, cls.dataLayer, 0]);
    //   map.moveLayer("allsids", globals.firstSymbolId);
    // }

    // self._addVectorSources(true);
    // let comparisonSource = Object.values(this.options.sourceData).find((o) => {
    //   return o.name === this.options.comparisonLayerState.hexSize;
    // });

    // let comparison_cls = this.options.comparisonLayerState;

  //   try {
  //     map2.addLayer(
  //       {
  //         id: comparison_cls.hexSize,
  //         type: "fill",
  //         source: comparison_cls.hexSize,
  //         "source-layer": comparisonSource.layer,
  //         layout: {
  //           visibility: "visible",
  //         },
  //         paint: {
  //           "fill-opacity": globals.opacity, //0.8
  //           "fill-color": [
  //             "interpolate",
  //             ["linear"],
  //             ["get", comparison_cls.dataLayer],
  //             comparison_cls.breaks[0],
  //             comparison_cls.color[0],
  //             comparison_cls.breaks[1],
  //             comparison_cls.color[1],
  //             comparison_cls.breaks[2],
  //             comparison_cls.color[2],
  //             comparison_cls.breaks[3],
  //             comparison_cls.color[3],
  //             comparison_cls.breaks[4],
  //             comparison_cls.color[4],
  //           ],
  //         },
  //       },
  //       globals.firstSymbolId
  //     );
  //
  //     let filterString = comparison_cls.dataLayer === "depth" ? "<=" : ">=";
  //     map2.setFilter(comparison_cls.hexSize, [
  //       filterString,
  //       comparison_cls.dataLayer,
  //       0,
  //     ]);
  //
  //     map2.moveLayer("allsids", globals.firstSymbolId); //ensure allsids outline ontop
  //   } catch (err) {
  //     if (debug) {
  //       console.warn(
  //         "attempted while no data layer is loaded on comparison map"
  //       );
  //       console.warn(err.stack);
  //     }
  //     //placed to catch error when attempted while no data layer is loaded on main map
  //   }
  //
  //   self.hideSpinner();
  });
  if(this.options.compareModeEnabled) {
    map2.once("idle", function () {
      self._addVectorSources(true);
      map2.once("idle", function () {
        if(self.secondDataset) {
          self.updateData(self.secondDataset, self.secondLayer, true)
        }
      });
    });
  }
}
export function toggleLabels(label) {
  let map = this.map;
  let map2 = this.map2;
  this.options.labelsDisabled = label;
  if (label == true) {
    this.options.basemapLabels.forEach((x) => {
      //console.log(x);
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
    this.clearHexHighlight()
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
  this.options.bivarConfig = {
    firstDataset,
    firstLayer,
    secondDataset,
    secondLayer
  }
  bvls.dataLayer[0] = firstLayer;
  bvls.dataLayer[1] = secondLayer;

  if(secondLayer == null || firstLayer == null) {
    return;
  }
  if(
    [firstLayer.Name, secondLayer.Name].includes("Ocean Data") &&
    firstLayer.Name !== secondLayer.Name
  ) {
    return;
  } else {
    let features = map.querySourceFeatures(cls.hexSize, {
      sourceLayer: [cls.hexSize === "ocean" ? "oceans" : cls.hexSize]
    });
    if (features?.length != 0) {
      this.emit('loadingStart')
      // let uniqueFeatures;
      let idProperty = null;
      // if (cls.hexSize === "admin1") {
      //   uniqueFeatures = this.getUniqueFeatures(features, "GID_1");
      //   idProperty = "GID_1";
      // } else if (cls.hexSize === "admin2") {
      //   uniqueFeatures = this.getUniqueFeatures(features, "GID_2");
      //   idProperty = "GID_2";
      // } else {
      //   uniqueFeatures = this.getUniqueFeatures(features, "hexid");
      // }

      let featuresUsed = features;
      let attrId_1 = firstLayer.layerId;
      let attrId_2 = secondLayer.layerId;
      let negativeAttrIds = ["depth"];

      let data_1 = featuresUsed.map((x_feat) => {
        let isNegative = negativeAttrIds.includes(attrId_1) ? -1 : 1;
        let propertyValue = x_feat.properties[attrId_1];
        return propertyValue * isNegative;
      });
      let data_2 = featuresUsed.map((y_feat) => {
        let isNegative = negativeAttrIds.includes(attrId_2) ? -1 : 1;
        let propertyValue = y_feat.properties[attrId_2];
        return propertyValue * isNegative;
      });

      let hasData = {
        data_1: data_1.some((x) => !Number.isNaN(x)),
        data_2: data_2.some((y) => !Number.isNaN(y)),
      };

      if (!hasData.data_1 || !hasData.data_2) {
        if (map.getLayer("bivariate")) {
          map.removeLayer("bivariate");
          map.removeSource("bivariate");
        }
        return;
      }

      let X_breaks = chroma.limits(data_1, "q", 3);
      let Y_breaks = chroma.limits(data_2, "q", 3);
      bvls.breaks.X = X_breaks;
      bvls.breaks.Y = Y_breaks;

      let bivar_colors = colors.colorSeqSeq3["blue-pink-purple"];
      bvls.color = bivar_colors;

      let bivarClass = Array(featuresUsed.length).fill(0);
      let bivarScatter = new Array(10);
      for (let i = 0; i < 10; i++) {
        bivarScatter[i] = [];
      }

      for (let i = 0; i < featuresUsed.length; i++) {

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
        featuresUsed[i]["properties"]["bivarClass"] = bivarClass[i]; //adding a property to the hex features; //TODO needs a better way especially for after switch to non-aggregated features
      }

      var fc = featureCollection(featuresUsed);
      //remove preexisting bivariate layer
      if (map.getLayer("bivariate")) {
        map.removeLayer("bivariate");
        map.removeSource("bivariate");
      }

      map.addSource("bivariate", {
        type: "geojson",
        data: fc,
        promoteId: idProperty,
      });
      map.addLayer({
        id: "bivariate",
        source: "bivariate",
        type: "fill",
        paint: {
          "fill-color": [
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
          ],
          "fill-opacity": self.options.opacity,
        },
      });

      if (!cls.hexSize === "bivariate") {
        cls.hexSize = "bivariate";
      }
      let point_radius;
      if (featuresUsed.length < 100) {
        point_radius = 3.3;
      } else if (featuresUsed.length > 1000) {
        point_radius = 1.5;
      } else {
        point_radius = ((featuresUsed.length - 100) / 100) * 0.2;
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
      return;
    }
  }
}

export function toggleMapboxGLCompare() {
  //check for other mode eg. bivariate mode being active
  if (this.options.bivariateModeEnabled) {
    return;
  }
  if (!this.options.compareModeEnabled) {
    this.createComparison(this.containerId, this.map, this.map2);
  } else {
    this.removeComparison();
  }
  this.options.compareModeEnabled = !this.options.compareModeEnabled;
}
