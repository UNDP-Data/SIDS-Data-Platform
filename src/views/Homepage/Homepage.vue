<template>
  <v-app>
    <v-main>
      <root-header/>
      <interfaces id="content"/>
      <video-block/>
      <resources/>
      <about/>
      <root-footer/>
    </v-main>
  </v-app>
</template>

<script>
import rootHeader from './children/appHeader';
import interfaces from './children/interfaces';
import videoBlock from './children/video';
import resources from './children/resources';
import About from './children/About/About.vue';
import rootFooter from './children/footer.vue';

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
</script>
<style media="screen">
/*@import '@/assets/font.css';
@import '@/assets/styles.css';*/

body, .v-application {
  font-family: "Proxima Nova", sans-serif !important;
  background-color: #ffffff !important;
}

html {
  scroll-behavior: smooth;
}
</style>
