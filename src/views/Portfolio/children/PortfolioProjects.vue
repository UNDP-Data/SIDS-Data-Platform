<template>
  <v-row class="justify-center">
    <v-col cols="11">
      <v-card flat>
        <v-card-title>
          <h3 class="block-subheader">Projects:</h3>
        </v-card-title>
        <v-virtual-scroll
          height="400"
          item-height="62"
          :items="projectData"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item.year+item.title"
              >
              <v-list-item-content>
                <v-list-item-title class="project-item_header">{{item.title}}</v-list-item-title>
                <v-list-item-subtitle class="project-item_description">{{nameFormat(item.country)}} - {{item.year}} - {{nFormatter(item.budget)}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider/>
          </template>
        </v-virtual-scroll>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import { mapState } from 'vuex';
import format from '@/mixins/format.mixin'
import sidsList from '@/assets/sidsList'
import { goals } from '@/assets/goalsList'


export default {
  name: 'PortfolioIndicatorBox',
  props: ['goalType', 'goal'],
  mixins:[format],
  data() {
    return {
      sdgToSamoa: { 1: [1], 2: [6], 3: [11], 4: [12, 13], 5: [13], 6: [7], 7: [3], 8: [1], 9: [1, 8], 10: [12, 13], 11: [1, 4, 8, 10], 12: [9, 10], 13: [2, 4], 14: [5, 10, 14], 15: [10, 15], 16: [1, 13], 17: [16] },
    }
  },
  computed:{
    ...mapState({
      portfolioData: state => state.sids.portfolioData,
    }),
    projectData() {
      return this.portfolioData.filter((project) => {
        return this.checkGoalValidity(project);
      }).sort((p1,p2) => {
        if(p1.title.trim() < p2.title.trim()) { return -1; }
        if(p1.title.trim() > p2.title.trim()) { return 1; }
        return 0;
      })
    }
  },
  methods: {
    nameFormat(code) {
      return sidsList.find(c => c.iso === code).name
    },
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.project-item {
  border-bottom: 1px solid
}
.project-item_header {
  text-align: left;
  font-size: 14px;
  font-weight: 500 !important;
  width: 100%;
}
.project-item_description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
  font-size: 14px;
}
</style>
