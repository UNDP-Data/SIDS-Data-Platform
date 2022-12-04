<template>
  <div class="map-container">
    <v-btn
      @click="menuColapsed = !menuColapsed"
      class="button-collapse d-none d-md-block"
      fab
      x-small
      >
      <v-icon
        class="button-collapse_icon"
        :class="{'button-collapse_icon-rotated' : menuColapsed}"
        large
      >
        mdi-chevron-left
      </v-icon>
      <span>

      </span>
    </v-btn>
    <v-chip
      v-if="dualModeEnabled"
      small
      class="mode-chip d-none d-md-block"
      color="primary"
    >
      Comparison mode enabled
    </v-chip>
    <v-chip
      v-if="bivariateModeEnabled"
      small
      class="mode-chip d-none d-md-block"
      color="primary"
    >
      Bivariate mode enabled
    </v-chip>
    <h3
      @click="menuColapsed = !menuColapsed"
      class="d-none d-md-flex map-layer-title"
      v-if="menuColapsed && activeDataset && activeLayer">
        {{activeLayer.activeYear ? activeLayer.title + ' ' +  activeLayer.activeYear : activeLayer.title}}
    </h3>
    <map-controller
      :class="{'data-controller-colapsed': menuColapsed}"
      class="data-controller"
      :dualModeEnabled="dualModeEnabled"
      :bivariateModeEnabled="bivariateModeEnabled"
      :map="map"
      @update="updateMap"
      @updateDual="updateComparisonMap"
      @updateBivariate="updateBivariate"
      @toggleBivariate="toggleBivar"
      @toggleDual="toggleDual"
    />
    <map-toolbar
      class="toolbar"
      :map="map"
      :activeLayer="activeLayer"
      :dualModeEnabled="dualModeEnabled"
      :bivariateModeEnabled="bivariateModeEnabled"
      @toggleBivar="toggleBivar"
      @toggleDual="toggleDual"
    />
    <selection-info
      v-if="map"
      :map="map"
      :activeLayer="activeLayer"
      :secondLayer="secondLayer"
    />
    <map-loader
      v-if="gisLoader"
    />
    <layer-legend-small class="d-none d-md-flex layer-legend-small" v-if="map"
      :class="{'layer-legend-small_hidden' : !menuColapsed}"
      :activeLayer="activeLayer"
      :map="map"
    />
    <div id="mapsContainer">
      <div id="map">
        <!-- <div class="loader-gis-modal">
          <grid-loader
            class="loader-gis display-none"
            :loading="gisLoader.loading"
            :color="gisLoader.color"
            :size="gisLoader.size"
          ></grid-loader>
        </div> -->
      </div>

      <div id="map2"></div>
    </div>
  </div>
</template>

<script>
import GIS from "@/gis/gis";
import MapController from "./children/MapController";
import LayerLegendSmall from "./children/LayerLegendSmall";
import SelectionInfo from "./children/SelectionInfo";
import MapToolbar from "./children/MapToolbar";
import MapLoader from "./children/MapLoader";

export default {
  name: "GeospatialData",
  data() {
    return {
      activeDataset:null,
      activeLayer:null,
      secondDataset:null,
      secondLayer: null,
      map: null,
      menuColapsed:false,
      dualModeEnabled: false,
      bivariateModeEnabled: false,
      gisLoader: true,
    };
  },
  components: {
    MapToolbar,
    MapController,
    SelectionInfo,
    MapLoader,
    LayerLegendSmall
  },
  methods: {
    toggleBivar(e) {
      if(this.bivariateModeEnabled === e) {
        return
      }
      if(this.dualModeEnabled){
        this.toggleDual(!this.dualModeEnabled)
      }
      this.bivariateModeEnabled = e;
      this.map.toggleBivariateComponents(e);
      if(this.bivariateModeEnabled) {
        this.updateBivariate({
          dataset: this.activeDataset,
          layer: this.activeLayer,
          secondDataset: this.secondDataset,
          secondLayer: this.secondLayer
        })
      }
    },
    toggleDual(e) {
      console.log(e)
      if(this.dualModeEnabled === e) {
        return
      }
      if(this.bivariateModeEnabled){
        this.toggleBivar(!this.bivariateModeEnabled)
      }
      this.dualModeEnabled = e;
      this.map.toggleMapboxGLCompare(e);
      if(this.dualModeEnabled) {
        this.updateMap({
          dataset: this.activeDataset,
          layer: this.activeLayer
        })
        this.updateComparisonMap({
          dataset: this.secondDataset,
          layer: this.secondLayer
        })
      }
    },
    updateBivariate({dataset, layer, secondDataset, secondLayer}) {
      this.activeDataset = dataset;
      this.activeLayer = layer;
      this.secondDataset = secondDataset;
      this.secondLayer = secondLayer;
      this.map.createBivariate(
        dataset,
        layer,
        secondDataset,
        secondLayer
      );
    },
    updateComparisonMap(e) {
      this.secondDataset = e.dataset;
      this.secondLayer = e.layer;
      if (e.layer) {
        if (e.layer.Name === "Ocean Data") {
          if (e.layer.Field_Name === "depth") {
            this.map.addOcean(e.dataset, e.layer, true);
          } else {
            this.map.updateData(e.dataset, e.layer, true);
          }
        } else {
          this.map.updateData(e.dataset, e.layer, true);
        }
      }
    },
    updateMap(e) {
      this.activeDataset = e.dataset
      this.activeLayer = e.layer
      if (e.layer) {
        if (e.layer.Name === "Ocean Data") {
          if (e.layer.Field_Name === "depth") {
            this.map.addOcean(e.dataset, e.layer);
          } else {
            this.map.updateData(e.dataset, e.layer);
          }
        } else {
          this.map.updateData(e.dataset, e.layer);
        }
      }
    },
    enebleLoader() {
      this.gisLoader = true;
    },
    disableLoder() {
      this.gisLoader = false;
    }
  },
  mounted() {
    this.map = new GIS("#mapsContainer", "map", "map2");
    this.map.on('loadingStart', this.enebleLoader)
    this.map.on('loadingEnd', this.disableLoder)
  },
  unmounted() {
    this.map.off('loadingStart', () => {
      this.gisLoader = true;
    })
    this.map.off('loadingEnd', () => {
      this.gisLoader = false;
    })
  }
};
</script>
<style media="screen">
.toolbar {
  position:absolute;
  z-index:98;
  top: 2em;
  right:11px;
}
.map-layer-title {
  position: absolute;
  z-index: 98;
  top: 4px;
  left: 5px;
  background: #f5f5f5;
  padding-left: 3.5em;
  padding-right: 1em;
  height: 50px;
  align-items: center;
  display: flex;
  border-radius: 25px;
}

