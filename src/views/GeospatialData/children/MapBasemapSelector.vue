<template>
  <v-menu
      v-model="open"
      :close-on-content-click="false"
      :x-offset="true"
      nudge-left="50"
      left
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip left maxWidth="200">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="toolbar-button"
              color="gray"
              @click="open = !open"
              dark
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <i class="basemap-selector-icon"></i>
            </v-btn>
          </template>
          <span>
            <b>Change Basemap</b> - Switch between Satellite Imagery and
            abstract map themes
          </span>
        </v-tooltip>
      </template>
      <div class="select">
        <v-select
          class="color-scheme-select"
          :value="basemap"
          rounded
          outlined
          @change="changeBasemap"
          dense
          hide-details
          :items="basemaps"
        >
        </v-select>
      </div>
    </v-menu>
</template>

<script>
export default {
  name: 'MapBasemapSelector',
  data() {
    return {
      basemap: 'Satellite Imagery',
      basemaps:['Satellite Imagery', 'Light Theme', 'Dark Theme'],
      open:false
    }
  },
  props:[
    'map'
  ],
  methods: {
    changeBasemap(basemap) {
      this.activeColor = basemap;
      this.map.changeBasemap(basemap);
    }
  }
}
</script>

<style>

.basemap-selector-icon {
  width: 38px;
  height: 38px;
  background-image: url("~@/assets/gis/sidebar/satellite-view.png");
  background-size: contain;
}
.color-scheme-select {
  width: 250px;
}
</style>
