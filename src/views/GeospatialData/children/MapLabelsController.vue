<template>
  <v-tooltip
    color="white"
    content-class="tooltip-white"
    transition="fade-transition"
    left maxWidth="240">
    <template v-slot:activator="{ on: tooltip }">
      <v-btn
        class="toolbar-button"
        color="gray"
        @click="toggleLabels"
        dark
        v-on="{ ...tooltip }"
      >
        <i class="toggle-lables-icon"
          :class="{
            'toggle-lables-minus': !modeOn,
            'toggle-lables-plus': modeOn
          }"
        ></i>
      </v-btn>
    </template>
    <span>
      <b>Map Labels</b> - Toggle On/Off labels (Towns, roads, etc.)
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'MapLabelsController',
  data() {
    return {
      modeOn:false
    }
  },
  props:[
    'map',
    'activeLayer'
  ],
  methods: {
    toggleLabels() {
      this.map.toggleLabels(this.modeOn)
      this.modeOn = !this.modeOn
    }
  }
}
</script>

<style>
.toggle-lables-icon {
  width: 38px;
  height: 38px;
  background-size: contain;
}
.toggle-lables-minus {
  background-image: url("~@/assets/gis/sidebar/aminus-icon.png");
}
.toggle-lables-plus {
  background-image: url("~@/assets/gis/sidebar/aplus-icon.png");
}
</style>
