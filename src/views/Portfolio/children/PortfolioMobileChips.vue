<template>
  <v-row class="justify-center">
    <v-col cols="11">
      <v-row dense class="justify-center">
        <v-col cols="6" class="d-flex justify-end justify-sm-center">
          <portfolio-indicator-box
            class="portfolio-chip"
            :value="projectsNumber"
            :title="$t('portfolio.chips.sidsWithProjects')"
          />
        </v-col>
        <v-col cols="6" class="d-flex justify-start justify-sm-center">
          <portfolio-indicator-box
            class="portfolio-chip"
            :value="memberStates"
            :title="$t('portfolio.chips.unMembsers')"
          />
        </v-col>
        <v-col cols="6" class="d-flex justify-end justify-sm-center">
          <portfolio-indicator-box
            class="portfolio-chip"
            :value="UNDPprojectsNumber"
            :title="$t('portfolio.chips.projects')"
          />
        </v-col>
        <v-col cols="6" class="d-flex justify-start justify-sm-center">
          <portfolio-indicator-box
            class="portfolio-chip"
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
  name: 'PortfolioMobileChips',
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
        case 'caribbean':
          return 25;
        case 'ais':
          return 9;
        case 'pacific':
          return 16;
        default:
          return 50;
      }
    },
    memberStates() {
      switch (this.region) {
        case 'caribbean':
          return 16
        case 'ais':
          return 9
        case 'pacific':
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

<style scoped>
.portfolio-chip {
  width: 120px;
}
</style>
