<template>
  <div class="d-flex toolbar-container">
    <div class="button-wrapper">
      <map-country-selector
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-admin-boundaries-controller
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-resolution-controller
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-3d-controller
        @toggle3d="toggle3d"
        :map="map"
        :disabled="bivariateModeEnabled"
      />
    </div>
    <div class="button-wrapper">
      <map-color-selector
        :disabled="dualModeEnabled"
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-opacity-controller
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-basemap-selector
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-labels-controller
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-bivar v-if="map"
        @toggleBivar="toggleBivar"
        :bivarEnabled="bivariateModeEnabled"
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-regional-analysis v-if="map"
        :disabled="dualModeEnabled"
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-dual
        @toggleDual="toggleDual"
        :dualEnabled="dualModeEnabled"
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-file-upload
      />
    </div>
  </div>
</template>

<script>
import MapCountrySelector from './MapCountrySelector'
import MapAdminBoundariesController from './MapAdminBoundariesController'
import MapResolutionController from './MapResolutionController'
import Map3dController from './Map3dController'
import MapColorSelector from './MapColorSelector'
import MapFileUpload from './MapFileUpload'
import MapOpacityController from './MapOpacityController'
import MapBasemapSelector from './MapBasemapSelector'
import MapLabelsController from './MapLabelsController'
import MapRegionalAnalysis from './MapRegionalAnalysis'
import MapBivar from './MapBivar'
import MapDual from './MapDual'


export default {
  name: 'MapToolbap',
  data() {
    return {
      enabled3d:false,
    }
  },
  components: {
    MapCountrySelector,
    MapAdminBoundariesController,
    MapResolutionController,
    Map3dController,
    MapColorSelector,
    MapOpacityController,
    MapBasemapSelector,
    MapFileUpload,
    MapLabelsController,
    MapRegionalAnalysis,
    MapBivar,
    MapDual
  },
  props:[
    'map',
    'dualModeEnabled',
    'bivariateModeEnabled'
  ],
  methods: {
    toggle3d(e) {
      this.enabled3d = e;
    },
    toggleBivar(e) {
      this.$emit('toggleBivar', e)
    },
    toggleDual(e) {
      this.$emit('toggleDual', e)
    }
  }
}
</script>

<style>
.toolbar-button {
  border-radius: 0!important;
  background-color: rgba(221, 221, 221, 0.9) !important;
  padding: 2px !important;
  width:40px !important;
  height:40px !important;
  min-width:40px !important;
  min-height:40px !important;
}
.toolbar-button-active {
  background-color: rgba(9, 105, 250, 0.8) !important;
}
.toolbar-container {
  width:85px;
  flex-wrap: wrap;
  justify-content: space-between;
}
.button-wrapper {
  max-width: 40px;
  flex-basis: 50%;
  margin-bottom: 5px;
}
@media (max-width:959px) {
  .button-wrapper {
    max-width: none;
    flex-basis: 15%;
    margin-bottom: 20px;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
}
</style>
