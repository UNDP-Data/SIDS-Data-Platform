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
import Chart from "chart.js";
import size from '@/mixins/size.mixin';

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
          xAxes: [
            {
              display: true,
              type: "logarithmic",
              scaleLabel: {
                display: true,
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45,

                callback: function (
                  valueX
                ) {
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
                  else return nFormatter(valueX, 2);
                },
              },
            },
          ],
          yAxes: [
            {
              display: true,
              type: "logarithmic",
              scaleLabel: {
                display: true,
              },
              ticks: {
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
                  else return nFormatter(valueY, 2);
                },
              },
            },
          ],
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
      this.chartOptions.scales.yAxes[0].type = this.yAxisType;
      this.chartOptions.scales.xAxes[0].type = this.xAxisType;
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
      this.chartOptions.scales.yAxes[0].ticks.max = e.maxY;
      this.chartOptions.scales.yAxes[0].ticks.min = e.minY;
      this.chartOptions.scales.xAxes[0].ticks.max = e.maxX;
      this.chartOptions.scales.xAxes[0].ticks.min = e.minX;
      this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.secondLayer.units;
      this.chartOptions.scales.xAxes[0].scaleLabel.labelString = this.activeLayer.units;
      this.chartOptions.scales.yAxes[0].afterBuildTicks = function (chartObjY) {
        chartObjY.ticks = [];
        chartObjY.ticks.push(e.Y_breaks[3]);
        chartObjY.ticks.push(e.Y_breaks[2]);
        chartObjY.ticks.push(e.Y_breaks[1]);
        chartObjY.ticks.push(e.Y_breaks[0]);
      }
      this.chartOptions.scales.xAxes[0].afterBuildTicks = function (chartObjX) {
        chartObjX.ticks = [];
        chartObjX.ticks.push(e.X_breaks[3]);
        chartObjX.ticks.push(e.X_breaks[2]);
        chartObjX.ticks.push(e.X_breaks[1]);
        chartObjX.ticks.push(e.X_breaks[0]);
      }
      this.chart = new Chart(canvas, {
        type: "scatter",
        data: { datasets: e.data },
        options: this.chartOptions,
      });
    },
    updateHistogramm(e) {
      this.chartOptions.scales.yAxes[0].ticks.max = e.maxY;
      this.chartOptions.scales.yAxes[0].ticks.min = e.minY;
      this.chartOptions.scales.xAxes[0].ticks.max = e.maxX;
      this.chartOptions.scales.xAxes[0].ticks.min = e.minX;
      this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.secondLayer.units;
      this.chartOptions.scales.xAxes[0].scaleLabel.labelString = this.activeLayer.units;
      this.chartOptions.scales.yAxes[0].afterBuildTicks = function (chartObjY) {
        chartObjY.ticks = [];
        chartObjY.ticks.push(e.Y_breaks[3]);
        chartObjY.ticks.push(e.Y_breaks[2]);
        chartObjY.ticks.push(e.Y_breaks[1]);
        chartObjY.ticks.push(e.Y_breaks[0]);
      }
      this.chartOptions.scales.xAxes[0].afterBuildTicks = function (chartObjX) {
        chartObjX.ticks = [];
        chartObjX.ticks.push(e.X_breaks[3]);
        chartObjX.ticks.push(e.X_breaks[2]);
        chartObjX.ticks.push(e.X_breaks[1]);
        chartObjX.ticks.push(e.X_breaks[0]);
      }
      this.chart.options = this.chartOptions;
      this.chart.data.datasets = e.data;
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
