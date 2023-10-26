<template>
  <div style="width: 190px;">
    <v-select
      class="undp-language-select ant-select-selector ant-select-selection-search"
      :value="activeLocale"
      :items="languages"
      item-text="name"
      item-value="id"
      @change="changeLocale"
      outlined
      hide-selected
      dense
      hide-details
    >
    </v-select>
  </div>
</template>

<script>
import { loadLanguageAsync } from '@/lang'
export default {
  name: 'LanguageSelector',
  data() {
    return {
      activeLanguage: 'en',
      languages: [{
        name: 'English',
        id:'en'
      },{
        name: 'Português',
        id:'pt'
      },{
        name: 'Français',
        id:'fr'
      },{
        name: 'Español',
        id:'es'
      }]
    };
  },
  computed: {
    activeLocale() {
      return this.$i18n.locale
    }
  },
  methods: {
    async changeLocale(locale) {
      await loadLanguageAsync(locale)
    }
  }
}
</script>

<style scoped>
</style>
