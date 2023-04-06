<template>
  <div class="navigation-container-mobile">
    <header class="mobile-header d-flex d-none-lg align-center justify-space-between pr-3 pl-2 pb-2 pt-2">
      <div class="language-selector-container">
        <language-selector-mobile/>
      </div>
      <h1 class="mr-2 ml-0">{{header}}</h1>
      <info-button class="ml-a" v-if="infoContent" :contentName="infoContent"/>
      <div v-else class="spacer-block">

      </div>
    </header>
  </div>
</template>

<script>

import InfoButton from '@/components/InfoButton';
import LanguageSelectorMobile from '@/components/LanguageSelectorMobile';

export default {
  name: 'NavHeaderMobile',
  data(){
    return {
      drawer: false
    }
  },
  components:{
    InfoButton,
    LanguageSelectorMobile
  },
  computed: {
    header() {
      return this.$t(this.$route.meta.header) || 'SIDS Data Platform'
    },
    infoContent() {
      return this.$route.meta.infoContent
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navigation-container-mobile {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 999999;
  background-color: #f4f5f8;
  max-height: 70px;
}
.mobile-header {
  text-align: center;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
}
.spacer-block{
  width: 56px;
}
.language-selector-container {
  max-width: 80px;
}
</style>
