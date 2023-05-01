<template>
  <v-menu
    eager
    transition="none"
    open-delay="200"
    :max-width="maxWidth"
    close-delay="200"
    open-on-hover
    allow-overflow
    :max-height="maxHeight"
    :top="bottom ? false : true"
    :bottom="bottom ? true : false"
    :attach="attach"
    :nudge-top="bottom ? 0 : 100"
    :nudge-bottom="bottom ? 50 : 0"
    :content-class="'tooltip-content ' + contentClass"
    >
      <template v-slot:activator="{ on, attrs }">
        <div
          v-if="hasButtonSlot"
          v-bind="attrs"
          v-on="on">
          <slot  name="button"
          ></slot>
        </div>
        <v-icon
          v-else
          v-bind="attrs"
          :disabled="disabled"
          v-on="on"
          color="#4F95DD"
        >
          mdi-information
        </v-icon>
      </template>
      <div v-if="hasContentSlot">
          <slot name="content"></slot>
      </div>
      <v-card v-else>
        <v-card-title><slot v-if="hasIconSlot" name="icon"></slot>{{textContentTitle}}</v-card-title>
        <v-card-text v-html="textContentText">
        </v-card-text>
      </v-card>
    </v-menu>
</template>

<script>
import size from '@/mixins/size.mixin';

export default {
  name: 'InfoHoverTooltip',
  props:['contentName', 'large', 'noMaxHeight', 'disabled', 'contentClass', 'bottom', 'attach'],
  mixins:[size],
  computed: {
    textContentTitle() {
      return this.$t('tooltips.'+this.contentName + '.title')
    },
    textContentText() {
      return this.$t('tooltips.'+this.contentName + '.content')
    },
    hasContentSlot() {
      return this.$slots['content']
    },
    hasButtonSlot() {
      return this.$slots['button']
    },
    hasIconSlot() {
      return this.$slots['icon']
    },
    maxWidth() {
      return this.isMobile ? '95%' : '800px'
    },
    maxHeight() {
      return this.isMobile && !this.noMaxHeight ? '60%' : 'auto'
    }
  }
}
</script>

<style scoped>
.mdi-information{
  font-size: 32px;
}
.tooltip-content{
  color: #000;
}
</style>
