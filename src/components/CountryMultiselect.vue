<template>
  <div class="select">
    <v-select
      rounded
      :value="countryActiveIdsList"
      :items="countriesToCompare"
      item-text="name"
      item-value="id"
      :placeholder="placeholder"
      @change="emitCountryChange"
      chips
      outlined
      hide-selected
      multiple
      dense
      hide-details
    >
      <template #selection="{ item, index }">
        <v-chip
          class="muliselect-chip"
          :close="!leaveOne || countryActiveIdsList.length > 1"
          @click:close="removeCountry(item.id)"
          :style="getChipStyle(index, item)"
          :color="getColor(index, item)">
          {{item.name}}
        </v-chip>
      </template>
      <template slot="item" slot-scope="data">
      <i
        class="flag-icon select_icon"
        :class="'flag-icon-' + flagCodes[data.item.id]"
      ></i>
      {{ data.item.name }}
      </template>
    </v-select>
  </div>
</template>

<script>

import flagCodes from '@/assets/flagCodes.js'

export default {
  name: 'CountryMultiselect',
  data() {
    return {
      flagCodes
    };
  },
  props:{
    placeholder: {
      type: String,
      default: 'Select countries'
    },
    countryActiveIdsList: {
      type: Array,
      default: () => []
    },
    leaveOne: {
      type: Boolean,
      default: false
    },
    countriesToCompare: {
      type: Array,
      default: () => []
    },
    colorScheme: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    emitCountryChange(countries) {
      this.$emit('countryChange',countries);
    },
    removeCountry(id) {
      let res = this.countryActiveIdsList.filter(countryId => countryId !== id)
      this.emitCountryChange(res);
    },
    getColor(index, item) {
      if(typeof this.colorScheme[0] === 'string') {
        return this.colorScheme[index%this.colorScheme.length];
      } else {

        let scheme = this.colorScheme.find(scheme => scheme.iso === item.iso)
        if(scheme)
          return scheme.color
      }
    },
    getChipStyle(index, item) {
      if(typeof this.colorScheme[0] === 'string') {
        return `background-color:${this.colorScheme[index%this.colorScheme.length]}80`;
      } else {
        let scheme = this.colorScheme.find(scheme => scheme.iso === item.iso)
        if(scheme)
          return `background:${scheme.color}80`
      }
    }
  }
}
</script>

<style scoped>
.select_icon {
  display: inline-block;
  margin-right: 10px;
}
.muliselect-chip {
  border-style: solid;
  border-width: 2px;
}
</style>
