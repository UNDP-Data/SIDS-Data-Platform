<template>
  <v-row class="justify-center">
    <v-col cols="11">
      <v-card flat>
        <v-card-title>
          <h3 class="block-subheader">{{$t('portfolio.projects')}}:</h3>
        </v-card-title>
        <v-virtual-scroll
          height="400"
          item-height="62"
          :items="projectData"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item.title"
              >
              <v-list-item-content>
                <v-list-item-title class="project-item_header">{{item.title}}</v-list-item-title>
                <v-list-item-subtitle class="project-item_description">
                  {{nameFormat(item.country)}}, {{computeBudget(item)}}, {{computeYear(item.year)}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider :key="item.title+'divider'"/>
          </template>
        </v-virtual-scroll>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import format from '@/mixins/format.mixin'
import sidsList from '@/assets/sidsList'

export default {
  name: 'PortfolioIndicatorBox',
  props: ['goalType', 'goal', 'projects'],
  mixins:[format],
  data() {
    return {};
  },
  computed:{
    projectData() {
      return [...this.projects].sort((p1,p2) => {
        if(p1.title.trim() < p2.title.trim()) { return -1; }
        if(p1.title.trim() > p2.title.trim()) { return 1; }
        return 0;
      })
    }
  },
  methods: {
    nameFormat(code) {
      return this.$t('countryNames.' + sidsList.find(c => c.iso === code).id);
    },
    computeYear(yearsArr) {
      return yearsArr.reduce((str, year, index) => {
        if(index === 0) {
          str+=year;
          return str;
        }
        if(year-1 === yearsArr[index-1]) {
          str = str.replace(` - ${year-1}`,'')
          str+= ` - ${year}`
        } else {
          str+= `, ${year}`
        }
        return str;
      },'')
    },
    computeBudget(project) {
      let budget = 0;
      project.year.map(year => {
        budget += project.budget[year];
      })
      return this.nFormatter(budget)
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
  font-size: 1rem;
  font-weight: 500 !important;
  width: 100%;
}
.project-item_description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
  font-size: 1rem;
}
</style>
