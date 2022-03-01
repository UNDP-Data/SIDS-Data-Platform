<template>
  <v-tooltip
    eager
    transition="none"
    open-delay="200"
    max-width="600"
    content-class="tooltip-content"
    allow-overflow
    bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          v-on="on"
          :large="large"
        >
          mdi-information-outline
        </v-icon>
      </template>
      <v-card>
        <v-card-title><slot name="icon"></slot>{{textContent[contentName].title}}</v-card-title>
        <v-card-text v-html="textContent[contentName].content">
        </v-card-text>
      </v-card>
    </v-tooltip>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'InfoHoverTooltip',
  props:['contentName', 'large'],
  computed: {
    ...mapState({
      textContent: (state) => state.texts.textContent
    })
  }
}
</script>

<style scoped>

</style>
