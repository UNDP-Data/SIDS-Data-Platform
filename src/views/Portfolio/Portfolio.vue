<template>
  <div class="">
    <div class="print-page-wrap">
      <printout-header>
        <template slot="text">
          <b>UNDP Portfolio <br/>
            in Small Island Developing States</b>
        </template>
      </printout-header>
      <portfolio-printout-chips
        :region="getCountryName(region)"
        :projects="portfolioData"
        :year="yearText"
        :goalType="goalsType"
        :goal="goal"
        :fundingCategory="fundingCategory"
        :fundingSource="fundingSource"
      />
      <portfolio-mobile-nav
        class="d-md-none d-print-none"
        :region="region"
        :regions="regionsToSelect"
        :goalType="goalsType"
        :year="year"
        :years="years"
        :goal="goal"
        :fundingCategory="fundingCategory"
        :fundingCategories="fundingCategoriesTypes"
        :fundingSource="fundingSource"
        :fundingSources="portfolioSources"
        @sourceChange="setSource"
        @categoryChange="setCategory"
        @yearChange="setYear"
        @regionChange="updateRegion"
        @goalTypeChange="transitionTo"
        @goalChange="updateGoal"
      />
      <portfolio-mobile-chips
        :region="region"
        :projects="portfolioData"
        :goalType="goalsType"
        :goal="goal"
        class="d-md-none mt-sm-6 d-print-none"
      />

      <v-row dense class="mt-sm-6 d-md-none d-print-none" justify="center">
        <v-col cols="11" sm="5">
          <portfolio-pie-chart
            @changeFilter="changeFilter"
            :data="regionFundingMobile"
            chartName="region"
            postfix="1"
            :colorScheme="regionColors"
          ></portfolio-pie-chart>
        </v-col>
        <v-col cols="11" sm="5">
          <portfolio-pie-chart
            @changeFilter="changeFilter"
            :data="sourcesFundingMobile"
            chartName="sources"
            postfix="1"
            :colorScheme="sourcesColor"
          ></portfolio-pie-chart>
        </v-col>
      </v-row>
      <v-row class="d-none d-md-flex mt-0 d-print-none">
        <v-col cols="12">
          <portfolio-map
            :region="region"
            @updateRegion="updateRegion"
            :projects="portfolioData"

          >
            <template v-slot:header>
              <v-row class="map-header d-none d-lg-flex">
                <v-col class="offset-lg-1 offset-lg-2 offset-md-1 offset-sm-2 offset-2" cols="8" sm="8" md='10' lg='8' xl="10">
                  <h2 class="page-header mt-md-2 mb-2">{{$t('portfolio.header')}}</h2>
                </v-col>
                <v-col class="" cols="2" sm="1" md='1' lg='2' xl="1">
                  <div class="mt-2 float-md-right mb-2">
                    <info-button :contentName="'aboutThis-portfolio'"/>
                  </div>
                  <div class="float-md-right">
                    <portfolio-export
                      :region="region"
                      :year="year"
                      :funding="fundingCategory"
                      :projects="portfolioData"
                      :data="portfolioSources"
                      :categories="fundingCategoriesTypes"
                    />
                  </div>
                </v-col>
              </v-row>
            </template>
          </portfolio-map>
        </v-col>
      </v-row>
      <v-row class="bars-row d-print-block d-none d-lg-block mb-3 mt-negative">
        <portfolio-bars :year='year' :fundingCategory='fundingCategory' :fundingSource='fundingSource' :region='region' :goalsType='goalsType'></portfolio-bars>
      </v-row>
      <p class="d-none d-print-block chart-caption chart-caption-goals text-center">
        Visualization of the portfolio by budget allocation across {{pages[activePage].name}}
      </p>

      <v-row class="d-none d-print-block">
        <v-col cols="12" v-html="$t(`tooltips.${pages[activePage].contentName}.content`)">
        </v-col>
      </v-row>
      <v-row class="d-none d-print-block d-md-flex mt-md-0 mt-lg-2 flex-lg-nowrap" justify="center">
        <v-col class="d-none d-print-none d-lg-block margin-wrap-right"></v-col>
        <v-col class="d-none d-print-block d-md-block pt-md-0 pb-md-0 pt-lg-4 pb-lg-4 tabs-column">
          <v-row class="d-none d-print-none d-lg-flex" justify="center">
            <v-col cols="12">
                <v-tabs
                  class="tabs portfolio-slider"
                  v-model="activePage"
                >
                  <v-tab v-for="page in pages" @change="transitionTo(page.value)" :key="page.value">
                    <info-hover-tooltip :contentName="page.contentName">
                      <template v-slot:button>{{$t(`root.goals.${page.value}`)}}</template>
                    </info-hover-tooltip>
                  </v-tab>
                </v-tabs>
            </v-col>
          </v-row>
          <v-row class="d-none d-print-flex d-md-flex mt-md-0 mt-lg-2" justify="center">
            <v-col cols="6" md="5" lg="6">
              <portfolio-pie-chart
                @changeFilter="changeFilter"
                :data="regionFunding"
                chartName="region"
                :colorScheme="regionColors"
              ></portfolio-pie-chart>
              <p class="d-none d-print-block chart-caption text-center">
                Visualization of budget allocation across regions
              </p>
            </v-col>
            <v-col cols="6" md="5" lg="6">
              <portfolio-pie-chart
                @changeFilter="changeFilter"
                :data="sourcesFunding"
                chartName="sources"
                :colorScheme="sourcesColor"
              ></portfolio-pie-chart>
              <p class="d-none d-print-block chart-caption text-center">
                Visualization of finance sources
              </p>
            </v-col>
          </v-row>
          <p class="d-none d-print-block mt-4">
            These two charts visualise investment across SIDS. Second pie chart can be used to identify organisations that invest in similar projects or are focused on the same resions, first one shows invesment across regions.
          </p>
        </v-col>
        <v-col class="selects-col d-print-none d-none d-lg-block margin-wrap-right">
          <v-row dense justify="center">
            <v-col cols='5' md="5" lg="12">
              <div class="select">
              <label class="input-label">{{$t('root.forms.years')}}</label>
              <v-select
                rounded
                dense
                hide-details
                :value="year"
                @change="setYear"
                :items="years"
                outlined
              ></v-select>
              </div>
            </v-col>
            <v-col cols='5'  md="5" lg="12">
              <v-divider class="mt-2 d-none d-lg-block mb-2"></v-divider>
              <div class="select">
                <label class="input-label">{{$t('portfolio.fundingCategories')}}</label>
                <v-select
                  rounded
                  hide-details
                  dense
                  :value="fundingCategory"
                  @change="setCategory"
                  :items="fundingCategoriesTypes"
                  outlined
                ></v-select>
              </div>
            </v-col>
          </v-row>
          <v-row dense justify="center">
            <v-col class="d-block d-lg-none"  cols='5'  md="5" lg="12">
              <div class="select">
                <label class="input-label">{{$t('root.forms.region')}}</label>
                <v-select
                  rounded
                  hide-details
                  dense
                  :value="region"
                  item-text="name"
                  item-value="iso"
                  @change="updateRegion"
                  :items="regionsToSelect"
                  outlined
                ></v-select>
              </div>
            </v-col>
            <v-col cols='5'  md="5" lg="12">
              <div class="select">
                <label class="input-label">{{$t('portfolio.fundingSources')}}</label>
                <v-autocomplete
                  rounded
                  hide-details
                  dense
                  :value="fundingSource"
                  @change="setSource"
                  :items="portfolioSources"
                  item-text="name"
                  item-value="name"
                  outlined
                  ></v-autocomplete>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <portfolio-mobile-nav
        class="d-none d-md-flex d-print-none mt-2 mb-4 d-lg-none"
        :region="region"
        :regions="regionsToSelect"
        :goalType="goalsType"
        :year="year"
        :years="years"
        :goal="goal"
        :fundingCategory="fundingCategory"
        :fundingCategories="fundingCategoriesTypes"
        :fundingSource="fundingSource"
        :fundingSources="portfolioSources"
        @sourceChange="setSource"
        @categoryChange="setCategory"
        @yearChange="setYear"
        @regionChange="updateRegion"
        @goalTypeChange="transitionTo"
        @goalChange="updateGoal"
      />
      <portfolio-projects class="d-lg-none d-print-none" :goalType="goalsType" :goal="goal"/>
    </div>
    <div class="d-none d-print-block">
      <h2 class="text-center">
        Selected projects
      </h2>
      <div :key="goal.id" class="mb-4" v-for="goal in goals[activeGoalType]">
        <template v-if="getTopFiveProjeccts(goal).length" >
          <h3  class="prinout-goal-header mb-4" :style="{background: goal.color}">
            {{goal.title}}
          </h3>
          <v-row class="printout-project-row" :key="idex" v-for="(project, idex) in getTopFiveProjeccts(goal)">
            <v-col class="text-center" cols="3">{{getCountryName(project.country)}}</v-col>
            <v-col cols="5">{{project.title}}</v-col>
            <v-col class="text-center" cols="2">{{project.year}}</v-col>
            <v-col class="text-center" cols="2">{{nFormatter(project.budget)}}</v-col>
          </v-row>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
