<template>
  <div class="navigation-container-mobile">
    <header class="mobile-header d-flex d-none-lg align-center justify-space-between pr-3 pl-2 pb-2 pt-2">
      <div class="spacer-block">

      </div>
      <h1 class="mobile-header mr-2 ml-2">{{header}}</h1>
      <info-button class="ml-a" v-if="infoContent" :contentName="infoContent"/>
      <div v-else class="spacer-block">

      </div>
    </header>
  </div>
</template>

<script>

import InfoButton from '@/components/InfoButton';

export default {
  name: 'NavHeaderMobile',
  data(){
    return {
      drawer: false
    }
  },
  components:{
    InfoButton
  },
  computed: {
    header() {
      return this.$route.meta.header || 'SIDS Data Platform'
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
  max-height: 64px;
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
</style>
