<template>
  <div class="sliderContainer">
    <div class='sliderDiv'></div>
    <h4>Year: {{ activeIndicatorYears[0] }}</h4>
  </div>

</template>
<script>
/*global gtag*/
import { mapState} from 'vuex';
import * as d3 from 'd3';
import {sliderTop} from 'd3-simple-slider';
// eslint-disable-next-line no-unused-vars
var selectedYear;
var slider, sliderSVG; 
// eslint-disable-next-line no-unused-vars
var hideSlider = false;

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
    resetTicks(){
      sliderSVG.select('.axis')
        .attr('transform','translate(0,0)');

      let ticks = sliderSVG.selectAll('.tick');

      ticks.append('circle')
        .attr('stroke','var(--dark-red)')
        .attr('fill','#fff')
        .attr('r',3);

      ticks.select('text').attr('y', -10);
      sliderSVG.select('.track-fill').attr('x1',-8)
    }
  },
  async mounted(){
    await this.defaultYear();
    slider = sliderTop()
    //.tickValues(this.activeIndicatorYears)
    .min(this.sliderYearsArray[0])
    .max(this.sliderYearsArray[this.sliderYearsArray.length - 1])
    .width(700)
    .displayValue(true)
    .tickFormat(d3.format('d'))
    .fill('var(--dark-red)')
    .value(this.sliderYearsArray[this.sliderYearsArray.length - 1])
    .marks(this.sliderYearsArray)
    .handle(['M -10, 0 a 10,10 0 1,1 20,0 a 10,10 0 1,1 -20,0'])
    .on('onchange', (value) => this.emitYearChange(value));

    sliderSVG = d3.select(this.$el)
      .append('svg')
      .attr('width', 800)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(30,30)')
    
    if (this.sliderYearsArray.length > 1 && this.indiCode !== 'region') {
      sliderSVG.call(slider)
      hideSlider = false;
      this.resetTicks();
      sliderSVG.select('.parameter-value')
      .insert('rect', 'text')
      .attr('x',-20)
      .attr('y',-44)
      .attr('rx', 5)
      .attr('width', 40)
      .attr('height', 25)
      .attr('fill', '#000');

      sliderSVG.select('.parameter-value')
      .append('polygon')
        .attr('points','-10,-24 10,-24 0,-11')
        .attr('fill', '#000');
      
    }
    else hideSlider = true;
  },
  watch:{
    indiCode(){
      console.log('changed indicode', this.indiCode);
      if (this.sliderYearsArray.length > 1 && this.indiCode !== 'region'){
        slider
          .tickValues(this.activeIndicatorYears)
          .min(this.sliderYearsArray[0])
          .max(this.sliderYearsArray[this.sliderYearsArray.length - 1])
          .value(this.sliderYearsArray[this.sliderYearsArray.length - 1])
          .marks(this.sliderYearsArray)
        sliderSVG.call(slider);
        hideSlider = false;
      }
      else hideSlider = true;
    }
  }
}
</script>
<style>
.sliderContainer{
  text-align: center;
}
.track{
  stroke-width: 0;
}
.handle {
fill: var(--dark-red);
stroke-width: 0;
}
.hide-slider {
  display: none;
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