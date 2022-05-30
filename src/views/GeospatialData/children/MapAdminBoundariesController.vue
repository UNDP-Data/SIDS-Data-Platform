<template>
  <v-menu
      v-model="open"
      :close-on-content-click="false"
      :x-offset="true"
      nudge-left="50"
      left
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip left maxWidth="240">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="toolbar-button"
              color="gray"
              @click="open = !open"
              dark
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <i class="add-boundaries-icon"></i>
            </v-btn>
          </template>
          <span>
            <b>Boundaries</b> - Toggles the display of administrative boundaries.
          </span>
        </v-tooltip>
      </template>
      <v-card class="background-grey">
        <v-card-title class="pt-1 pb-1">Add boundaries</v-card-title>
        <v-card-text class="mb-1 pb-1">
          <v-checkbox
            class="mt-1"
            v-model="boundary1"
            hide-details
            label="Admin Region 1"
            @change="boundary1Update"
          >
            <template slot="append">
              <i class="checkbox-boundary-icon checkbox-boundary-icon-1"></i>
            </template>
          </v-checkbox>
          <v-checkbox
            class="mt-1"
            v-model="boundary2"
            hide-details
            label="Admin Region 2"
            @change="boundary2Update"
          >
            <template slot="append">
              <i class="checkbox-boundary-icon checkbox-boundary-icon-2"></i>
            </template>
          </v-checkbox>
        </v-card-text>
      </v-card>
    </v-menu>
</template>

<script>
export default {
  name: 'MapAdminBoundariesController',
  data() {
    return {
      open:false,
      boundary1:false,
      boundary2:false
    }
  },
  props:[
    'map'
  ],
  methods: {
    boundary1Update(state) {
      let source = "admin1",
      slayer = "admin1",
      color = "red";
      if(state){
        this.addLayer({
          layerName: `${slayer}-overlay`,
          source,
          slayer,
          color
        })
      } else {
        this.map.removeLayer(`${slayer}-overlay`)
      }
    },
    boundary2Update(state) {
      let source = "admin2",
      slayer = "admin2",
      color = "#003399";
      if(state){
        this.addLayer({
          layerName: `${slayer}-overlay`,
          source,
          slayer,
          color
        })
      } else {
        this.map.removeLayer(`${slayer}-overlay`)
      }
    },
    addLayer({
      layerName,
      source,
      slayer,
      color
    }) {
      this.map.map.addLayer(
        {
          id: layerName,
          type: "line",
          source: source,
          "source-layer": slayer,
          layout: {
            visibility: "visible",
          },

          paint: {
            "line-color": color,
            "line-width": 1,
          },
        },
        this.map.options.firstSymbolId
      );
      if (this.map.getLayer("admin1-overlay")) {
        this.map.map.moveLayer(layerName, "admin1-overlay"); //brings the layer ontop of admin1-overlay
      }
    }
  }
}
</script>

<style>
.add-boundaries-icon {
  width: 38px;
  height: 38px;
  background-image: url("~@/assets/gis/sidebar/add-boundaries-icon.png");
  background-size: contain;
}
.checkbox-boundary-icon {
  width: 30px;
  height: 30px;
  background-size: contain;
}
.checkbox-boundary-icon-1 {
  background-image: url("~@/assets/gis/sidebar/admin-region-1.png");
}
.checkbox-boundary-icon-2 {
  background-image: url("~@/assets/gis/sidebar/admin-region-2.png");
}
</style>
