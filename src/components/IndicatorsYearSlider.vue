<template>
  <v-slider
    v-model="value"
    :min="0"
    :max="1"
    :step="0.2"
    thumb-label
  ></v-slider>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'IndicatorsYearSlider',
  data () {
    return {
      value: 0,
    }
  },
  computed: {
    ...mapState({
      data: state => state.indicators.activeIndicatorData,
    }),
    activeIndicatorYears(){
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
    },
  }
}
</script>