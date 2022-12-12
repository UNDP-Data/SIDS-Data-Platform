<template>
  <v-card flat class="overflow background-grey">
    <v-row dense>
      <v-col class="printing-4" cols="7" md="4">
        <v-subheader class="d-none d-md-block info-bar_header block-header">{{$t('countryNames.'+id)}}</v-subheader>
        <v-list dense class="indicators-list background-grey">
          <v-list-item v-if="checkIndicator('key-sids-region')">
            <v-list-item-content class="small-padding">
              <v-list-item-title
                class="one-line_header"
                v-text="$t('countryProfile.infoBox.key-sids-region')"
              ></v-list-item-title>
              <v-list-item-subtitle
                class="one-line_header"
              >{{
                getIndicator('key-sids-region').value
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-countryOffice')">
            <v-list-item-content class="small-padding">
              <v-list-item-title
                class="one-line_header"
                v-text="$t('countryProfile.infoBox.key-countryOffice')"
              ></v-list-item-title>
              <v-list-item-subtitle
                class="one-line_header"
              >{{
                getIndicator('key-countryOffice').value
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="checkIndicator('key-un-member')">
            <v-list-item-content class="small-padding">
              <v-list-item-title
                class="one-line_header"
                v-text="$t('countryProfile.infoBox.key-un-member')"
              ></v-list-item-title>
              <v-list-item-subtitle
                class="one-line_header"
              >{{
                getIndicator("key-un-member").value
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <info-hover-tooltip v-if="checkIndicator('key-wdi2-SP.POP.TOTL')" :large="false">
            <template slot="content">
              <v-card flat>
                <v-card-text class="active-indicator-info">
                  {{indicatorsMetadata['key-wdi2-SP.POP.TOTL'].longDefinition}}
                  <v-divider class="mb-1 mt-1"></v-divider>
                  <b>{{$t('portfolio.year')}}:</b>
                    <template v-if="getIndicator('key-wdi2-SP.POP.TOTL').year && getIndicator('key-wdi2-SP.POP.TOTL').year!=='No Year'">
                      ({{getIndicator('key-wdi2-SP.POP.TOTL').year}})
                    </template> <template v-else>
                      {{$t('root.noData')}}
                    </template> <br/>
                  <b>{{$t('root.source')}}:</b> {{indicatorsMetadata['key-wdi2-SP.POP.TOTL'].source}} <br/>
                  <a v-if="indicatorsMetadata['key-wdi2-SP.POP.TOTL'].sourceLink !== 'No Data'" :href="indicatorsMetadata['key-wdi2-SP.POP.TOTL'].sourceLink" target="_blank">Link</a>
                </v-card-text>
              </v-card>
            </template>
            <template slot="button">
              <v-list-item>
                <v-list-item-content class="small-padding">
                  <v-list-item-title class="one-line_header" v-text="$t('countryProfile.infoBox.key-wdi2-SP-POP-TOTL')"></v-list-item-title>
                  <v-list-item-subtitle
                    class="one-line_header">{{checkNoDataIndicator('key-wdi2-SP.POP.TOTL')}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </info-hover-tooltip>
          <v-list-item v-if="checkIndicator('key-language')">
            <v-list-item-content class="small-padding">
              <v-list-item-title
                class="one-line_header"
                v-text="$t('countryProfile.infoBox.key-language')"
              ></v-list-item-title>
              <v-list-item-subtitle
                class="one-line_header">{{
                getIndicator("key-language").value
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <info-hover-tooltip v-if="checkIndicator('key-wdi-AG.SRF.TOTL.K2')" :large="false">
            <template slot="content">
              <v-card flat>
                <v-card-text class="active-indicator-info">
                  {{indicatorsMetadata['key-wdi-AG.SRF.TOTL.K2'].longDefinition}}
                  <v-divider class="mb-1 mt-1"></v-divider>
                  <b>{{$t('portfolio.year')}}:</b>
                    <template v-if="getIndicator('key-wdi-AG.SRF.TOTL.K2').year && getIndicator('key-wdi-AG.SRF.TOTL.K2').year!=='No Year'">
                      ({{getIndicator('key-wdi-AG.SRF.TOTL.K2').year}})
                    </template> <template v-else>
                      {{$t('root.noData')}}
                    </template> <br/>
                  <b>{{$t('root.source')}}:</b> {{indicatorsMetadata['key-wdi-AG.SRF.TOTL.K2'].source}} <br/>
                  <a v-if="indicatorsMetadata['key-wdi-AG.SRF.TOTL.K2'].sourceLink !== 'No Data'" :href="indicatorsMetadata['key-wdi-AG.SRF.TOTL.K2'].sourceLink" target="_blank">Link</a>
                </v-card-text>
              </v-card>
            </template>
            <template slot="button">
              <v-list-item>
                <v-list-item-content class="small-padding">
                  <v-list-item-title class="one-line_header" v-text="$t('countryProfile.infoBox.key-wdi-AG-SRF-TOTL-K2')"></v-list-item-title>
                  <v-list-item-subtitle
                    class="one-line_header">{{checkNoDataIndicator('key-wdi-AG.SRF.TOTL.K2')}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </info-hover-tooltip>
          <v-list-item v-if="checkIndicator('key-incomeClass')">
            <v-list-item-content class="small-padding">
              <v-list-item-title
                class="one-line_header"
                v-text="$t('countryProfile.infoBox.key-incomeClass')"
              ></v-list-item-title>
              <v-list-item-subtitle
                class="one-line_header">{{
                computeIncome(getIndicator("key-incomeClass").value)
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <info-hover-tooltip v-if="checkIndicator('key-hdr-hdi')" :large="false">
            <template slot="content">
              <v-card flat>
                <v-card-text class="active-indicator-info">
                  {{indicatorsMetadata['key-hdr-hdi'].longDefinition}}
                  <v-divider class="mb-1 mt-1"></v-divider>
                  <b>{{$t('portfolio.year')}}:</b>
                    <template v-if="getIndicator('key-hdr-hdi').year && getIndicator('key-hdr-hdi').year!=='No Year'">
                      ({{getIndicator('key-hdr-hdi').year}})
                    </template> <template v-else>
                      {{$t('root.noData')}}
                    </template> <br/>
                  <b>{{$t('root.source')}}:</b> {{indicatorsMetadata['key-hdr-hdi'].source}} <br/>
                  <a v-if="indicatorsMetadata['key-hdr-hdi'].sourceLink !== 'No Data'" :href="indicatorsMetadata['key-hdr-hdi'].sourceLink" target="_blank">Link</a>
                </v-card-text>
              </v-card>
            </template>
            <template slot="button">
              <v-list-item>
                <v-list-item-content class="small-padding">
                  <v-list-item-title class="one-line_header" v-text="$t('countryProfile.infoBox.key-hdr-hdi')"></v-list-item-title>
                  <v-list-item-subtitle
                    class="one-line_header">{{computeHDI(getIndicator("key-hdr-hdi").value)}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </info-hover-tooltip>
          <info-hover-tooltip v-if="checkIndicator('key-wdi2-SI.POV.GINI')" :large="false">
            <template slot="content">
              <v-card flat>
                <v-card-text class="active-indicator-info">
                  {{indicatorsMetadata['key-wdi2-SI.POV.GINI'].longDefinition}}
                  <v-divider class="mb-1 mt-1"></v-divider>
                  <b>{{$t('portfolio.year')}}:</b>
                    <template v-if="getIndicator('key-wdi2-SI.POV.GINI').year && getIndicator('key-wdi2-SI.POV.GINI').year!=='No Year'">
                      ({{getIndicator('key-wdi2-SI.POV.GINI').year}})
                    </template> <template v-else>
                      {{$t('root.noData')}}
                    </template> <br/>
                  <b>{{$t('root.source')}}:</b> {{indicatorsMetadata['key-wdi2-SI.POV.GINI'].source}} <br/>
                  <a v-if="indicatorsMetadata['key-wdi2-SI.POV.GINI'].sourceLink !== 'No Data'" :href="indicatorsMetadata['key-wdi2-SI.POV.GINI'].sourceLink" target="_blank">Link</a>
                </v-card-text>
              </v-card>
            </template>
            <template slot="button">
              <v-list-item>
                <v-list-item-content class="small-padding">
                  <v-list-item-title class="one-line_header" v-text="$t('countryProfile.infoBox.key-wdi2-SI-POV-GINI')"></v-list-item-title>
                  <v-list-item-subtitle
                    class="one-line_header">{{getIndicator("key-wdi2-SI.POV.GINI").value}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </info-hover-tooltip>
          <v-list-item v-if="checkIndicator('key-undpPage')">
            <v-list-item-content class="small-padding">
              <v-list-item-title class="one-line_header">
                <a :href="getIndicator('key-undpPage').value" target="_blank">
                  {{ $t('countryProfile.infoBox.key-undpPage') }}
                </a>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col class="p-0 d-flex align-center printing-4" md="4" cols="5">
        <v-img
          eager
          class="bg-printable"
          contain
          :src="require(`@/assets/media/profiles-maps/${id}.png`)"
          height="250"
        />
      </v-col>
      <v-col class="p-0 align-center d-none d-block-print d-md-block printing-4" cols="4">
        <v-img
          eager
          class="bg-printable"
          cover
          :src="require(`@/assets/media/country-photos/${id}.jpg`)"
          height="100%"
        ></v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import format from "@/mixins/format.mixin";
import { mapState } from "vuex";
import InfoHoverTooltip from '@/components/InfoHoverTooltip.vue'

export default {
  name: "CountryInfoBar",
  props: ["profile", "id", "name"],
  components:{
    InfoHoverTooltip
  },
  mixins: [format],
  computed: {
    ...mapState({
      indicatorsMetadata: (state) => state.profiles.indicatorsMetadata,
    }),
  },
  methods: {
    computeIncome(income) {
      if (income === "Lower-middle income") {
        return this.$t('countryProfile.infoBox.incomeLowMiddle')
      } else if (income === "High income") {
        return this.$t('countryProfile.infoBox.incomeHigh')
      } else if (income === "Upper-middle income") {
        return this.$t('countryProfile.infoBox.incomeUpMiddle')
      }
    },
    computeHDI(hdi) {
      let hdiNum = parseFloat(hdi),
        hdiClass = "No data";
      if (hdi >= 0.8) {
        hdiClass = this.$t('countryProfile.infoBox.hdiVHigh');
      } else if (hdi >= 0.7) {
        hdiClass = this.$t('countryProfile.infoBox.hdiHigh');
      } else if (hdi >= 0.55) {
        hdiClass = this.$t('countryProfile.infoBox.hdiMedium');
      } else if (hdi > 0) {
        hdiClass = this.$t('countryProfile.infoBox.hdiLow');
      } else {
        hdiClass =  this.$t('root.noData');
        hdiNum =  this.$t('root.noData');
      }
      return `${hdiNum}, ${hdiClass}`;
    },
    getIndicator(code) {
      return this.profile.find((indicators) => indicators.axis === code)
    },
    checkIndicator(code) {
      let indi = this.profile.find((indicators) => indicators.axis === code)
      return indi && indi.value;
    },
    checkNoData(code) {
      return this.getIndicator(code).value === 'No Data' ?
      false : true;
    },
    checkNoDataIndicator(code) {
      if(this.getIndicator(code) && this.getIndicator(code).value) {
        return this.getIndicator(code).value === 'No Data' ?
        this.getIndicator(code).value : this.nFormatter(this.getIndicator(code).value)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indicators-list .one-line {
  flex-wrap: nowrap;
  padding: 4px 0;
}
.indicators-list .v-list-item {
  min-height: 25px;
}
.overflow {
  overflow: hidden;
}
.info-bar_header {
  padding-top: 10px;
}
.info-bar_map {
  max-height: 230px;
  max-width: 94%;
  margin: auto;
}
.small-padding {
  padding: 4px 0 !important;
}
</style>
