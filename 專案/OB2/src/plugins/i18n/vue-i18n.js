import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);
let lang = localStorage.getItem('language') || 'zh_TW';
const i18n = new VueI18n({
    lazy: true,
    locale: lang,
    fallbackLocale: 'zh_TW',
    silentFallbackWarn: true,
    silentTranslationWarn: true
});

export default i18n;