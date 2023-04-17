<template>
  <div class="finance-block">
      <v-subheader class="finance-header block-subheader">Finance</v-subheader>
      <v-card flat class="overflow">
          <v-list dense class="indicators-list"
          >
            <v-list-item v-for="(indicator) in financeData"
              :ripple="false"
              :to="`/development-indicators/${indicator.axis}`"
              :key="indicator.axis">
                    <info-hover-tooltip :large="true">
                      <template slot="content">
                        <v-card flat>
                          <v-card-text class="active-indicator-info">
                            {{indicatorsMetadata[indicator.axis].longDefinition}}
                            <v-divider class="mb-1 mt-1"></v-divider>
                            <b>{{$t('portfolio.year')}}:</b>
                              <template v-if="indicator.year && indicator.year!=='No Year'">
                                ({{indicator.year}})
                              </template> <template v-else>
                                {{$t('root.noData')}}
                              </template> <br/>
                            <b>{{$t('root.source')}}:</b> {{indicatorsMetadata[indicator.axis].source}} <br/>
                            <a v-if="indicatorsMetadata[indicator.axis].sourceLink !== 'No Data'" :href="indicatorsMetadata[indicator.axis].sourceLink" target="_blank">Link</a>
                          </v-card-text>
                        </v-card>
                      </template>
                      <template slot="button">
                        <v-list-item-content class="one-line">
                          <v-list-item-title class="one-line_header">
                            {{$t(`finance.${indicator.axis.replaceAll('.','-')}`)}}
                          </v-list-item-title>
                          <v-list-item-subtitle class="one-line_subheader">{{formatNumber(indicator.value)}}
                            <template v-if="indicator.year && indicator.year!=='No Year'">
                              ({{indicator.year}})
                            </template>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </info-hover-tooltip>
            </v-list-item>
          </v-list>
      </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import format from '@/mixins/format.mixin'
import InfoHoverTooltip from '@/components/InfoHoverTooltip.vue'

export default {
  props: {
    countryId: {
      type: String,
      default: ''
    }
  },
  mixins:[format],
  components:{
    InfoHoverTooltip
  },
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
  border-bottom: 1.5px solid #D4D6D8;
  padding: 12px 0;
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
    padding-bottom: 10px;
    height: auto;
}
.one-line_subheader{
  flex-basis: auto;
  font-weight: 700 !important;
  font-size: 16px !important;
  line-height: 137.5%;
  color: #000000 !important;
}
.one-line_header{
  font-weight: 400;
  font-size: 16px !important;
  line-height: 137.5%;
  color: #000000;
}
</style>
