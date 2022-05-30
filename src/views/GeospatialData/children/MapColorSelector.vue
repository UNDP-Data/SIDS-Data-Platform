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
              <i class="color-scheme-icon"></i>
            </v-btn>
          </template>
          <span>
            <b>Color scheme</b> - Change between several color palettes
            for the displayed data
          </span>
        </v-tooltip>
      </template>
      <div class="select">
        <v-select
          class="color-scheme-select"
          :value="activeColor"
          rounded
          outlined
          @change="changeColorScheme"
          dense
          hide-details
          :items="colors"
        >
        </v-select>
      </div>
    </v-menu>
</template>

<script>
export default {
  name: 'MapColorSelector',
  data() {
    return {
      activeColor: 'original',
      colors:[
        {
          value: 'original',
          text: 'Default'
        },
        {
          value: 'invert',
          text: 'Invert current'
        },
        {
          value: 'red',
          text: 'Reds'
        },
        {
          value: 'purple',
          text: 'Purples'
        },
        {
          value: 'blue',
          text: 'Blues'
        },
        {
          value: 'colorblind-safe',
          text: 'Colorblind Safe'
        }
      ],
      open:false
    }
  },
  props:[
    'map'
  ],
  methods: {
    changeColorScheme(scheme) {
      this.activeColor = scheme;
      this.map.changeColor(scheme);
    }
  }
}
</script>

<style>

.color-scheme-icon {
  width: 38px;
  height: 38px;
  background-image: url("~@/assets/gis/sidebar/color-icon-1.png");
  background-size: contain;
}
.color-scheme-select {
  width: 250px;
}
</style>
