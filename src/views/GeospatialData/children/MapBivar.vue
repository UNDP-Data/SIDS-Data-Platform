<template>
  <div class="">
  <v-tooltip left maxWidth="240">
    <template v-slot:activator="{ on: tooltip }">
      <v-btn
        class="toolbar-button"
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
    <div class="d-none" id="drawControls">
    </div>
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
    'activeLayer'
  ],
  methods: {
    toggleBivar() {
      this.modeOn = !this.modeOn;
      this.$emit('toggleBivar', this.modeOn)
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
