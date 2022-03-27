<template>
  <div class="navigation-container">
    <v-list
      class="main-menu-desktop main-menu"
      ref="stickyMenuContainer"
      dense>
        <div
          class="border-wrapper"
          ref="stickyMenu"
          :class="{ 'border-wrapper-fixed': offset }">
          <v-list-item
            class="menu-item"
            v-for="route in routes"
            :key="route.link"
            :to="route.link"
          >
            <v-list-item-content>
              <v-list-item-title
                class="menu-item_text"
                v-text="route.name">
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
    </v-list>
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
          return !route.desctopOnly && route.path!=='*'
        }
        return route.path!=='*'
      } )
    },
  },
  methods: {
    handleScroll () {
      let containerOffset = this.$refs.stickyMenuContainer.$el.getBoundingClientRect().top;
      if(containerOffset < 0 ) {
        this.offset = true;
      } else {
        this.offset = false;
      }
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
.main-menu {
  height: 100%;
  padding-top: 20vh;
  text-transform: uppercase;
  text-align: right;
}
.main-menu-desktop {
  background: transparent !important;
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
}
.navigation-menu-drawer {
  height: 100vh !important;
}
.menu-item{
  height: 50px;
  padding-right: 24px;
}
.menu-item .menu-item_text {
  font-size: 14px !important;
  letter-spacing: 1px;
  color: rgba(0,0,0,.54);
  font-weight: 500;
  white-space: normal;
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
.menu-item.v-list-item--active {
  padding-right: 21px;
  border-right: 3px solid #ED462F;
}
.border-wrapper {
  padding-bottom: 10px;
  padding-top: 10px;
  border-right: 1px solid rgba(10, 11, 49, 0.2) !important;
  /* transition: top 300ms linear */
}
.border-wrapper-fixed {
  position: fixed;
  top:20vh;
  max-width: 16.6666666667%;
}
.menu-item.v-list-item--active .menu-item_text {
  color: #E21549;
}
</style>
