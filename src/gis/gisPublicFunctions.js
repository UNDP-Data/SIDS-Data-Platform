import colors from "@/gis/static/colors.js";
import chroma from "chroma-js";
import constants from "@/gis/static/constants.js";
import mapboxgl from "@/gis/mapboxgl";

export function updateData(
  activeDataset,
  activeLayer,
  comparison = false
)
{
  let map = !comparison ? this.map : this.map2; //
  let cls = !comparison
    ? this.options.currentLayerState
    : this.options.comparisonLayerState;
  let Field_Name = activeLayer.Field_Name;
  this._handleOceanData(activeDataset, activeLayer, comparison)
  this.clearHexHighlight();
  // this.remove3d();

  cls.dataLayer = Field_Name; //update global to reflect selected datalayer

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

    if (this.options.firstSymbolId) {
      map.moveLayer(cls.hexSize, this.options.firstSymbolId);
    }
  }

  setTimeout(() => {
    var features = map.queryRenderedFeatures({
      layers: [cls.hexSize],
    });
    if (features) {
      var uniFeatures;
      if (cls.hexSize === "admin1") {
        uniFeatures = this.getUniqueFeatures(features, "GID_1");
      } else if (cls.hexSize === "admin2") {
        uniFeatures = this.getUniqueFeatures(features, "GID_2");
      } else {
        uniFeatures = this.getUniqueFeatures(features, "hexid");
      }
      var selectedData = uniFeatures.map((x) => x.properties[Field_Name]);
      console.warn("changeDataOnMap selectedData", selectedData);

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
      } while (this.checkForDuplicates(breaks_new) && this.options.precision < 10);
      breaks = breaks_new;

      var colorRamp = colors.colorSeq["yellow-blue"];

      if (Field_Name.substring(0, 2) === "1a") {
        colorRamp = colors.colorDiv.gdpColor;
      } else if (Field_Name.substring(0, 2) === "1c") {
        colorRamp = colors.colorSeq["pop"];
      } else if (Field_Name === "7d10") {
        colorRamp = colors.colorSeq["combo"];
      } else if (Field_Name === "7d5") {
        colorRamp = colors.colorSeq["minty"];
      } else if (Field_Name === "7d7") {
        colorRamp = colors.colorSeq["blues"];
      } else if (Field_Name === "7d4") {
        colorRamp = colors.colorSeq["pinkish"];
      } else if (Field_Name === "7d8") {
        colorRamp = colors.colorSeq["silvers"];
      } else if (Field_Name === "d") {
        breaks = [-4841, -3805, -2608, -1090, 1322];
        colorRamp = colors.colorSeq["ocean"];
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
          ["get", Field_Name],
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
        if (!comparison) {
          this.addNoDataLegend()
        }
      } else {
        map.setFilter(cls.hexSize, [">=", Field_Name, 0]);
        this.emit('layerUpdate', {
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
            self.options.opacity // 0.8
          );
        }, 100);
      }
    }
    map.once('idle', () => {
      if(this.options.mode3d) {
        this.add3dLayer(map, this.options.currentLayerState.hexSize + "-3d")
      }
    })
  }, 1000);

  map.moveLayer("allsids", this.options.firstSymbolId);
}

export function addOcean(activeDataset, activeLayer, comparison = false) {
  let map = !comparison ? this.map : this.map2; //
  let cls = !comparison
    ? this.options.currentLayerState
    : this.options.comparisonLayerState;

  this.clearHexHighlight();
  // this.remove3d();

  cls.dataLayer = activeLayer.Field_Name; //corresponds to the attributeId
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
            colorRamp: cls.color,
            breaks: cls.breaks,
            selectedData: selectedData,
            precision: this.options.precision
          });
        }
      }
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

  if(!map.getLayer(this.options.currentLayerState.hexSize)) {
    this.options.currentLayerState.hexSize = resolution;
    this.options.comparisonLayerState.hexSize = resolution;
    return
  }
  if(this.options.mode3d) {
    this.map.removeLayer(this.options.currentLayerState.hexSize + "-3d")
  }
  // this.remove3d();
  //update resolution state
  this.options.currentLayerState.hexSize = resolution;
  this.options.comparisonLayerState.hexSize = resolution;

  //clear maplayers that are usercontrolled
  for (var x in constants.userLayers) {
    if (map.getLayer(constants.userLayers[x])) {
      map.removeLayer(constants.userLayers[x]);
    }
    if (this.options.compareMode) {
      if (map2.getLayer(constants.userLayers[x])) {
        map2.removeLayer(constants.userLayers[x]);
      }
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

  map.once('idle', () => {
    if(this.options.mode3d) {
      this.add3dLayer(map, this.options.currentLayerState.hexSize + "-3d")
    }
  })
  // if (globals.compareMode) {
  //   map2.addLayer(options, globals.firstSymbolId);
  // }

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

  if (map.getStyle().name === "Mapbox Satellite") {
    map.moveLayer(resolution);
    // if (globals.compareMode) {
    //   map2.moveLayer(resolution);
    // }
  }

  /*     map.once("idle", function (e) {
      console.log(`map.once on idle triggered by ${e}`);
      console.log("map idle-> recoloring");
      this.recolorBasedOnWhatsOnPage();

      //console.log('change bins');
      //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)
      map.moveLayer(resolution, "allsids");
    }); */
  map.once("idle", () => {

    this.recolorBasedOnWhatsOnPage(); //as it's inside an arrow function this. should refer to the outer scope and should be able to find the function

    //console.log('change bins');
    //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)
    map.moveLayer(resolution, "allsids");

    // this.hideSpinner();
  });
  // map2.once("idle", () => {
  //   if (debug) {
  //     console.log("map2 idle-> recoloring");
  //   }
  //   this.recolorBasedOnWhatsOnPage(map2); //as it's inside an arrow function this. should refer to the outer scope and should be able to find the function
  //
  //   //console.log('change bins');
  //   //map.setPaintProperty(globals.currentLayerState.hexSize, 'fill-opacity', 0.7)
  //   map2.moveLayer(resolution, "allsids");
  //
  //   // this.hideSpinner();
  // });
}

export function add3D() {
  let map = this.map;

  this.clearHexHighlight();

  let id = this.options.currentLayerState.hexSize + "-3d";
  if(!map.getLayer(this.options.currentLayerState.hexSize)) {
    map.easeTo({
      center: map.getCenter(),
      pitch: 55,
    });
    return this.options.mode3d = true;
  }
  if (map.getLayer(id)) {
    map
      .easeTo({
        center: map.getCenter(),
        pitch: 0,
      })
      .removeLayer(id);
      this.options.mode3d = false;
  }
  else {
    this.options.mode3d = true;
    this.add3dLayer(map, id)
    map.easeTo({
      center: map.getCenter(),
      pitch: 55,
    });
  }

  // map.once("idle", () => {
  //   this.hideSpinner();
  // });
}
