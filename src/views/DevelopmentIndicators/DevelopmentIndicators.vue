<template>
  <div class="mt-md-5 print-root">
    <div class="print-page-wrap">
      <printout-header>
        <template slot="text">
          <b>{{$t('indicators.export.report')}}</b> <br/> {{activeIndicatorsMeta.indicator}}
        </template>
      </printout-header>
      <p class="d-none d-print-block">
        <b>{{$t('gis.controller.datasets')}}:</b>{{datasetMeta[activeIndicatorsMeta.dataset]['Dataset Name']}}
      </p>
      <p class="d-none d-print-block">
        <b>{{$t('spiders.definition')}}:</b>{{activeIndicatorsMeta.def}}
      </p>
      <p class="d-none d-print-block">
        <b>{{$t('spiders.source')}}:</b>{{activeIndicatorsMeta.sourcce}}{{activeIndicatorsMeta.link}}
      </p>
      <v-row  v-if="page!=='mvi'" dense class="printable-hidden">
        <v-col cols='12'>
          <indicators-choro-chart class="choro-printabe" v-if='!noData' :chartId="'choro-print'" :region="region" :mviCodes="mviCodes" :year="year" :sorting="sortingName" :page="page" :chartType="'bars'" :indicatorCode="indicator"/>
          <h4 class="text-center" v-else>{{$t('root.noData')}}</h4>
          <p v-if="year === 'recentValue'" class="text-center">
            {{$t('indicators.export.valuesLast')}}
          </p>
          <p class="text-center">
            <span class="choro-print-legend choro-print-legend_caribean">{{$t('countryNames.caribbean')}}</span>
            <span class="choro-print-legend pr-8 pl-8 choro-print-legend_ais">{{$t('countryNames.ais')}}</span>
            <span class="choro-print-legend choro-print-legend_pacific">{{$t('countryNames.pacific')}}</span>
          </p>
          </v-col>
      </v-row>
    </div>
      <v-row dense>
        <v-col  class="d-none d-print-none d-lg-block" v-if="page==='devIdictors'" cols='3'>
          <indicators-nav :chartType="chartType" :activeIndicatorCode="indicator" @indicatorChange="indicatorUpdate" :year="year" @yearChange="yearUpdate"/>
        </v-col>
        <v-col  class="d-none d-print-none d-lg-block pt-14" v-else cols='3'>
          <mvi-indicators-nav :mviCodes="mviCodes" @MviIndicatorsChange="MVIindicatorUpdate"/>
        </v-col>
        <v-dialog
          v-model="dialog"
          width="400"
          :fullscreen = "isMobile"
          content-class="dialog-box"
          transition="dialog-right-transition"
        >
          <indicators-nav :chartType="chartType" @close="dialog = !dialog" v-if="page==='devIdictors'" :activeIndicatorCode="indicator" :year="year" @indicatorChange="indicatorUpdate" @yearChange="yearUpdate"/>
          <mvi-indicators-nav v-else @close="dialog = !dialog" :mviCodes="mviCodes" @MviIndicatorsChange="MVIindicatorUpdate"/>
        </v-dialog>

        <v-col md='12' lg='9'>
          <v-row class="d-none d-md-flex d-print-none nav-filter-row" >
            <v-col cols='8' sm="10" lg="8" offset="2" class="offset-sm-1 offset-lg-2">
              <h2 v-if="page!=='mvi'" class="page-header">
                {{$t('indicators.headerIndicators')}}
              </h2>
              <h2 v-else class="page-header text-left">
                {{$t('indicators.headerMVI')}}
              </h2>
            </v-col>
            <v-col cols='2' sm="1" lg="2">
              <div class="float-right mt-0 mb-2">
                <info-button :contentName="page!=='mvi' ? 'aboutThis-indicators' : 'aboutThis-mvi'"/>
              </div>
              <indicators-export
                :data="activeIndicatorData"
                :meta="activeIndicatorsMeta"
                :indiCode="indicator"
              />
            </v-col>
          </v-row>
          <indicators-autocomplete
            v-if="page !== 'mvi'"
            class="d-flex d-lg-none d-print-none"
            @toggleDialog="dialog = !dialog"
            @indicatorChange="indicatorUpdate"
            :activeIndicatorCode="indicator"/>
          <indicators-mobile-nav
            v-if="page !== 'mvi'"
            class="d-block mb-md-4 d-print-none d-lg-none"
            @chartTypeChange="transitionTo"
            @yearChange="yearUpdate"
            @sortingChange="sortingUpdate"
            @indicatorChange="indicatorUpdate"
            @regionChange="regionUpdate"
            :activeIndicatorCode="indicator"
            :year="year"
            :sortingType="sortingName"
            :chartType="chartType"
            :chartTypes="tabs"
            :region="region"
            :regions="regions"
          />
          <mvi-mobile-nav
            class="mt-5 d-flex d-print-none d-lg-none"
            v-if="page === 'mvi'"
            :sortingType="sortingName"
            :chartType="chartType"
            :chartTypes="tabs"
            :region="region"
            :regions="regions"
            @chartTypeChange="transitionTo"
            @sortingChange="sortingUpdate"
            @regionChange="regionUpdate"
            @toggleDialog="dialog = !dialog"
            :mviCodes="mviCodes"
            @MviIndicatorsChange="MVIindicatorUpdate"
          />
          <v-row dense class="d-none d-print-none d-lg-flex nav-tabs-row justify-center">
            <v-col class="d-flex">
              <div class="ma-auto">
                <v-tabs
                  v-if="!isMobile && (indicator!=='region' || page==='mvi')"
                  :value="activeTab"
                  :grow="isMobile"
                  :class="{
                    'indicators-tabs' : page!=='mvi',
                    'mvi-tabs' : page==='mvi'
                  }"
                  class="tabs tabs-small"
                >
                  <v-tab v-for="(tab, index) in tabs" :value="index" :key="index" @change="transitionTo(tab.chartType)">{{$t('indicators.tabs.'+ tab.chartType)}}</v-tab>
                </v-tabs>
              </div>
            </v-col>
          </v-row>
          <v-row class="nav-filter-row d-print-none d-none d-lg-flex" dense justify="end">
            <div v-if="(chartType === 'bars' || chartType === 'spider')" class="sorting-row">
                <v-tabs
                  :grow="false"
                  v-model="sorting"
                  class="tabs tabs-small tabs-slider sorting sorting-tabs"
                >
                  <v-tab key="rank" value="rank">{{$t('indicators.filters.rank')}}</v-tab>
                  <v-tab key="region" value="region">{{$t('indicators.filters.region')}}</v-tab>
                </v-tabs>
            </div>
            <div v-if="chartType === 'series'" class="sorting-row">
              <div class="select sorting sorting-select">
                <v-select
                  rounded
                  dense
                  hide-details
                  v-model="region"
                  :items="regionsDesctop"
                  outlined
                >
                  <template slot="selection" slot-scope="data">
                    <span class="select-text-element">{{$t('regions.' + data.item)}}</span>
                  </template>
                  <template  slot="item" slot-scope="data">
                    {{$t('regions.' + data.item)}}
                  </template>
                </v-select>
              </div>
            </div>
          </v-row>
          <v-row dense :class="{'d-print-none' : !mlMode}">
            <v-col cols='12'>
              <indicators-choro-chart class="d-print-none" v-if='!noData' :chartId="'choro'" :region="region" :mviCodes="mviCodes" :year="year" :sorting="sortingName" :page="page" :chartType="chartType" :indicatorCode="indicator"/>
              <h4 class="text-center" v-else>No data for selected indicator</h4>
              <indicators-m-l v-if="mlMode && mlAvaliable && page!=='mvi'" :indicator="indicator" @close="mlMode=false" :year="year"/>
              <v-btn v-else-if="mlAvaliable && page!=='mvi'" rounded small class="float-right d-print-none" color="primary" @click="toggleMlMode()">AI Mode</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    <div v-if="page!=='mvi' && !mlMode" class="printable-hidden print-page-wrap">
      <v-row dense>
        <v-col cols='12'>
          <h4 class="text-center">Regional averages</h4>
          <indicators-choro-chart class="choro-printabe-series choro-printabe-region-avgs" v-if='!noData' :chartId="'choro-print-reg-avg'" region="regionalAvg" :mviCodes="mviCodes" :year="year" :sorting="sortingName" :page="page" :chartType="'series'" :width="800" :indicatorCode="indicator"/>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols='12'>
          <h4 class="text-center">Caribbean</h4>
          <indicators-choro-chart class="choro-printabe-series choro-printabe-region-avgs" v-if='!noData' :chartId="'choro-print-reg-car'" region="caribbean" :mviCodes="mviCodes" :year="year" :sorting="sortingName" :page="page" :chartType="'series'" :width="800" :indicatorCode="indicator"/>
        </v-col>
      </v-row>
    </div>
    <div v-if="page!=='mvi' && !mlMode" class="printable-hidden print-page-wrap print-page-wrap-last">
      <v-row dense>
        <v-col cols='12'>
          <h4 class="text-center">AIS</h4>
          <indicators-choro-chart class="choro-printabe-series choro-printabe-region-avgs" v-if='!noData' :chartId="'choro-print-reg-ais'" region="ais" :mviCodes="mviCodes" :year="year" :sorting="sortingName" :page="page" :chartType="'series'" :width="800" :indicatorCode="indicator"/>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols='12'>
          <h4 class="text-center">Pacific</h4>
          <indicators-choro-chart class="choro-printabe-series choro-printabe-region-avgs" v-if='!noData' :chartId="'choro-print-reg-pac'" region="pacific" :mviCodes="mviCodes" :year="year" :sorting="sortingName" :page="page" :chartType="'series'" :width="800" :indicatorCode="indicator"/>
        </v-col>
      </v-row>
      <p class="print-page-wrap_footer">
        Live version and links to original data sources available at
        <a class="d-block mt-0" :href="pageLink">{{pageLink}}</a>
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import IndicatorsNav from './children/IndicatorsNav.vue'
import IndicatorsMobileNav from './children/IndicatorsMobileNav.vue'
import MviMobileNav from './children/MviMobileNav.vue'
import IndicatorsAutocomplete from './children/IndicatorsAutocomplete.vue'
import PrintoutHeader from '@/components/PrintoutHeader.vue'
import IndicatorsExport from './children/IndicatorsExport.vue'
import MVIIndicatorsNav from './children/MVIIndicatorsNav.vue'
import indicatorsMLmodels from './children/indicatorsMLmodels.vue'
import IndicatorsChoroChart from './children/IndicatorsChoroChart.vue'
import InfoButton from '@/components/InfoButton.vue'
import sizeMixin from '@/mixins/size.mixin'
import { mapState } from 'vuex'
import store from '@/store'
import { datasetMeta } from '@/assets/datasets/datasetMeta';

