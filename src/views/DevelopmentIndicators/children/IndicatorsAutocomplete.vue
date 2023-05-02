<template>
  <v-row class="d-flex justify-center">
    <v-col class="d-flex" cols="8">
      <div class="select indicators-autocomplete">
        <label class="input-label">{{$t('indicators.forms.indicator')}}</label>
        <v-autocomplete
          class="autocomplete-select undp-select"
          dense
          hide-details
          :value="indicatorFirstCode"
          outlined
          @change="emitIndicatorChange"
          item-text="indicator"
          item-value="indicatorCode"
          :filter="indicatorsFilter"
          :items="allIndicators"
        >
          <template v-slot:item="{ item }">
            <v-list-item-content>
              <v-list-item-title class="inicator-item_header">
                {{item.indicator}}
              </v-list-item-title>
              <v-list-item-subtitle class="inicator-item_description">
                {{datasetsMeta[item.dataset] && datasetsMeta[item.dataset].datasetName}}
              </v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </div>
    </v-col>
    <v-col class="d-flex justify-end align-center" cols="3">
      <div class="mt-5">
        <info-hover-tooltip :bottom="true" :disabled="!activeIndicator" :large="true">
          <template slot="content">
            <v-card flat>
              <v-card-title v-if="activeIndicator" class="mb-1 active-indicator_header">{{activeIndicator.indicator}} ({{activeIndicator.units}})</v-card-title>
              <v-card-text v-if="activeIndicator" class="active-indicator-info">
                {{activeIndicator.def}}
                <v-divider class="mb-1 mt-1"></v-divider>
                <b>Source:</b>{{activeIndicator.source}} <br/>
                <a :href="activeIndicator.link" target="_blank">Link</a>
              </v-card-text>
            </v-card>
          </template>
        </info-hover-tooltip>
      </div>
      <div class="ml-2 mt-5">
        <v-btn
            class="filter-sm-button"
            @click="emitToggleDialog"
            fab
            color="#D12800"
            outlined
          >
          <v-icon>mdi-filter
          </v-icon>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>
<script>
/*global gtag*/
import { mapState } from 'vuex';
import InfoHoverTooltip from '@/components/InfoHoverTooltip.vue'


export default {
  name: 'indicatorsAutocomplete',
  props:['activeIndicatorCode'],
  components:{
    InfoHoverTooltip
  },
  computed: {
    ...mapState({
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      datasetsMeta: state => state.indicators.datasetsMeta
    }),
    allIndicators() {
      let indicatorsArray = [];
      for(let indicator in this.indicatorsMeta) {
        if(this.indicatorsMeta[indicator].dataset !== 'key' &&
          (!this.indicatorsMeta[indicator].codesArray ||
          this.indicatorsMeta[indicator].codesArray[0] === this.indicatorsMeta[indicator].indicatorCode)) {
          indicatorsArray.push(this.indicatorsMeta[indicator])
        }
      }
      indicatorsArray.sort(function(a, b) {
          var textA = a.indicator.toUpperCase().trim();
          var textB = b.indicator.toUpperCase().trim();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      return indicatorsArray;
    },
    activeIndicator() {
      return this.indicatorsMeta[this.activeIndicatorCode];
    },
    indicatorFirstCode() {
      if(this.activeIndicator) {
        return this.activeIndicator.codesArray ? this.activeIndicator.codesArray[0] : this.activeIndicator.indicatorCode;
      }
      return ''
    }
  },
  methods: {
    indicatorsFilter(item, queryText, itemText) {
      return itemText.toLowerCase().includes(queryText.toLowerCase())
    },
    emitIndicatorChange(indicator) {
      gtag('event', 'indi_select', {
        indicator
      });
      this.$emit('indicatorChange', indicator)
    },
    emitToggleDialog(){
      this.$emit('toggleDialog')
    }
  },
}
</script>

<style>
.indicators-autocomplete {
  width: 100%;
}
.autocomplete-select {
  width: 100%;
}
.inicator-item_header {
  text-align: left;
  width: 100%;
}
.inicator-item_description {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  display: block;
  font-size: 12px;
}
.inicator-item::after {
  min-height: 0;
}
.active-indicator_header {
  padding-bottom: 0.5em;
  word-break: break-word;
}
.dimensions-select{
  max-width: 60%;
  margin-right: 0;
}
.autocomplete-select {
  font-size: 14px !important;
  font-weight: bold;
}
.autocomplete-select input {
  overflow: hidden;
  text-overflow: ellipsis;
}
.autocomplete-select .v-input__append-inner{
  margin-top: 12px !important;
}
.autocomplete-select .v-select__slot {
  height: 48px !important;
}
.mobile-pillar-selector {
  margin: 6px 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.filter-sm-button, .filter-sm-button:hover{
  width: 36px !important;
  height: 36px !important;
  padding: 8px 18px !important;
}
</style>
