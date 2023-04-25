<template>
  <v-app>
    <v-main id="home">
      <root-header/>
      <interfaces id="content"/>
      <video-block/>
      <resources/>
      <v-container><about/></v-container>
      <root-footer/>
    </v-main>
  </v-app>
</template>

<script>
import rootHeader from './children/appHeader';
import interfaces from './children/interfaces';
import videoBlock from './children/video';
import resources from './children/resources';
import About from '../About/About.vue';
import rootFooter from '@/components/RootFooter.vue';

export default {
  name: 'Homepage',

  components: {
    rootHeader,
    interfaces,
    videoBlock,
    resources,
    About,
    rootFooter
  },

  data: () => ({
    //
  }),
};
console.log('in homepage')
</script>
<style media="screen">

body, .v-application {
  font-family: "Proxima Nova", sans-serif !important;
}
#home{
  background-color: #ffffff;
}
html {
  scroll-behavior: smooth;
}
</style>
