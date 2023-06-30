<template>
  <div class='sliderDiv' v-if="(indiCode !== 'region') && (activeIndicatorYears.length > 1)">
  </div>
  <div style='text-align: center;' v-else-if="(activeIndicatorYears.length === 1)"><h4>Year: {{ activeIndicatorYears[0] }}</h4></div>

</template>
<script>
/*global gtag*/
import { mapState } from 'vuex';
import * as d3 from 'd3';
import {sliderBottom} from 'd3-simple-slider';
// eslint-disable-next-line no-unused-vars
let selectedYear;

export default {
  name: 'IndicatorsYearSlider',
  data: function () {
    return {
      selectedYear: null,
    }
  },
  props:['indiCode'],
  computed: {
    ...mapState({
      data: state => state.indicators.activeIndicatorData,
    }),
    activeIndicatorYears(){
      if(this.data && this.data.data) {
        const test = Object.keys(this.data.data).filter(year => (year !== 'recentYear') && year !== 'recentValue').map(year => {
          return Number(year)
        })
        console.log('test', test)
        return Object.keys(this.data.data).filter(year => (year !== 'recentYear') && year !== 'recentValue').map(year => {
          return Number(year)
        })
      } else {
        return []
      }
    },
    sliderYearsArray(){
      let array = [];
      let min = Math.min(...this.activeIndicatorYears);
      let max = Math.max(...this.activeIndicatorYears);
      console.log('min',min,'max',max)
      for (let i = min; i <= max; i++) array.push(i);
      return array;
    }
  },
  methods: {
    async defaultYear(){
      this.selectedYear = this.activeIndicatorYears[this.activeIndicatorYears.length-1];
    },
    emitYearChange(value) {
      const year = Math.round(value)
      if (this.activeIndicatorYears.includes(year)){
        gtag('event', 'indi_year', {
          year
        });
        this.$emit('yearChange', year)
      }
    },
  },
  async mounted(){
    await this.defaultYear();
    var slider = sliderBottom()
    .tickValues(this.activeIndicatorYears)
        .min(this.sliderYearsArray[0])
        .max(this.sliderYearsArray[this.sliderYearsArray.length - 1])
        .width(700)
        .displayValue(true)
        .on('onchange', (value) => this.emitYearChange(value));

    d3.select(this.$el)
      .append('svg')
      .attr('width', 800)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)')
      .call(slider)
  }
}
</script>
<style>
.v-slider__tick-label{
  font-size: 0.7rem;
}
.v-slider__thumb-label{
  z-index: 100;
}
</style>