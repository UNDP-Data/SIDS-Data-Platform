<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    :fullscreen="isFullscreen"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="normal"
        :small="!isSmallScreen"
        :block="!isSmallScreen"
        :fab="fab"
        :outlined="!fab"
        rounded
        :icon="isSmallScreen && !fab"
        v-bind="attrs"
        v-on="on"
        @click='toggleTooltip'
      >
        <span v-if="!isSmallScreen">About this</span>
        <v-icon v-else>mdi-information-variant</v-icon>
      </v-btn>
    </template>
    <template>
      <v-card>
        <v-card-title class="justify-space-between">
          {{textContent[contentName].title}}
          <v-btn
            color="normal"
            icon
            @click='toggleTooltip'
          >
            <v-icon >mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text v-html="textContent[contentName].content">
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>

import { mapState } from 'vuex';
export default {
  name: 'InfoButton',
  data() {
    return {
      dialog: false
    }
  },
  props:['contentName', 'fab'],
  computed: {
    ...mapState({
      textContent: (state) => state.texts.textContent
    }),
    isFullscreen() {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm
    },
    isSmallScreen() {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.md
    }
  },
  methods: {
    toggleTooltip() {
      this.dialog = !this.dialog
    }
  }
}
</script>

<style scoped>

</style>
