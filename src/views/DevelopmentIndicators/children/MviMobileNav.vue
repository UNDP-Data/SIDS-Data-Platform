<template>
  <div class="indicators-mvi-nav">
    <v-row class="justify-center">
      <v-col cols="11">
        <v-row class="justify-center">
          <v-col cols="10">
            <v-row class="justify-center">
              <v-col cols="6">
                <div class="select">
                  <label class="input-label">Chart type</label>
                  <v-select
                    rounded
                    dense
                    hide-details
                    item-value="chartType"
                    item-text="name"
                    :value="chartType"
                    :items="chartTypes"
                    @change="emitChartTypeChange"
                    outlined
                  ></v-select>
                </div>
              </v-col>
              <v-col cols="6">
                <div v-if="chartType === 'bars'" class="select">
                  <label class="input-label">Sorting</label>
                  <v-select
                    rounded
                    dense
                    hide-details
                    item-value="value"
                    item-text="text"
                    :value="sortingType"
                    :items="sortingTypes"
                    @change="emitSortingChange"
                    outlined
                  ></v-select>
                </div>
                <div v-else class="select">
                  <label class="input-label">Region</label>
                  <v-select
                    rounded
                    dense
                    hide-details
                    item-value="value"
                    item-text="text"
                    :value="region"
                    :items="regions"
                    @change="emitRegionChange"
                    outlined
                  ></v-select>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="d-flex align-end" cols="2">
            <v-btn
                class="filter-sm-button"
                rounded
                @click="emitToggleDialog"
                fab
                color="primary"
              >
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'MviMobileNav',
  props:['sortingType', 'chartType', 'chartTypes', 'region' ,'regions'],
  data(){
    return {
      sortingTypes:[{
        value: 'rank',
        text: 'Rank'
      },{
        value: 'region',
        text: 'Region'
      }]
    }
  },
  methods: {
    emitChartTypeChange(chartType){
      this.$emit('chartTypeChange', chartType)
    },
    emitSortingChange(sorting){
      this.$emit('sortingChange', sorting)
    },
    emitRegionChange(region){
      this.$emit('regionChange', region)
    },
    emitToggleDialog() {
      this.$emit('toggleDialog')
    }
  },
}
</script>

<style>
</style>
