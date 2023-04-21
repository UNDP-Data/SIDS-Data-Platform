<template>
  <div class="select">
    <v-select
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
import { loadLanguageAsync } from '@/language'
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
.select{
  background-color: #FFF;
  font-weight: 600;
  font-size: 16px;
  line-height: 112.5%;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.select .v-text-field--outlined{
  border-radius: 0;
}
.select v-select__slot{
  border: 2px solid #000000;
  padding: 24px;
}
</style>
