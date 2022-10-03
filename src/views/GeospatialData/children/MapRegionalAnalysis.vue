<template>
  <div class="">
  <v-tooltip
    color="white"
    content-class="tooltip-white"
    transition="fade-transition"
    left maxWidth="240">
    <template v-slot:activator="{ on: tooltip }">
      <div>
        <v-btn
          class="toolbar-button"
          color="gray"
          @click="toggleLabels"
          :disabled="disabled"
          dark
          v-on="{ ...tooltip }"
        >
          <i class="regional-analysis-icon"
          ></i>
        </v-btn>
      </div>
    </template>
    <span>
      <b>Regional Analysis</b> - Draw an area of interest to compute statistics for the region
    </span>
  </v-tooltip>
    <div class="d-none" id="drawControls">
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapRegionalAnalysis',
  data() {
    return {
      modeOn:false
    }
  },
  props:[
    'map',
    'activeLayer',
    'disabled'
  ],
  methods: {
    toggleLabels() {
      this.map.startRegionAnalisys()
    }
  }
}
</script>

<style>
.regional-analysis-icon {
  width: 38px;
  height: 38px;
  background-size: contain;
  background-image: url("~@/assets/gis/sidebar/draw-icon.png");
}
</style>
