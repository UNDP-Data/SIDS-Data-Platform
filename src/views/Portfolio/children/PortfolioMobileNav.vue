<template>
  <div class="indicators-mobile-nav">
    <v-row class="justify-center">
      <v-col cols="11">
        <v-row class="justify-center">
          <v-col cols="6">
            <div class="select">
              <label class="input-label">{{$t('root.forms.region')}}</label>
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
          <v-col cols="6">
            <div class="select">
              <label class="input-label">{{$t('portfolio.year')}}</label>
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
              >
                <template slot="selection" slot-scope="data">
                  <span class="select-text-element">{{data.item === 'all' ? $t('portfolio.yearsAll') : data.item}}</span>
                </template>
                <template  slot="item" slot-scope="data">
                  {{data.item === 'yearsAll' ? $t('portfolio.yearsAll') : data.item}}
                </template>
              </v-select>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="6" class="position-relative">
            <div class="select">
              <label class="input-label">{{$t('portfolio.fundingCategories')}}</label>
              <v-select
                rounded
                dense
                hide-details
                :value="fundingCategory"
                :items="fundingCategories"
                @change="emitCategoryChange"
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
            <v-icon dense class="child-select-icon">mdi-chevron-right</v-icon>
          </v-col>
          <v-col class="d-flex align-end" cols="6">
            <div class="select select-flex">
              <label class="input-label">{{$t('portfolio.fundingSources')}}</label>
              <v-select
                rounded
                dense
                hide-details
                item-text="name"
                item-value="id"
                :value="fundingSource"
                :items="fundingSources"
                @change="emitSourceChange"
                outlined
              >
                <template slot="selection" slot-scope="data">
                  <span class="select-text-element">{{data.item.id === 'all' ? $t('portfolio.' + data.item.text) : data.item.text}}</span>
                </template>
                <template  slot="item" slot-scope="data">
                  {{data.item.id === 'all' ? $t('portfolio.' + data.item.text) : data.item.text}}
                </template>
              </v-select>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="6" class="position-relative">
            <div class="select">
              <label class="input-label">{{$t('portfolio.goalType')}}</label>
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
              >
                <template slot="selection" slot-scope="data">
                  <span class="select-text-element">{{$t('root.goals.' + data.item.value)}}</span>
                </template>
                <template  slot="item" slot-scope="data">
                  {{$t('root.goals.' + data.item.value)}}
                </template>
              </v-select>
            </div>
            <v-icon dense class="child-select-icon">mdi-chevron-right</v-icon>
          </v-col>
          <v-col cols="6">
            <div class="select">
              <label class="input-label">{{$t('portfolio.goal')}}</label>
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
              >
                <template slot="selection" slot-scope="data">
                  <span class="select-text-element">{{data.item.id ? $t('root.'+goalType + '.' + data.item.id + '.name') : $t('portfolio.fundingTypes.all')}}</span>
                </template>
                <template  slot="item" slot-scope="data">
                  {{data.item.id ? $t('root.'+goalType + '.' + data.item.id + '.name') : $t('portfolio.fundingTypes.all')}}
                </template>
              </v-select>
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
.select-flex {
  max-width: 100%;
  width: 100%;
}
</style>
