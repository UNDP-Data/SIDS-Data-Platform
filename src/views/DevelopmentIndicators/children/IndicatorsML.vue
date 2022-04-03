<template>
  <div class="pl-5 ml-container">
    <v-row class="justify-center">
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
            outlined
          ></v-select>
        </div>
      </v-col>
      <v-col cols="6">
        <div class="select">
          <label class="input-label">Year</label>
          <v-select
            rounded
            dense
            hide-details
            item-value="id"
            item-text="name"
            :value="year"
            @change="emitYearChange"
            :items="years"
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
            hide-details
            outlined
          ></v-autocomplete>
        </div>
        <div class="select" v-else>
          <label class="input-label">Select predictors</label>
          <v-select
            rounded
            dense
            v-model="nPredicor"
            :items="nPredicors"
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
            item-text="name"
            item-value="id"
            outlined
          ></v-select>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="primary"
          @click="getMLData"
          dense
          rounded
        >Train</v-btn>
        <p></p>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="10">
        <div id="pred-bar">

        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="10">
        <div id="imp-bar">

        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>

import { mapState } from 'vuex';
import service from '@/services'
import poltly from 'plotly.js-dist/plotly'

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
      }]
    }
  },
  props:['indicatorCode', 'year'],
  computed: {
    ...mapState({
      profileData: state => state.indicators.profileData,
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      data: state => state.indicators.activeIndicatorData
    }),
    activeIndicatorsMeta() {
      return this.indicatorsMeta[this.indicatorCode] || this.indicatorsMeta['hdr-137506']
    },
    years(){
      if(this.data && this.data.data) {
        return Object.keys(this.data.data).filter(year => year !== 'recentYear').map(year => {
          return {
            name: year === 'recentValue' ? 'Recent value' : year,
            id: year
          }
        }).reverse()
      } else {
        return []
      }
    },
    allIndicators() {
      let indicatorsArray = [];
      for(let indicator in this.indicatorsMeta) {
        if(this.indicatorsMeta[indicator].dataset !== 'key') {
          indicatorsArray.push(this.indicatorsMeta[indicator])
        }
      }
      return indicatorsArray;
    },
  },
  methods: {
    async getMLData() {
      let req = {
        target:this.indicatorCode,
        interval: this.pinterval,
        target_year: this.year,
        interpolator: this.imputer,
        scheme: this.predictor,
        estimators: this.estimator,
        model: this.emodel
      };
      if(this.predictor === 'MANUAL') {
        req.manual_predictors = this.inPredicor
      } else {
        req.number_predictor = this.nPredicor
      }
      let res = await service.loadML(req)
      // res = {
        // "rmse_deviation": 0.41889601752837874,
        // "rmse": 32.216311478716804,
        // "model_feature_importance": [
        //   1,
        //   0.5
        // ],
        // "model_feature_names": [
        //   "wdi-AG.LND.AGRI.K2",
        //   "wdi-AG.LND.AGRI.K4"
        // ],
        // "prediction": {
        //   "country": {
        //     "0": "Anguilla",
        //     "1": "American Samoa",
        //     "2": "Cook Islands",
        //     "3": "Cabo Verde",
        //     "4": "Curaçao",
        //     "5": "Guinea-Bissau",
        //     "6": "Kiribati",
        //     "7": "Montserrat",
        //     "8": "Niue",
        //     "9": "Tuvalu"
        //   },
        //   "prediction": {
        //     "0": 60.251274591521906,
        //     "1": 96.91603165525441,
        //     "2": 60.251274591521906,
        //     "3": 71.06048781159562,
        //     "4": 70.95096646904064,
        //     "5": 87.29235701815934,
        //     "6": 91.34565122601724,
        //     "7": 60.251274591521906,
        //     "8": 60.251274591521906,
        //     "9": 98.8995139415924
        //   },
        //   "lower": {
        //     "0": 44.256487591885254,
        //     "1": 94.0839119085,
        //     "2": 44.256487591885254,
        //     "3": 7.53202343,
        //     "4": 37.10776216492857,
        //     "5": 74.93097030383393,
        //     "6": 83.70707951896154,
        //     "7": 44.256487591885254,
        //     "8": 44.256487591885254,
        //     "9": 96.7769181081923
        //   },
        //   "upper": {
        //     "0": 76.83304496869289,
        //     "1": 100,
        //     "2": 76.83304496869289,
        //     "3": 99.48411083024999,
        //     "4": 86.04106028134687,
        //     "5": 99.4663613455,
        //     "6": 99.04810676564286,
        //     "7": 76.83304496869289,
        //     "8": 76.83304496869289,
        //     "9": 100
        //   }
        // }
      // }
      this.drawChart(Object.values(res.prediction.prediction), Object.values(res.prediction.country), Object.values(res.prediction.upper), Object.values(res.prediction.lower))
      this.drawImportanceimportance(res.model_feature_names.map(code => this.indicatorsMeta[code].indicator), res.model_feature_importance)
    },
    drawChart(prediction, country, upper, lower) {
      var traces = [{
        x: prediction,
        y: country,
        error_x: {
          type: "data",
          symmetric: false,
          array: upper,
          arrayminus:lower
        },
        type: "bar",
        orientation: 'h'
      }];
      var layout = {
        autosize: true
      };
      poltly.newPlot('pred-bar', traces,layout);
    },
    drawImportanceimportance(feature_names, importance_values){
      let traces = [{
        x: feature_names,
        y: importance_values,
        type: "bar",
        orientation: 'v'
      }];
      var layout = {
        autosize: true,
      };
      poltly.newPlot('imp-bar', traces,layout);
    },
    emitYearChange(year) {
      this.$emit('yearChange', year)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* style.css */
.allSids {
  fill: #fee391;
  stroke: #333;
  stroke-width: 1px;
  filter: drop-shadow(1px 1px 0px purple);
}

.countryHover {
  fill: #91eefe;
  filter: drop-shadow(1px 1px 0px purple);
  cursor: pointer;
}

.shadow {
  filter: drop-shadow(1px 1px 0px black);
}

.countryHighlight {
  fill: #fec44f;
}

.region.NI {
  fill: #aaa;
  stroke: #aaa;
}

/* Colors taken from colorbrewer2.org - blue */
.b0-9 {
  fill: #f7fbff;
}

.b1-9 {
  fill: #deebf7;
}

.b2-9 {
  fill: #c6dbef;
}

.b3-9 {
  fill: #9ecae1;
}

.b4-9 {
  fill: #6baed6;
}

.b5-9 {
  fill: #4292c6;
}

.b6-9 {
  fill: #2171b5;
}

.b7-9 {
  fill: #08519c;
}

.b8-9 {
  fill: #08306b;
}

/* Colors taken from colorbrewer2.org - red */
.r0-9 {
  fill: #fff5f0;
}

.r1-9 {
  fill: #fee0d2;
}

.r2-9 {
  fill: #fcbba1;
}

.r3-9 {
  fill: #fc9272;
}

.r4-9 {
  fill: #fb6a4a;
}

.r5-9 {
  fill: #ef3b2c;
}

.r6-9 {
  fill: #cb181d;
}

.r7-9 {
  fill: #a50f15;
}

.r8-9 {
  fill: #67000d;
}

/* Colors taken from colorbrewer2.org - green */
.g0-9 {
  fill: #f7fcf5;
}

.g1-9 {
  fill: #e5f5e0;
}

.g2-9 {
  fill: #c7e9c0;
}

.g3-9 {
  fill: #a1d99b;
}

.g4-9 {
  fill: #74c476;
}

.g5-9 {
  fill: #41ab5d;
}

.g6-9 {
  fill: #238b45;
}

.g7-9 {
  fill: #006d2c;
}

.g8-9 {
  fill: #00441b;
}

.choroText {
  text-anchor: middle;
  color: black;
}
.spiderbox {
  position: relative;
  z-index: 5;
}
#choro_legend_container {
  margin: 0;
  padding: 0;
}

#choro_map_container svg {
  margin-top: 5px;
  margin-bottom: -5px;
  padding-bottom: 0px;
  padding-top: 10px;
  overflow: visible;
}

