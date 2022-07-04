<template>
  <div class="pl-5 ml-container">
    <v-row>
      <v-col cols="6">
        <div class="select">
          <label class="input-label">Model</label>
          <v-select
            rounded
            dense
            hide-details
            item-value="chartType"
            item-text="name"
            :value="modelType"
            :items="modelTypes"
            @change="getMLestimate"
            outlined
          ></v-select>
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12">
        <h4 class="choro-title text-center">
          {{activeIndicatorsMeta.indicator}}
          ({{activeIndicatorsMeta.units}})
        </h4>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12 d-flex">
        <div class="select">
          <label class="input-label">Base Imputer</label>
          <v-select
            rounded
            dense
            hide-details
            v-model="imputer"
            item-text="name"
            item-value="id"
            :items="imputers"
            @change="getMLestimate"
            outlined
          ></v-select>
        </div>
      </v-col>
      <v-col cols="12">
        <p>
          The base imputer is a standard model that will be used to interpolate missing values in the most complete prediction features
        </p>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12 d-flex">
        <div class="select">
          <label class="input-label">Predictor Selection Method</label>
          <v-select
            rounded
            dense
            hide-details
            v-model="predictor"
            :items="predictors"

            @change="getMLestimate"
            item-text="name"
            item-value="id"
            outlined
          ></v-select>
        </div>
      </v-col>
      <v-col cols="12">
        <p>
          The manual option allows for the manual selection of predictors. Automatic via feature selection option will select the most important predictors using recusive feature elimination. While Automatic via PCA will perform princial component analysis and use the new dimensions as predictors
        </p>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12 d-flex">
        <div class="select" v-if="predictor === 'MANUAL'">
          <label class="input-label">Select predictors</label>
          <v-autocomplete
            rounded
            dense
            v-model="inPredicor"
            multiple
            item-text="indicator"
            item-value="indicatorCode"
            :items="allIndicators"
            @change="getMLestimate"
            hide-details
            outlined
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                {{item.indicator}} <template v-if="item.dim !=='none'">{{item.dim}}</template>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </div>
        <div class="select" v-else>
          <label class="input-label">Select predictors</label>
          <v-select
            rounded
            dense
            v-model="nPredicor"
            :items="nPredicors"
            @change="getMLestimate"
            hide-details
            outlined
          ></v-select>
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="12 d-flex">
        <div class="select">
          <label class="input-label">Number of Estimators in Ensemble models</label>
          <v-select
            rounded
            dense
            hide-details
            v-model="estimator"
            @change="getMLestimate"
            :items="estimators"
            outlined
          ></v-select>
        </div>
      </v-col>
      <v-col cols="12">
        <p>
          The number of base estimators in the ensemble models (the number of trees in the model)
        </p>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="6">
        <div class="select">
          <label class="input-label">Ensemble models</label>
          <v-select
            rounded
            dense
            hide-details
            v-model="emodel"
            item-text="name"
            item-value="id"
            @change="getMLestimate"
            :items="emodels"
            outlined
          ></v-select>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="select">
          <label class="input-label">Prediction Interval Type</label>
          <v-select
            rounded
            dense
            hide-details
            v-model="pinterval"
            :items="pintervals"
            @change="getMLestimate"
            item-text="name"
            item-value="id"
            outlined
          ></v-select>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p class="mb-4" v-if="estimate">
          Estimated time of training {{estimate}} seconds
        </p>
        <v-btn
          color="primary"
          @click="getMLData"
          dense
          :loading="loading"
          :disabled="loading"
          rounded
        >Train</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="error">
      <v-col cols="10">
        <v-chip
          class="mr-2"
          color="red"
        >
          {{error}}
        </v-chip>
      </v-col>
    </v-row>
    <v-row v-if="rmse">
      <v-col cols="10">
        <p>Normalized root mean square is
          <v-chip
            class="mr-2"
            :color="chipColor"
          >
            {{rmse}}
          </v-chip>
      </p>
      </v-col>
    </v-row>
    <v-row  v-if="rmse">
      <v-col cols="12">
        <h2 class="block-subheader">Prediction Strength</h2>
        <p>The importance of each predictors is measure through gini importance. Gini importance is defined as the total decrease in node impurity (weighted by the probability of reaching that node (which is approximated by the proportion of samples reaching that node)) averaged over all trees of the ensemble. The higher the value the better</p>
      </v-col>
      <v-col cols="8">
        <indicators-bar-chart class="bar-chart-ml-self" chartId="bar-self" :data="barsData"/>
      </v-col>
      <v-col cols="4">
        <indicators-pie-chart chartId="pie-self" :data="pieData"/>
      </v-col>
    </v-row>
    <v-row v-if="rmse">
      <v-col cols="12">
        <indicators-heat-map-chart  chartId="hear-self" :data="mlData.correlation"/>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import { mapState } from 'vuex';
