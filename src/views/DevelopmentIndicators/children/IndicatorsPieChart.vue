<template lang="html">
  <div class="chart-container">
    <canvas class="pie-chart-container" width="400" height="400" :id="chartId"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  name: 'IndicatorsPieChart',
  props:['chartId', 'data'],
  data() {
    return {
      colors:['#00AED9', '#3EB049', '#FDB713', '#FDB713', '#ed4530', '#0b306b'],
      chart:null,
      chartConfig: {
        legend: {
          position: "top",
          align: "start"
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var label = data.labels[tooltipItem.index] || '';

              if (label) {
                  label += ': ';
              }
              let match = data.datasets[0].data[tooltipItem.index].toString().replace('.','').match(/^0+/),
              level = match ? match[0].length : 0
              label += data.datasets[0].data[tooltipItem.index].toFixed(level > 1 ? level + 1 : 2);
              return label;
            }
          }
        }
      }
    }
  },
  methods: {
    updatePieChart(data) {
      if(this.chart) {
        this.updateChart(data);
      } else {
        this.initChart(data);
      }
    },
    initChart(data) {
      let canvas = document.getElementById(this.chartId);
      this.chart = new Chart(canvas, {
        type: "pie",
        data: this.parsePieData(data),
        options: this.chartConfig,
      })
    },
    updateChart(data) {
      this.chart.data = this.parsePieData(data);
      this.chart.update(0);
    },
    parsePieData(data) {
      return {
        datasets: [{
          data: Object.values(data),
          backgroundColor: this.colors.slice(0, Object.keys(data).length),
          borderColor: this.colors.slice(0, Object.keys(data).length),
          borderWidth:0,
          spacing:0
        }],
        labels:Object.keys(data),
      }
    }
  },
  mounted() {
    if(this.data) {
      this.updatePieChart(this.data)
    }
  },
  watch: {
    data() {
      if(this.data) {
        this.updatePieChart(this.data)
      }
    }
  }
}
</script>

<style lang="css" scoped>
.chart-container {
  position: relative;
  min-height: 240px;
}
.pie-chart-container {
  height: 240px;
}
</style>
