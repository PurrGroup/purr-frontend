import { createI18n } from 'vue-i18n';
import elementLangEn from 'element-plus/lib/locale/lang/en';
import elementLangZhCn from 'element-plus/lib/locale/lang/zh-cn';

import localeLangEn from './lang/en';
import localeLangZhCn from './lang/zh-cn';

const messages = {
  'zh-cn': {
    ...localeLangZhCn,
    ...elementLangZhCn
  },
  en: {
    ...localeLangEn,
    ...elementLangEn
  }
};

const i18n = createI18n({
  locale: window.localStorage.getItem('lang') || 'zh-cn',
  messages
});

export default i18n;
