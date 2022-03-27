<template>
  <div class="navigation-container-mobile">
    <header class="mobile-header d-flex d-none-lg align-center justify-space-between pr-3 pl-2 pb-2 pt-2">
      <button
        @click="drawer = !drawer"
        >
        <v-icon
            v-if="!drawer"
           size="48"
           color="blue darken-2"
         >
           mdi-menu
         </v-icon>
         <v-icon
             v-else
            size="48"
            color="blue darken-2"
          >
            mdi-close
          </v-icon>
      </button>
      <h1 class="mobile-header mr-2 ml-2">{{header}}</h1>
      <info-button class="ml-a" v-if="infoContent" :contentName="infoContent"/>
      <div v-else class="spacer-block">

      </div>
    </header>
    <v-navigation-drawer
      class="navigation-menu-drawer d-md-none"
      v-model="drawer"
      :app="true"
    >
      <nav-menu :allowScroll="false"/>
    </v-navigation-drawer>
  </div>
</template>

<script>

import NavMenu from '@/components/NavMenu';
import InfoButton from '@/components/InfoButton';

export default {
  name: 'NavMenuMobile',
  data(){
    return {
      drawer: false
    }
  },
  components:{
    NavMenu,
    InfoButton
  },
  computed: {
    header() {
      return this.$route.meta.header
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
  z-index: 9999;
  background-color: #f4f5f8;
  max-height: 64px;
}
.main-menu {
  height: 100%;
  padding-top: 20vh;
  text-transform: uppercase;
  text-align: right;
}
.navigation-menu-drawer {
  top: 64px !important;
}
.navigation-container {
  position: relative;
    height: 100%;
}
.mobile-header {
  text-align: center;
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
}
.spacer-block{
  width: 56px;
}
</style>