.indicatorFilter {
  margin: 0;
  text-align: center;
  padding: 0;
  margin-bottom: 5px;
}

#indicatorSubCategorySelect, #indicatorSubCategorySelect2 {
  font-size: 14px;
  height: 30px;
  width: 100%;
}

#indicatorCategorySelect, #indicatorCategorySelect2 {
  font-size: 16px;
  height: 40px;
  margin-top: 28px;
  width: 100%;
}

#indicatorSelectBox2 {
  display: none;
}

.listbox {
  background: white;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100%;
}

.listbox ul {
  list-style: none;
  margin: 0;
  padding: 6px;
}

.listbox li {
  padding: 4px;
  cursor: pointer;
}

.listbox li:hover {
  background-color: #bbb;
}

.listbox li.indiActive {
  background: #4db052;
  font-size: 14px;
  font-weight: bold;
}

.listbox li.indiActive2 {
  background: #b14cb6;
  font-size: 14px;
  font-weight: bold;
}

.listbox li {
  -webkit-transition: background-color 200ms linear;
  -moz-transition: background-color 200ms linear;
  -o-transition: background-color 200ms linear;
  -ms-transition: background-color 200ms linear;
  transition: background-color 200ms linear;
}

.listbox::-webkit-scrollbar {
  width: 8px;
}

