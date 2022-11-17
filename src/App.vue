<template>
  <v-container
    data-app
    class="v-application v-application--is-ltr"
    id="app"
    fluid
  >
    <nav-header-mobile class="d-block d-print-none d-md-none"/>
    <root-header v-if="!scrolledToContent" id="headerElement" class="d-none-print" />
    <nav-menu-mobile class="d-print-none d-md-none"/>
    <v-row no-gutters id="content">
      <root-loader v-if="loading"/>
      <v-col class="d-none d-md-block menu-col d-none-print" cols="0" md="2">
        <nav-menu />
      </v-col>
      <v-col cols="12" md="10">
        <router-view class="root-router" />
      </v-col>
    </v-row>
    <root-footer class="d-none d-md-flex d-none-print" />
    <indicators-ml-popup/>
  </v-container>
</template>
<script>
import RootHeader from "@/components/RootHeader.vue";
import RootFooter from "@/components/RootFooter.vue";
import RootLoader from "@/components/RootLoader.vue";
import indicatorsMlPopup from "@/views/DevelopmentIndicators/children/indicatorsMlPopup.vue";
import NavMenu from "@/components/NavMenu.vue";
import NavHeaderMobile from "@/components/NavHeaderMobile.vue";
import NavMenuMobile from "@/components/NavMenuMobile.vue";

import { mapState } from 'vuex';

export default {
  name: "Root",
  components: {
    RootHeader,
    RootFooter,
    RootLoader,
    NavMenu,
    indicatorsMlPopup,
    NavMenuMobile,
    NavHeaderMobile
  },
  data() {
    return {
      scrolledToContent: false
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loader.loading
    })
  },
  methods: {
    handleScroll () {
      if(window.scrollY > document.getElementById('headerElement').offsetHeight - 32) {
        window.removeEventListener('scroll', this.handleScroll);
        window.scrollTo(0,0);
        this.scrolledToContent = true
      }
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll);
  },
};
</script>
<style>
@import './assets/styles/RootStyles.css';
@import './assets/styles/buttons.css';
@import './assets/styles/text.css';
@import './assets/styles/forms.css';
@import './assets/styles/print.css';
@import './choro/vizEngine.css';

html {
  scroll-behavior: smooth;
}

#app {
  padding: 0;
  background-color: #f4f5f8;
}
#content {
  min-height: calc(100vh - 100px);
  overflow-x: hidden;
  position: relative;
}
.root-router {
  padding: 0 2em 4em;
  position: relative;
}
:focus {
  outline: none;
}
body,
.v-application {
  font-family: "Proxima Nova", sans-serif !important;
}

@media all and (max-width: 959px) {
  #content {
    min-height: calc(100vh - 32px);
  }
  .root-router {
    padding: 0 0 8em;
  }
  .menu-col {
    width: 0 !important;
  }
}
svg {
  overflow: visible !important;
}
@media (max-width:)
</style>
