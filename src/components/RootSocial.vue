<template>
  <div class="social-root d-none d-md-flex">
      <v-btn @click="fbClick" color="#4267B2" small depressed class="social-button">
        <v-icon color="#fff">mdi-facebook</v-icon>
      </v-btn>
      <v-btn @click="twClick" color="#1DA1F2" small depressed class="social-button">
        <v-icon color="#fff">mdi-twitter</v-icon>
      </v-btn>
      <v-btn @click="liClick" color="#0077b5" small depressed class="social-button">
        <v-icon color="#fff">mdi-linkedin</v-icon>
      </v-btn>
  </div>
</template>

<script>
import services from '@/services';
import sidsList from '@/assets/sidsList';
import { mapState } from 'vuex';

export default {
  name: 'RootSocial',
  data(){
    return {
      textTemplates: ''
    }
  },
  computed:{
    ...mapState({
      indicatorsMeta: state => state.indicators.indicatorsMeta
    }),
    twShareText() {
      let text = ''
      if(this.$route.path.indexOf('/portfolio') !== -1) {
        text = this.textTemplates.twitter.portfolio
      } else if(this.$route.path.indexOf('/development') !== -1) {
        text = this.textTemplates.twitter.indicators
        let indicator = this.indicatorsMeta[this.$route.params.indicator]
        if(!indicator) {
          indicator = 'SIDS'
        } else {
          indicator = indicator.indicator
        }
        text = text.replaceAll('{indicator}', indicator)
      } else if(this.$route.path.indexOf('/vulnerability') !== -1) {
        text = this.textTemplates.twitter.mvi
      } else if(this.$route.path.indexOf('/country-profiles') !== -1) {
        text = this.textTemplates.twitter.profiles
        let country = sidsList.find(c => c.id === this.$route.params.country).name
        text = text.replaceAll('{country}', country)
      } else if(this.$route.path.indexOf('/geospatial-data') !== -1) {
        text = this.textTemplates.twitter.gis;
        let layer = ''
        if (document.getElementById('gisDataset')) {
          layer = document.getElementById('gisDataset').value
        }
        if(document.getElementById('gisLayer') && document.getElementById('gisLayer').previousSibling) {
          layer = document.getElementById('gisLayer').previousSibling.innerHTML
        }
        if (layer === 'Dataset' || layer === 'Layer') {
          layer = 'SIDS'
        }
        text = text.replaceAll('{layerTitle}', layer)
      } else {
        text = this.textTemplates.twitter.general
      }
      text += this.textTemplates.all
      return text;
    },
    fbShareText() {
      let text = ''
      if(this.$route.path.indexOf('/portfolio') !== -1) {
        text = this.textTemplates.twitter.portfolio
      } else if(this.$route.path.indexOf('/development') !== -1) {
        text = this.textTemplates.twitter.indicators
        let indicator = this.indicatorsMeta[this.$route.params.indicator]
        if(!indicator) {
          indicator = 'SIDS'
        } else {
          indicator = indicator.indicator
        }
        text = text.replaceAll('{indicator}', indicator)
      } else if(this.$route.path.indexOf('/vulnerability') !== -1) {
        text = this.textTemplates.twitter.mvi
      } else if(this.$route.path.indexOf('/country-profiles') !== -1) {
        text = this.textTemplates.twitter.profiles
        let country = sidsList.find(c => c.id === this.$route.params.country).name
        text = text.replaceAll('{country}', country)
      } else if(this.$route.path.indexOf('/geospatial-data') !== -1) {
        text = this.textTemplates.twitter.gis;
        let layer = ''
        if (document.getElementById('gisDataset')) {
          layer = document.getElementById('gisDataset').value
        }
        if(document.getElementById('gisLayer') && document.getElementById('gisLayer').previousSibling) {
          layer = document.getElementById('gisLayer').previousSibling.innerHTML
        }
        if (layer === 'Dataset' || layer === 'Layer') {
          layer = 'SIDS'
        }
        text = text.replaceAll('{layerTitle}', layer)
      } else {
        text = this.textTemplates.twitter.general
      }
      text += this.textTemplates.all
      return text;
    },
    twShareLink() {
      return `https://twitter.com/share?url=${window.location.href}&text=${this.twShareText}&hashtags=RisingUpForSIDS`
    },
    fbShareLink() {
      return `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
    },
    liShareLink() {
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://data.undp.org/sids' + window.location.pathname)}`
    }
  },
  methods: {
    fbClick() {
      window.open(
        this.fbShareLink,
       'newwindow',
       'width=300,height=250');
      return false;
    },
    twClick() {
      window.open(
        this.twShareLink,
       'newwindow',
       'width=300,height=250');
      return false;
    },
    liClick() {
      window.open(
        this.liShareLink,
       'newwindow',
       'width=250,height=400');
      return false;
    }
  },
  async beforeMount() {
    this.textTemplates = await services.loadShareText();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.social-root {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-right: 0px solid #E9ECF6;
  overflow: hidden;
  z-index: 999;
}
.social-button {
  padding: 0 !important;
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  border-radius: 0!important;
  cursor: pointer !important;
  position: relative;
}
.social-button::after {
  content: '';
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  position: absolute;
  transition: all 200ms;
}
.social-button:hover::after {
  background: rgba(0, 0, 0, 0.05);
}
.social-button:first-child{
  border-top: 0px solid #E9ECF6 !important;
}
</style>
