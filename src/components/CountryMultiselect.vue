<template>
  <div class="select">
    <v-select
      rounded
      :value="compareIdsList"
      :items="sidsListFiltered"
      item-text="name"
      item-value="id"
      placeholder="Overlay countries to compare indicator rank"
      @change="setCompareCountries"
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
          close
          @click:close="removeCountry(item.id)"
          :style="getChipStyle(index)"
          :color="getColor(index)">
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
import sizeMixin from '@/mixins/size.mixin'

import { mapState } from 'vuex';
export default {
  name: 'CountryMultiselect',
  props:{
    countryActiveIdsList: {
      type: Array,
      default: () => []
    },
    countriesToCompare: {
      
    }
  }
  data() {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
