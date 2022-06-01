<template>
  <div class="map-controller">
    <layers-controller
      :dualModeEnabled="dualModeEnabled"
      :bivariateModeEnabled="bivariateModeEnabled"
      @layersChange="emitUpdate"
      @modeUpdate="toggleBivarUpdate"
    />
    <layer-description
      v-if="!bivariateModeEnabled"
      :activeLayer="activeLayer"
      :activeDataset="activeDataset"
    />
    <layer-legend v-if="map && !bivariateModeEnabled"
      :map="map"
      :activeLayer="activeLayer"
    />
    <layer-bivar-legend v-if="map && bivariateModeEnabled"
      :map="map"
      :activeLayer="activeLayer"
      :secondLayer="secondLayer"
    />
  </div>
</template>

<script>
import LayersController from './LayersController';
import LayerDescription from './LayerDescription';
import LayerLegend from './LayerLegend';
import LayerBivarLegend from './LayerBivarLegend';
export default {
  name: 'MapController',
  data() {
    return {
      activeLayer:null,
      activeDataset:null,
      secondLayer:null,
      secondDataset:null
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
    LayerLegend,
    LayerBivarLegend
  },
  methods:{
    toggleBivarUpdate(e) {
      this.$emit('updateBivarState', e)
    },
    emitUpdate(e) {
      if(this.activeLayer !== e.layer) {
          this.$emit("update", e);
      }
      this.activeLayer = e.layer
      this.activeDataset = e.dataset
      this.secondLayer = e.secondLayer
      this.secondDataset = e.secondDataset

      if (this.bivariateModeEnabled) {
        return this.emitBivariateUpdate(e);
      }
      if (this.dualModeEnabled) {
        return this.emitBivariateUpdate(e);
      }
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
