<template>
  <div class="about-page">
    <v-row class="d-none d-md-flex mt-0" justify="center">
      <v-col cols="12">
        <h2 class="page-header">{{$t('about.header')}}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-none d-md-block" md="3">
        <template v-for="(resource, index) in resources">
          <resource :key="index+'33'" v-if="index%2 === 1" :resource="resource" />
        </template>
      </v-col>
      <v-col md="6" xs="12" sm="12">
        <v-expansion-panels v-model="expansion" class="mb-4" flat accordion>
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
          <v-expansion-panel>
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
        <v-card flat>
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <p  class="mr-auto mb-0">
                {{$t('about.fBulletin')}}
              </p>
              <v-btn
                class="mr-0 ml-2"
                color="primary"
                rounded
                target="_blank"
                href="https://undp.us4.list-manage.com/subscribe?u=cf50bc7216b0c4b063618fbac&id=c2c8d779ea"
                small
              >{{$t('root.buttons.subscribe')}}</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col class="d-none d-md-block" md="3">
        <template v-for="(resource, index) in resources">
          <resource :key="index" v-if="index%2 === 0" :resource="resource" />
        </template>
      </v-col>
      <v-col :key="index+'11'" class="d-none d-sm-block d-md-none" md="3" v-for="(resource, index) in resources">
        <template >
          <resource :resource="resource" />
        </template>
      </v-col>
      <v-col cols="12" :key="index+'22'" class="d-block d-sm-none" v-for="(resource, index) in resources">
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
   .about-page .v-expansion-panel::after {
     border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
   }
</style>
