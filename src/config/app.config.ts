import type { LangCode } from '../types';

export const API_HOSTS: string[] = ['de1', 'nl1', 'at1', 'gb1']
  .map((host) => `https://${host}.api.radio-browser.info`);

export const GENRES: string[] = [
  'all', 'pop', 'rock', 'jazz', 'classical', 'electronic',
  'news', 'hiphop', 'lounge', 'dance', 'chillout'
];

export const STATION_GENRES: string[] = [
  'pop', 'rock', 'jazz', 'classical', 'electronic',
  'news', 'hiphop', 'lounge', 'dance', 'chillout', 'other'
];

export const COUNTRY_CODES: string[] = [
  'US', 'GB', 'DE', 'FR', 'CA', 'AT', 'CH', 'IT', 'ES', 'NL', 'ALL'
];

export const SUPPORTED_LANGS: LangCode[] = ['en', 'de', 'nl', 'it', 'fr'];

export const LANG_LABELS: Record<LangCode, string> = {
  en: 'EN', de: 'DE', nl: 'NL', it: 'IT', fr: 'FR'
};