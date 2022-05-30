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
        :map="map"
      />
    </div>
    <div class="button-wrapper">
      <map-color-selector
        :map="map"
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
export default {
  name: 'MapToolbap',
  data() {
    return {
    }
  },
  components: {
    MapCountrySelector,
    MapAdminBoundariesController,
    MapResolutionController,
    Map3dController,
    MapColorSelector
  },
  props:[
    'map'
  ]
}
</script>

<style>
.toolbar-button {
  border-radius: 0!important;
  background-color: rgba(221, 221, 221, 0.7) !important;
  padding: 2px !important;
  width:40px !important;
  height:40px !important;
  min-width:40px !important;
  min-height:40px !important;
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
</style>
