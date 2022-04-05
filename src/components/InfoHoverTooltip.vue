<template>
  <v-menu
    eager
    transition="none"
    open-delay="200"
    :max-width="maxWidth"
    close-delay="200"
    open-on-hover
    content-class="tooltip-content"
    allow-overflow
    bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          :disabled="disabled"
          v-on="on"
          :large="large"
        >
          mdi-information-outline
        </v-icon>
      </template>
      <div v-if="hasContentSlot">
          <slot name="content"></slot>
      </div>
      <v-card v-else>
        <v-card-title><slot v-if="hasIconSlot" name="icon"></slot>{{textContent[contentName].title}}</v-card-title>
        <v-card-text v-html="textContent[contentName].content">
        </v-card-text>
      </v-card>
    </v-menu>
</template>

<script>
import { mapState } from 'vuex';
import size from '@/mixins/size.mixin';

export default {
  name: 'InfoHoverTooltip',
  props:['contentName', 'large', 'disabled'],
  mixins:[size],
  computed: {
    ...mapState({
      textContent: (state) => state.texts.textContent
    }),
    hasContentSlot() {
      return this.$slots['content']
    },
    hasIconSlot() {
      return this.$slots['icon']
    },
    maxWidth() {
      return this.isMobile ? '80%' : '600px'
    }
  }
}
</script>

<style scoped>

</style>
