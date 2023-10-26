<template>
  <div class="navigation-container"
    ref="stickyMenuContainer">
    <div
      class="d-flex sticky-menu-container flex-column"
      :class="{ 'border-wrapper-fixed': offset }"
    >
      <a href="/" class="nav-logo-block pa-4 mt-0">
        <div
          style='margin: 0; display: flex; align-items: center; gap: 1rem; width: 100%;'
        >
          <a href='./'>
            <img alt='undp logo' src="@/assets/media/undp-logo-blue.svg" style='width: 72px;' />
          </a>
          <p class='undp-typography margin-bottom-00' style="color: var(--black); font-size: 1.25rem;">
            Rising Up
            <br />
            For SIDS
          </p>
        </div>
      </a>
      <v-list
        class="main-menu-desktop main-menu mt-10"
        dense>
          <div
            class="border-wrapper">
            <v-list-item
              class="menu-item"
              @click="emitDrawerClose"
              v-for="route in routes"
              :key="route.link"
              :to="route.link"
              style="padding: 0;"
            >
              <v-list-item-content style="padding: 0;">
                <v-list-item-title
                  class="menu-item_text"
                  v-text="$t('navigation.' + route.meta.linkText)">
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
      </v-list>
    </div>
  </div>
</template>

<script>
import sizeMixin from '@/mixins/size.mixin';

export default {
  name: 'NavMenu',
  mixins:[sizeMixin],
  props:{
    allowScroll: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      offset: 0
    }
  },
  computed: {
    routes () {
      return this.$router.options.routes.filter( route => {
        if(this.isMobile) {
          return !route.desctopOnly && route.path!=='*' && route.name!=='Homepage'
        }
        return route.path!=='*' && route.name!=='Homepage'
      } )
    },
  },
  methods: {
    handleScroll () {
      let containerOffset = this.$refs.stickyMenuContainer.getBoundingClientRect().top;
      if(containerOffset < 0 ) {
        this.offset = true;
      } else {
        this.offset = false;
      }
    },
    emitDrawerClose(){
      this.$emit('drawerClose')
    }
  },
  created () {
    if(this.allowScroll) {
      window.addEventListener('scroll', this.handleScroll);
    }
  },
  destroyed () {
    if(this.allowScroll) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.menu-item_text {
  flex: 1 1 100%;
  overflow: visible;
  white-space: normal;
  line-height: .9rem;
}
.main-menu {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.15;
  text-transform: uppercase;
}
.main-menu-desktop {
  background: transparent !important;
  padding: 0 0.75rem;
}
.mdl-tabs__tab-bar {
  flex-direction: column;
  height: 100%;
  border-right: 1px solid rgba(10, 11, 49, 0.2);
  border-bottom: none;

}
.mdl-tabs__tab{
  display: flex;
  width: 100%;
  height: 50px;
  margin: 0;
  justify-content: right;
  align-items: center;
  font-size: 14px;
  letter-spacing: 1px;
  text-align: right;

}
.mdl-tabs__tab.is-active {
    border-right: 3px solid #ED462F;
    color: #E21549;
}
.mdl-tabs__tab.is-active:hover {
    color: #E21549;
}
.mdl-tabs__tab:hover {
    background: rgba(158, 158, 158, 0.34);
    color: black;
}
.navigation-container {
  position: relative;
  height: 100%;
  min-height: 100vh;
}
.navigation-menu-drawer {
  height: 100vh !important;
}
.menu-item {    
  border: none;
  border-bottom: 1px solid #a9b1b7;
  display: block;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 0;
}

.menu-item:hover{
  background-color: #edeff0 !important;
}

.menu-item .menu-item_text {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.15;
  text-transform: uppercase;
  padding: 1.5rem;
}
.menu-item.v-list-item--active::before {
  opacity: 0;
}
.menu-item.v-list-item--active::before {
  opacity: 0;
}
.menu-item.v-list-item--active:hover::before {
  opacity: 0.12;
}
.menu-item.v-list-item--active .menu-item_text{
  font-weight: 700;
  color: #D12800;
}
.border-wrapper {
  padding-bottom: 10px;
  padding-top: 10px;
}
.border-wrapper-fixed {
  position: fixed;
  top:0px;
  max-width: 16.66667%
}
.menu-item.v-list-item--active .menu-item_text {
  background-color: var(--blue-600);
  color: #fff;
}
.nav-logo-block {
  width: 100%;
  text-decoration: none;
}
.nav-logo-block_image {
  max-width: 100%;
}
.sticky-menu-container {
  height: calc(100vh);
  width: 100%;
}

</style>
