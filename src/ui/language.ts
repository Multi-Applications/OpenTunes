import { LANG_LABELS, SUPPORTED_LANGS } from '../config/app.config';
import { lang, setLang, t } from '../core/i18n';
import type { LangCode } from '../types';
import { renderGenreSelect } from './dialog';
import { $ } from './dom';
import { renderGrid } from './grid';
import { renderPlayerBar } from './player-bar';

export function renderLangSelect(): void {
  const sel = $<HTMLSelectElement>('#langSelect');
  sel.innerHTML = SUPPORTED_LANGS
    .map((code) => `<option value="${code}" ${code === lang ? 'selected' : ''}>${LANG_LABELS[code]}</option>`)
    .join('');
}

export function applyStaticI18n(): void {
  document.documentElement.lang = lang;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n as string);
  });
  document.querySelectorAll<HTMLInputElement>('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder as string);
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle as string);
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria as string));
  });
}

export function initLanguage(): void {
  $('#langSelect').addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    setLang(target.value as LangCode);
    applyStaticI18n();
    renderLangSelect();
    renderGenreSelect();
    renderGrid();
    renderPlayerBar();
  });
}