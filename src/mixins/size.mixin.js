export default {
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm'
    },
    isDesktop() {
      return this.$vuetify.breakpoint.name === 'lg' || this.$vuetify.breakpoint.name === 'xl'
    },
    isTablet() {
      return this.$vuetify.breakpoint.name === 'md'
    },
  }
}
