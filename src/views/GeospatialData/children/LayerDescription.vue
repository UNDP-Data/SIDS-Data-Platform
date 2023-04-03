<template>
  <v-card class="mb-1 description-block">
    <v-card-subtitle class=" pt-4 pb-0 block-header" v-if="activeLayer">
      <h6 class="undp-typography">{{ activeLayer.Description }}
          {{ activeDataset.type === "temporal" ? activeLayer.Temporal : "" }}
      </h6>
    </v-card-subtitle>
    <v-card-subtitle class="block-header" v-else>
      SIDS Geospatial Platform
    </v-card-subtitle>
    <v-card-text class="pb-2" v-if="activeLayer">
      {{ activeLayer.Desc_long }}<br />
      <b>Reference</b> {{ activeLayer.Source_Name }} <br />
      <a :href="activeLayer.Source_Link" target="_blank" class="undp-style pt-2">
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
  background-color: #EDEFF0 !important;
}
</style>
