/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { useI18n } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import { en, hu } from 'vuetify/locale'
import en_custom from "./../locales/en.json"
import hu_custom from "./../locales/hu.json"

import { createVuetify } from 'vuetify'


const messages = {
  en: {
    ...en_custom,
    $vuetify: {
      ...en,
    },
  },
  hu: {
    ...hu_custom,
    $vuetify: {
      ...hu,
      dataIterator: {},
    },
  },
}


export const i18n = createI18n({
  legacy: false,
  locale: 'hu',
  fallbackLocale: 'en',
  messages,
})

export default createVuetify({
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  theme: {
    defaultTheme: 'light',
  },
})
