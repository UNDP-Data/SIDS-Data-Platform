<template>
  <v-tooltip
  color="white"
  content-class="tooltip-white"
  transition="fade-transition"
  left maxWidth="240">
    <template v-slot:activator="{ on: tooltip }">
      <div v-on="{ ...tooltip }">
        <v-btn
          class="toolbar-button"
          color="gray"
          :disabled="disabled"
          @click="toggle3D"
          dark
        >
          <i class="add-boundaries-icon"
            :class="{
              'toggle-3d-icon-3d': !modeOn,
              'toggle-3d-icon-2d': modeOn
            }"
          ></i>
        </v-btn>
      </div>
    </template>
    <span>
      <b>3D mode</b> - Visualize data values using 3-dimensional {{activeLayer}}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'Map3dController',
  data() {
    return {
      modeOn:false
    }
  },
  props:[
    'map',
    'activeLayer',
    'disabled'
  ],
  methods: {
    toggle3D() {
      this.modeOn = !this.modeOn
      this.map.add3D();
      this.$emit('toggle3d', this.modeOn)
    }
  }
}
</script>

<style>
.toggle-3d-icon {
  width: 38px;
  height: 38px;
  background-size: contain;
}
.toggle-3d-icon-3d {
  background-image: url("~@/assets/gis/sidebar/3d-icon.png");
}
.toggle-3d-icon-2d {
  background-image: url("~@/assets/gis/sidebar/2d-icon.png");
}
</style>
