<template>
  <v-card class="ml-loading-popup" v-if="mlModel">
    <v-card-title class="pb-2">
      AI Mode
    </v-card-title>
    <v-card-text>
      <h4>
        {{indicatorsMeta[mlModel.target].indicator}}
      </h4>
      <div class="d-flex justify-space-between">
        Elapsed time: {{elapsedTime}}
        <v-btn @click="canselAItrainig" small rounded color="error" v-if="loading">
          Cansel
        </v-btn>
        <v-btn @click="goToResults" small rounded color="primary" v-else>
          Results
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'indicatorsMlPopup',
  data(){
    return {
      currentTime: new Date().getTime()
    };
  },
  computed: {
    ...mapState({
      loading: state => state.ml.mlLoading,
      mlModel: state => state.ml.mlModel,
      indicatorsMeta: state => state.indicators.indicatorsMeta,
      mlStartTime: state => state.ml.mlStartTime,
      canselSource: state => state.ml.source
    }),
    elapsedTime() {
      let sec = Math.floor((this.currentTime - this.mlStartTime) / 1000);
      return `${Math.floor(sec/60)}:${sec%60}`
    }
  },
  methods: {
    countdown() {
      this.currentTime = new Date().getTime();
      if(this.loading) {
        setTimeout(this.countdown, 1000);
      }
    },
    canselAItrainig() {
      this.canselSource.cancel('user cancel')
    },
    goToResults() {
      this.$router.push({
        name:'Development Indicators',
        params:{
          year:this.mlModel.target_year,
          chartType:'bars',
          indicator:this.mlModel.target
        }
      })
    }
  },
  watch:{
    loading() {
      this.countdown()
    }
  },
}
</script>

<style>
.ml-loading-popup {
  position: fixed !important;
  top:50px;
  right: 50px;
  width: 300px;
  z-index: 999;
}
</style>
