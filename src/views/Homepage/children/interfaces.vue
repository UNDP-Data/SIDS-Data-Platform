<template>
  <div>
    <v-container>
      <v-row dense>
        <v-col>
          <h2 class="interfaces-header text-center pt-5 pb-5">{{$t('interfaces.header')}}</h2>
        </v-col>
      </v-row>
      <div class="d-flex flex-column flex-sm-row">
        <div class="phone-block">
          <v-card class="phone-block_card" flat>
            <v-img
              eager
              class="d-sm-none mr-auto ml-auto"
              width="42"
              src="~@/assets/mediahome/profiles.png"
            ></v-img>
            <v-card-title class="phone-block_title justify-center pr-0 pl-0 pt-0 pb-0 pb-sm-2">
              <a class="title_link" href="/country-profiles/">
                {{$t('interfaces.profiles.header')}}
              </a>
            </v-card-title>
            <a class="d-none d-sm-block" href="/country-profiles/">
              <v-img
                eager
                class="phone-image"
                width="100%"
                src="~@/assets/mediahome/profiles.jpg"
              ></v-img>
            </a>
            <v-card-text class="phone-block_text pr-0 pl-0">
              {{$t('interfaces.profiles.description')}}
            </v-card-text>
          </v-card>
        </div>
        <div class="phone-block">
          <v-card class="phone-block_card" flat>
            <v-img
              eager
              class="d-sm-none mr-auto ml-auto"
              width="42"
              src="~@/assets/mediahome/indicators.png"
            ></v-img>
            <v-card-title class="phone-block_title justify-center pr-0 pl-0 pt-0 pb-0 pb-sm-2">
              <a class="title_link" href="/development-indicators/">
                {{$t('interfaces.indicators.header')}}
              </a>
            </v-card-title>
            <a class="d-none d-sm-block" href="/development-indicators/">
              <v-img
                eager
                class="phone-image"
                width="100%"
                src="~@/assets/mediahome/indicators.jpg"
              ></v-img>
            </a>
              <v-card-text class="phone-block_text pr-0 pl-0">
                {{$t('interfaces.indicators.description')}}
              </v-card-text>
          </v-card>
        </div>
        <div class="phone-block">
          <v-card class="phone-block_card" flat>
            <v-img
              eager
              class="d-sm-none mr-auto ml-auto"
              width="42"
              src="~@/assets/mediahome/MVI.png"
            ></v-img>
            <v-card-title class="phone-block_title justify-center pr-0 pl-0 pt-0 pb-0 pb-sm-2">
              <a class="title_link" href="/vulnerability/">
                {{$t('interfaces.mvi.header')}}
              </a>
            </v-card-title>
            <a class="d-none d-sm-block" href="/vulnerability/">
              <v-img
                eager
                class="phone-image"
                width="100%"
                src="~@/assets/mediahome/mvi.jpg"
              ></v-img>
            </a>
              <v-card-text class="phone-block_text pr-0 pl-0">
                {{$t('interfaces.mvi.description')}}
              </v-card-text>
          </v-card>
        </div>
        <div class="phone-block">
          <v-card class="phone-block_card" flat>
            <v-img
              eager
              class="d-sm-none mr-auto ml-auto"
              width="42"
              src="~@/assets/mediahome/GIS.png"
            ></v-img>
            <v-card-title class="phone-block_title justify-center pr-0 pl-0 pt-0 pb-0 pb-sm-2">
              <a class="title_link" href="/geospatial-data/">
                {{$t('interfaces.gis.header')}}
              </a>
            </v-card-title>
            <a class="d-none d-sm-block" href="/geospatial-data/">
              <v-img
                eager
                class="phone-image"
                width="100%"
                src="~@/assets/mediahome/gis.jpg"
              ></v-img>
            </a>
              <v-card-text class="phone-block_text pr-0 pl-0">
                {{$t('interfaces.gis.description')}}
              </v-card-text>
          </v-card>
        </div>
        <div class="phone-block">
          <v-card class="phone-block_card" flat>
            <v-img
              eager
              class="d-sm-none mr-auto ml-auto"
              width="42"
              src="~@/assets/mediahome/portfolio.png"
            ></v-img>
            <v-card-title class="phone-block_title justify-center pr-0 pl-0 pt-0 pb-0 pb-sm-2">
              <a class="title_link" href="/portfolio/">
                {{$t('interfaces.portfolio.header')}}
              </a>
            </v-card-title>
            <a class="d-none d-sm-block" href="/portfolio/">
              <v-img
                eager
                class="phone-image"
                width="100%"
                src="~@/assets/mediahome/portfolio.jpg"
              ></v-img>
            </a>
              <v-card-text class="phone-block_text pr-0 pl-0">
                {{$t('interfaces.portfolio.description')}}
              </v-card-text>
          </v-card>
        </div>
      </div>
    </v-container>
  </div>
</template>
<script>
  export default {
    name: 'interfaces',
    data() {
      return {
      }
    }
  }
</script>
<style>
.phone-image {
  border-radius: 24px;
  overflow: hidden;
  transition:all 150ms ease-in;
  cursor: pointer;
}
.phone-image:hover {
  transform: scale(1.025);
}
.phone-block {
  width: 20%;
  padding: 10px;
  box-sizing: border-box;
}
.phone-block_card {
  background: transparent !important;
}
.phone-block_title {

  word-break: keep-all;
  font-size: 18px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: 0em;
  text-align: center;
  min-height: 64px;
  cursor: pointer;
  vertical-align: center
}
.phone-block_text{
  font-size: 16px;
  line-height: 137.5%;
  color: #000000 !important;
}
.interfaces-header{
  margin: 13px 0 30px;
  font-style: normal;
  font-weight: 600; 
  font-size: 35px;
  line-height: 114.2%;
  color: #000000;

}
.title_link {
  font-weight: 700;
  font-size: 16px;
  line-height: 112.5%;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  text-decoration: none;
  color: inherit !important;
}

  @media (max-width:639px) {
    .interfaces-header {
      font-size: 20px;
      line-height: 24px;
    }
    .top-content-chips {
      font-size: 16px;
      line-height: 20px;
      margin-bottom: 20px;
    }
    .phone-image {
      max-height: 65vh;
      margin: auto;
    }
    .phone-block {
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
    .title_link {
      font-size: 15px;
    }
  }
</style>
