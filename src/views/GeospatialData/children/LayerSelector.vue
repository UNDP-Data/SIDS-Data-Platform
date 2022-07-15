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
      v-if="dataset && dataset.type === 'layers'"
      dense
    >
      <v-col>
        <v-select
          rounded
          dense
          hide-details
          class="map-input"
          :value="layer"
          item-text="Description"
          item-value="Description"
          :items="activeLayers"
          :label="layerLabel"
          @change="emitLayerChange"
          return-object
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-row
      class="spacing-row"
      v-else-if="dataset && dataset.type === 'temporal'"
      dense
    >
      <v-col>
        <v-slider
          class="map-input"
          :value="tickIndex"
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
      return this.dataset.layers.map((layer) => layer.Temporal);
    },
    tickIndex() {
      return this.ticksLabels.indexOf(this.layer.Temporal)
    },
    activeLayers() {
      return Object.keys(this.dataset.layers).map(k => {
        return {
          id: k,
          name: this.dataset.layers[k]
        }
      })
    }
  },
  methods: {
    emitDatasetChange(dataset){
      this.$emit('datasetChange', dataset)
    },
    emitLayerChange(layer){
      this.$emit('layerChange', layer)
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