.layer-legend-small {
  position: absolute;
  z-index: 98;
  left: 5px;
  bottom: 5px;
  min-width: 200px;
}
.layer-legend-small.layer-legend-small_hidden {
  display: none !important;
}
/* portrait devices smaller than tablets */
@media (orientation: portrait) and (max-width: 750px) {
  .landscape-enforcer {
    display: block;
  }
}
/* portrait devices as big as tablets */
@media (orientation: portrait) and (min-width: 750px) {
  .landscape-enforcer {
    display: none;
  }
}

/* landscape for devices smaller than laptops */
@media (orientation: landscape) and (max-width: 1200px) {
  .analysis-tools {
    display: none !important;
    /* used to hide analysis tools from mobile devices */
  }
}

/* */
@media (orientation: landscape) {
  .landscape-enforcer {
    display: none;
  }
}

.mapboxgl-popup-content {
  overflow-y: scroll;
  overflow-x: scroll;
  max-height: 50vh;
}

#map,
#map2 {
  height: 100vh;
  width: 100%;
}
.map-container {
  position: relative;
  padding: 0 !important;
  height: 100vh;
  width: 100%;
}
.data-controller {
  position: absolute;
  left: 2em;
  top: 2em;
  width: 400px;
  z-index: 999;
  transition: 0.5s ease-in-out all;
  opacity: 1;
}
/* FOR LEGEND ??*/

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  display: none;
}

::-webkit-scrollbar-thumb {
  background: #9e9e9e;
  border-radius: 10px;
}

/* onclick of hexes mapbox control bottom-right */
.my-custom-control {
  /* display: block; */
  display: none;
  background-color: rgba(221, 221, 221, 0.9);
  height: 0px;
  width: 0px;
  padding: 5px;
}

.data-controller-colapsed {
  opacity: 0;
  z-index: -999;
  left: -30px;
  pointer-events: none;
}

.mapbox-gl-draw_polygon.active,
.mapbox-gl-draw_polygon.active:hover {
  background-color: rgb(42, 155, 42);
}

#mapsContainer {
  /* position: relative; */
  /*  height: 100%;
  width: 100%; */
  height: 100vh;
}
#mapsContainer #map,
#mapsContainer #map2 {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
}
.button-collapse {
  position:absolute;
  top: 4px;
  left: 4px;
  z-index: 1000;
  background: rgba(221, 221, 221, 0.9);
}
.button-collapse_icon {
  transform: rotate(0deg);
  transition: all 200ms;
}
.button-collapse_icon-rotated {
  transform: rotate(180deg);
}
.mode-chip {
  position: absolute;
  top: 20px;
  left: 60px;
  z-index: 1000;
}

@media (max-width:959px) {
  .toolbar {
    top: auto;
    bottom: 40px;
    width: 100%;
    max-width: calc(95% - 140px);
    left: 5%;
  }

  #mapsContainer, .map-container {
    height: calc(100vh - 68px);
  }
  #mapsContainer #map,
  #mapsContainer #map2  {
    height: calc(100vh - 68px);
    width: 100%;
  }
  .data-controller {
    width: 90%;
    left: 5%;
  }
}
</style>
