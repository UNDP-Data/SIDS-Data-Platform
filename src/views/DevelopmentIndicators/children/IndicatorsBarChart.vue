<template lang="html">
  <canvas :id="chartId"></canvas>
</template>

<script>
import Chart from "chart.js";
import { mapState } from 'vuex';

export default {
  name: 'IndicatorsBarChart',
  props:['chartId', 'data'],
  data() {
    return {
      chart:null,
      colors:['#00AED9', '#3EB049', '#FDB713', '#FDB713', '#ed4530', '#0b306b', '#863785', '#378386', '#863737', '#86377f', '#f16a29'],
      chartConfig: {
        maintainAspectRatio: false,
        legend: {
          position: "bottom",
          align: "start"
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label || '';

              if (label) {
                  label += ': ';
              }
              let match = tooltipItem.yLabel.toString().replace('.','').match(/^0+/),
              level = match ? match[0].length : 0
              label += tooltipItem.yLabel.toFixed(level > 2 ? level + 1 : 2);
              return label;
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      indicatorsMeta: state => state.indicators.indicatorsMeta,
    }),
  },
  methods: {
    updateBarChart(data) {
      if(this.chart) {
        this.updateChart(data);
      } else {
        this.initChart(data);
      }
    },
    initChart(data) {
      let canvas = document.getElementById(this.chartId);
      this.chart = new Chart(canvas, {
        type: "bar",
        data: this.parseBarData(data),
        options: this.chartConfig,
      })
    },
    updateChart(data) {
      this.chart.data = this.parsePieData(data);
      this.chart.update(0);
    },
    parseBarData(data) {
      return {
        datasets: Object.keys(data).map((entry, index) => {
          let dim = '';
          if(this.indicatorsMeta[entry] && this.indicatorsMeta[entry].dim.toLowerCase() !== 'none') {
            dim = this.indicatorsMeta[entry].dim
          }
          return {
            label: this.indicatorsMeta[entry] ? this.indicatorsMeta[entry].indicator + ' ' + dim  : entry,
            data: [data[entry]],
            backgroundColor: this.colors[index],
            borderColor: this.colors[index],
            borderWidth:0,
            spacing:0
          }
        }),
        labels: ['']
      }
    }
  },
  mounted() {
    if(this.data) {
      this.updateBarChart(this.data)
    }
  },
  watch: {
    data() {
      if(this.data) {
        this.updateBarChart(this.data)
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>
