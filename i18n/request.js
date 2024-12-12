import { getRequestConfig } from 'next-intl/server';
import { getUserLocale } from '../services/locale';
import { defaultLocale } from '../i18n/config';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  let messages;
  try {
    messages = (await import(`./../lang/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`./../lang/${defaultLocale}.json`)).default;
  }

  return {
    locale,
    messages: messages
  };
});