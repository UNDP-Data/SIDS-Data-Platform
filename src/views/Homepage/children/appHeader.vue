<template>
  <div>
    <div class="d-none d-md-block d-lg-block d-xl-block header-bar undp-country-header flex-div" style="display: flex !important; z-index: 1000;">
      <div>
        <a href="./" style="display: flex; gap: var(--spacing-05); align-items: center; text-decoration: none;">
          <img
            height="122px"
            style="margin-bottom: -8px;"
            src="@/assets/media/undp-logo-blue.svg"
            alt="UNDP Data Futures Platform Logo">
          <p class='undp-typography margin-bottom-02' style="color: var(--black); font-size: 1.25rem; text-decoration: none; margin-top: 20px;">
            Rising Up
            <br />
            For SIDS
          </p>
        </a>
      </div>
      <language-selector class="l-selector ml-4 ml-sm-auto mr-4" style="margin: 0 !important"/>
    </div>
    <div class="header">
      <video class="header_video d-block" poster="@/assets/mediahome/header-bg.jpg" autoplay muted loop playsinline>
        <source src="@/assets/mediahome/videos/header-xl.webm" type="video/webm">
        <source src="@/assets/mediahome/videos/header-xl.mp4" type="video/mp4">
      </video>
      <main role="main" class="header-text pt-6">
        <h1 class="header-text_header header-text_header-big mt-16">{{ $t("root.header.header[0]") }}</h1>
        <h2 class="header-text_header header-text_header-small">{{$t("root.header.header[1]")}}</h2>
        <h1 class="header-text_header header-text_header-big">{{$t("root.header.header[2]")}} </h1>
        <p class="d-none d-md-block d-lg-block d-xl-block header-text_description mt-3 px-12">{{$t("root.header.description")}}</p>
        <div class="top-content_input mt-10 mb-16" id="search">
            <v-autocomplete
              class="undp-search"
              :menu-props="{
                'nudge-right':0
              }"
              :attach="'#search'"
              return-object
              :items="searchData"
              @change="selectItem"
              item-text="text"
              item-value="text"
            >
              <template slot="item" slot-scope="data">
                <div class="d-flex input_selection justify-space-between text-left">
                  {{data.item.text}}
                  <v-chip :color="getColor(data.item.type)" class="input_selection-chip">
                    {{$t('root.header.'+data.item.type)}}</v-chip>
                </div>
              </template>
              <v-btn
                variant="flat"
                class="search_button"
                slot="append"
                large
                depressed
              >
                {{$t('root.buttons.search')}}
              </v-btn>
            </v-autocomplete>
          </div>
          <a class="header_button-down d-none d-md-block" href="#content">
            <img alt="Arrow Down Icon" src="@/assets/mediahome/arrow-down.png">
          </a>
      </main>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import sidsList from '@/assets/sidsList';
  import LanguageSelector from '@/components/LanguageSelector'
  export default {
    name: 'rootHeader',
    data() {
      return {
        searchData:[]
      }
    },
    async beforeCreate() {
      let res = await axios.get(process.env.VUE_APP_API_PATH + '/data/searchDict.json');
      this.searchData = res.data;
    },
    components: {
      LanguageSelector
    },
    methods: {
      getColor(type) {
        if(type === 'indicator') {
          return 'green'
        }
        return 'blue'
      },
      selectItem(item) {
        let link = '/';
        if(item.type === 'indicator') {
          link += 'development-indicators/' + item.id + '/'
        }
        if(item.type === 'profile') {
          let id = sidsList.find(c => c.iso === item.id).id
          link += 'country-profiles/' + id + '/'
        }
        window.location.href = link;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.top-content_input {
  max-width: 650px;
  margin: auto;
  position: relative;
}
#home .theme--light.v-text-field > .v-input__control > .v-input__slot::before{
  border:0;
}
.undp-search .v-select__slot{
  border: 2px solid #FFF;
}
.undp-search .v-input__slot{
  padding: 0 !important;
}
.undp-search .v-btn__content{
  font-size: 1rem;
  letter-spacing: 0.03em;
}
.undp-search .v-input__append-inner {
  margin-top: 0px !important;
}
.undp-search .v-text-field input {
  padding: 0 10px 10px 10px !important;
  font-size: 1.1rem !important;
}
#home .v-select__slot input{
  color:#FFF !important;
  padding: 0 0 20px 15px !important;
  font-size: 1.1rem;
}
.v-text-field > .v-input__control > .v-input__slot::after{
  border: 0px !important;
  box-shadow: none !important;
}
.top-content_input .v-input__append-inner {
  margin: auto;
}
.search_button {
  background-color: #fff !important;
  color: #006EB5 !important;
  font-size: 18px;
  font-weight: 700;
  padding: 0 25 !important;
  border-radius: 0;
  height: 100%;
}
.input_selection {
  width: 100%;
}
.input_selection-chip {
  flex: 0 0 auto;
  margin-left: auto;
  color: #fff !important;
}
.header {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}
.header-bar {
  width: 100%;
  padding: 0 1.5rem;
  position: absolute;
  margin-top: 0;
  margin-bottom: 0;
  background-color: var(--white);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-bar_logo {
  width: 190px;
}
.header_video {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.header-text {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  margin-bottom: auto;
  margin-top: auto;
}
.header-text h1, .header-text h2{
  text-transform: uppercase;
}
.header-text h2{
  font-size: 16px;
}
.header-text_header {
  font-weight: 650;
  margin-top: -6px;
  font-family: var(--fontFamilyHeadings);
}
.header-text_header-big {
  font-size: 58px;
  -webkit-animation: fadein 2s;
  -moz-animation: fadein 2s;
  -ms-animation: fadein 2s;
  -o-animation: fadein 2s;
  animation: fadein 2s;
  font-family: var(--fontFamilyHeadings);
}

.header-text_header-small {
  font-size: 36px;
  -webkit-animation: fadein 3s;
  -moz-animation: fadein 3s;
  -ms-animation: fadein 3s;
  -o-animation: fadein 3s;
  animation: fadein 3s;
  font-family: var(--fontFamilyHeadings);
}

.header-text_description {
  font-weight: 400;
  font-size: 25px;
  line-height: 137.5%;
  -webkit-animation: fadein 3s;
  -moz-animation: fadein 3s;
  -ms-animation: fadein 3s;
  -o-animation: fadein 3s;
  animation: fadein 3s;
  max-width: 1000px;
  margin: 0 auto;
}
.header_button-down {
  margin: auto;
  position: relative;
  z-index: 3;
  margin-top: 0px;
  margin-bottom: 50px;
}

@media all and (max-width:600px) {
  .header-text_header-big {
    font-size: 36px;
    margin-bottom: .6em;
  }
  .header-text_header-small {
    font-size: 24px;
    margin-bottom: .6em;
  }
}
@media all and (max-width:959px) {

  .header {
    min-height: calc(100vh - 100px);
  }
}
.header-bar_logo-mobile {
  position: relative;
  width: 200px;
  max-width: 70%;
  margin: 0.5em auto 1em;
}

</style>
