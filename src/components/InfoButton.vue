<template>
  <v-dialog
    v-model="dialog"
    transition="dialog-bottom-transition"
    :fullscreen="isMobile"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="normal"
        :small="isDesktop"
        :block="isDesktop"
        :outlined="isDesktop"
        rounded
        :icon="!isDesktop"
        v-bind="attrs"
        v-on="on"
        @click='toggleTooltip'
      >
        <span v-if="isDesktop">About this</span>
        <v-icon
          v-else
          v-bind="attrs"
          v-on="on"
          :large="true"
        >
          mdi-information-outline
        </v-icon>
      </v-btn>
    </template>
    <template>
      <v-card v-if="textContent">
        <v-card-title class="info-title justify-space-between">
          {{textContent[contentName].title}}
          <v-btn
            color="normal"
            icon
            @click='toggleTooltip'
          >
            <v-icon >mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="info-content" v-html="textContent[contentName].content">
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import sizeMixin from '@/mixins/size.mixin'

import { mapState } from 'vuex';
export default {
  name: 'InfoButton',
  mixins: [sizeMixin],
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
  },
  methods: {
    toggleTooltip() {
      this.dialog = !this.dialog
    }
  }
}
</script>

<style>
.info-title{
  position: relative;
  padding-bottom: 40px !important;
  background: #fff;
}
.info-title::before {
  content: '';
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  height: 4px;
  background: linear-gradient(90deg, rgba(13,177,75,1) 0%, rgba(13,177,75,1) 33%, rgba(245,130,32,1) 33%, rgba(245,130,32,1) 66%, rgba(11,198,255,1) 66%, rgba(0,212,255,1) 100%);
}
.info-title {
  position: sticky;
  top: 0;
}
</style>
