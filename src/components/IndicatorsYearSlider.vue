<template>
  <div v-if="(indiCode !== 'region') && (activeIndicatorYears.length > 1)">
    <v-slider
      v-model="selectedYear"
      :tick-labels="activeIndicatorYears"
      :min="0"
      :max="activeIndicatorYears.length-1"
      tick-size="2"
      color="var(--dark-red)"
      track-color="var(--gray-400)"
      @change="emitYearChange"
    ></v-slider>
  </div>
  <div style='text-align: center;' v-else-if="(activeIndicatorYears.length === 1)"><h4>Year: {{ activeIndicatorYears[0] }}</h4></div>

</template>
<script>
/*global gtag*/
import { mapState } from 'vuex';
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
        return Object.keys(this.data.data).filter(year => (year !== 'recentYear') && year !== 'recentValue').map(year => {
          return Number(year)
        })
      } else {
        return []
      }
    },
  },
  methods: {
    async defaultYear(){
      this.selectedYear = this.activeIndicatorYears[this.activeIndicatorYears.length-1];
    },
    emitYearChange(yearIndex) {
      const year = this.activeIndicatorYears[yearIndex].toString();
      gtag('event', 'indi_year', {
        year
      });
      this.$emit('yearChange', year)
    },
  },
  async mounted(){
    await this.defaultYear();
  }
}
</script>
<style>
.v-slider__tick-label{
  font-size: 0.7rem;
}
</style>