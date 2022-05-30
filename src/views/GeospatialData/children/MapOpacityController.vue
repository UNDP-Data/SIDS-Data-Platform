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
              <i class="opacity-icon"></i>
            </v-btn>
          </template>
          <span>
            <b>Opacity</b> - Change opacity for data fills
          </span>
        </v-tooltip>
      </template>
      <div class="opacity-control-container pr-2 pl-2">
        <v-slider
          hint="opacity"
          max="100"
          :value="opacity"
          min="0"
          hide-details
          @change="updateOpacity"
        >
          <template slot="prepend">
            0
          </template>
          <template slot="append">
            100
          </template>
        </v-slider>
      </div>
    </v-menu>
</template>

<script>
export default {
  name: 'MapOpacityController',
  data() {
    return {
      open:false,
      opacity:20
    }
  },
  props:[
    'map'
  ],
  methods: {
    updateOpacity(opacity) {
      this.opacity = opacity
      this.map.changeOpacity(opacity/100)
    }
  }
}
</script>

<style>

.opacity-icon {
  width: 38px;
  height: 38px;
  background-image: url("~@/assets/gis/sidebar/opacity-icon.png");
  background-size: contain;
}

.opacity-control-container {
  width: 220px;
  height: 36px;
  border-radius: 18px;
  background: rgb(233, 236, 246);
}
.opacity-control-container .v-input__slot {
  padding: 0 !important;
}
.opacity-control-container .v-input {
  display: flex;
  align-items: center;
}
</style>
