<template>
  <v-row class="justify-center d-none d-print-flex">
    <v-col cols="6">
      <p class="portfolio-print-filters-list mb-0">
        <span class="portfolio-print-filters-list_name">
          Region:
        </span>
        {{region}}
      </p>
      <p class="portfolio-print-filters-list mb-0">
        <span class="portfolio-print-filters-list_name">
          Years:
        </span>
        {{year}}
      </p>
      <p class="portfolio-print-filters-list mb-0">
        <span class="portfolio-print-filters-list_name">
          Funding categories:
        </span>
        {{fundingCategory}}
      </p>
      <p class="portfolio-print-filters-list mb-0">
        <span class="portfolio-print-filters-list_name">
          Funding sources:
        </span>
        {{fundingSource}}
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
import { goals } from '@/assets/goalsList'

export default {
  name: 'PortfolioPrintoutChips',
  mixins:[format],
  props:['year', 'fundingCategory', 'fundingSource', 'region', 'goalType', 'goal', 'projects'],
  components:{
    PortfolioIndicatorBox
  },
  data() {
    return {
      sdgToSamoa: { 1: [1], 2: [6], 3: [11], 4: [12, 13], 5: [13], 6: [7], 7: [3], 8: [1], 9: [1, 8], 10: [12, 13], 11: [1, 4, 8, 10], 12: [9, 10], 13: [2, 4], 14: [5, 10, 14], 15: [10, 15], 16: [1, 13], 17: [16] },
    }
  },
  computed:{
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
          if(this.checkGoalValidity(project)) {
            distinctProjects.push(project.title)
          }
        }
      })
      return distinctProjects.length
    },
    projectsFundning() {
      let funding = 0;
      this.projects.map(project => {
        if(this.checkGoalValidity(project)) {
          funding = funding + parseInt(project.budget);
        }
      })
      return this.nFormatter(funding)
    }
  },
  methods: {
    checkGoalValidity(project) {
      if(this.goalType === 'sdgs') {
        if(this.goal === 'all') {
          return project.sdg !== ''
        }
        return project.sdg.includes(this.goal)
      } else if (this.goalType === 'signature-solutions') {
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
    }
  }
}
</script>

<style>
.portfolio-print-filters-list_name {
  display: block;
  font-size: 14px;
  font-weight: normal;
}
.portfolio-print-filters-list {
  font-size: 20px;
  font-weight: bold;
}
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
