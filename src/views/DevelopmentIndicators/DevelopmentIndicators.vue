<template>
  <div class="mt-md-5">
  <v-row dense>
    <v-col  class="d-none d-lg-block" v-if="page==='devIdictors'" cols='3'>
      <indicators-nav :chartType="chartType" :activeIndicatorCode="indicator" @indicatorChange="indicatorUpdate" :year="year" @yearChange="yearUpdate"/>
    </v-col>
    <v-col  class="d-none d-lg-block pt-14" v-else cols='3'>
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
      <v-row class="d-none d-md-flex nav-filter-row" >
        <v-col cols='8' sm="10" lg="8" offset="2" class="offset-sm-1 offset-lg-2">
          <h2 v-if="page!=='mvi'" class="page-header">
            Development Indicators
          </h2>
          <h2 v-else class="page-header text-left">
            Multidimensional Vulnerability Index
          </h2>
        </v-col>
        <v-col cols='2' sm="1" lg="2">
          <div class="float-right mt-2 mb-2">
            <info-button :contentName="page!=='mvi' ? 'aboutThis-indicators' : 'aboutThis-mvi'"/>
          </div>
        </v-col>
      </v-row>
      <indicators-autocomplete
        v-if="page !== 'mvi'"
        class="d-flex d-lg-none"
        @toggleDialog="dialog = !dialog"
        @indicatorChange="indicatorUpdate"
        :activeIndicatorCode="indicator"/>
      <indicators-mobile-nav
        v-if="page !== 'mvi'"
        class="d-block mb-md-4 d-lg-none"
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
        class="mt-5 d-flex d-lg-none"
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
      <v-row dense class="d-none d-lg-flex nav-tabs-row justify-center">
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
              <v-tab v-for="(tab, index) in tabs" :disabled="tab.chartType === 'ml' && !mlAvaliable" :value="index" :key="index" @change="transitionTo(tab.chartType)">{{tab.name}}</v-tab>
            </v-tabs>
          </div>
        </v-col>
      </v-row>
      <v-row class="nav-filter-row d-none d-lg-flex" dense justify="end">
        <div v-if="(chartType === 'bars' || chartType === 'spider')" class="sorting-row">
            <v-tabs
              :grow="false"
              v-model="sorting"
              class="tabs tabs-small tabs-slider sorting sorting-tabs"
            >
              <v-tab key="rank" value="rank">Rank</v-tab>
              <v-tab key="region" value="region">Region</v-tab>
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
          ></v-select>
          </div>
        </div>
      </v-row>
      <v-row v-if="chartType !== 'ml'" dense>
        <v-col cols='12'>
          <indicators-choro-chart v-if='!noData' :region="region" :mviCodes="mviCodes" :year="year" :sorting="sortingName" :page="page" :chartType="chartType" :indicatorCode="indicator"/>
          <h4 class="text-center" v-else>No data for selected indicator</h4>
        </v-col>
      </v-row>
      <v-row v-if="chartType === 'ml'" dense>
        <v-col cols='12'>
          <indicators-m-l v-if='!noData' @yearChange="yearUpdate" :year="year" :indicatorCode="indicator"/>
          <h4 class="text-center" v-else>No data for selected indicator</h4>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  </div>
</template>

<script>
// @ is an alias to /src

import IndicatorsNav from './children/IndicatorsNav.vue'
import IndicatorsMobileNav from './children/IndicatorsMobileNav.vue'
import MviMobileNav from './children/MviMobileNav.vue'
import IndicatorsAutocomplete from './children/IndicatorsAutocomplete.vue'
import MVIIndicatorsNav from './children/MVIIndicatorsNav.vue'
import IndicatorsML from './children/IndicatorsML.vue'
import IndicatorsChoroChart from './children/IndicatorsChoroChart.vue'

import InfoButton from '@/components/InfoButton.vue'
import sizeMixin from '@/mixins/size.mixin'
import { mapState } from 'vuex'
import store from '@/store'

export default {
  name: 'DevelopmentIndicators',
  props:['chartType', 'indicator', 'page', 'year'],
  mixins:[sizeMixin],
  data: function() {
    return {
      dialog:false,
      resizeTimeout:null,
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
      region: 'All',
      regions:[
        'All',
        'AIS',
        'Caribbean',
        'Pacific'
      ],
      regionsDesctop:[
        'All',
        'AIS',
        'Caribbean',
        'Pacific',
        'Regional average'
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
        },
        {
          name:'Machine Learning',
          chartType:'ml',
          mobile: false
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
    IndicatorsChoroChart,
    IndicatorsAutocomplete,
    MviIndicatorsNav:MVIIndicatorsNav,
    IndicatorsMobileNav,
    MviMobileNav,
    IndicatorsML
  },
  computed: {
    ...mapState({
      activeIndicatorData: state => state.indicators.activeIndicatorData,
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      MLTargetSize: state => state.indicators.MLTargetSize
    }),
    sortingName() {
      if(this.sorting === 0) {
        return 'rank'
      } else {
        return 'region'
      }
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
      return this.indicatorsMeta[this.indicator]
    },
    mlAvaliable() {
      return Object.values(this.activeIndicatorsMeta.yearValueCounts).some(v=>v >= this.MLTargetSize);
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
          rootThis.region = 'All'
        }
      }, 100);
    }
  },
  created() {
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
      await store.dispatch('indicators/getIndicatorData',to.params.indicator)
      next()
    } catch (e) {
      next(from)
    }
  },
  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch('indicators/getIndicatorData',to.params.indicator)
      next()
    } catch (e) {
      next(from)
    }
  },
}
</script>
<style media="screen">
  .nav-tabs-row {
    margin-top: -10px !important;;
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
</style>
