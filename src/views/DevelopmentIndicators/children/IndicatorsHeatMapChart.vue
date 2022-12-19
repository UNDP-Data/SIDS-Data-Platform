<template lang="html">
  <canvas class="heatChart" :id="chartId"></canvas>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title } from "chart.js";
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
Chart.register(MatrixController, MatrixElement, LineElement, PointElement, LinearScale, Title);

// eslint-disable-next-line
import { mapState } from 'vuex';

export default {
  name: 'IndicatorsHeatMapChart',
  props:['chartId', 'data'],
  data() {
    let rootThis = this;
    return {
      chart:null,
      colors:['#00AED9', '#3EB049', '#FDB713', '#FDB713', '#ed4530', '#0b306b', '#863785', '#378386', '#863737', '#86377f', '#f16a29'],
      chartConfig: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            position: 'bottom',
            type:'linear',
            offset: true,
            ticks: {
              maxRotation: 90,
              padding: 5,
              callback(value) {
                let key = rootThis.data.columns[value]
                let dim = ''
                if(rootThis.indicatorsMeta[key] && rootThis.indicatorsMeta[key].dim.toLowerCase() !== 'none') {
                  dim = rootThis.indicatorsMeta[key].dim
                }
                let label = rootThis.indicatorsMeta[key] ? rootThis.indicatorsMeta[key].indicator + ' ' + dim : key;
                if(label.length > 15) {
                  let spaceindex = label.indexOf(" ", label.length/2 - 5)
                  label = [label.substring(0,spaceindex), label.substring(spaceindex+1)]
                }
                return label
              }
            },
            gridLines: {
              display: false,
              drawBorder: false,
              tickMarkLength: 0,
            },
          }],
          yAxes: [{
            offset: true,
            type:'linear',
            position: 'left',
            ticks: {
               // workaround, see: https://github.com/chartjs/Chart.js/pull/6257
              maxRotation: 90,
              padding: 5,
              callback(value) {
                let key = rootThis.data.columns[value]
                let dim = ''
                if(rootThis.indicatorsMeta[key] && rootThis.indicatorsMeta[key].dim.toLowerCase() !== 'none') {
                  dim = rootThis.indicatorsMeta[key].dim
                }
                let label = rootThis.indicatorsMeta[key] ? rootThis.indicatorsMeta[key].indicator + ' ' + dim : key;
                if(label.length > 15) {
                  let spaceindex = label.indexOf(" ", label.length/2 - 5)
                  label = [label.substring(0,spaceindex), label.substring(spaceindex+1)]
                }
                return label
              }
            },
            gridLines: {
              display: false,
              drawBorder: false,
              tickMarkLength: 0
            },
          }]
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItem) {
              let key1 = rootThis.data.columns[tooltipItem[0].xLabel]
              let label1 = rootThis.indicatorsMeta[key1] ? rootThis.indicatorsMeta[key1].indicator : key1;
              let key2 = rootThis.data.columns[tooltipItem[0].yLabel]
              let label2 = rootThis.indicatorsMeta[key2] ? rootThis.indicatorsMeta[key2].indicator : key2;
              return label1 + ' & ' + label2
            },
            label: function(tooltipItem) {
              let dataValue = rootThis.data.data[tooltipItem.xLabel][tooltipItem.yLabel]
              let match = dataValue.toString().replace('.','').match(/^0+/),
              level = match ? match[0].length : 0
              return dataValue.toFixed(level > 1 ? level + 1 : 2);
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
    updateHeatChart(data) {
      if(this.chart) {
        this.updateChart(data);
      } else {
        this.initChart(data);
      }
    },
    initChart(data) {
      let canvas = document.getElementById(this.chartId);
      this.chart = new Chart(canvas, {
        type: "matrix",
        data: this.parseHeatData(data),
        options: this.chartConfig,
      })
    },
    updateChart(data) {
      this.chart.data = this.parseHeatData(data);
      this.chart.update(0);
    },
    parseHeatData(data) {
      return {
        datasets: [{
          data: data.data.reduce((reducer, array, index) => {
            array.map((value, indexSecond) => {
              reducer.push({x: index,
              y: indexSecond,
              d: data.columns[indexSecond],
              v: value})
            })
            return reducer
          }, []),
          backgroundColor: function(ctx) {
              var value = ctx.dataset.data[ctx.dataIndex].v;
              var alpha = Math.abs(value);
              // eslint-disable-next-line no-undef
              return value > 0 ? Color('blue').alpha(alpha).rgbString() : Color('red').alpha(alpha).rgbString()
          },
          width: function(ctx) {
              var a = ctx.chart.chartArea;
              return (a.right - a.left) / 10;
          },
          height: function(ctx) {
              var a = ctx.chart.chartArea;
              return (a.bottom - a.top) / 10;
          }
        }],
        lables: data.columns,
      }
    }
  },
  mounted() {
    if(this.data) {
      this.updateHeatChart(this.data)
    }
  },
  watch: {
    data() {
      if(this.data) {
        this.updateHeatChart(this.data)
      }
    }
  }
}
</script>

<style lang="css" scoped>
.heatChart {
  height: 600px !important
}
</style>
