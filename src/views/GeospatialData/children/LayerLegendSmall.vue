<template>
  <v-card class="background-grey mr-4 ml-4 mr-md-0 ml-md-0">
    <div
      v-if="activeLayer"
      class="w-100 col-flex"
    >
      <div v-if="hasData" class="d-flex d-md-block">
        <div  class="d-flex justify-center legend-title mr-4 ml-4 align-center">
          <span v-html="activeLayer.Units"></span>
        </div>
        <div
          class="d-flex justify-space-evenly legend main-legend pb-1 pb-md-0"
        >
          <div class="legend-item" :key="index" v-for="(item,index) in legendPoints">
            <div class="legend-item_text">{{item.text}}</div>
            <div class="legend-item_point" :style="'background-color:'+item.color"></div>
          </div>
        </div>
      </div>
      <v-card-text class="pt-2 pb-2" v-else>
        No Data for this Region
      </v-card-text>
    </div>
  </v-card>
</template>

<script>
import format from "@/mixins/format.mixin";

export default {
  name: 'LayerDescription',
  data() {
    return {
      legendPoints:null,
      chart:null,
      hasData:true,
      chartOptions: {
        responsive: true,
        tooltips: {
          enabled: false,
        },
        legend: {
          display: false,
        },
        annotation: {
          annotations: [
            {
              type: "line",
              mode: "vertical",
              scaleID: "x-axis-0",
              value: "70%",
              borderColor: "black",
              label: {
                content: "Your Score",
                enabled: true,
                position: "center",
              },
            },
          ],
        },
        scales: {
          borderWidth: 0,
          yAxes: [
            {
              display: true,
              type: "logarithmic",
              scaleLabel: {
                display: true,
                labelString: 'Frequency'
              },
              ticks: {
                maxTicksLimit: 4,
                max: 0,
                callback: function (
                  value
                ) {
                  if (value === 100000000) return "100M";
                  if (value === 10000000) return "10M";
                  if (value === 1000000) return "1M";
                  if (value === 100000) return "100K";
                  if (value === 10000) return "10K";
                  if (value === 1000) return "1K";
                  if (value === 100) return "100";
                  if (value === 10) return "10";
                  if (value === 1) return "1";
                  return null;
                },
              }
            },
          ],
          xAxes: [
            {
              barPercentage: 1.0,
              categoryPercentage: 1.0,
              gridLines: {
                display: true,
              },
              scaleLabel: {
                display: false,
              },
              ticks: {
                maxTicksLimit: 10,
              },
            },
          ],
        },
      }
    }
  },
  mixins: [format],
  props:[
    'activeLayer',
    'map',
  ],
  methods: {
    updateLegend(e) {
      if(e.noData && e.activeLayer === this.activeLayer) {
        this.hasData = false
      } else if(e.activeLayer === this.activeLayer) {
        this.legendPoints = e.breaks.map((item, index) => {
          return {
            text: this.nFormatter(item,2),
            color: e.colorRamp[index]
          }
        })
        this.hasData = true;
      }
    },
  },
  mounted() {
    this.map.on('layerUpdate', this.updateLegend)
  },
  destroyed() {
    this.map.off('layerUpdate', this.updateLegend)
  }
}
</script>

<style>
.histogram_frame {
  height: 200px;
  border-radius: 0 !important;
}
.legend-title {
  font-size: 11px;
  font-weight: bold;
}
.legend-item_text {
  font-size: 11px;
  line-height: 14px;
  margin-top: 5px;
  width: 100%;
  text-align: center;;
}
.justify-space-evenly {
  justify-content: space-evenly;
}
.w-100 {
  width: 100%;
  padding: 4px;
}
.legend-item_point {
  width: 17px;
  height: 15px;
  background: url("~@/assets/polygon.png");
  background-repeat: no-repeat;
  background-size: 101% 101%;
  margin-top: 2px;
  z-index: 4;
}
@media (max-width:959px) {
  /* .background-grey {
    background-color: transparent !important;
  } */
  .histogram_frame {
    height: auto;
    border-radius: 22px !important;
  }
  .main-legend {
    width: 100%
  }
}
</style>