export default {
  name: 'DevelopmentIndicators',
  props:['chartType', 'indicator', 'page', 'year'],
  mixins:[sizeMixin],
  data: function() {
    return {
      dialog:false,
      datasetMeta: datasetMeta,
      resizeTimeout:null,
      mlMode:false,
      mviCodes:[
        "mvi-ldc-VIC-Index"
        ,"mvi-ldc-AFF-Index"
        ,"mvi-ldc-REM-Index"
        ,"mvi-ldc-LECZ-Index"
        ,'mvi-ldc-DRY-Index'
        ,"mvi-ldc-XCON-Index"
        ,"mvi-ldc-XIN-Index"
        ,"mvi-ldc-AIN-Index"
        ,"mvi-wdi2-ST.INT.RCPT.XP.ZS"
        ,"mvi-wdi-BX.TRF.PWKR.DT.GD.ZS"
        ,"mvi-wdi-BX.KLT.DINV.WD.GD.ZS"
      ],
      region: 'allSids',
      regions:[
        'allSids',
        'ais',
        'caribbean',
        'pacific'
      ],
      regionsDesctop:[
        'allSids',
        'ais',
        'caribbean',
        'pacific',
        'regionalAvg'
      ],
      sorting:0,
      menuBar:{
        devIdictors: [{
          name:'Choropleth',
          chartType:'choro'
        },{
          name:'Bar chart',
          chartType:'bars',
          mobile: true
        },{
          name:'Global view',
          chartType:'global'
        },
        {
          name:'Time series',
          chartType:'series',
          mobile: true
        }
      ],
        mvi: [{
          name:'Spider',
          chartType:'spider'
        },{
          name:'Bar chart',
          chartType:'bars',
          mobile: true
        },{
          name:'Global view',
          chartType:'global'
        },
        {
          name:'Time series',
          chartType:'series',
          mobile: true
        }
      ]
      }
    }
  },
  components: {
    InfoButton,
    IndicatorsNav,
    PrintoutHeader,
    IndicatorsChoroChart,
    IndicatorsAutocomplete,
    MviIndicatorsNav:MVIIndicatorsNav,
    IndicatorsMobileNav,
    IndicatorsExport,
    MviMobileNav,
    indicatorsML:indicatorsMLmodels
  },
  computed: {
    ...mapState({
      activeIndicatorData: state => state.indicators.activeIndicatorData,
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      MLTargetSize: state => state.indicators.MLTargetSize,
      mlData: state => state.ml.mlData,
      mlModel: state => state.ml.mlModel
    }),
    sortingName() {
      if(this.sorting === 0) {
        return 'rank'
      } else {
        return 'region'
      }
    },
    pageLink() {
      return window.location.toString()
    },
    tabs() {
      if(this.isMobile) {
        return this.menuBar[this.page].filter(bar => bar.mobile)
      }
      return this.menuBar[this.page]
    },
    noData() {
      if(this.page === 'mvi') {
        return false;
      }
      return this.activeIndicatorData.data && !Object.keys(this.activeIndicatorData.data.recentValue).some(value => {
        return this.activeIndicatorData.data.recentValue[value] !== 'No Data'
      })
    },
    activeTab() {
      return this.tabs.findIndex(menuItem => menuItem.chartType === this.chartType)
    },
    activeIndicatorsMeta() {
      return this.indicatorsMeta[this.indicator] || this.indicatorsMeta['hdr-137506']
    },
    mlAvaliable() {
      return this.indicator && this.indicator.match(/.*key|mvi|ndgain|wdi.*/gm);
    }
  },
  methods: {
    transitionTo(chartType) {
      if(this.page === 'mvi'){
        this.$router.push({path:`/vulnerability/${this.indicator}/${chartType}`})
      }
      else {
        this.$router.push({path:`/development-indicators/${this.indicator}/${this.year}/${chartType}`})
      }
    },
    sortingUpdate(sortingType) {
      if(sortingType === 'rank') {
        return this.sorting = 0
      } else {
        return this.sorting = 1
      }
    },
    toggleMlMode() {
      this.mlMode = !this.mlMode
      if(this.mlMode === true) {
        this.transitionTo('bars')
      }
    },
    indicatorUpdate(indicatorCode) {
      this.$router.push({path:`/development-indicators/${indicatorCode}/recentValue/${this.chartType}`})
    },
    yearUpdate(year) {
      this.$router.push({path:`/development-indicators/${this.indicator}/${year}/${this.chartType}`})
    },
    regionUpdate(region) {
      this.region = region
    },
    MVIindicatorUpdate(mviCodes){
      this.mviCodes = mviCodes;
    },
    updateScreenSize() {
      let rootThis = this;
      if(this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(async () => {
        if(rootThis.isMobile && !(rootThis.chartType === 'bars' || rootThis.chartType === 'series')) {
          rootThis.transitionTo('bars')
        }
        if(rootThis.isMobile) {
          rootThis.region = 'allSids'
        }
      }, 100);
    },
  },
  created() {
    if(this.mlData && this.mlModel && this.mlModel.target === this.indicator && this.mlModel.target_year === this.year) {
      this.mlMode = true;
    }
    window.addEventListener("resize", this.updateScreenSize);
  },
  destroyed() {
    window.removeEventListener("resize", this.updateScreenSize);
  },
  watch: {
    page() {
      this.sorting = 0
    },
  },
  async beforeRouteUpdate(to, from, next) {
    try {
      if(to.params.indicator !== from.params.indicator) {
        await store.dispatch('indicators/getIndicatorData', to.params.indicator)
      }
      next()
    } catch (e) {
      next(from)
    }
  },
  async beforeRouteEnter(to, from, next) {
    try {
      if(to.params.indicator !== from.params.indicator) {
        await store.dispatch('indicators/getIndicatorData', to.params.indicator)
      }
      next()
    } catch (e) {
      next(from)
    }
  },
}
</script>
<style media="screen">
  .nav-tabs-row {
    margin-top: -10px !important;
  }
  .mvi-tabs {
    margin-bottom: auto;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }
  .sorting-row{
    position: relative;
    width: 100%;
  }
  .sorting-tabs {
    top: 30px;
  }
  .sorting{
    position: absolute;
    width: auto;
    right: 0px;
  }
  .sorting-select {
    top: 25px;
  }
  .nav-tabs-row {
    min-height: 38px;
  }
  .radarChart .radar {
    margin-left: 125px;
    margin-right: 125px;
  }
  .dialog-box {
    background: #fff;
    padding: 10px;
    border-radius: 5px;
  }
  .filter-button {
    margin-left: auto;
    margin-right: 0;
  }
  .description {
    position: relative;
    z-index: 1;
  }
  .choro-printabe {
    transform: scale(1.5) translate(110px, 170px);
    padding-bottom: 290px;
  }
  .choro-printabe .barAxis {
    transform: translate(90px, 25px)!important;
  }
  .choro-print-legend {
    font-size: 24px;
    font-weight: bold;
  }
  .choro-print-legend_caribean {
    color: rgb(0, 128, 128);
  }
  .choro-print-legend_ais {
    color: rgb(151, 0, 43);
  }
  .choro-print-legend_pacific {
    color: rgb(240, 165, 0);
  }
  @media print {
    .print-root {
      max-height: 4200px;
      overflow: hidden;
    }
  }
</style>
