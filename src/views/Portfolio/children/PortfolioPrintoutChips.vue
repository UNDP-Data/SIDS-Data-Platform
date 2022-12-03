<template>
  <v-row class="justify-center d-none d-print-flex">
    <v-col cols="6">
      <p class="portfolio-print-filters-list mb-0">
        <span class="portfolio-print-filters-list_name">
          {{$t('root.forms.region')}}:
        </span>
        {{region}}
      </p>
      <p class="portfolio-print-filters-list mb-0">
        <span class="portfolio-print-filters-list_name">
          {{$t('root.forms.years')}}:
        </span>
        {{this.year === 'all' ? this.$t('portfolio.yearsAll') : this.year}}
      </p>
      <p class="portfolio-print-filters-list mb-0">
        <span class="portfolio-print-filters-list_name">
          {{$t('portfolio.fundingCategories')}}:
        </span>
        {{$t('portfolio.fundingTypes.' + fundingCategory)}}
      </p>
      <p class="portfolio-print-filters-list mb-0">
        <span class="portfolio-print-filters-list_name">
          {{$t('portfolio.fundingSources')}}:
        </span>
        {{fundingSource === 'all' ? $t('portfolio.fundingTypes.all') : fundingCategories[fundingSource].donor}}
      </p>
    </v-col>
    <v-col cols="6" class="portfolio-print-chips">
      <v-row dense class="justify-center">
        <v-col cols="6" class="d-flex justify-center">
          <portfolio-indicator-box
            class="portfolio-printout-chip"
            :value="projectsNumber"
            :title="$t('portfolio.chips.sidsWithProjects')"
          />
        </v-col>
        <v-col cols="6" class="d-flex justify-center">
          <portfolio-indicator-box
            class="portfolio-printout-chip"
            :value="memberStates"
            :title="$t('portfolio.chips.unMembsers')"
          />
        </v-col>
        <v-col cols="6" class="d-flex justify-center">
          <portfolio-indicator-box
            class="portfolio-printout-chip"
            :value="UNDPprojectsNumber"
            :title="$t('portfolio.chips.projects')"
          />
        </v-col>
        <v-col cols="6" class="d-flex justify-center">
          <portfolio-indicator-box
            class="portfolio-printout-chip"
            :value="projectsFundning"
            :title="$t('portfolio.chips.funding')"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import PortfolioIndicatorBox from './PortfolioIndicatorBox'
import format from '@/mixins/format.mixin'
import { mapState } from 'vuex';
export default {
  name: 'PortfolioPrintoutChips',
  mixins:[format],
  props:['year', 'fundingCategory', 'fundingSource', 'region', 'projects'],
  components:{
    PortfolioIndicatorBox
  },
  data() {
    return {
    }
  },
  computed:{
    ...mapState({
      fundingCategories: state => state.sids.fundingCategories,
    }),
    projectsNumber() {
      switch (this.region) {
        case 'Caribbean':
          return 25;
        case 'AIS':
          return 9;
        case 'Pacific':
          return 16;
        default:
          return 50;
      }
    },
    memberStates() {
      switch (this.region) {
        case 'Caribbean':
          return 16
        case 'AIS':
          return 9
        case 'Pacific':
          return 13
        default:
          return 38
      }
    },
    UNDPprojectsNumber() {
      let distinctProjects = [];
      this.projects.map(project => {
        if (!distinctProjects.includes(project.title)) {
          distinctProjects.push(project.title)
        }
      })
      return distinctProjects.length
    },
    projectsFundning() {
      let funding = 0;
      if(this.year === 'all') {
        this.projects.map(project => {
          funding += project.year.reduce((budget, year) => {return budget + project.budget[year]},0);
        })
      } else {
        this.projects.map(project => {
          funding += project.budget[this.year];
        })
      }
      return this.nFormatter(funding)
    }
  }
}
</script>

<style>
.portfolio-print-chips {
  -webkit-print-color-adjust: exact !important;
  background: #418FDE;
}
.portfolio-printout-chip {
  color: #fff !important;
  background: transparent !important;
  box-shadow: none !important;
}
.portfolio-printout-chip .custom-chip_text {
  color: #fff !important;
  font-weight: normal !important;
  max-width: 160px !important;
  font-size: 14px;
}
.portfolio-printout-chip .custom-chip_header {
  font-size: 42px;
  font-weight: 600 !important;
  margin-bottom: 12px;
}
</style>
