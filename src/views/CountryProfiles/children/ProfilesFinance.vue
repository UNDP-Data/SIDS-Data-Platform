<template>
  <div class="finance-block">
      <v-subheader class="finance-header block-subheader">Finance</v-subheader>
      <v-card flat class="overflow">
          <v-list dense class="indicators-list"
          >
            <v-list-item v-for="(indicator) in financeData" :key="indicator.axis">
              <v-list-item-content class="one-line">
                <v-list-item-title class="one-line_header">
                  {{$t(`finance.${indicator.axis.replaceAll('.','-')}`)}}
                </v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(indicator.value)}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
      </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import format from '@/mixins/format.mixin'


export default {
  props: {
    countryId: {
      type: String,
      default: ''
    }
  },
  mixins:[format],
  computed:{
    ...mapState({
      profiles: state => state.profiles.profiles,
      indicatorsMetadata: state => state.profiles.indicatorsMetadata
    }),
    financeData() {
      return this.profiles[this.countryId].Finance
    }
  },
  methods: {
    formatNumber(number) {
      if(isNaN(parseInt(number))) {
        return number
      }
      return this.nFormatter(number,2);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.finance-block .theme--light.v-sheet{
  background-color: transparent;
}
.indicators-list .v-list-item__content{
  border-bottom: 1px solid #D4D6D8;
  padding: 10px 0;
}
.indicators-list .v-list-item {
  min-height: 25px;
}
.finance-header {
    font-weight: 700;
    font-size: 16px !important;
    line-height: 112.5%;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: #000000;
    padding-bottom: 16px;
}
.one-line_subheader{
  flex-basis: auto;
  font-weight: 700;
  font-size: 16px !important;
  line-height: 137.5%;
  color: #000000;
}
.one-line_header{
  font-weight: 400;
  font-size: 16px !important;
  line-height: 137.5%;
  color: #000000;
}
</style>
