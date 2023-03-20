<template>
  <div class="mvi-indicators-nav">
    <v-row class="nav-row">
      <v-col>
        <v-tabs
          :value="activePreset"
          grow
          class="mb-4 mvi-nav-tabs tabs tabs-small"
        >
          <v-tab :value="0" @change="setPreset('MVI')">
            <info-hover-tooltip :bottom="true" contentName="mviSelectTooltip">
              <template v-slot:button>{{$t('indicators.mviFilters.mvi')}}</template>
            </info-hover-tooltip>
          </v-tab>
          <v-tab :value="1" @change="setPreset('EVI')">
            <info-hover-tooltip :bottom="true" contentName="eviSelectTooltip">
              <template v-slot:button>{{$t('indicators.mviFilters.evi')}}</template>
            </info-hover-tooltip>
          </v-tab>
          <v-tab :value="2">{{$t('indicators.mviFilters.custom')}}</v-tab>
        </v-tabs>
      </v-col>
      <v-col class="flex-grow-0 d-md-none">
        <v-btn
            class="d-block dense "
            icon
            @click="$emit('close')"
            color="primary"
          >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card flat>
      <v-list dense v-for="indicatorCatery in catIndicators"
        :key="indicatorCatery.category"
        class="pt-0 pb-0"
        flat
      >
      <v-subheader :style="'background-color:'+indicatorCatery.color" class="block-subheader pl-4">{{$t('indicators.mvi.'+indicatorCatery.category)}}</v-subheader>
      <v-list-item
      class="mvi-indi-list_item"
        dense
        v-for="indicator in indicatorCatery.indicators"
        :key="indicator.name"
      >
        <div class="list-item-container">
          <v-list-item-action>
            <v-checkbox
              class="undp-checkbox"
              :input-value="mviCodes"
              :value="indicator.code"
              @change="updateValue"
              :ripple="false"
            ></v-checkbox>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{$t('indicators.mvi.'+indicator.code.replaceAll('.','-'))}}</v-list-item-title>
          </v-list-item-content>
        </div>
      </v-list-item>
    </v-list>
    </v-card>
  </div>
</template>
<script>

import { mviIndicators, mviPreset, eviPreset } from '@/assets/goalsList'
import InfoHoverTooltip from '@/components/InfoHoverTooltip';

export default {
  name: 'MBIIndicatorsNav',
  props:['mviCodes'],
  components:{
    InfoHoverTooltip
  },
  data() {
    return {
      catIndicators:mviIndicators,
      MVI:mviPreset,
      EVI:eviPreset
    }
  },
  computed: {
    activePreset() {
      if(this.mviCodes.length === 11) {
        return 0;
      }
      if (this.mviCodes.length === 8 && this.mviCodes.every(code => this.EVI.includes(code))) {
        return 1;
      }
      return 2;
    }
  },
  methods:{
    updateValue(value) {
      this.emitValue(value)
    },
    emitValue(value) {
      return this.$emit('MviIndicatorsChange', value)
    },
    setPreset(presetName) {
      this.emitValue(this[presetName]);
    }
  }
}
</script>

<style>
.mvi-nav-tabs .v-tab {
  padding: 8px !important;
  min-width: 40px;
}
.mvi-indicators-nav .v-list-item__action {
  margin: 0 !important;
}
.mvi-indicators-nav .nav-row {
  max-width: 100%;
}
.mvi-indi-list_item {
  min-height: 38px !important;
  padding: 0 14px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #000000;
}
.mvi-indicators-nav .list-item-container{
  border-bottom: 1px solid #D4D6D8;
  display: flex;
  padding: 10px 0;
  width: 100%;
}
.mvi-indicators-nav .v-subheader{
  height: 50px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px !important;
  text-transform: uppercase; 
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #000000;
}

</style>
