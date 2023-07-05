<template>
  <div class="yearsContainer">
    <div class="sliderContainer" v-show="this.sliderYearsArray.length > 1 && this.indiCode !== 'region'">
      <svg width="750" height="100">
        <g transform='translate(30,30)'></g>
      </svg>
      <v-btn
        class="mt-3"
        @click="toggleYearPlay"
        :disabled="activeIndicatorYears.length === 1"
        icon
        >
        <v-icon v-if="playingYear">mdi-pause</v-icon>
        <v-icon v-else>mdi-play</v-icon>
      </v-btn>
    </div>
    <div class="singleYear" v-show="this.sliderYearsArray.length === 1"><h4>Year: {{ activeIndicatorYears[0] }}</h4></div>
  </div>
</template>
<script>
/*global gtag*/
import { mapState} from 'vuex';
import * as d3 from 'd3';
import {sliderTop} from 'd3-simple-slider';

export default {
  name: 'IndicatorsYearSlider',
  data: function () {
    return {
      selectedYear: null,
      playingYear: false,
      playInterval: null,
      slider: null,
      sliderSvg: null,
      first: true,
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
    sliderYearsArray(){
      let array = [];
      let min = Math.min(...this.activeIndicatorYears);
      let max = Math.max(...this.activeIndicatorYears);
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
      let years = this.activeIndicatorYears.slice();
      let index = 0;
      this.transitionToNextYear(years, index)
    },
    transitionToNextYear(years, index) {
      if(this.playingYear) {
        if(index !== this.activeIndicatorYears.length-1) {
          this.slider.value(years[index]);
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
    },
    resetTicks(){
      this.sliderSVG.select('.axis')
        .attr('transform','translate(0,0)');

      let ticks = this.sliderSVG.selectAll('.tick');

      ticks.append('circle')
        .attr('stroke','var(--dark-red)')
        .attr('fill','#fff')
        .attr('r',3);

      ticks.select('text').attr('y', -10);
      this.sliderSVG.select('.track-fill').attr('x1',-8);
      if (this.first) {
        this.sliderSVG.select('.parameter-value')
          .insert('rect', 'text')
          .attr('x',-20)
          .attr('y',-44)
          .attr('rx', 5)
          .attr('width', 40)
          .attr('height', 25)
          .attr('fill', '#000');

        this.sliderSVG.select('.parameter-value')
          .append('polygon')
          .attr('points','-10,-24 10,-24 0,-11')
          .attr('fill', '#000');

        this.first = false;
      }
    }
  },
  async mounted(){
    await this.defaultYear();
    // years slider
    this.sliderSVG = d3.select(this.$el).select('.sliderContainer').select('g');

    this.slider = sliderTop()
      //.tickValues(this.activeIndicatorYears)
      .min(this.sliderYearsArray[0])
      .max(this.sliderYearsArray[this.sliderYearsArray.length - 1])
      .width(700)
      .displayValue(true)
      .tickFormat(d3.format('d'))
      .fill('var(--dark-red)')
      .value(this.sliderYearsArray[this.sliderYearsArray.length - 1])
      .marks(this.sliderYearsArray)
      .handle(['M -8, 0 a 8,8 0 1,1 16,0 a 8,8 0 1,1 -16,0'])
      .on('onchange', (value) => this.emitYearChange(value));

    if (this.sliderYearsArray.length > 1 && this.indiCode !== 'region') {    
      this.sliderSVG.call(this.slider);
      this.sliderSVG.select('.parameter-value')
      .insert('rect', 'text')
      .attr('x',-20)
      .attr('y',-44)
      .attr('rx', 5)
      .attr('width', 40)
      .attr('height', 25)
      .attr('fill', '#000');

    this.sliderSVG.select('.parameter-value')
      .append('polygon')
      .attr('points','-10,-24 10,-24 0,-11')
      .attr('fill', '#000');

    this.resetTicks();
   }
  },
  watch:{
    indiCode(){
      if (this.sliderYearsArray.length > 1 && this.indiCode !== 'region'){

        this.slider
          .min(this.sliderYearsArray[0])
          .max(this.sliderYearsArray[this.sliderYearsArray.length - 1])
          .value(this.sliderYearsArray[this.sliderYearsArray.length - 1])
          .marks(this.sliderYearsArray);

        this.sliderSVG.call(this.slider);
        this.resetTicks();
      }
    }
  }
}
</script>
<style>
.sliderContainer, .singleYear{
  text-align: center;
  display: flex;
  justify-content: center;
}
.track{
  stroke-width: 0;
}
.handle {
  fill: var(--dark-red);
  stroke-width: 0;
}
.tick line{
 display: none;
}
.tick text{
  fill: #000;
  font-size: 0.7rem;
}
.parameter-value text{
  fill: #FFF;
  font-size: 0.8rem;
}
.slider line{
  opacity: 0.5;
}
</style>