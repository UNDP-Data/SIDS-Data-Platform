<template>
  <v-card flat>
    <v-card-title class="justify-center">
      <h3 class="ml-auto page-header text-center">
        AI Mode
      </h3>
      <v-btn class="mr-0 ml-auto" icon @click="autoMode ? closeAiMode() : autoMode = true">
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
              <v-col cols="3" class="ml-panel-button-params ml-panel-button_content d-flex align-center pt-0 pb-0">
                {{model.params}}
              </v-col>
              <v-col cols="4" class="ml-panel-button_advantage ml-panel-button_content d-flex align-center pt-0 pb-0">
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
            <v-row v-if="modelAvaliable">
              <h2 class="block-subheader">Prediction Strength</h2>
              <p>The importance of each predictors is measure through gini importance. Gini importance is defined as the total decrease in node impurity (weighted by the probability of reaching that node (which is approximated by the proportion of samples reaching that node)) averaged over all trees of the ensemble. The higher the value the better</p>
              <v-col cols="8">
                <div :id="'imp-bar-'+i">
                </div>
              </v-col>
              <v-col cols="4">
                <div :id="'imp-pie-'+i">
                </div>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col v-if="yearsList" cols="12">
                <p>Model is not avaliable for selected year</p>
                <p>Avaliable years: {{yearsList}}</p>
              </v-col>
              <v-col v-else cols="12">
                <p>This models is not avaliable for selected indicator</p>
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
import store from '@/store';

