<template>
  <div class="about-page">
    <v-row class="d-none d-md-flex mt-7" justify="center">
      <v-col cols="12">
        <h2 class="undp-typography">{{$t('about.header')}}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="7" xs="12" sm="12" class="pa-10 pa-sm-10 pa-md-4">
        <v-expansion-panels class="mb-4 " flat accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatSids')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class='undp-typography'>
                <a href="http://unohrlls.org/about-sids/" target="_blank">{{$t('about.whatSidsContent[0]')}}</a> {{$t('about.whatSidsContent[1]')}}
              </p>
              <p class='undp-typography'>
                {{$t('about.whatSidsContent[2]')}}
              </p>
              <p class='undp-typography'>
                {{$t('about.whatSidsContent[3]')}}
              </p>
              <p class='undp-typography'>
                {{$t('about.whatSidsContent[4]')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatOffer')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class='undp-typography'>
                {{$t('about.whatOfferContent[0]')}}
                <a href="https://www.sparkblue.org/dashboard/small-island-developing-states" target="_blank">
                  <b>{{$t('about.whatOfferContent[1]')}}</b>
                </a>
                  {{$t('about.whatOfferContent[2]')}}
              </p>
              <p class='undp-typography'>
                <b>{{$t('about.whatOfferContent[3]')}}</b>
                {{$t('about.whatOfferContent[4]')}}
              </p>
              <p class='undp-typography'>
                <b>{{$t('about.whatOfferContent[5]')}}</b>
                {{$t('about.whatOfferContent[6]')}}
              </p>
              <p class='undp-typography'>
                <b>{{$t('about.whatOfferContent[7]')}}</b>
                {{$t('about.whatOfferContent[8]')}}
              </p>
              <p class='undp-typography'>
                <b>{{$t('about.whatOfferContent[9]')}}</b>
                {{$t('about.whatOfferContent[10]')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatPlatform')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class='undp-typography'>
                {{$t('about.whatPlatformContent')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatSources')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class='undp-typography'>
                {{$t('about.whatSourcesContent')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatFuture')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class='undp-typography'>
                {{$t('about.whatFutureContent')}}
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-divider/>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t('about.whatContact')}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class='undp-typography'>
                {{$t('about.whatContactContent[0]')}}
                <a href="https://www.sparkblue.org/dashboard/small-island-developing-states" target="_blank">
                  {{$t('about.whatContactContent[1]')}}</a>.
              </p>
              <p class='undp-typography'>
                {{$t('about.whatContactContent[2]')}}<br/>
                <i>{{$t('about.whatContactContent[3]')}}</i> – <i>{{$t('about.whatContactContent[4]')}}</i><br/>
              </p>
              <p class='undp-typography'>
                {{$t('about.whatContactContent[5]')}}<br/>
                <i>{{$t('about.whatContactContent[6]')}}</i><br/>
              </p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card flat class="subscribe-container">
          <v-card-text>
            <div class="d-flex align-center justify-center py-4">
              <h2  class="subscribe-block_header">
                {{$t('about.fBulletin')}}
              </h2>
                <v-btn
                  variant="plain"
                  depressed
                  class="undp-button button-secondary button-arrow ml-6"
                  target="_blank"
                  href="https://undp.us4.list-manage.com/subscribe?u=cf50bc7216b0c4b063618fbac&id=c2c8d779ea"
                >{{$t('root.buttons.subscribe')}}
                </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="d-none d-md-block offset-md-1" md="3" >
        <template v-for="(resource, index) in resources">
          <resource :key="index" v-if="index%2 === 0" :resource="resource" />
        </template>
        <template v-for="(resource, index) in resources">
          <resource :key="index+'33'" v-if="index%2 === 1" :resource="resource" />
        </template>
      </v-col>

      <v-col :key="index+'11'" class="d-none d-sm-block d-md-none pa-10 pa-sm-10 pa-md-0" md="3" v-for="(resource, index) in resources">
        <template >
          <resource :resource="resource" />
        </template>
      </v-col>
      <v-col cols="12" :key="index+'22'" class="d-block d-sm-none pa-10 pa-sm-10 pa-md-0" v-for="(resource, index) in resources">
        <template >
          <resource :resource="resource" />
        </template>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Resource from './children/Resource';

export default {
  name: 'Portfolio',
  data() {
    return {
      expansion:0
    }
  },
  components:{
    Resource
  },
  computed: {
    ...mapState({
      resources: state => state.texts.resources
    }),
  }
}
</script>
<style>
    .text-field {
      width: 100%
    }

  .last-panel{
    border-bottom: 1px solid #A9B1B7 !important;
  }
   .about-page .v-expansion-panel::after {
     border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
   }
   .about-page .theme--light.v-expansion-panels .v-expansion-panel{
    background-color: transparent;
  }
   .about-page {
    min-height: 100vh;
  }
  .about-page .v-expansion-panel-header {
    font-weight: 400;
    font-size: 1.3em !important;
    line-height: 114.2%;
    color: #000000;
    padding: 20px 40px 25px 0;
  }
  .about-page .v-expansion-panel-content {
    font-weight: 400;
    font-size: 20px;
    line-height: 137.5%;
    color: #000000;
    padding: 25px 20px 20px 20px;
  }
  .about-page .v-expansion-panel-content a b {
    font-weight: 400;
  }
  .about-page .v-expansion-panel::after {
    border-top: 1px solid #A9B1B7 !important;
  }
  .about-page a {
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
  .subscribe-container{
  background: #fff;
  margin-bottom: 80px;
}
.subscribe-block_header{
  font-weight: 400;
  font-size: 25px;
  line-height: 114.2%;
  display: flex;
  align-items: center;
  color: #000000;
}
.subscribe-container a {
  border-bottom:0;
  color: #fff !important;
  border-radius: 0;
}
</style>
