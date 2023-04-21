<template>
  <component :is="currentTemplate">
      <router-view></router-view>
  </component>
</template>

<script>
import PlatformPages from "@/views/PlatformPages.vue";
import Homepage from "@/views/Homepage/Homepage.vue";

export default {
  name: "Root",
  components: {
    PlatformPages,
    Homepage,
  },
  data() {
    return {}
  },
  computed: {
    currentTemplate(){
        return this.$route.meta.template
     }
  },
  methods: {
    // handleScroll () {
    //   if(window.scrollY > document.getElementById('headerElement').offsetHeight - 32) {
    //     window.removeEventListener('scroll', this.handleScroll);
    //     this.scrolledToContent = true
    //   }
    // }
  },
  // created () {
  //   window.addEventListener('scroll', this.handleScroll);
  // },
};
</script>
<style>
@import './assets/styles/RootStyles.css';
@import './assets/styles/styles.css';

</style>
