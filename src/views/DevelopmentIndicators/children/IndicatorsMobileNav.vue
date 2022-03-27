<template>
  <div class="indicators-mobile-nav">
    <v-row class="justify-center">
      <v-col cols="11">
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
            <div class="select">
              <label class="input-label">Dimension</label>
              <v-select
                rounded
                dense
                :disabled="dimensions.length<2"
                hide-details
                item-value="code"
                item-text="dimension"
                :value="activeIndicatorCode"
                :items="dimensions"
                @change="emitDimensionChange"
                outlined
              ></v-select>
            </div>
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col cols="6">
            <div class="select">
              <label class="input-label">Year</label>
              <v-select
                :disabled="chartType !== 'bars'"
                rounded
                dense
                hide-details
                item-value="id"
                item-text="name"
                :value="year"
                :items="years"
                @change="emitYearChange"
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
    </v-row>
  </div>
</template>
<script>

import { mapState } from 'vuex';

export default {
  name: 'IndicatorsMobileNav',
  props:['activeIndicatorCode', 'year', 'sortingType', 'chartType', 'chartTypes', 'region' ,'regions'],
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
  computed: {
    ...mapState({
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      data: state => state.indicators.activeIndicatorData
    }),
    activeIndicator() {
      return this.allindicators.find(indicator => indicator['indicatorCode'] === this.activeIndicatorCode);
    },
    dimensions() {
      if(this.activeIndicator && this.activeIndicator.codesArray) {
        return this.activeIndicator.codesArray.map(code => {
          return {
            code,
            dimension: this.indicatorsMeta[code].dim
          }
        })
      }
      return [{
        dimension:'none',
        code: this.activeIndicatorCode
      }]
    },
    allindicators() {
      let indicatorsArray = [];
      for(let indicator in this.indicatorsMeta) {
        indicatorsArray.push(this.indicatorsMeta[indicator])
      }
      indicatorsArray.sort(function(a, b) {
          var textA = a.indicator.toUpperCase();
          var textB = b.indicator.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      return indicatorsArray;
    },
    years(){
      if(this.chartType === 'series') {
        return [{
          name: 'All',
          id:this.year
        }]
      }
      if(this.data && this.data.data) {
        return Object.keys(this.data.data).filter(year => year !== 'recentYear').map(year => {
          return {
            name: year === 'recentValue' ? 'Recent value' : year,
            id: year
          }
        }).reverse()
      } else {
        return []
      }
    }
  },
  methods: {
    emitChartTypeChange(chartType){
      this.$emit('chartTypeChange', chartType)
    },
    emitDimensionChange(dimension){
      this.$emit('indicatorChange', dimension)
    },
    emitYearChange(year){
      this.$emit('yearChange', year)
    },
    emitSortingChange(sorting){
      this.$emit('sortingChange', sorting)
    },
    emitRegionChange(region){
      this.$emit('regionChange', region)
    }
  },
}
</script>

<style>
</style>
