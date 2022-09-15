<template>
  <v-menu
      v-model="open"
      :close-on-content-click="false"
      :offset-x="!($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
      :offset-y="($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
      content-class="select-floating"
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
            <div>
              <v-btn
                class="toolbar-button"
                color="gray"
                :disabled="disabled"
                @click="open = !open"
                dark
                v-bind="attrs"
                v-on="{ ...tooltip, ...menu }"
              >
                <i class="color-scheme-icon" :class="getColorIcon(activeColor)"></i>
              </v-btn>
            </div>
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
          <template #selection="{ item }">
            <i
              class="color-selection-select mr-2"
              :class="getColorIcon(item.value)"
            ></i>
            <span>
              {{item.text}}
            </span>
          </template>
          <template slot="item" slot-scope="data">
            <i
              class="color-selection-select mr-2"
              :class="getColorIcon(data.item.value)"
            ></i>
            {{ data.item.text }}
          </template>
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
    'map',
    'disabled'
  ],
  methods: {
    changeColorScheme(scheme) {
      this.open = false;
      this.activeColor = scheme;
      this.map.changeColor(scheme);
    },
    getColorIcon(activeColor) {
      if(activeColor === 'invert') {
        return 'color-scheme-icon-invert'
      }
      if(activeColor === 'red') {
        return 'color-scheme-icon-red'
      }
      if(activeColor === 'purple') {
        return 'color-scheme-icon-purple'
      }
      if(activeColor === 'blue') {
        return 'color-scheme-icon-blue'
      }
      if(activeColor === 'colorblind-safe') {
        return 'color-scheme-icon-green'
      }
      return 'color-scheme-icon-default'
    }
  }
}
</script>

<style>

.color-scheme-icon {
  width: 38px;
  height: 38px;
  background-size: contain;
}
.color-selection-select {
  width: 30px;
  height: 30px;
  background-size: contain;
}
.color-scheme-icon-blue {
  background-image: url("~@/assets/gis/sidebar/icon-blue.png");
}
.color-scheme-icon-red {
  background-image: url("~@/assets/gis/sidebar/icon-red.png");
}
.color-scheme-icon-purple {
  background-image: url("~@/assets/gis/sidebar/icon-purple.png");
}
.color-scheme-icon-green {
  background-image: url("~@/assets/gis/sidebar/icon-green.png");
}
.color-scheme-icon-invert {
  background-image: url("~@/assets/gis/sidebar/icon-invert.png");
}
.color-scheme-icon-default {
  background-image: url("~@/assets/gis/sidebar/icon-default.png");
}
.color-scheme-select {
  width: 250px;
}
</style>
