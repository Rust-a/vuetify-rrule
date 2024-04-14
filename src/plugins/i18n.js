import {createI18n} from 'vue-i18n'
import en from '@/locales/en.json'

function loadLocaleMessages() {
    return {
        en
    }
}

function checkDefaultLanguage() {
    let matched = null;
    let languages = Object.getOwnPropertyNames(loadLocaleMessages());
    languages.forEach(lang => {
        if (lang === navigator.language) {
            matched = lang;
        }
    });
    if (!matched) {
        languages.forEach(lang => {
            let languagePartials = navigator.language.split("-")[0];
            if (lang === languagePartials) {
                matched = lang;
            }
        });
    }
    return matched;
}


const locale = localStorage.getItem('locale')
    || checkDefaultLanguage()
    || "en";
export const selectedLocale = (locale === 'en') ? 'en' : locale;
export const languages = Object.getOwnPropertyNames(loadLocaleMessages());

const i18n = createI18n({
    partialBundledLanguages: true,
    locale: selectedLocale || "en",
    globalInjection: true,
    fallbackLocale: "en",
    messages: loadLocaleMessages()
})
export default i18n;
