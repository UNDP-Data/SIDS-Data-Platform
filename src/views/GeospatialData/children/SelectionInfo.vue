<template>
  <v-card v-if="value || mean || min || max" class="selection-info description-block background-grey">
    <v-card-text class="pa-2">
      <h4 v-if="name">{{name}}</h4>
      <h4 v-if="value && !bivarClass">{{$t('gis.toolbar.value')}}:</h4>
      <p  v-if="value && !bivarClass" class="mb-0">
        {{value}}
        <span v-html="activeLayer.Unit"></span>
      </p>

      <h4  v-if="bivarClass">{{$t('gis.toolbar.class')}}:</h4>
      <p class="mb-0">
        {{bivarClass}}
      </p>
      <h4  v-if="level1">{{$t('gis.toolbar.firstValue')}} ({{level1}}):</h4>
      <p v-if="value1" class="mb-0">
        {{value1}}
      </p>

      <h4  v-if="level2">{{$t('gis.toolbar.firstValue')}} ({{level2}}):</h4>
      <p v-if="value2" class="mb-0">
        {{value2}}
      </p>
      <h4 v-if="mean || min || max">{{$t('gis.toolbar.regionalStatistics')}}:</h4>
      <p v-if="mean" class="mb-0">
        {{$t('gis.toolbar.mean')}} {{mean}}
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
      mean:null,
      bivarClass:null,
      level1:null,
      value1:null,
      level2:null,
      value2:null,
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
      console.log(e)
      if(e !== null) {
        this.min = this.nFormatter(e.min,2)
        this.max = this.nFormatter(e.max,2)
        this.mean = this.nFormatter(e.mean,2)
      } else {
        this.min = null
        this.max = null
        this.mean = null
      }
    },
    bivarUpdate(e) {
      if(e !== null) {
        this.bivarClass = e.class;
        this.level1 = e.level1;
        this.value1 = this.nFormatter(e.value1,2)
        this.level2 = e.level2;
        this.value2 = this.nFormatter(e.value2,2)
      } else {
        this.bivarClass = null
        this.level1 = null
        this.value1 = null
        this.level2 = null
        this.value2 = null
      }
    }
  },
  mounted() {
    this.map.on('selectionUpdate', this.updateValue)
    this.map.on('selectionPolyUpdate', this.polyUpdate)
    this.map.on('bivariateClick', this.bivarUpdate)
  },
  destroyed() {
    this.map.off('selectionUpdate', this.updateValue)
    this.map.off('selectionPolyUpdate', this.polyUpdate)
    this.map.on('bivariateClick', this.bivarUpdate)
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
