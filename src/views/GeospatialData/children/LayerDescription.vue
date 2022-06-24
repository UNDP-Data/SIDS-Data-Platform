<template>
  <v-card class="mb-1 description-block background-grey">
    <v-card-subtitle class=" pt-2 pb-2 block-header" v-if="activeLayer">
      <b
        >{{ activeLayer.Description }}
        {{ activeDataset.type === "temporal" ? activeLayer.Temporal : "" }}</b
      >
    </v-card-subtitle>
    <v-card-subtitle class="block-header" v-else>
      SIDS Geospatial Platform
    </v-card-subtitle>
    <v-card-text class="pb-2" v-if="activeLayer">
      {{ activeLayer.Desc_long }}<br />
      <b>Reference</b> {{ activeLayer.Source_Name }} <br />
      <a :href="activeLayer.Source_Link" target="_blank">
        Source
      </a>
    </v-card-text>
    <v-card-text class="pb-2" v-else>
      This map visualizes data for the SIDS at different resolutions. Select a
      dataset above or a country to view spatial data about that region.
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name: 'LayerDescription',
  data() {
    return {
    }
  },
  props:[
    'activeLayer',
    'activeDataset'
  ]
}
</script>

<style>

.description-block {
  border-radius: 0 !important;
}
</style>
