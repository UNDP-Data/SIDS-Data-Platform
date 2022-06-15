import Vue from 'vue';
import VueI18n from 'vue-i18n';
import service from '@/services';
import axios from 'axios';

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages: {}
})

const loadedLanguages = [] // our default language that is preloaded

function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang = 'en') {

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  let messages = await service.loadLang(lang)
  i18n.setLocaleMessage(lang, messages)
  console.log(i18n)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

export default i18n;
