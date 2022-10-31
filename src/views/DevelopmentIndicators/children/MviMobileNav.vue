<template>
  <div class="indicators-mvi-nav">
    <v-row class="justify-center">
      <v-col cols="11">
        <v-row>
          <v-expansion-panels accordion flat dense>
            <v-expansion-panel
              v-for="(indicatorCatery,i) in catIndicators"
              :key="i"
            >
              <v-expansion-panel-header class="font-weight-bold"
                :color="indicatorCatery.color"
              >
              {{$t('indicators.mvi.'+indicatorCatery.category)}}
              </v-expansion-panel-header>
              <v-expansion-panel-content
              >
                <v-list dense flat>
                  <v-list-item
                    dense
                    v-for="indicator in indicatorCatery.indicators"
                    :key="indicator.name"
                  >
                    <v-list-item-action class="ma-0">
                      <v-checkbox
                        :input-value="mviCodes"
                        :value="indicator.code"
                        @change="emitMviIndicatorsChange"
                        :ripple="false"
                      ></v-checkbox>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{$t('indicators.mvi.'+indicator.code.replaceAll('.','-'))}}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
        <v-row class="justify-center">
          <v-col cols="10">
            <v-row class="justify-center">
              <v-col cols="6">
                <div class="select">
                  <label class="input-label">Chart type</label>
                  <v-select
                    rounded
                    dense
                    hide-details
                    item-value="chartType"
                    :value="chartType"
                    :items="chartTypes"
                    @change="emitChartTypeChange"
                    outlined
                  >
                    <template slot="selection" slot-scope="data">
                      <span class="select-text-element">{{$t('indicators.tabs.' + data.item.chartType)}}</span>
                    </template>
                    <template  slot="item" slot-scope="data">
                      {{$t('indicators.tabs.' + data.item.chartType)}}
                    </template>
                  </v-select>
                </div>
              </v-col>
              <v-col cols="6">
                <div v-if="chartType === 'bars' || chartType === 'spider'" class="select">
                  <label class="input-label">Sorting</label>
                  <v-select
                    rounded
                    dense
                    hide-details
                    item-value="value"
                    item-text="text"
                    :value="sortingType"
                    :items="sortingTypes"
                    @change="emitSortingChange"
                    outlined
                  >
                    <template slot="selection" slot-scope="data">
                      <span class="select-text-element">{{$t('indicators.filters.' + data.item.value)}}</span>
                    </template>
                    <template  slot="item" slot-scope="data">
                      {{$t('indicators.filters.' + data.item.value)}}
                    </template>
                  </v-select>
                </div>
                <div v-else class="select">
                  <label class="input-label">Region</label>
                  <v-select
                    rounded
                    dense
                    hide-details
                    item-value="value"
                    item-text="text"
                    :value="region"
                    :items="regions"
                    @change="emitRegionChange"
                    outlined
                  >
                    <template slot="selection" slot-scope="data">
                      <span class="select-text-element">{{$t('regions.' + data.item)}}</span>
                    </template>
                    <template  slot="item" slot-scope="data">
                      {{$t('regions.' + data.item)}}
                    </template>
                  </v-select>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="d-flex align-end justify-end" cols="2">
            <v-btn
                class="filter-sm-button"
                rounded
                @click="emitToggleDialog"
                fab
                color="primary"
              >
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
/*global gtag*/
import { mviIndicators, mviPreset, eviPreset } from '@/assets/goalsList';

export default {
  name: 'MviMobileNav',
  props:['sortingType', 'chartType', 'chartTypes', 'region' ,'regions', 'mviCodes'],
  data(){
    return {
      catIndicators:mviIndicators,
      MVI: mviPreset,
      EVI:eviPreset,
      sortingTypes:[{
        value: 'rank',
        text: 'Rank'
      },{
        value: 'region',
        text: 'Region'
      }]
    }
  },
  methods: {
    emitChartTypeChange(chartType){
      this.$emit('chartTypeChange', chartType)
    },
    emitSortingChange(sorting){
      this.$emit('sortingChange', sorting)
    },
    emitRegionChange(region){
      this.$emit('regionChange', region)
    },
    emitToggleDialog() {
      this.$emit('toggleDialog')
    },
    emitMviIndicatorsChange(value) {
      gtag('event', 'mvi_filter', {
        mvi_set: value
      });
      return this.$emit('MviIndicatorsChange', value)
    },
  },
}
</script>

<style>
</style>