import service from '@/services'
import plotly from 'plotly.js-dist/plotly'
import IndicatorsPieChart from './IndicatorsPieChart';
import IndicatorsBarChart from './IndicatorsBarChart';
import IndicatorsHeatMapChart from './IndicatorsHeatMapChart';
import store from '@/store'

export default {
  name: 'IndicatorsML',
  data: function () {
    return {
      modelType:'Two Level Imputation',
      modelTypes:['Two Level Imputation'],
      imputer: 'KNNImputer',
      imputers: [
        {name: 'K Nearest Neighbour Imputer', id:'KNNImputer'},
        {name: 'Iterative Imputer', id:'IterativeImputer'},
        {name: 'Simple Imputer', id:'SimpleImputer'}
      ],
      predictor: 'AFS',
      predictors: [
        { id:'AFS', name: 'Automatic via feature selection'},
        { id: 'PCA', name: 'Automatic via PCA'},
        { id:'MANUAL', name: 'Manual'}
      ],
      inPredicor: [],
      nPredicor:10,
      nPredicors:[5,10,20],
      estimator: 100,
      estimators: [10, 100, 500, 1000],
      emodel:'rfr',
      emodels:[
        { name: 'Random Forest Regressor', id:'rfr'},
        { name: 'Gradient Boost Regressor', id:'gbr'},
        { name: 'Extra Trees Regressor', id:'etr'},
        { name: 'Best Model', id:'all'}
      ],
      pinterval:'quantile',
      pintervals:[{
        name: 'Residual Bootstrap',
        id:'bootstrap'
      },{
        name:'Quantile',
        id:'quantile'
      }],
      loading:false,
      error: null,
      estimate: null
    }
  },
  props:['indicatorCode', 'year'],
  components:{
    IndicatorsPieChart,
    IndicatorsBarChart,
    IndicatorsHeatMapChart
  },
  computed: {
    ...mapState({
      profileData: state => state.indicators.profileData,
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      data: state => state.indicators.activeIndicatorData,
      MLTargetSize: state => state.indicators.MLTargetSize,
      MLPredictorSize: state => state.indicators.MLPredictorSize,
      mlData: state => state.ml.mlData,
      mlModel: state => state.ml.mlModel
    }),
    activeIndicatorsMeta() {
      return this.indicatorsMeta[this.indicatorCode] || this.indicatorsMeta['hdr-137506']
    },
    chipColor() {
      if(this.rmse > 0.7) return 'red'
      if(this.rmse > 0.3) return 'yellow'
      return 'green'
    },
    barsData() {
      if(this.mlData) {
        return this.mlData.model_feature_names.reduce((reducer, value, index) => {
          reducer[value] = this.mlData.model_feature_importance[index];
          return reducer
        }, {})
      }
      return null;
    },
    pieData() {
      if(this.mlData) {
        return this.mlData.feature_importance_pie.category.reduce((reducer, value, index) => {
          reducer[value] = this.mlData.feature_importance_pie.value[index];
          return reducer
        }, {})
      }
      return null;
    },
    rmse() {
      if(this.mlData) {
        return Math.ceil(this.mlData.rmse_deviation,2);
      }
      return null
    },
    allIndicators() {
      let indicatorsArray = [];
      for(let indicator in this.indicatorsMeta) {
        if(this.indicatorsMeta[indicator].dataset !== 'key' &&
          this.indicatorsMeta[indicator].yearValueCounts[this.year] >= this.MLPredictorSize
        ) {
          indicatorsArray.push(this.indicatorsMeta[indicator])
        }
      }
      return indicatorsArray;
    },
  },
  methods: {
    async getMLestimate() {
      let req = {
        target:this.indicatorCode,
        interval: this.pinterval,
        target_year: this.year,
        interpolator: this.imputer,
        scheme: this.predictor,
        estimators: this.estimator,
        model: this.emodel,
        dataset: this.indicatorsMeta[this.indicatorCode].dataset
      };
      if(this.predictor === 'MANUAL') {
        req.manual_predictors = this.inPredicor
      } else {
        req.number_predictor = this.nPredicor
      }
      let estimate = await service.loadMLestimate(req);
      this.estimate = `${Math.floor(estimate/60)}:${Math.floor(estimate%60)}`
    },
    async getMLData() {
      let req = {
        target:this.indicatorCode,
        interval: this.pinterval,
        target_year: this.year,
        interpolator: this.imputer,
        scheme: this.predictor,
        estimators: this.estimator,
        model: this.emodel,
        dataset: this.indicatorsMeta[this.indicatorCode].dataset
      };
      if(this.predictor === 'MANUAL') {
        req.manual_predictors = this.inPredicor
      } else {
        req.number_predictor = this.nPredicor
      }
      this.loading = true;
      this.error = false
      try {
        await store.dispatch('ml/loadModel', req);
      } catch (e) {
        if(e.message !== 'user cancel') {
          this.error = 'Computation failed'
        }
        return this.loading = false;
      }
      this.loading = false;
    },
    // drawData(){
    //   if(this.mlData === null) {
    //     return
    //   }
    //   this.correlation(this.mlData.correlation)
    //   // this.pie(this.mlData.feature_importance_pie)
    //   // this.drawImportanceimportance(this.mlData.model_feature_names, this.mlData.model_feature_importance)
    // },
    correlation(corrData){
      var trace = {
        z: corrData.data,
        x: corrData.index.map(code => {
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
        y: corrData.columns.map(code => {
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
        type: 'heatmap'
      }
      var layout = {
        margin: {l: 200, b:100, t:0},
        height:corrData.index.length * 40,
        plot_bgcolor:"rgba(0,0,0,0)",
        paper_bgcolor:"rgba(0,0,0,0)",
        width:document.getElementById('corr').offsetWidth,
        xaxis:{
          tickfont:{size:10}
        },
        yaxis:{
          tickfont:{size:10}
        }
      };
      plotly.newPlot('corr', [trace],layout)
    },
    emitYearChange(year) {
      this.$emit('yearChange', year)
    },
    resetData() {
      store.commit('ml/setMLData', null);
    }
  },
  watch:{
    async year() {
      this.resetData();
      await this.getMLestimate();
    },
    mlData() {
      if(this.mlData) {
        store.dispatch('ml/clearModel');
      }
    }
  },
  mounted() {
    this.getMLestimate()
    if(this.mlData && this.mlModel && this.mlModel.target === this.indicatorCode && this.mlModel.target_year === this.year) {
      this.pinterval = this.mlModel.interval
      this.imputer = this.mlModel.interpolator
      this.predictor = this.mlModel.scheme
      this.estimator = this.mlModel.estimators
      this.emodel = this.mlModel.model
      if(this.predictor === 'MANUAL') {
        this.inPredicor = this.mlModel.manual_predictors
      } else {
        this.nPredicor = this.mlModel.number_predictor
      }
      store.dispatch('ml/clearModel');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.bar-chart-ml-self {
  height: 400px;
}
/* style.css */
</style>
