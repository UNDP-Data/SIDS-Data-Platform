<template>
  <v-container class="about-block">
    <v-row class="d-none d-md-flex mt-0" justify="center">
      <v-col cols="12">
        <h2 class="about-block_header text-center pt-5 pb-8">{{$t('about.header')}}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="7" xs="12" sm="12" class="offset-lg-1">
        <v-expansion-panels v-model="panel" class="mb-4" flat accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatSids')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                <a href="http://unohrlls.org/about-sids/" target="_blank">{{$t('about.whatSidsContent[0]')}}</a> {{$t('about.whatSidsContent[1]')}}
              </p>
              <p>
                {{$t('about.whatSidsContent[2]')}}
              </p>
              <p>
                {{$t('about.whatSidsContent[3]')}}
              </p>
              <p>
                {{$t('about.whatSidsContent[4]')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatOffer')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                {{$t('about.whatOfferContent[0]')}}
                <a href="https://www.sparkblue.org/dashboard/small-island-developing-states" target="_blank">
                  <b>{{$t('about.whatOfferContent[1]')}}</b>
                </a>
                  {{$t('about.whatOfferContent[2]')}}
              </p>
              <p>
                <b>{{$t('about.whatOfferContent[3]')}}</b>
                {{$t('about.whatOfferContent[4]')}}
              </p>
              <p>
                <b>{{$t('about.whatOfferContent[5]')}}</b>
                {{$t('about.whatOfferContent[6]')}}
              </p>
              <p>
                <b>{{$t('about.whatOfferContent[7]')}}</b>
                {{$t('about.whatOfferContent[8]')}}
              </p>
              <p>
                <b>{{$t('about.whatOfferContent[9]')}}</b>
                {{$t('about.whatOfferContent[10]')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatPlatform')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                {{$t('about.whatPlatformContent')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatSources')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                {{$t('about.whatSourcesContent')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatFuture')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                {{$t('about.whatFutureContent')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel class="last-panel">
            <v-expansion-panel-header>{{$t('about.whatContact')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                {{$t('about.whatContactContent[0]')}}
                <a href="https://www.sparkblue.org/dashboard/small-island-developing-states" target="_blank">
                  {{$t('about.whatContactContent[1]')}}</a>.
              </p>
              <p>
                {{$t('about.whatContactContent[2]')}}<br/>
                <i>{{$t('about.whatContactContent[3]')}}</i> – <i>{{$t('about.whatContactContent[4]')}}</i><br/>
              </p>
              <p>
                {{$t('about.whatContactContent[5]')}}<br/>
                <i>{{$t('about.whatContactContent[6]')}}</i><br/>
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <subscribe/>
      </v-col>

      <v-col class="d-none d-md-block offset-lg-1" md="3">
        <template v-for="(resource, index) in resources">
          <resource :key="index" :resource="resource" />
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';
import Resource from './children/Resource';
import subscribe from './children/subscribe.vue';


export default {
  name: 'Portfolio',
  data() {
    return {
      panel:0,
      resources: []
    }
  },
  components:{
    Resource,
    subscribe
  },
  computed: {
  },
  async created() {
   let resp = await axios.get(process.env.VUE_APP_API_PATH+'/data/cms/resources.json');
   this.resources = resp.data.additionalResources;
  }
}
</script>
<style>
  .about-block_header{
    font-weight: 600;
    font-size: 35px;
    line-height: 114.2%;
  }
  .text-field {
    width: 100%
  }
  .last-panel{
    border-bottom: 1px solid #A9B1B7 !important;
  }
  .about-block {
    min-height: 100vh;
  }
  .about-block .v-expansion-panel-header {
    font-weight: 400;
    font-size: 25px;
    line-height: 114.2%;
    color: #000000;
    padding: 20px 0 24px;
  }
  .about-block .v-expansion-panel-content {
    font-weight: 400;
    font-size: 20px;
    line-height: 137.5%;
    color: #000000;
    padding: 25px 20px 20px 20px;
  }
  .about-block .v-expansion-panel-content a b {
    font-weight: 400;
  }
  .about-block .v-expansion-panel::after {
    border-top: 1px solid #A9B1B7 !important;
  }
  .about-block a {
    text-decoration: none;
    border-bottom: 1px solid #000;
    color: #000000 !important;
  }
  .v-expansion-panels {
    margin-bottom: 45px;
  }
  .v-icon.mdi-chevron-down.theme--light{
    display: none;
  }
  .v-expansion-panel-header__icon:after {
    transform: translateY(-50%);
    transition: all 200ms ease-in-out;
    background: url(https://design.undp.org/static/media/chevron-down.16c97a3f.svg) no-repeat center center;
    content: "";
    float: right;
    height: 13px;
    position: absolute;
    pointer-events: none;
    right: 5px;
    top: 50%;
    width: 20px;
  }
  .v-expansion-panel-header--active .v-expansion-panel-header__icon:after{
    transform: rotate(180deg);
  }
</style>
