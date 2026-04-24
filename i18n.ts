import { defineConfig } from 'next-intl/config';
 
export default defineConfig({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  messages: {
    zh: () => import('./locales/zh.json'),
    en: () => import('./locales/en.json')
  }
});