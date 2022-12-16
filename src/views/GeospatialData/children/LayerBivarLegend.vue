<template>
  <v-card class="background-grey bivar_frame">
    <div
      v-if="activeLayer && secondLayer"
    >
      <div v-if="hasData">
        <div  class="d-flex justify-center legend-title">
          <span v-html="activeLayer.Unit"></span>
        </div>
        <canvas
          v-if="!isMobile"
          id="bivar_histogram"
          width="320"
          height="200"
        ></canvas>
        <canvas
          v-else
          id="bivar_histogram"
          width="320"
          height="100"
        ></canvas>
        <v-row class="d-none d-md-flex">
          <v-col cols="6">
            <v-switch
              class="mt-1"
              v-model="xAxisLinear"
              @change="updateAxisType"
              :label="`${$t('gis.legend.x')}: ${xAxisType}`"
              hide-details
            ></v-switch>
          </v-col>
          <v-col cols="6">
            <v-switch
              class="mt-1"
              v-model="yAxisLinear"
              @change="updateAxisType"
              :label="`${$t('gis.legend.y')}: ${yAxisType}`"
              hide-details
            ></v-switch>
          </v-col>
        </v-row>
      </div>
      <v-card-text v-else>
        {{$t('gis.legend.noData')}}
      </v-card-text>
    </div>
    <v-card-text v-else>
      {{$t('gis.legend.selectDataset')}}
    </v-card-text>
  </v-card>
</template>

<script>
import format from "@/mixins/format.mixin";
import { Chart, ScatterController, PointElement,CategoryScale, LinearScale, LogarithmicScale, Title } from "chart.js";
import size from '@/mixins/size.mixin';

Chart.register(ScatterController, PointElement,CategoryScale, LinearScale, LogarithmicScale, Title);

