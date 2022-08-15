import Vue from 'vue';
import VueI18n from 'vue-i18n';
import service from '@/services';
import axios from 'axios';

Vue.use(VueI18n);
let i18n;
const loadedLanguages = []
export function initI18n() {
  let lang = localStorage.getItem('lang');
  if(!lang) {
    lang = ['en', 'pt', 'fr', 'es'].some(l => l === navigator.language.split('-')[0]) ? navigator.language.split('-')[0] : 'en'
  }
  let promise;
  if(lang !== "en") {
    promise = Promise.all([service.loadLang(lang), service.loadLang('en')])
  } else {
    promise = Promise.all([service.loadLang(lang)])
  }
  return promise.then(function([data, enData]) {
    let messages = {};
    messages[lang] = data;
    if(lang !== "en") {
      messages["en"] = enData;
    }
    i18n = new VueI18n({
      locale: lang,
      fallbackLocale: 'en',
      messages
    })

    loadedLanguages.push(lang)
    localStorage.setItem('lang', lang);
    return i18n;
  })
}
 // our default language that is preloaded

function setI18nLanguage (lang) {
  i18n.locale = lang
  localStorage.setItem('lang', lang);
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
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

export default initI18n;
