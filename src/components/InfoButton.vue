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
        small
        :block="!isSmall"
        outlined
        rounded
        :icon="isSmall"
        v-bind="attrs"
        v-on="on"
        @click='toggleTooltip'
      >
        <span v-if="!isSmall">About this</span>
        <v-icon v-else>mdi-information-variant</v-icon>
      </v-btn>
    </template>
    <template>
      <v-card>
        <v-toolbar
        >
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="toggleTooltip"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
        <v-card-text>
          <slot name="content"></slot>
        </v-card-text>
        <v-card-actions class="justify-end">
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  name: 'InfoButton',
  data() {
    return {
      dialog: false
    }
  },
  computed:{
    isFullscreen() {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm
    },
    isSmall() {
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
