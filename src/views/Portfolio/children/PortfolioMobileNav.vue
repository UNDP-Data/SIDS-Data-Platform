<template>
  <div class="indicators-mobile-nav mt-10">
    <v-row class="justify-center">
      <v-col cols="11">
        <v-row class="justify-center">
          <v-col cols="6">
            <div class="select">
              <p class="input-label">{{$t('root.forms.region')}}</p>
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
              <p class="input-label">{{$t('portfolio.year')}}</p>
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
                  <span class="select-text-element">{{data.item.text ? $t('portfolio.' + data.item.text) : data.item.value}}</span>
                </template>
                <template  slot="item" slot-scope="data">
                  {{data.item.text ? $t('portfolio.' + data.item.text) : data.item.value}}
                </template>
              </v-select>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="6" class="position-relative">
            <div class="select">
              <p class="input-label">{{$t('portfolio.fundingCategories')}}</p>
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
          <v-col cols="6">
            <div class="select">
              <p class="input-label">{{$t('portfolio.fundingSources')}}</p>
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
              >
                <template slot="selection" slot-scope="data">
                  <span class="select-text-element">{{data.item.text ? $t('portfolio.' + data.item.text) : data.item.name}}</span>
                </template>
                <template  slot="item" slot-scope="data">
                  {{data.item.text ? $t('portfolio.' + data.item.text) : data.item.name}}
                </template>
              </v-select>
            </div>
          </v-col>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="6" class="position-relative">
            <div class="select">
              <p class="input-label">{{$t('portfolio.goalType')}}</p>
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
              <p class="input-label">{{$t('portfolio.goal')}}</p>
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
</style>
