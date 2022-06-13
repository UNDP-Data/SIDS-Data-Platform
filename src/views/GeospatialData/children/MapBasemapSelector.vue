<template>
  <v-menu
      v-model="open"
      :close-on-content-click="false"
      :x-offset="true"
      content-class="select-floating"
      nudge-left="50"
      left
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip
          color="white"
          content-class="tooltip-white"
          transition="fade-transition"
          left maxWidth="200">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="toolbar-button"
              color="gray"
              @click="open = !open"
              dark
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <i class="basemap-selector-icon" :class="getMapIcon(basemap)"></i>
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
          <template #selection="{ item }">
            <i
              class="base-selection-select mr-2"
              :class="getMapIcon(item)"
            ></i>
            <span>
              {{item}}
            </span>
          </template>
          <template slot="item" slot-scope="data">
          <i
            class="base-selection-select mr-2"
            :class="getMapIcon(data.item)"
          ></i>
          {{ data.item }}
          </template>
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
  computed: {
    satelliteImage() {
      if(this.basemap === 'Light Theme') {
        return 'satelite-white'
      }
      if(this.basemap === 'Dark Theme') {
        return 'satelite-dark'
      }
      return 'satelite'
    }
  },
  methods: {
    changeBasemap(basemap) {
      this.activeColor = basemap;
      this.map.changeBasemap(basemap);
    },
    getMapIcon(basemap) {
      if(basemap === 'Light Theme') {
        return 'satelite-white'
      }
      if(basemap === 'Dark Theme') {
        return 'satelite-dark'
      }
      return 'satelite'
    }
  }
}
</script>

<style>
.base-selection-select {
  width: 20px;
  height: 20px;
  background-size: contain;
}
.basemap-selector-icon {
  width: 30px;
  height: 30px;
  background-size: contain;
}
.satelite {
  background-image: url("~@/assets/gis/sidebar/satelite.png");
}
.satelite-white {
  background-image: url("~@/assets/gis/sidebar/satelite-white.png");
}
.satelite-dark {
  background-image: url("~@/assets/gis/sidebar/satelite-dark.png");
}
.color-scheme-select {
  width: 250px;
}
</style>
