<template>
  <v-card flat class="overflow country-profile">
    <v-row>
      <v-col>
        <v-subheader class="d-none d-md-block info-bar_header">{{$t('countryNames.'+id)}}</v-subheader>
        <hr style="margin-left:16px" class="d-none d-md-block">
      </v-col>
    </v-row>
    <v-row>
      <v-col class="printing-6 mt-4" cols="12" md="6">
        <v-row>
          <v-col sm="6" md="12" lg="6">
            <v-list-item  v-if="checkIndicator('key-1')">
              <v-list-item-content class="small-padding">
                <v-list-item-title               
                  v-text="$t('countryProfile.infoBox.regionally')"
                ></v-list-item-title>
                <v-list-item-subtitle>{{
                  getIndicator("key-1").value
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item  v-if="checkIndicator('key-2')">
              <v-list-item-content class="small-padding">
                <v-list-item-title             
                  v-text="$t('countryProfile.infoBox.office')"
                ></v-list-item-title>
                <v-list-item-subtitle>{{
                  getIndicator("key-2").value
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item  v-if="checkIndicator('key-3')">
              <v-list-item-content class="small-padding">
                <v-list-item-title 
                  v-text="$t('countryProfile.infoBox.memberState')"
                ></v-list-item-title>
                <v-list-item-subtitle>{{
                  getIndicator("key-3").value
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="checkIndicator('key-wdi2-SP.POP.TOTL')">
              <v-list-item-content class="small-padding">
                <v-list-item-title v-text="$t('countryProfile.infoBox.population')"></v-list-item-title>
                <v-list-item-subtitle
                 >{{checkNoDataIndicator('key-wdi2-SP.POP.TOTL')}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="checkIndicator('key-7')">
              <v-list-item-content class="small-padding">
                <v-list-item-title              
                  v-text="$t('countryProfile.infoBox.lang')"
                ></v-list-item-title>
                <v-list-item-subtitle
                 >{{
                  getIndicator("key-7").value
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col sm="6" md="12" lg="6">
            <v-list-item v-if="checkIndicator('key-wdi-AG.SRF.TOTL.K2')">
              <v-list-item-content class="small-padding">
                <v-list-item-title v-text="$t('countryProfile.infoBox.area')"></v-list-item-title>
                <v-list-item-subtitle
                 >{{checkNoDataIndicator('key-wdi-AG.SRF.TOTL.K2')}} <span v-if="checkNoData('key-wdi-AG.SRF.TOTL.K2')">km<sup>2</sup></span></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="checkIndicator('key-10')">
              <v-list-item-content class="small-padding">
                <v-list-item-title               
                  v-text="$t('countryProfile.infoBox.income')"
                ></v-list-item-title>
                <v-list-item-subtitle
                 >{{
                  computeIncome(getIndicator("key-10").value)
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="checkIndicator('key-hdr-137506')">
              <v-list-item-content class="small-padding">
                <v-list-item-title
                  v-text="$t('countryProfile.infoBox.hdi')"
                ></v-list-item-title>
                <v-list-item-subtitle
                 >{{
                  computeHDI(getIndicator("key-hdr-137506").value)
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="checkIndicator('key-wdi2-SI.POV.GINI')">
              <v-list-item-content class="small-padding">
                <v-list-item-title                
                  v-text="$t('countryProfile.infoBox.gini')"
                ></v-list-item-title>
                <v-list-item-subtitle
                 >{{
                  getIndicator("key-wdi2-SI.POV.GINI").value
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="checkIndicator('key-13')">
              <v-btn
                variant="plain"
                class="red-arrow"
                depressed
                :href="getIndicator('key-13').value"
                target="_blank"
              >
                {{$t('countryProfile.infoBox.countryPage')}}
              </v-btn>
            </v-list-item>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="printing-6 mt-4" cols="12" md="6">
        <v-row>
          <v-col sm="12" lg="6" class="mt-0 d-flex align-center printing-12 ">
            <div class="pa-6 grey-background" style="width: 100%;">
              <v-img
              eager
              class="bg-printable"
              contain
              :src="require(`@/assets/media/profiles-maps/${id}.png`)"
              height="352"
            /> 
            </div>
          </v-col>
          <v-col sm="12" lg="6" class="mt-0 align-center d-none d-block-print d-md-block printing-12">
            <v-img
              eager
              class="bg-printable"
              cover
              :src="require(`@/assets/media/country-photos/${id}.jpg`)"
              height="400"
            ></v-img>
          </v-col>
        </v-row>
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
.overflow {
  overflow: hidden;
}
.info-bar_header {
  font-style: normal;
  font-weight: 700;
  font-size: 55px;
  padding-bottom: 18px;
}
hr{
  border: 1px solid #000000;
}

.info-bar_map {
  max-height: 230px;
  max-width: 94%;
  margin: auto;
}
.small-padding {
  padding: 4px 0 !important;
}
.country-profile .v-subheader{
  height: auto;
}
.theme--light.v-subheader {
  color: rgba(0, 0, 0, 1) !important;
}
.country-profile.theme--light.v-card{
  background-color: transparent;
}       
.country-profile .v-list-item .v-list-item__title{
  font-weight: 700;
  font-size: 16px;
  line-height: 112.5%;
  letter-spacing: 0.03em;
  text-transform: uppercase !important;
  color: #000000;
}
.country-profile .v-list-item .v-list-item__subtitle{
  font-weight: 400;
  font-size: 20px;
  line-height: 137.5%;
  color: #232E3D;
  margin-bottom: 24px;
}
.country-profile .v-list-item__title, .country-profile .v-list-item__subtitle{
  text-overflow: clip;
  white-space: normal;
}
.grey-background{
  background-color: #EDEFF0;
}
</style>
