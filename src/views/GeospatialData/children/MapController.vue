<template>
  <div class="map-controller">
    <layers-controller
      :dualModeEnabled="dualModeEnabled"
      :bivariateModeEnabled="bivariateModeEnabled"
      @layersChange="emitUpdate"
    />
    <layer-description
      :activeLayer="activeLayer"
      :activeDataset="activeDataset"
    />
    <layer-legend v-if="map"
      :map="map"
      :activeLayer="activeLayer"
    />
  </div>
</template>

<script>
import LayersController from './LayersController';
import LayerDescription from './LayerDescription';
import LayerLegend from './LayerLegend';
export default {
  name: 'MapController',
  data() {
    return {
      activeLayer:null,
      activeDataset:null
    }
  },
  props: [
    "map",
    "dualModeEnabled",
    "bivariateModeEnabled",
  ],
  components:{
    LayersController,
    LayerDescription,
    LayerLegend
  },
  methods:{
    emitUpdate(e) {
      this.activeLayer = e.layer
      this.activeDataset = e.dataset
      if (this.bivariateModeEnabled) {
        return this.emitBivariateUpdate(e);
      }
      if (this.dualModeEnabled) {
        return this.emitBivariateUpdate(e);
      }
      return this.$emit("update", e);
    },
    emitBivariateUpdate(e) {
      this.$emit("updateBivariate", e);
    },
    emitComparisonUpdate(e) {
      this.$emit("updateComparison", e);
    }
  }
}
</script>

<style>
.map-controller {
  max-height: 85vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
