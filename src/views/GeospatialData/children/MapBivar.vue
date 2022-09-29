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
          @click="toggleBivar"
          dark
          v-on="{ ...tooltip }"
        >
          <i class="bivar-icon"
          ></i>
        </v-btn>
      </template>
      <span>
        <b>Bivariate Mode</b> - Show the relationships between two datasets
      </span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'MapBivar',
  data() {
    return {
      modeOn:false
    }
  },
  props:[
    'map',
    'activeLayer',
    'bivarEnabled'
  ],
  methods: {
    toggleBivar() {
      this.modeOn = !this.modeOn;
      this.$emit('toggleBivar', this.modeOn)
    }
  },
  watch: {
    bivarEnabled() {
      this.modeOn = this.bivarEnabled
    }
  }
}
</script>

<style>
.bivar-icon {
  width: 38px;
  height: 38px;
  background-size: contain;
  background-image: url("~@/assets/gis/sidebar/bivariate-mode-icon.png");
}
</style>
