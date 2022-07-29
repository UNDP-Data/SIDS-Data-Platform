<template>
  <v-menu
      v-model="open"
      :close-on-content-click="false"
      :offset-x="!($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
      :offset-y="($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
      content-class="select-floating"
      :nudge-left="!($vuetify.breakpoint.xs || $vuetify.breakpoint.sm) ? 50 : 0"
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
          left maxWidth="240">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="toolbar-button"
              color="gray"
              @click="open = !open"
              dark
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <i
                class="resolution-controll-button-icon"
               :class="{
                 'button-resolution-icon-boundary-1': activeResolution === 'admin1',
                 'button-resolution-icon-boundary-2': activeResolution === 'admin2',
                 'button-resolution-icon-hex-1': activeResolution === 'hex-1km',
                 'button-resolution-icon-hex-5': activeResolution === 'hex-5km',
                 'button-resolution-icon-hex-10': activeResolution === 'hex-10km'
               }"></i>
            </v-btn>
          </template>
          <span>
            <b>Resolution</b> - Choose different level of aggregation of the data layer.
          </span>
        </v-tooltip>
      </template>
      <v-card class="background-grey">
        <v-card-text class="">
          <div class="mb-2">
          <h4>Hexbins</h4>
          <v-btn-toggle
            :value="activeHexResolution"
          >
            <v-btn
              class="button-resolution-controller"
              @click="handleResolutionChange('hex-1km')"
            >
              1 km
              <i class="button-resolution-icon button-resolution-icon-hex-1"></i>
            </v-btn>
            <v-btn
              class="button-resolution-controller"
              @click="handleResolutionChange('hex-5km')"
            >
              5 km
              <i class="button-resolution-icon button-resolution-icon-hex-5"></i>
            </v-btn>
            <v-btn
              class="button-resolution-controller"
              @click="handleResolutionChange('hex-10km')"
            >
              10 km
              <i class="button-resolution-icon button-resolution-icon-hex-10"></i>
            </v-btn>
          </v-btn-toggle>
        </div>
        <div class="">
          <h4>Administrative regions</h4>
          <v-btn-toggle class="d-flex"
            :value="activeAdminResolution"
          >
            <v-btn
              class="button-adm button-resolution-controller"
              @click="handleResolutionChange('admin1')"
            >
              Level 1
              <i class="button-resolution-icon button-resolution-icon-boundary-1 "></i>
            </v-btn>
            <v-btn
              class="button-adm button-resolution-controller"
              @click="handleResolutionChange('admin2')"
            >
              Level 2
              <i class="button-resolution-icon button-resolution-icon-boundary-2"></i>
            </v-btn>
          </v-btn-toggle>

        </div>
        </v-card-text>
      </v-card>
    </v-menu>
</template>

<script>
export default {
  name: 'MapResolutionController',
  data() {
    return {
      open:false,
      activeResolution:'hex-5km'
    }
  },
  computed:{
    activeHexResolution() {
      let index = ['hex-1km','hex-5km','hex-10km'].indexOf(this.activeResolution)
      if(index === -1) {
        return null
      }
      return index
    },
    activeAdminResolution() {
      let index = ['admin1','admin2'].indexOf(this.activeResolution)
      if(index === -1) {
        return null
      }
      return index
    }
  },
  props:[
    'map'
  ],
  methods: {
    handleResolutionChange(resolution) {
      this.activeResolution = resolution;
      this.map.changeHexagonSize(resolution);
    }
  }
}
</script>

<style>
.resolution-controll-button-icon {
  width: 38px;
  height: 38px;
  background-size: contain;
}
.button-resolution-icon {
  width: 24px;
  height: 24px;
  background-size: contain;
  margin-left: 10px;
}
.button-resolution-icon-boundary-1 {
  background-image: url("~@/assets/gis/sidebar/admin-region-1.png");
}
.button-resolution-icon-boundary-2 {
  background-image: url("~@/assets/gis/sidebar/admin-region-2.png");
}
.button-resolution-icon-hex-1 {
  background-image: url("~@/assets/gis/sidebar/hex1.png");
}
.button-resolution-icon-hex-5 {
  background-image: url("~@/assets/gis/sidebar/hex5.png");
}
.button-resolution-icon-hex-10 {
  background-image: url("~@/assets/gis/sidebar/hex10.png");
}
.button-resolution-controller {
  padding: 2px 5px !important;
  min-height: 32px !important;
  height: 32px !important;
}
.button-adm {
  width: 50%;
}
</style>
