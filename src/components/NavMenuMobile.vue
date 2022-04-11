<template>
  <div class="navigation-buttons-mobile">
    <v-list
      class="main-menu-mobile"
      dense>
      <v-list-item
        class="menu-mobile-item"
        v-for="route in routes"
        :key="route.link"
        :to="route.link"
      >
        <v-list-item-content>
          <img class="menu-mobile-item_icon" :src="require(`@/assets/media/menu/${route.meta.icon}.png`)"/>
          <v-list-item-title
            class="menu-mobile-item_text"
            v-text="route.meta.icon">
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navigation-buttons-mobile {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 999999999;
}
.main-menu-mobile {
  display: flex;
  flex-direction: row;
  padding: 0 !important;
}
.menu-mobile-item {
  width: 20%;
  padding: 0 5px !important;
  margin: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.menu-mobile-item_icon {
  max-width: 26px;
  margin: 5px auto 5px;
}
.menu-mobile-item_text {
  font-weight: bold !important;
  font-size: 12px !important;
  text-transform: capitalize;
  color: #110848;
}
</style>
