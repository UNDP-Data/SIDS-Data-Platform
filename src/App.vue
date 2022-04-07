<template>
  <v-container
    data-app
    class="v-application v-application--is-ltr"
    id="app"
    fluid
  >
    <nav-menu-mobile v-if="hasTexts" class="d-block d-md-none"/>
    <root-header v-if="!scrolledToContent" class="d-none-print" />
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
  </v-container>
</template>
<script>
import RootHeader from "@/components/RootHeader.vue";
import RootFooter from "@/components/RootFooter.vue";
import RootLoader from "@/components/RootLoader.vue";
import NavMenu from "@/components/NavMenu.vue";
import NavMenuMobile from "@/components/NavMenuMobile.vue";

import { mapState } from 'vuex';

export default {
  name: "Root",
  components: {
    RootHeader,
    RootFooter,
    RootLoader,
    NavMenu,
    NavMenuMobile
  },
  data() {
    return {
      scrolledToContent: false
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loader.loading
    }),
    hasTexts() {
      return this.$route.meta.header
    }
  },
  methods: {
    handleScroll () {
      if(window.scrollY > document.getElementById('headerElement').offsetHeight) {
        window.removeEventListener('scroll', this.handleScroll);
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
}
:focus {
  outline: none;
}
body,
.v-application {
  font-family: "Proxima Nova", sans-serif !important;
}

@media all and (max-width: 960px) {
  #content {
    min-height: calc(100vh);
  }
  .root-router {
    padding: 0 0 4em;
  }
  .menu-col {
    width: 0 !important;
  }
}
svg {
  overflow: visible !important;
}
</style>