// @ is an alias to /src
import PortfolioMap from './children/PortfolioMap';
import PortfolioBars from './children/PortfolioBars';
import PrintoutHeader from '@/components/PrintoutHeader.vue'
import PortfolioExport from './children/PortfolioExport';
import PortfolioPieChart from './children/PortfolioPieChart';
import PortfolioMobileNav from './children/PortfolioMobileNav';
import PortfolioPrintoutChips from './children/PortfolioPrintoutChips'
import PortfolioMobileChips from './children/PortfolioMobileChips';
import InfoHoverTooltip from '@/components/InfoHoverTooltip';
import PortfolioProjects from './children/PortfolioProjects';


import InfoButton from '@/components/InfoButton.vue'

import { mapState } from 'vuex';
import sidsdata from '@/mixins/SIDSData.mixin'
import format from '@/mixins/format.mixin'
import store from '@/store'
import sizeMixin from '@/mixins/size.mixin'

import sidsList from '@/assets/sidsList'
import {goalTypes, goals} from '@/assets/goalsList'


export default {
  name: 'Portfolio',
  components: {
    PortfolioMap,
    PortfolioPieChart,
    PortfolioExport,
    InfoButton,
    PortfolioMobileNav,
    PrintoutHeader,
    PortfolioBars,
    PortfolioMobileChips,
    PortfolioPrintoutChips,
    PortfolioProjects,
    InfoHoverTooltip
  },
  props:['year', 'fundingCategory', 'fundingSource', 'region', 'goalsType'],
  mixins:[sidsdata, sizeMixin, format],
  data: function () {
    return {
      goals,
      pages:goalTypes,
      activePage:goalTypes.findIndex((goal) => goal.value === this.goalsType),
      fundingCategoriesTypes:['All', "European Union", "Donor Countries", "Programme Countries", "UN Agencies", "UN Pooled Funds", "Vertical Funds", "Other"],
      years:[
        {
          text:this.$t('portfolio.yearsAll'),
          value: 'all',
        },{
          text:'2021',
          value: '2021',
        },{
          text:'2020',
          value: '2020',
        },{
          text:'2019',
          value: '2019',
        },{
          text:'2018',
          value: '2018',
        },{
          text:'2017',
          value: '2017',
        },{
          text:'2016',
          value: '2016',
        },{
          text:'2015',
          value: '2015',
        },{
          text:'2014',
          value: '2014',
        },{
          text:'2013',
          value: '2013',
        },{
          text:'2012',
          value: '2012',
        }
      ],
      regionsToSelect: [
        {iso: "Caribbean", name:'Caribbean'},
        {iso: "AIS", name:'AIS'},
        {iso: "Pacific", name:'Pacific'},
        {iso: "All", name:'All SIDS'},
      ].concat(sidsList.filter(country => !country.average)),
      sdgToSamoa: { 1: [1], 2: [6], 3: [11], 4: [12, 13], 5: [13], 6: [7], 7: [3], 8: [1], 9: [1, 8], 10: [12, 13], 11: [1, 4, 8, 10], 12: [9, 10], 13: [2, 4], 14: [5, 10, 14], 15: [10, 15], 16: [1, 13], 17: [16] },
      goal:'all',
      regions: ["Caribbean", "AIS", "Pacific"],
      regionColors: d3.scaleOrdinal()
        .domain(["Caribbean", "AIS", "Pacific"])
        .range(["#008080", "#97002B", "#F0A500"]),
      sourcesColor: d3.scaleOrdinal()
        .domain(["Vertical Funds", "Donor Countries", "Programme Countries", "UN Pooled Funds", "UN Agencies", "European Union", "Other"])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#ac4f5f"])
    }
  },
  computed:{
    ...mapState({
      countries: state => state.sids.countryList,
      fundingCategories: state => state.sids.fundingCategories,
      portfolioData: state => state.sids.portfolioData,
      portfolioSources: state => state.sids.portfolioSources
    }),
    regionFunding() {
       let funding = this.regions.map(region => {
        return {
          category: region,
          value: this.portfolioData.reduce((budget, project) => {
              if(project.region === region &&
                (this.fundingCategory === 'All' ||
                project.donors.some((donor) =>this.checkProjectsCategory(project, donor))
                )
              ) {
                return budget + parseInt(project.budget)
              }
              return budget
          }, 0)
        }
      })
      return funding
    },
    yearText() {
      return this.years.find(y => y.value === this.year).text;
    },
    regionFundingMobile() {
       let funding = this.regions.map(region => {
        return {
          category: region,
          value: this.portfolioData.reduce((budget, project) => {
              if(project.region === region &&
                (this.fundingCategory === 'All' ||
                project.donors.some((donor) =>this.checkProjectsCategory(project, donor))
              ) && this.checkGoalValidity(project)
              ) {
                return budget + parseInt(project.budget)
              }
              return budget
          }, 0)
        }
      })
      return funding
    },
    sourcesFunding() {
      let labels = this.sourcesColor.domain().map(label => {
        return {
          category: label,
          value: this.portfolioData.reduce((budget, project) => {
            let financing = project.donors.reduce((finance, donor, index, donors )=> {
              if(this.fundingCategory === 'All' || donors.some((donor) => this.checkProjectsCategory(project, donor))) {
                if (label == "Programme Countries") {
                  if (donor.category == "Government" && project.country == donor.subCategory) {
                    return finance + (project.budget / donors.length)
                  }
                }
                else if (label == "Donor Countries") {
                  if (donor.category == "Government" && donor.subCategory != project.country) {
                    return finance + (project.budget / donors.length)
                  }
                }
                else if (donor.category == label) {
                  return finance + (project.budget / donors.length)
                }
              }
              return finance
            }, 0)
            return budget + financing
          }, 0)
        }
      });
      return labels
    },
    sourcesFundingMobile() {
      let labels = this.sourcesColor.domain().map(label => {
        return {
          category: label,
          value: this.portfolioData.reduce((budget, project) => {
            let financing = project.donors.reduce((finance, donor, index, donors )=> {
              if((this.fundingCategory === 'All' || donors.some((donor) => this.checkProjectsCategory(project, donor))) && this.checkGoalValidity(project)) {
                if (label == "Programme Countries") {
                  if (donor.category == "Government" && project.country == donor.subCategory) {
                    return finance + (project.budget / donors.length)
                  }
                }
                else if (label == "Donor Countries") {
                  if (donor.category == "Government" && donor.subCategory != project.country) {
                    return finance + (project.budget / donors.length)
                  }
                }
                else if (donor.category == label) {
                  return finance + (project.budget / donors.length)
                }
              }
              return finance
            }, 0)
            return budget + financing
          }, 0)
        }
      });
      return labels
    },
    activeGoalType() {
      return this.pages[this.activePage].value
    }
  },
  methods: {
    setYear(year) {
      this.$router.push({query: Object.assign({}, this.$route.query, {year})})
    },
    setCategory(category) {
      this.$router.push({query: Object.assign({}, this.$route.query, {
        fundingCategory : encodeURIComponent(category),
        fundingSource : encodeURIComponent('All Funding Sources')
      })})
    },
    setSource(source) {
      this.$router.push({query: Object.assign({}, this.$route.query, {fundingSource : encodeURIComponent(source)})})
    },
    updateRegion(region) {
      this.changeFilter({
        type: 'region',
        value: region
      })
    },
    changeFilter({type, value}) {
      if(type === 'region') {
        let regionToSet
        if(this.region === value) {
          regionToSet = 'All'
        } else {
          regionToSet = value
        }
        this.$router.push({query: Object.assign({}, this.$route.query, {region : encodeURIComponent(regionToSet)})})
      } else {
        let categoryToSet
        if(this.fundingCategory === value) {
          categoryToSet = 'All'
        } else {
          categoryToSet = value
        }
        this.$router.push({query: Object.assign({}, this.$route.query, {
          fundingCategory : encodeURIComponent(categoryToSet)})})
      }
    },
    callDataUpdate(route) {
      store.dispatch('sids/generatePortfolioData', {
        region: route.query.region || 'All',
        year: route.query.year || 'all',
        category: decodeURIComponent(route.query.fundingCategory || 'All') ,
        source: decodeURIComponent(route.query.fundingSource || 'All Funding Sources'),
      });
    },
    transitionTo(to) {
      this.activePage = this.pages.findIndex((goal) => goal.value === to);
      this.$router.push({path:`/portfolio/${to}`, query: this.$route.query})
    },
    updateGoal(goal) {
      this.goal = goal;
    },
    checkGoalValidity(project) {
      if(this.goalsType === 'sdgs') {
        if(this.goal === 'all') {
          return project.sdg !== ''
        }
        return project.sdg.includes(this.goal)
      } else if (this.goalsType === 'signature-solutions') {
        if(this.goal === 'all') {
          return project.solution !== ''
        }
        return project.solution.includes(this.goal)
      } else {
        if(this.goal === 'all') {
          return project.sdg !== ''
        }
        let samoaNumber = goals.samoa.findIndex(goal => goal.name === this.goal) + 1,
        sdgNumbers = this.sdgToSamoa[samoaNumber]

        return sdgNumbers.some(number => {
          return project.sdg.includes(goals.sdgs[number].name)
        })
      }
    },
    getTopFiveProjeccts(goal) {
      return this.portfolioData.filter(project => {
        if(this.goalsType === 'sdgs') {
          return project.sdg.includes(goal.name)
        } else if (this.goalsType === 'signature-solutions') {
          return project.solution.includes(goal.name)
        } else {
          let samoaNumber = goals.samoa.findIndex(goal => goal.name === this.goal) + 1,
          sdgNumbers = this.sdgToSamoa[samoaNumber]
          return sdgNumbers.some(number => {
            return project.sdg.includes(goals.sdgs[number].name)
          })
        }
      }).sort((a, b) => {
        return b.budget - a.budget
      }).slice(0,5);
    },
    getCountryName(iso) {
      let country = sidsList.find(c => c.iso === iso);
      if(country) {
        return country.name
      }
      return iso
    }
  },
  async beforeRouteUpdate(to, from, next){
    if(to.params.goalsType === from.params.goalsType) {
      this.callDataUpdate(to)
    }
    next();
  },
}
</script>
<style media="screen">
  .portfolio-slider {
    max-width: 792px;
    margin-left: auto;
    margin-top: -22px;
  }
  .mt-negative{
    height: 215px;
    margin-top: -205px !important;
  }
  @media print {
    .mt-negative{
      height: 215px;
      margin-top: 20px !important;
    }
    .bars-row {
      transform: scale(0.87);
    }
  }
  .tabs-column {
    min-width: 830px;
  }
  .tabs {
    margin-left: auto;
    margin-right: auto;
  }
  .margin-wrap-right {
    max-width: 200px;
    min-width: 170px;
    margin-right: auto;
  }

  .map-header {
    position: relative;
    z-index: 5;
  }
  @media all and (max-width:1263px) {
    .tabs-column {
      min-width: 100%;
    }
    .margin-wrap-right {
      max-width: none;
    }
  }
  .bars-row {
    position: relative;
    z-index: 2;
  }
  .chart-caption {
    font-weight: 200;
    font-size: 18px;
    margin-top: 45px;
  }
  .chart-caption-goals{
    margin-top: -28px;
    margin-left: 15px;
  }
  .prinout-goal-header {
    -webkit-print-color-adjust: exact !important;
    padding: 10px;
    font-size: 24px;
    color: #fff;
  }
  .printout-project-row {
    border-bottom: 2px solid #c0c0c0;
  }
  .printout-project-row:last-child {
    border-bottom: none;
  }
</style>
