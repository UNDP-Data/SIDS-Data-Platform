<template>
  <v-card v-if="value" class="selection-info description-block background-grey">
    <v-card-text class="pa-2">
      <h4 v-if="name">{{name}}</h4>
      <h4>Value:</h4>
      <p class="mb-0">
        {{value}}
        <span v-html="activeLayer.Unit"></span>
      </p>

      <h4 v-if="mean || min || max">Regional statistics:</h4>
      <p v-if="mean" class="mb-0">
        Mean {{mean}}
        <span v-html="activeLayer.Unit"></span>
      </p>
      <p v-if="max" class="mb-0">
        max {{max}}
        <span v-html="activeLayer.Unit"></span>
      </p>
      <p v-if="min" class="mb-0">
        min {{min}}
        <span v-html="activeLayer.Unit"></span>
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import format from "@/mixins/format.mixin";

export default {
  name: 'SelectionInfo',
  data() {
    return {
      value:null,
      name:null,
      min:null,
      max:null,
      mean:null
    }
  },
  mixins: [format],
  props:[
    'map',
    'activeLayer'
  ],
  methods: {
    updateValue(e) {
      if(e.value) {
        this.value = this.nFormatter(e.value,2)
      } else {
        this.value = null
      }
      if(e.selectionName) {
        this.name = e.selectionName
      } else {
        this.name = null
      }
    },
    polyUpdate(e) {
      if(e !== null) {
        this.min = this.nFormatter(e.min,2)
        this.max = this.nFormatter(e.max,2)
        this.mean = this.nFormatter(e.mean,2)
      } else {
        this.min = null
        this.max = null
        this.mean = null
      }
    }
  },
  mounted() {
    this.map.on('selectionUpdate', this.updateValue)
    this.map.on('selectionPolyUpdate', this.polyUpdate)
  }
}
</script>

<style>
.selection-info {
  position: absolute;
  z-index:99;
  bottom: 60px;
  right: 11px;
}
.description-block {
  border-radius: 0 !important;
}
</style>
