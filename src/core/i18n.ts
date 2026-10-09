import { SUPPORTED_LANGS } from '../config/app.config';
import { LOCALES } from '../locales';
import { loadStorage, saveStorage } from './storage';
import type { LangCode } from '../types';

function detectLang(): LangCode {
  const stored = loadStorage<string | null>('wr.lang', null);
  if (stored && (SUPPORTED_LANGS as string[]).indexOf(stored) !== -1) return stored as LangCode;
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return (SUPPORTED_LANGS as string[]).indexOf(nav) !== -1 ? (nav as LangCode) : 'en';
}

export let lang: LangCode = detectLang();

export function setLang(next: LangCode): void {
  lang = next;
  saveStorage('wr.lang', lang);
  buildRegionNames();
}

export function t(key: string): string {
  return (LOCALES[lang] && LOCALES[lang].common[key]) || LOCALES.en.common[key] || key;
}

let regionNames: Intl.DisplayNames | null = null;

function buildRegionNames(): void {
  try {
    regionNames = new Intl.DisplayNames([lang], { type: 'region' });
  } catch (e) {
    regionNames = null;
  }
}
buildRegionNames();

export function countryName(code: string): string {
  if (code === 'ALL') return t('allCountries');
  if (regionNames) {
    try {
      const name = regionNames.of(code);
      if (name) return name;
    } catch (e) {}
  }
  return code;
}

export function genreLabel(genre: string): string {
  if (genre === 'all') return t('allGenres');
  const labels = LOCALES[lang].genres;
  if (labels && labels[genre]) return labels[genre];
  return genre.charAt(0).toUpperCase() + genre.slice(1);
}