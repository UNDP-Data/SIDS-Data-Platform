<template>
  <div class="mb-2">
    <v-row dense>
      <v-col>
        <p class="input-label mt-3">{{ this.datasetLabel }}</p>
        <v-autocomplete
          class="map-input mb-3"
          dense
          hide-details
          id="gisDataset"
          :disabled='disabled'
          :value="dataset"
          @change="emitDatasetChange"
          :items="datasets"
          item-text="title"
          item-value="title"
          return-object
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
        <p class="input-label mt-0">{{ this.layerLabel }}</p>
        <v-select
          rounded
          dense
          hide-details
          id="gisLayer"
          class="map-input"
          :value="layer"
          item-text="title"
          item-value="layerId"
          :items="dataset.layers"
          @change="emitLayerChange"
          return-object
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-row
      class="spacing-row"
      v-if="layer && datasetLayer && layer.years.length > 1 && layer.years.length < 6 && !isMobile"
      dense
    >
      <v-col>
        <v-slider
          class="map-year-s"
          :tick-labels="ticksLabels"
          :max="layer.years.length - 1"
          step="1"
          ticks="always"
          tick-size="4"
          :value="activeYearIndex"
          @change="updateYearByIndex"
        ></v-slider>
      </v-col>
    </v-row>
    <v-row
      class="spacing-row"
      v-else-if="layer && datasetLayer && (layer.years.length > 5 || (layer.years.length > 1 && isMobile))"
      dense
    >
      <v-col>
        <v-select
          rounded
          dense
          hide-details
          class="map-input"
          :value="year"
          :items="layer.years"
          :label="layerLabel"
          @change="updateYear"
          outlined
        ></v-select>
      </v-col>
    </v-row>
    <v-row
      class="spacing-row"
      v-else-if="!dataset"
      dense
    ></v-row>
  </div>
</template>

<script>
import service from '@/services'
import size from '@/mixins/size.mixin';
export default {
  name: 'LayersController',
  mixins:[size],
  data() {
    return {
      activeYear: null,
    }
  },
  props:[
    'datasets',
    'dataset',
    'datasetLabel',
    'layer',
    'year',
    'layerLabel',
    'disabled',
  ],
  computed:{
    ticksLabels() {
      return this.layer && this.layer.years
    },
    datasetLayer() {
      return this.layer && this.dataset.layers.some(l => {
        return l.layerId === this.layer.layerId
      })
    },
    activeYearIndex() {
      return this.layer && this.layer.years.findIndex(y => y === this.year);
    }
  },
  methods: {
    async emitDatasetChange(dataset){
      this.$emit('datasetChange', dataset)
      await this.emitLayerChange(dataset.layers[0])
    },
    updateYearByIndex(yearIndex) {
      this.$emit('yearChange', this.layer.years[yearIndex])
      this.emitLayerChange(this.layer)
    },
    updateYear(year) {
      this.$emit('yearChange', year)
      this.emitLayerChange(this.layer)
    },
    async emitLayerChange(layer){
      let layerData = await service.loadGISLayer(layer.layerId)
      layerData.years = layer.years
      if(this.year === null || !layer.years.some(y => y === this.year)) {
        this.$emit('yearChange', layer.years[0])
        layerData.activeYear = layer.years[0]
      } else {
        layerData.activeYear = this.year
      }
      this.$emit('layerChange', layerData)
    },
  }
}
</script>

<style>
</style>