.listbox::-webkit-scrollbar-track {
  background: white;
}

#indicatorSelect {
  width: 100%;
  height: 300px;
  margin: 0;
  padding: 0;
  font-size: 12px;
}

#indicatorSelect2 {
  width: 100%;
  height: 100px;
  margin: 0;
  padding: 0;
  font-size: 12px;
}

#indicatorSelectorColumn {
  margin: 0;
  padding: 0;
}

.c008080 {
  fill: #008080;
}

.cF0A500 {
  fill: #F0A500;
}

.c97002B {
  fill: #97002B;
}

.nodata {
  fill: #F4F5F8;
}

#choroInfoBox p {
  font-size: 12px;
  text-align: left;
}

#choroIndiSource {
  padding: 0;
}

#choroInfoBox h4 {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

#choroInfoBox {
  height: 212px;
  margin: 0;
  padding: 0;
  padding: 12px;
  margin-top: 12px;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: #e9e6e6;
  border: 0.5px solid gray;
}

#choroInfoBox::-webkit-scrollbar-track {
  background: #e9e6e6;
}

#choroInfoBox::-webkit-scrollbar {
  width: 8px;
}

.textNum, .textNumEnd {
  font-family: sans-serif;
  fill: black;
  font-size: 12px;
}

.choroLegendTitle {
  font-family: sans-serif;
  fill: black;
  font-size: 14px;
  font-weight: bold;
}

#indicatorExportDiv {
  float: right;
  margin-top: -50px;
}

#tooltipIndicatorContent {
  max-width: 350px;
}

#choro_legend_container {
  height: 45px;
  overflow: visible;
}

#choro-legend_region {
  height: 42px;
  margin-left: 120px;
  margin-top: 5px;
  padding: 0;
}

#countryDataPanel h2 {
  padding-top: 40px;
}

.timeSeriesTooltip {
  position: absolute;
  background-color: #f5f5f5;
  border: 1px solid lightgrey;
  border-radius: 4px;
  padding: 5px;
  font-size: 12px;
}
#timeSeriesContainer {
  width: 900px;
  display:none;
}

@media all and (max-width:960px) {
  #timeSeriesContainer {
    width: 100%;
    display:none;
  }
  .choro {
    min-height: 1400px;
  }
}

.choro-title{
  position: relative;
  z-index: 2;
}
/*# sourceMappingURL=vizEngine.css.map */

</style>
