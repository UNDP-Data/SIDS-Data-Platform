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
          <v-col class="d-flex align-end justify-space-between" cols="6">
            <div class="select min-0">
              <label class="input-label">Year</label>
              <v-select
                :disabled="chartType !== 'bars' || years.length === 1"
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
            <v-btn
                class="ml-2 filter-sm-button"
                :disabled="chartType !== 'bars' || years.length === 1"
                rounded
                @click="toggleYearPlay"
                fab
                color="primary"
              >
              <v-icon v-if="!playingYear">mdi-play</v-icon>
              <v-icon v-else>mdi-pause</v-icon>
            </v-btn>
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
      playInterval:null,
      playingYear:false,
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
        let res = Object.keys(this.data.data).filter(year => year !== 'recentYear').map(year => {
          return {
            name: year === 'recentValue' ? 'Recent value' : year,
            id: year
          }
        }).reverse()
        if(res.length === 2) {
          res.shift()
          res[0].id = 'recentValue';
        }
        return res
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
    },
    toggleYearPlay() {
      if(this.playingYear) {
        this.pausePlayYear()
      } else {
        this.playYear()
      }
    },
    playYear() {
      this.playingYear = true;
      if(this.playInterval) {
        clearTimeout(this.playInterval)
      }
      let years = this.years.slice().reverse();
      let index = 0;
      this.transitionToNextYear(years, index)
    },
    transitionToNextYear(years, index) {
      if(this.playingYear) {
        if(index !== this.years.length-1) {
          this.emitYearChange(years[index].id);
          index++;
          this.playInterval = setTimeout(()=>{this.transitionToNextYear(years, index)}, 3000)
        } else {
          this.pausePlayYear()
        }
      } else {
        clearTimeout(this.playInterval)
      }
    },
    pausePlayYear() {
      clearTimeout(this.playInterval)
      this.playingYear = false;
    }
  },
}
</script>

<style>
.filter-sm-button, .filter-sm-button:hover{
  width: 36px !important;
  height: 36px !important;
  padding: 8px 18px !important;
}
.min-0 {
  min-width: 0;
  width: 100%;
}
</style>
