<template>
  <div class="">
  <v-tooltip
    color="white"
    content-class="tooltip-white"
    transition="fade-transition"
    left maxWidth="240">
    <template v-slot:activator="{ on: tooltip }">
      <v-btn
        class="toolbar-button"
        :class="{'toolbar-button-active': modeOn}"
        color="gray"
        @click="toggleDual"
        dark
        v-on="{ ...tooltip }"
      >
        <i class="dual-mode-icon"
        ></i>
      </v-btn>
    </template>
    <span>
      <b>Comparison</b> - Enable a draggable slider to visually compare datasets
    </span>
  </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'MapDual',
  data() {
    return {
      modeOn:false
    }
  },
  props:[
    'map',
    'activeLayer',
    'dualEnabled'
  ],
  methods: {
    toggleDual() {
      this.modeOn = !this.modeOn;
      this.$emit('toggleDual', this.modeOn)
    }
  },
  watch: {
    dualEnabled() {
      this.modeOn = this.dualEnabled
    }
  }
}
</script>

<style>
.dual-mode-icon {
  width: 38px;
  height: 38px;
  background-size: contain;
  background-image: url("~@/assets/gis/sidebar/dual-mode-icon.png");
}
</style>
