<template>
  <div>
  <v-slider
    v-model="selectedYear"
    :tick-labels="activeIndicatorYears"
    :min="0"
    :max="activeIndicatorYears.length-1"
    tick-size="4"
    thumb-label="always"
    @change="emitYearChange"
  ></v-slider>
  </div>

</template>
<script>
/*global gtag*/
import { mapState } from 'vuex';
export default {
  name: 'IndicatorsYearSlider',
  data: function () {
    return {
      selectedYear: this.defaultSelectedYear,
    }
  },
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
    defaultSelectedYear(){
      return this.activeIndicatorYears.length -1
    }
  },
  methods: {
    emitYearChange(yearIndex) {
      const year = this.activeIndicatorYears[yearIndex].toString();
      gtag('event', 'indi_year', {
        year
      });
      this.$emit('yearChange', year)
    },
  }
}
</script>