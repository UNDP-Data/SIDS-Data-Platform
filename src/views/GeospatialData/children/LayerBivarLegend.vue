<template>
  <v-card class="background-grey bivar_frame">
    <div
      v-if="activeLayer && secondLayer"
      class="pic app-body population-per-km col-flex"
    >
      <div v-if="hasData">
        <div  class="d-flex justify-center legend-title">
          <span v-html="activeLayer.Unit"></span>
        </div>
        <canvas
          id="bivar_histogram"
          width="320"
          height="200"
        ></canvas>
      </div>
      <v-card-text v-else>
        No Data for this Region
      </v-card-text>
    </div>
    <v-card-text v-else>
      Select a Datasets and Layers to view data on the map.
    </v-card-text>
  </v-card>
</template>

<script>
import format from "@/mixins/format.mixin";
import Chart from "chart.js";

export default {
  name: 'LayerBivarLegend',
  mixins: [format],
  data() {
    let nFormatter = this.nFormatter
    return {
      hasData:false,
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
  methods:{
    updateChart(e) {
      this.hasData = true;
      this.$nextTick(() => {
        if(this.chart) {
          this.updateHistogramm(e);
        } else {
          this.initHistogramm(e);
        }
      })
    },
    initHistogramm(e) {
      let canvas = document.getElementById("bivar_histogram");
      this.chartOptions.scales.yAxes[0].ticks.max = e.maxY;
      this.chartOptions.scales.yAxes[0].ticks.min = e.minY;
      this.chartOptions.scales.xAxes[0].ticks.max = e.maxX;
      this.chartOptions.scales.xAxes[0].ticks.min = e.minX;
      this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.secondLayer.Unit;
      this.chartOptions.scales.xAxes[0].scaleLabel.labelString = this.activeLayer.Unit;
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
      new Chart(canvas, {
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
      this.chartOptions.scales.yAxes[0].scaleLabel.labelString = this.secondLayer.Unit;
      this.chartOptions.scales.xAxes[0].scaleLabel.labelString = this.activeLayer.Unit;
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
      this.chart.data = e.data
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
  height: 300px;
}
</style>