export default {
  name: 'LayerBivarLegend',
  mixins: [format, size],
  data() {
    let nFormatter = this.nFormatter
    return {
      hasData:false,
      xAxisLinear: false,
      yAxisLinear: false,
      chartOptions: {
        animation: {
            duration: 0
        },
        scales: {
          x: {
            // beginAtZero:true,
            display: true,
            type: "logarithmic",
            autoSkip: false,
            title: {
              display: true,
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              major: {
                enabled: true
              },
              callback: function (
                valueX
              ) {
                // console.log(valueX)
                if (valueX === 100000000) return "100M";
                if (valueX === 10000000) return "10M";
                if (valueX === 1000000) return "1M";
                if (valueX === 100000) return "100K";
                if (valueX === 10000) return "10K";
                if (valueX === 1000) return "1K";
                if (valueX === 100) return "100";
                if (valueX === 10) return "10";
                if (valueX === 1) return "1";
                if (valueX === 0.1) return "0.1";
                if (valueX > 10)
                  return nFormatter(valueX, 1);
                if(valueX < 0) {
                  console.log('-'+nFormatter(Math.abs(valueX), 2))
                  return '-'+nFormatter(Math.abs(valueX), 2);
                }
                return nFormatter(valueX, 2);
              },
            },
          },
          y: {
            display: true,
            beginAtZero:true,
            autoSkip: false,
            type: "logarithmic",
            title: {
              display: true,
            },
            ticks: {
              major: {
                enabled: true
              },
              maxRotation: 45,
              minRotation: 45,

              callback: function (
                valueY
              ) {
                if (valueY === 100000000) return "100M";
                if (valueY === 10000000) return "10M";
                if (valueY === 1000000) return "1M";
                if (valueY === 100000) return "100K";
                if (valueY === 10000) return "10K";
                if (valueY === 1000) return "1K";
                if (valueY === 100) return "100";
                if (valueY === 10) return "10";
                if (valueY === 1) return "1";
                if (valueY === 0.1) return "0.1";
                if (valueY > 10)
                  return nFormatter(valueY, 1);
                if(valueY < 0) {
                  console.log('-'+nFormatter(Math.abs(valueY), 2))
                  return '-'+nFormatter(Math.abs(valueY), 2);
                }
                return nFormatter(valueY, 2);
              },
            },
          },
        },
        legend: {
          position: "top",
          display: false,
        },
        tooltips: false,
      }
    }
  },
  props:[
    'map',
    'activeLayer',
    'secondLayer'
  ],
  computed: {
    xAxisType() {
      return this.xAxisLinear ? 'linear' : 'logarithmic'
    },
    yAxisType() {
      return this.yAxisLinear ? 'linear' : 'logarithmic'
    }
  },
  methods:{
    updateAxisType() {
      this.chartOptions.scales.y.type = this.yAxisType;
      this.chartOptions.scales.x.type = this.xAxisType;
      this.chart.options = this.chartOptions;
      this.chart.update(0);
    },
    updateChart(e) {
      if(e.noData) {
        this.hasData = false;
        this.chart = null;
      } else {
        this.hasData = true;
        this.$nextTick(() => {
          if(this.chart) {
            this.updateHistogramm(e);
          } else {
            this.initHistogramm(e);
          }
        })
      }
    },
    initHistogramm(e) {
      let canvas = document.getElementById("bivar_histogram");
      this.chartOptions.scales.y.max = e.maxY;
      this.chartOptions.scales.y.min = e.minY;
      console.log(this.chartOptions)
      this.chartOptions.scales.x.max = e.maxX;
      this.chartOptions.scales.x.min = e.minX;
      this.chartOptions.scales.y.title.text = [[this.secondLayer.title], [this.secondLayer.units]];
      this.chartOptions.scales.x.title.text = [[this.activeLayer.title], [this.activeLayer.units]];
      this.chartOptions.scales.y.afterBuildTicks = function (chartObjY) {
        chartObjY.ticks = [];
        chartObjY.ticks.push({
          value: e.Y_breaks[3],
          major: true
        });
        chartObjY.ticks.push({
          value: e.Y_breaks[2],
          major: true
        });
        chartObjY.ticks.push({
          value: e.Y_breaks[1],
          major: true
        });
        chartObjY.ticks.push({
          value: e.Y_breaks[0],
          major: true
        });
        console.log(chartObjY.ticks)
      }
      this.chartOptions.scales.x.afterBuildTicks = function (chartObjX) {
        chartObjX.ticks = [];
        chartObjX.ticks.push({
          value: e.X_breaks[3],
          major: true
        });
        chartObjX.ticks.push({
          value: e.X_breaks[2],
          major: true
        });
        chartObjX.ticks.push({
          value: e.X_breaks[1],
          major: true
        });
        chartObjX.ticks.push({
          value: e.X_breaks[0],
          major: true
        });
      }
      this.chart = new Chart(canvas, {
        type: "scatter",
        data: { datasets: e.data },
        options: this.chartOptions,
      });
    },
    updateHistogramm(e) {
      this.chartOptions.scales.y.max = e.maxY;
      this.chartOptions.scales.y.min = e.minY
      console.log(this.chartOptions)
      this.chartOptions.scales.x.max = e.maxX;
      this.chartOptions.scales.x.min = e.minX;
      this.chartOptions.scales.y.title.text = [[this.secondLayer.title], [this.secondLayer.units]];
      this.chartOptions.scales.x.title.text = [[this.activeLayer.title], [this.activeLayer.units]];
      this.chartOptions.scales.y.afterBuildTicks = function (chartObjY) {
        chartObjY.ticks = [];
        chartObjY.ticks.push({
          value: e.Y_breaks[3],
          major: true
        });
        chartObjY.ticks.push({
          value: e.Y_breaks[2],
          major: true
        });
        chartObjY.ticks.push({
          value: e.Y_breaks[1],
          major: true
        });
        chartObjY.ticks.push({
          value: e.Y_breaks[0],
          major: true
        });
      }
      this.chartOptions.scales.x.afterBuildTicks = function (chartObjX) {
        chartObjX.ticks = [];
        chartObjX.ticks.push({
          value: e.X_breaks[3],
          major: true
        });
        chartObjX.ticks.push({
          value: e.X_breaks[2],
          major: true
        });
        chartObjX.ticks.push({
          value: e.X_breaks[1],
          major: true
        });
        chartObjX.ticks.push({
          value: e.X_breaks[0],
          major: true
        });
      }
      this.chart.options = this.chartOptions;
      this.chart.data.datasets = e.data;
      console.log(this.chartOptions)
      this.chart.update(0);
    },
  },
  mounted() {
    this.map.on('bivarDataUpdate', this.updateChart)
  },
  destroyed() {
    this.map.off('bivarDataUpdate', this.updateChart)
  }
}
</script>

<style>

.description-block {
  border-radius: 0 !important;
}
.bivar_frame {
  min-height: 300px;
}
@media (max-width:959px) {
  .bivar_frame {
    min-height: 0;
    max-height: 120px;
  }
}
</style>
