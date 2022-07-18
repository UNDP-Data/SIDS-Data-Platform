<template>
  <div>
    <v-row dense>
      <v-col>
        <v-autocomplete
          rounded
          class="map-input"
          dense
          hide-details
          :disabled='disabled'
          :value="dataset"
          @change="emitDatasetChange"
          :items="datasets"
          item-text="title"
          item-value="title"
          return-object
          :label="datasetLabel"
          outlined
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-row
      class="spacing-row"
      v-if="dataset && dataset.layers.length > 1"
      dense
    >
      <v-col>
        <v-select
          rounded
          dense
          hide-details
          class="map-input"
          :value="layer"
          item-text="title"
          item-value="layerId"
          :items="dataset.layers"
          :label="layerLabel"
          @change="emitLayerChange"
          return-object
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-row
      class="spacing-row"
      v-else-if="layer && layer.years.length > 1"
      dense
    >
      <v-col>
        <v-slider
          class="map-input"
          :tick-labels="ticksLabels"
          :max="dataset.layers.length - 1"
          step="1"
          ticks="always"
          tick-size="4"
          @change="emitTemporalChange"
        ></v-slider>
      </v-col>
    </v-row>
    <v-row
      class="spacing-row"
      v-else
      dense
    ></v-row>
  </div>
</template>

<script>
import service from '@/services'
export default {
  name: 'LayersController',
  data() {
    return {
    }
  },
  props:[
    'datasets',
    'dataset',
    'datasetLabel',
    'layer',
    'layerLabel',
    'disabled'
  ],
  computed:{
    ticksLabels() {
      return this.layer && this.layer.years
    }
  },
  methods: {
    async emitDatasetChange(dataset){
      this.$emit('datasetChange', dataset)
      if(dataset.layers.length === 1) {
        await this.emitLayerChange(dataset.layers[0])
      }
    },
    async emitLayerChange(layer){
      let layerData = await service.loadGISLayer(layer.layerId)
      layerData.years = layer.years
      this.$emit('layerChange', layerData)
    },
    emitTemporalChange(index) {
      this.$emit('layerChange', this.dataset.layers[index])
    }
  }
}
</script>

<style>

.spacing-row {
  height: 55px;
}
</style>
