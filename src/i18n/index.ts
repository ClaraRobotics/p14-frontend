import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import th from './messages_th.json';
import en from './messages_en.json';
import mm from './messages_mm.json';
import kh from './messages_kh.json';

const DEFAULT_LANG = 'en';

export const resources = {
  th: { translation: th },
  en: { translation: en },
  mm: { translation: mm },
  kh: { translation: kh },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  debug: true,
});

export default i18n;
