<template>
  <v-menu
      v-model="open"
      :close-on-content-click="false"
      content-class="select-floating"
      :offset-x="!($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
      :offset-y="($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
      :nudge-left="!($vuetify.breakpoint.xs || $vuetify.breakpoint.sm) ? 10 : 0"
      :nudge-top="($vuetify.breakpoint.xs || $vuetify.breakpoint.sm) ? 20 : 0"
      :left="!($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
      :top="($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip
          color="white"
          :disabled="open"
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
            <b>{{$t('gis.toolbar.basemap[0]')}}</b> {{$t('gis.toolbar.basemap[1]')}}
          </span>
        </v-tooltip>
      </template>
      <div class="select">
        <v-select
          class="color-scheme-select undp-select"
          :value="basemap"
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
              {{$t('gis.toolbar.'+item)}}
            </span>
          </template>
          <template slot="item" slot-scope="data">
          <i
            class="base-selection-select mr-2"
            :class="getMapIcon(data.item)"
          ></i>
          {{$t('gis.toolbar.'+data.item)}}
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
      basemap: 'satellite',
      basemaps:['satellite', 'light', 'dark'],
      open:false
    }
  },
  props:[
    'map'
  ],
  computed: {
    satelliteImage() {
      if(this.basemap === 'light') {
        return 'satelite-white'
      }
      if(this.basemap === 'dark') {
        return 'satelite-dark'
      }
      return 'satelite'
    }
  },
  methods: {
    changeBasemap(basemap) {
      this.open = false;
      this.basemap = basemap;
      this.map.changeBasemap(basemap);
    },
    getMapIcon(basemap) {
      if(basemap === 'light') {
        return 'satelite-white'
      }
      if(basemap === 'dark') {
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
