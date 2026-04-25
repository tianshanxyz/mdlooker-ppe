export default {
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  messages: {
    zh: () => import('./locales/zh.json'),
    en: () => import('./locales/en.json')
  }
};