<template>
  <v-card flat>
    <v-card-title class="justify-center">
      <h3 class="ml-auto page-header text-center">
        AI Mode
      </h3>
      <v-btn class="mr-0 ml-auto" icon @click="autoMode ? $emit('close') : autoMode = true">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-subtitle>
      Select one of five pretrained models to add the predicted results to the interface and analyze correlation between indicators by visualizing the importance of othe indicators used in predictions.
    </v-card-subtitle>
    <v-card-text>
      <v-expansion-panels v-if="autoMode" v-model="activePanel" flat accordion>
        <v-expansion-panel
          v-for="(model,i) in models"
          :key="i"
          class="mb-4 ml-panel"
          @change="onPageExpand(i)"
        >
          <v-expansion-panel-header class="ml-panel-button">
              <v-col :style="{'background': model.color}" class="justify-center ml-panel-button-first ml-panel-button_content pt-0 pb-0 d-flex align-center ml-panel_number" cols="2">
                Model {{i+1}}
              </v-col>
              <v-col cols="3" class="font-weight-bold ml-panel-button_content d-flex align-center pt-0 pb-0">
                {{model.name}}
              </v-col>
              <v-col cols="4" class="ml-panel-button-params ml-panel-button_content d-flex align-center pt-0 pb-0">
                {{model.params}}
              </v-col>
              <v-col cols="3" class="ml-panel-button_content d-flex align-center pt-0 pb-0">
                {{model.adv}}
              </v-col>

            <template v-slot:actions>
              <div class="icon-container"  :style="{'background': `${model.color}90`}">
                <v-icon>
                  $expand
                </v-icon>
              </div>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="pt-4">
            <v-row>
              <v-col cols="8">
                <div :id="'imp-bar-'+i">
                </div>
              </v-col>
              <v-col cols="4">
                <div :id="'imp-pie-'+i">
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div v-if="autoMode" class="d-flex align-center">
        <p class="mr-4 mb-0">
          Or, you can design your own machine learning model to train in real-time in our Azure environment, with custom parameters and model types
        </p>
        <div>
          <v-btn :disabled="!!designErr" small rounded @click="autoMode = false" color="primary">Design your own model</v-btn>
          <p class="caption mt-2" v-if="designErr">{{designErr}}</p>
        </div>
      </div>
      <indicators-ML @close="autoMode = false" :indicatorCode="indicator" :year="year" v-else/>
    </v-card-text>
  </v-card>
</template>

<script>
import service from '@/services';
import poltly from 'plotly.js-dist/plotly';
import { mapState } from 'vuex';
import IndicatorsML from './IndicatorsML';

export default {
  name: 'indicatorsMLmodels',
  props:['indicator', 'year'],
  data(){
    return {
      activePanel:undefined,
      autoMode:true,
      models:[{
        name:"Random Forest Regressor",
        params:"100 Indicators, 42 Fibbledygooks, 14 trees mapped to 18 bees, Data style",
        adv:"Most indicator predictions",
        color:"#00AED9"
      },{
        name:"Gradient Boost Regressor",
        params:"100 Indicators, 42 Fibbledygooks, 14 trees mapped to 18 bees, Data style",
        adv:"Highest accuracy",
        color:"#3EB049"
      }]
    }
  },
  computed: {
    ...mapState({
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      mlData: state => state.ml.mlData,
      mlModel: state => state.ml.mlModel
    }),
    designErr() {
      if(this.year === 'recentValue' || this.year > 2019 || this.year < 2000) {
        return 'Target year does not supported. Support from 2000 to 2019'
      }
      if(!['key', 'mvi', 'ndgain', 'wdi'].includes(this.indicatorsMeta[this.indicator].dataset)) {
        return 'Target dataset not supported. Support Key Indicators, MVI, WDI, ND-GAIN'
      }
      return null
    }
  },
  components:{
    IndicatorsML
  },
  methods: {
    async onPageExpand(index) {
      await this.$nextTick()
      if(typeof this.activePanel !== 'undefined') {
        let res = await service.loadMLindicatorData({
          indicator:this.indicator,
          model:this.activePanel+1,
          dataset:this.indicator.split('-')[0]
        })
        this.initPieChart(index, res.featureImportances.categories)
        this.initBarChart(index, res.featureImportances.indicators)
      }
    },
    initBarChart(index, data){
      let traces = [{
        x: Object.keys(data).map(code => {
          let indi = this.indicatorsMeta[code] ? this.indicatorsMeta[code].indicator : code;
          // if(indi.length > 15) {
          //   let spaceindex = indi.indexOf(" ", 10)
          //   indi = indi.substring(0,spaceindex) + '<br>' + indi.substring(spaceindex+1)
          // }
          return indi
        }),
        y: Object.values(data),
        type: "bar",
        orientation: 'v'
      }];
      var layout = {
        autosize: true,
        margin: {b: 200, r:100},
        plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
        xaxis:{
          tickfont:{size:10}
        },
        yaxis:{
          tickfont:{size:10}
        }
      };
      poltly.newPlot('imp-bar-'+index, traces,layout);
    },
    initPieChart(index, data) {
      var trace = {
        type: 'pie',
        labels: Object.keys(data),
        values: Object.values(data)
      }
      poltly.newPlot('imp-pie-'+index, [trace], {
        plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
      })
    },
    isModelDisplayed(index) {
      return !(typeof this.activePanel === 'undefined' || this.activePanel === index)
    }
  },
  created() {
    if(this.mlData && this.mlModel.target === this.indicator && this.mlModel.target_year === this.year) {
      this.autoMode = false;
    }
  },
  watch: {
    year() {
      if(this.designErr) {
        this.autoMode = true
      }
    },
    indicator() {
      if(this.designErr) {
        this.autoMode = true
      }
    }
  }
}
</script>

<style>
.ml-panel {
}
.ml-panel .icon-container{
  height: 48px;
  display: flex;
  align-items: center;
  padding-left: .2em;
  padding-right: .2em;
  border-top-right-radius: 5px !important;
  border-bottom-right-radius: 5px !important;
}
.ml-panel-button {
  padding: 0!important;
  background: #DCDCDC;
  border-radius: 5px !important;
  min-height: 48px !important;
}
.ml-panel-button-first {
  border-top-left-radius: 5px !important;
  font-size: 20px;
  border-bottom-left-radius: 5px !important;
}

.ml-panel-button-params {
  font-size: 12px;
}
.ml-panel-button_content {
  height: 48px;
}
</style>
