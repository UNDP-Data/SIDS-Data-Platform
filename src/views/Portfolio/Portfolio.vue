<template>
  <div class="">
    <div class="print-page-wrap">
      <printout-header>
        <template slot="text">
          {{$t('portfolio.header')}}
        </template>
      </printout-header>
      <portfolio-printout-chips
        :region="getCountryName(region)"
        :projects="portfolioData"
        :year="yearText"
        :goalType="goalsType"
        :goal="goal"
        :fundingCategory="fundingCategoryText"
        :fundingSource="fundingSource"
      />
      <p class="d-none mt-6 d-print-block">
        {{$t('portfolio.export.intro')}}
      </p>
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
        <v-col class="pt-6" cols="11" sm="5">
          <portfolio-pie-chart
            @changeFilter="changeFilter"
            :data="regionFundingMobile"
            chartName="region"
            postfix="1"
            :colorScheme="regionColors"
          ></portfolio-pie-chart>
        </v-col>
        <v-col class="pt-6 position-relative" cols="11" sm="5">
          <div class="pie-tooltip-container">
            <info-hover-tooltip :bottom="true" contentName="portfolioTooltip-solutions">
              <template slot="content">
                <v-card class="pie-tooltip-content">
                  <v-card-title>
                    Finance sources
                  </v-card-title>
                  <v-card-text>
                    <p>Pie chart can be used to identify organisations that invest in similar projects or are focused on the same regions</p>
                  </v-card-text>
                </v-card>
              </template>
            </info-hover-tooltip>
          </div>
          <portfolio-pie-chart
            @changeFilter="changeFilter"
            :data="sourcesFundingMobile"
            :activeCategory="fundingCategory"
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
                <v-col class="offset-lg-2 offset-xl-1 offset-md-1 offset-sm-2 offset-2" cols="8" sm="8" md='10' lg='8' xl="10">
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
      <v-row class="bars-row d-none d-lg-block mb-3 mt-negative">
        <portfolio-bars :year='year' :fundingCategory='fundingCategory' :fundingSource='fundingSource' :region='region' :goalsType='goalsType'></portfolio-bars>
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
                  <info-hover-tooltip attach=".portfolio-slider" :key="page.value" v-for="page in pages" :bottom="true" :noMaxHeight="true" contentClass="tabs-tooltip" :contentName="page.contentName">
                    <template v-slot:button>
                    <v-tab class="portfolio-tab" :class="{'portfolio-tab-long' : page.value === 'sdgs'}"   @change="transitionTo(page.value)" >
                        {{$t(`root.goals.${page.value}`)}}
                    </v-tab></template>
                  </info-hover-tooltip>
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
              <h3 class="d-none d-print-block chart-caption text-center">
                <b>Funding by regions</b>
              </h3>
            </v-col>
            <v-col class="position-relative" cols="6" md="5" lg="6">
              <div class="pie-tooltip-container d-print-none">
                <info-hover-tooltip :bottom="true" contentName="portfolioTooltip-solutions">
                  <template slot="content">
                    <v-card class="pie-tooltip-content">
                      <v-card-text>
                        <p>{{$t('portfolio.fundingInfo')}}</p>
                      </v-card-text>
                    </v-card>
                  </template>
                </info-hover-tooltip>
              </div>
              <portfolio-pie-chart
                @changeFilter="changeFilter"
                :data="sourcesFunding"
                chartName="sources"
                :activeCategory="fundingCategory"
                :colorScheme="sourcesColor"
              ></portfolio-pie-chart>
              <h3 class="d-none d-print-block chart-caption text-center">
                <b>Funding by category</b>
              </h3>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="selects-col d-print-none d-none d-lg-block margin-wrap-right">
          <v-row dense justify="center">
            <v-col cols='5' md="5" lg="12">
              <div class="select">
              <label class="input-label">{{$t('portfolio.year')}}</label>
              <v-select
                rounded
                dense
                hide-details
                :value="year"
                @change="setYear"
                :items="years"
                outlined
              >
                <template slot="selection" slot-scope="data">
                  <span class="select-text-element">{{data.item.text ? $t('portfolio.' + data.item.text) : data.item.value}}</span>
                </template>
                <template  slot="item" slot-scope="data">
                  {{data.item.text ? $t('portfolio.' + data.item.text) : data.item.value}}
                </template>
              </v-select>
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
                >
                  <template slot="selection" slot-scope="data">
                    <span class="select-text-element">{{$t('portfolio.fundingTypes.' + data.item.text)}}</span>
                  </template>
                  <template  slot="item" slot-scope="data">
                    {{$t('portfolio.fundingTypes.' + data.item.text)}}
                  </template>
                </v-select>
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
                >
                  <template slot="selection" slot-scope="data">
                    <span class="select-text-element">{{data.item.id ? $t('countryNames.'+data.item.id) : $t('regions.'+data.item.iso)}}</span>
                  </template>
                  <template  slot="item" slot-scope="data">
                   {{data.item.id ? $t('countryNames.'+data.item.id) : $t('regions.'+data.item.iso)}}
                  </template>
                </v-select>
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
                  >
                  <template slot="selection" slot-scope="data">
                    <span class="select-text-element">{{data.item.text ? $t('portfolio.' + data.item.text) : data.item.name}}</span>
                  </template>
                  <template  slot="item" slot-scope="data">
                    {{data.item.text ? $t('portfolio.' + data.item.text) : data.item.name}}
                  </template>
                  </v-autocomplete>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="bars-row d-none d-print-block">
        <portfolio-bars :year='year' :fundingCategory='fundingCategory' :fundingSource='fundingSource' :region='region' :goalsType='goalsType'></portfolio-bars>
      </v-row>
      <v-row class="d-none d-print-block">

        <v-col class="chart-caption-goals" cols="12">
          <h3>
            {{$t(`root.goals.${goalsType}`)}}
          </h3>
        </v-col>
        <v-col class="mt-0 pt-0" cols="12" v-html="$t(`portfolio.export.${goalsType}`)">
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
      <div :key="goal.id" class="mb-4" v-for="goal in goals[goalsType]">
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
/*global gtag*/
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
      fundingCategoriesTypes:[{
        value:'All',
        text: "all",
      },
      {
        value:"European Union",
        text: "eu",
      },
      {
        value:"Donor Countries",
        text: "donors",
      },
      {
        value:"Programme Countries",
        text: "programmeCountries",
      },
      {
        value:"UN Agencies",
        text: "unAcgencies",
      },
      {
        value:"UN Pooled Funds",
        text: "unFunds",
      },
      {
        value:"Vertical Funds",
        text: "verticalFunds",
      },
      {
        value:"Other",
        text: "other"
      }],
      years:[
        {
          text:'yearsAll',
          value: 'all',
        },{
          value: '2021',
        },{
          value: '2020',
        },{
          value: '2019',
        },{
          value: '2018',
        },{
          value: '2017',
        },{
          value: '2016',
        },{
          value: '2015',
        },{
          value: '2014',
        },{
          value: '2013',
        },{
          value: '2012',
        }
      ],
      regionsToSelect: [
        {iso: "caribbean", name:this.$t('regions.caribbean')},
        {iso: "ais", name:this.$t('regions.ais')},
        {iso: "pacific", name:this.$t('regions.pacific')},
        {iso: "allSids", name:this.$t('regions.allSids')},
      ].concat(sidsList.filter(country => !country.average)),
      sdgToSamoa: { 1: [1], 2: [6], 3: [11], 4: [12, 13], 5: [13], 6: [7], 7: [3], 8: [1], 9: [1, 8], 10: [12, 13], 11: [1, 4, 8, 10], 12: [9, 10], 13: [2, 4], 14: [5, 10, 14], 15: [10, 15], 16: [1, 13], 17: [16] },
      goal:'all',
      regions: ["caribbean", "ais", "pacific"],
      regionColors: d3.scaleOrdinal()
        .domain(["caribbean", "ais", "pacific"])
        .range(["#008080", "#97002B", "#F0A500"]),
      sourcesColor: d3.scaleOrdinal()
        .domain(["eu", "donors", "programmeCountries", "unAcgencies", "unFunds", "verticalFunds", "other"])
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
              if(project.region.toLowerCase() === region &&
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
      let year = this.years.find(y => y.value === this.year);
      return year.text ? this.$t('portfolio.' + year.text) : year.value;
    },
    fundingCategoryText() {
      return this.fundingCategoriesTypes.find(c => c.value === this.fundingCategory).text
    },
    regionFundingMobile() {
       let funding = this.regions.map(region => {
        return {
          category: region,
          value: this.portfolioData.reduce((budget, project) => {
              if(project.region.toLowerCase() === region &&
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
      let labels = this.fundingCategoriesTypes.filter(c => c.value !== 'All').map(c => {
        return {
          category: c.text,
          value: this.portfolioData.reduce((budget, project) => {
            let financing = project.donors.reduce((finance, donor, index, donors )=> {
              if(this.fundingCategory === 'All' || donors.some((donor) => this.checkProjectsCategory(project, donor))) {
                if (c.value == "Programme Countries") {
                  if (donor.category == "Government" && project.country == donor.subCategory) {
                    return finance + (project.budget / donors.length)
                  }
                }
                else if (c.value == "Donor Countries") {
                  if (donor.category == "Government" && donor.subCategory != project.country) {
                    return finance + (project.budget / donors.length)
                  }
                }
                else if (donor.category == c.value) {
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
      let labels = this.fundingCategoriesTypes.filter(c => c.value !== 'All').map(c => {
        return {
          category: c.text,
          value: this.portfolioData.reduce((budget, project) => {
            let financing = project.donors.reduce((finance, donor, index, donors )=> {
              if((this.fundingCategory === 'All' || donors.some((donor) => this.checkProjectsCategory(project, donor))) && this.checkGoalValidity(project)) {
                if (c.value == "Programme Countries") {
                  if (donor.category == "Government" && project.country == donor.subCategory) {
                    return finance + (project.budget / donors.length)
                  }
                }
                else if (c.value == "Donor Countries") {
                  if (donor.category == "Government" && donor.subCategory != project.country) {
                    return finance + (project.budget / donors.length)
                  }
                }
                else if (donor.category == c.value) {
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
    }
  },
  methods: {
    setYear(year) {
      gtag('event', 'portfolio_filter', {
        type: 'year', value: year
      });
      this.$router.push({query: Object.assign({}, this.$route.query, {year})})
    },
    setCategory(category) {
      gtag('event', 'portfolio_filter', {
        type: 'category', value: category
      });
      this.$router.push({query: Object.assign({}, this.$route.query, {
        fundingCategory : encodeURIComponent(category),
        fundingSource : encodeURIComponent('All Funding Sources')
      })})
    },
    setSource(source) {
      this.$router.push({query: Object.assign({}, this.$route.query, {fundingSource : encodeURIComponent(source)})})
    },
    updateRegion(region) {
      gtag('event', 'portfolio_country_select', {
        country: region
      });
      this.changeFilter({
        type: 'region',
        value: region
      })
    },
    changeFilter({type, value}) {
      if(type === 'region') {
        let regionToSet
        if(this.region === value) {
          regionToSet = 'allSids'
        } else {
          regionToSet = value
        }
        this.$router.push({query: Object.assign({}, this.$route.query, {region : encodeURIComponent(regionToSet)})})
      } else {
        gtag('event', 'portfolio_filter', {
          type, value
        });
        let categoryToSet = this.fundingCategoriesTypes.find(c => c.text === value).value;
        if(this.fundingCategory === categoryToSet) {
          categoryToSet = 'All'
        }
        this.$router.push({query: Object.assign({}, this.$route.query, {
          fundingCategory : encodeURIComponent(categoryToSet)})})
      }
    },
    callDataUpdate(route) {
      store.dispatch('sids/generatePortfolioData', {
        region: route.query.region || 'allSids',
        year: route.query.year || 'all',
        category: decodeURIComponent(route.query.fundingCategory || 'All') ,
        source: decodeURIComponent(route.query.fundingSource || 'All Funding Sources'),
      });
    },
    transitionTo(to) {
      gtag('event', 'portfolio_goalChange', {
        goal: to
      });
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
          let samoaNumber = goals.samoa.findIndex(goalSamoa => goal.name === goalSamoa.name) + 1,
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
    position: relative;
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
    font-weight: 400;
    font-size: 18px;
    margin-top: 45px;
  }
  .chart-caption-goals{
    font-weight: 400;
    margin-top: -28px !important;
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
  .pie-tooltip-content {
    max-width: 300px;
  }
  .pie-tooltip-container {
    position: absolute;
    top: 0;
    right: 0;
  }
  .tabs-tooltip {
    width: 860px !important;
    left: 50% !important;
    transform: translateX(-50%);
  }
  .portfolio-tab {
    max-width: 217px !important;
    width: 217px !important;
  }

  .portfolio-tab-long {
    max-width: 340px !important;
    width: 340px !important;
  }
</style>
