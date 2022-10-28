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
          :left="!($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
          :top="($vuetify.breakpoint.xs || $vuetify.breakpoint.sm)"
          maxWidth="200">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="toolbar-button"
              color="gray"
              @click="open = !open"
              dark
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <i class="country-icon"></i>
            </v-btn>
          </template>
          <span>
            <b>{{$t('gis.toolbar.countrySelect[0]')}}</b> {{$t('gis.toolbar.countrySelect[1]')}}
          </span>
        </v-tooltip>
      </template>
      <div class="select">
        <v-autocomplete
          class="map-country-select"
          rounded
          outlined
          placeholder="Search country or region"
          hide-selected
          @change="countrySelect"
          dense
          :filter="countryFilter"
          hide-details
          :items="countries"
          item-text="GID_0"
          item-value="NAME_0"
          return-object
        >
          <template #selection="{ item }">
            <span class="map-country-select_selection">
              <i v-if="item.flagCode"
                class="flag-icon select_icon mr-2"
                :class="'flag-icon-' + computeFlagCode(item.flagCode)"
              ></i>
              {{item.id ? $t('regions.' + item.id) : computeCountryName(item.GID_0) }}
            </span>
          </template>
          <template slot="item" slot-scope="data">
          <i
            class="flag-icon select_icon mr-2"
            :class="'flag-icon-' + computeFlagCode(data.item.flagCode)"
          ></i>
          {{data.item.id ? $t('regions.' + data.item.id) : computeCountryName(data.item.GID_0) }}
          </template>
        </v-autocomplete>
      </div>
    </v-menu>
</template>

<script>
import names from "@/gis/static/names";
import sidsList from "@/assets/sidsList";
export default {
  name: 'MapCountrySelector',
  data() {
    return {
      countries:names,
      open:false
    }
  },
  props:[
    'map'
  ],
  methods: {
    computeCountryName(code) {
      let sids = sidsList.find(c => c.iso === code);
      if(sids) {
        return this.$t('countryNames.'+sids.id)
      } else {
        console.log(code)
      }
    },
    computeFlagCode(code) {
      if(code) {
        return code.toLowerCase()
      }
    },
    countryFilter(item, queryText) {
      let queryLK = queryText.toLowerCase(),
      itemLK = item.NAME_0.toLowerCase();
      return itemLK.indexOf(queryLK) !== -1
    },
    countrySelect(selection) {
      this.open = false;
      this.map.zoomToCountry(selection);
    }
  }
}
</script>

<style>

.country-icon {
  width: 38px;
  height: 38px;
  background-image: url("~@/assets/gis/sidebar/country-icon.png");
  background-size: contain;
}
.map-country-select {
  width: 250px;
}
.map-country-select_selection {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
