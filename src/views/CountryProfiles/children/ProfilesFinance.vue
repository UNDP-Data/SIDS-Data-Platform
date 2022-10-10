<template>
  <div>
      <v-subheader class="finance-header block-subheader">Finance</v-subheader>
      <v-card flat class="overflow background-grey">
          <v-list dense class="indicators-list background-grey"
          >
            <v-list-item v-for="(indicator) in financeData" :key="indicator.axis">
              <v-list-item-content class="one-line">
                <div class="one-line_header">
                    <info-hover-tooltip :large="false">
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
                    </info-hover-tooltip>
                </div>
                <v-list-item-title class="one-line_header">
                  {{$t(`finance.${indicator.axis.replaceAll('.','-')}`)}}
                </v-list-item-title>
                <v-list-item-subtitle class="one-line_subheader">{{formatNumber(indicator.value)}}
                  <template v-if="indicator.year && indicator.year!=='No Year'">
                    ({{indicator.year}})
                  </template>
                </v-list-item-subtitle>
              </v-list-item-content>
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
.indicators-list .one-line {
  padding: 4px 0;
}
.indicators-list .v-list-item {
  min-height: 25px;
}
.finance-header {
  color: #0018a0;
  justify-content: center;
  align-items: flex-start;
}
.one-line_subheader{
  flex-basis: auto;
}
</style>
