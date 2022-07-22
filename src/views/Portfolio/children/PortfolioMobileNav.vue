<template>
  <div class="indicators-mobile-nav">
    <v-row class="justify-center">
      <v-col cols="11">
        <v-row class="justify-center">
          <v-col cols="6">
            <div class="select">
              <label class="input-label">Region</label>
              <v-select
                rounded
                dense
                hide-details
                item-text="name"
                item-value="iso"
                :value="region"
                :items="regions"
                @change="emitRegionChange"
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
                item-value="value"
                item-text="text"
                :value="year"
                :items="years"
                @change="emitYearChange"
                outlined
              ></v-select>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="6" class="position-relative">
            <div class="select">
              <label class="input-label">Funding category</label>
              <v-select
                rounded
                dense
                hide-details
                :value="fundingCategory"
                :items="fundingCategories"
                @change="emitCategoryChange"
                outlined
              ></v-select>
            </div>
            <v-icon dense class="child-select-icon">mdi-chevron-right</v-icon>
          </v-col>
          <v-col cols="6">
            <div class="select">
              <label class="input-label">Funding source</label>
              <v-select
                rounded
                dense
                hide-details
                item-text="name"
                item-value="name"
                :value="fundingSource"
                :items="fundingSources"
                @change="emitSourceChange"
                outlined
              ></v-select>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="6" class="position-relative">
            <div class="select">
              <label class="input-label">Goal type</label>
              <v-select
                rounded
                dense
                hide-details
                item-value="value"
                item-text="name"
                :value="goalType"
                :items="goalTypes"
                @change="emitGoalTypeChange"
                outlined
              ></v-select>
            </div>
            <v-icon dense class="child-select-icon">mdi-chevron-right</v-icon>
          </v-col>
          <v-col cols="6">
            <div class="select">
              <label class="input-label">Goal</label>
              <v-select
                rounded
                dense
                hide-details
                item-value="value"
                item-text="name"
                :value="goal"
                :items="activeGoals"
                @change="emitGoalChange"
                outlined
              ></v-select>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { goals, goalTypes } from '@/assets/goalsList';

export default {
  name: 'PortfolioMobileNav',
  props:['region' ,'regions','year','years','fundingCategory','fundingCategories','fundingSource', 'fundingSources', 'goalType', 'goal'],
  data(){
    return {
      goalTypes: goalTypes
    }
  },
  computed: {
    activeGoals() {
      return [{
        name:'All',
        value: 'all'
      }].concat(goals[this.goalType])
    }
  },
  methods: {
    emitSourceChange(source){
      this.$emit('sourceChange', source)
    },
    emitCategoryChange(category){
      this.$emit('categoryChange', category)
    },
    emitYearChange(year){
      this.$emit('yearChange', year)
    },
    emitGoalTypeChange(goalType){
      this.$emit('goalChange', 'all')
      this.$emit('goalTypeChange', goalType)
    },
    emitGoalChange(goal){
      this.$emit('goalChange', goal)
    },
    emitRegionChange(region){
      this.$emit('regionChange', region)
    }
  },
}
</script>

<style>

.child-select-icon {
  position: absolute !important;
  right: -0.5em;
  bottom: 1em;
}
</style>
