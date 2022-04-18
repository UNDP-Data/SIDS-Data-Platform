<template>
  <div class="mvi-indicators-nav">
    <v-row class="nav-row">
      <v-col>
        <v-tabs
          :value="activePreset"
          grow
          class="mb-2 mvi-nav-tabs tabs tabs-small"
        >
          <v-tab :value="0" @change="setPreset('MVI')">
            <info-hover-tooltip :bottom="true" contentName="mviSelectTooltip">
              <template v-slot:button>MVI</template>
            </info-hover-tooltip>
          </v-tab>
          <v-tab :value="1" @change="setPreset('EVI')">
            <info-hover-tooltip :bottom="true" contentName="eviSelectTooltip">
              <template v-slot:button>EVI</template>
            </info-hover-tooltip>
          </v-tab>
          <v-tab :value="2">Custom</v-tab>
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
        flat
      >
      <v-subheader :style="'background-color:'+indicatorCatery.color" class="block-subheader">{{indicatorCatery.category}}</v-subheader>
      <v-list-item dense
        v-for="indicator in indicatorCatery.indicators"
        :key="indicator.name"
      >
        <v-list-item-action>
          <v-checkbox
            :input-value="mviCodes"
            :value="indicator.code"
            @change="updateValue"
            :ripple="false"
          ></v-checkbox>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{indicator.name}}</v-list-item-title>
        </v-list-item-content>
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
</style>