export default {
  name: 'indicatorsMLmodels',
  props:['indicator', 'year'],
  data(){
    return {
      activePanel:undefined,
      autoMode:true,
      models:[
        {
          name: "Extratree Regressor",
          color:"#00AED9",
          params: "n_estimators, maximum depth (tuned via cross-validation), initial_strategy=\"KNNimputer\"",
          adv: "uses averaging to improve the predictive accuracy and control over-fitting via randomization, faster computation",
        },
        {
          name: "Random Forest Regressor",
          color:"#3EB049",
          params: "n_estimators, maximum depth (tuned via cross-validation), initial_strategy=\\\"KNNimputer\\\"",
          adv: "uses averaging to improve the predictive accuracy and reduce over-fitting via bootsrapping compared to decision trees.Processing high-dimensional data and feature-missing data are the strengths of random forest",
        },
        {
          name: "Gradient boost Regressor",
          color: '#FDB713',
          params: "loss_function, learning_rate, n_estimators, maximum depth (tuned via cross-validation), initial_strategy=\\\"KNNimputer\\\"",
          adv: "Higher point estimation accuracy",
        },
        {
          name: "LGBM Regressor",
          color: '#FDB713',
          params: "Boosting type, maximum tree depth of base learners, number of boosted trees to fit (all selected via cross-validation) and feature importance type",
          "Model Description": "LightGBM is a gradient boosting framework that uses tree based learning algorithms. It is designed to be distributed and efficient. LightGBM has a faster rate of execution along with being able to maintain good accuracy levels primarily due to the utilization of two novel techniques: Gradient-Based One-Side Sampling (GOSS, retains instances with larger gradients and performs random sampling on instances with smaller gradients) and Exclusive Feature Bundling (EFB,a near lossless method to reduce the number of effective features)",
          adv: "Faster training speed and higher efficiency, Lower memory usage, Better accuracy, scaling to large data  ",
        }
      ]
    }
  },
  computed: {
    ...mapState({
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      mlData: state => state.ml.mlData,
      mlModel: state => state.ml.mlModel,
      mlPredictionData: state => state.ml.MLPredictionData
    }),
    designErr() {
      if(this.year === 'recentValue' || this.year > 2019 || this.year < 2000) {
        return 'Target year does not supported. Support from 2000 to 2019'
      }
      if(!['key', 'mvi', 'ndgain', 'wdi'].includes(this.indicatorsMeta[this.indicator].dataset)) {
        return 'Target dataset not supported. Support Key Indicators, MVI, WDI, ND-GAIN'
      }
      return null
    },
    modelAvaliable() {
      return this.mlPredictionData && this.mlPredictionData.data && this.mlPredictionData.data[this.year] ? true : false
    },
    yearsList() {
      return this.mlPredictionData ? Object.keys(this.mlPredictionData.data).toString() : null
    }
  },
  components:{
    IndicatorsML
  },
  methods: {
    async onPageExpand() {
      await this.$nextTick()
      if(typeof this.activePanel !== 'undefined') {
        let res = await service.loadMLindicatorData({
          indicator:this.indicator,
          model:this.activePanel+1,
          dataset:this.indicator.split('-')[0]
        })
        store.dispatch('ml/loadMlPredictionData', res)
        await this.$nextTick()
        await this.$nextTick()
        this.drawData()
      }
    },
    drawData() {
      if(!this.mlPredictionData || !this.mlPredictionData.data[this.year]) {
        return
      }
      this.initPieChart(this.activePanel, this.mlPredictionData.categoryImportances[this.year])
      this.initBarChart(this.activePanel, this.mlPredictionData.featureImportances[this.year])
    },
    initBarChart(index, data){
      let traces = [{
        x: Object.keys(data).map(code => {
          let indi = this.indicatorsMeta[code] ? this.indicatorsMeta[code].indicator : code;
          if(this.indicatorsMeta[code] && this.indicatorsMeta[code].dim !== 'none') {
            indi+= ' ' + this.indicatorsMeta[code].dim
          }
          if(indi.length > 15) {
            let spaceindex = indi.indexOf(" ", indi.length/2 - 5)
            indi = indi.substring(0,spaceindex) + '<br>' + indi.substring(spaceindex+1)
          }
          return indi
        }),
        y: Object.values(data),
        type: "bar",
        orientation: 'v'
      }];
      var layout = {
        autosize: false,
        margin: {b: 200, r:100, l:0, t:0},
        width:document.getElementById('imp-bar-'+index).offsetWidth,
        height:400,
        plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
        xaxis:{
          tickangle:35,
          tickfont:{size:9}
        },
        yaxis:{
          tickfont:{size:9}
        }
      };
      poltly.newPlot('imp-bar-'+index, traces, layout);
    },
    initPieChart(index, data) {
      let trace = {
        type: 'pie',
        labels: Object.keys(data),
        values: Object.values(data)
      }
      var layout = {
        legend: {
          x: 1,
        },
        margin: {t: 0, b:0},
        autosize: false,
        width:document.getElementById('imp-pie-'+index).offsetWidth,
        height:400,
        // automargin: true,
        plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
      };
      poltly.newPlot('imp-pie-'+index, [trace], layout)
    },
    isModelDisplayed(index) {
      return !(typeof this.activePanel === 'undefined' || this.activePanel === index)
    },
    closeAiMode() {
      this.activePanel = undefined;
      store.dispatch('ml/clearMlPredictionData')
      this.$emit('close')
    }
  },
  created() {
    if(this.mlData && this.mlModel && this.mlModel.target === this.indicator && this.mlModel.target_year === this.year) {
      this.autoMode = false;
    }
  },
  watch: {
    async year() {
      if(this.designErr) {
        this.autoMode = true
      }
      if(typeof this.activePanel !== undefined && this.activePanel !== null) {
        await this.$nextTick()
        this.drawData(this.mlPredictionData)
      }
    },
    indicator() {
      if(this.designErr) {
        this.autoMode = true
        this.activePanel = undefined;
      }
    },
    autoMode() {
      if(!this.autoMode) {
        this.activePanel = undefined;
      }
    },
    activePanel() {
      if(!this.activePanel) {
        store.dispatch('ml/clearMlPredictionData')
      }
    }
  }
}
</script>

<style>
.ml-panel {
}
.ml-panel .icon-container{
  height: 64px;
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
  min-height: 56px !important;
}
.ml-panel-button-first {
  border-top-left-radius: 5px !important;
  font-size: 20px;
  border-bottom-left-radius: 5px !important;
}

.ml-panel-button-params {
  font-size: 10px;
}
.ml-panel-button_content {
  height: 64px;
}
.ml-panel-button_advantage {
  font-size: 10px;
}
</style>
