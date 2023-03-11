import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';

import en from './en.json';
import ar from './ar.json';

i18n.use(initReactI18next).init({
  lng: I18nManager.isRTL ? 'ar' : 'en',
  fallbackLng: 'en',

  resources: {
    en: {translation: en},
    ar: {translation: ar},
  },
});
export default i18n;
