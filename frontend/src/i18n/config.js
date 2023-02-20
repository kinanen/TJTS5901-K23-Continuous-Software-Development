import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        lng:'fi',
        fallbackLng: 'en',
        debug: true,
        resources: {
            en: require('./locales/en.json'),
            fi: require('./locales/fi.json'),
            fr: require('./locales/fr.json')
        },
        ns: ['translations'],
        defaultNS: 'translations'
    });

//i18n.languages = [en, fi, fr];

export default i18n;