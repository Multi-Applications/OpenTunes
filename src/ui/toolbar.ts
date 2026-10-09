import { executeSearch } from '../core/api';
import { COUNTRY_CODES, GENRES } from '../config/app.config';
import { countryName, genreLabel } from '../core/i18n';
import { saveStorage } from '../core/storage';
import { state } from '../core/state';
import { $, esc } from './dom';

function chipClass(active: boolean): string {
  const base = 'flex-none rounded-full border px-4 py-2 text-[13px] font-medium transition-colors';
  return active
    ? base + ' border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-zinc-950'
    : base + ' border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-50';
}

export function renderToolbar(): void {
  const toolbar = $<HTMLDivElement>('#toolbar');

  if (state.currentView !== 'discover') {
    toolbar.classList.add('hidden');
    return;
  }
  toolbar.classList.remove('hidden');

  const countryOptions = COUNTRY_CODES
    .map((code) =>
      `<option value="${code}" ${code === state.selectedCountry ? 'selected' : ''}>${esc(countryName(code))}</option>`
    )
    .join('');

  const countrySelect = `
      <div class="relative flex-none">
        <select id="countrySelect"
                class="h-9 appearance-none rounded-full border border-gray-200 bg-white pl-3.5 pr-8 text-[13px] font-medium outline-none transition-colors focus:border-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-white">
          ${countryOptions}
        </select>
        <svg class="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400 dark:text-zinc-500"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 9l-7 7-7-7"/>
        </svg>
      </div>`;

  const genreChips = GENRES
    .map((g) => `<button type="button" class="${chipClass(g === state.selectedGenre)}" data-genre="${g}">${esc(genreLabel(g))}</button>`)
    .join('');

  toolbar.innerHTML = countrySelect + genreChips;
}

export function initToolbar(): void {
  $('#toolbar').addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const chip = target.closest<HTMLButtonElement>('.chip, [data-genre]');
    if (chip && chip.dataset.genre) {
      state.selectedGenre = chip.dataset.genre;
      executeSearch();
    }
  });

  $('#toolbar').addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    if (target.id === 'countrySelect') {
      state.selectedCountry = target.value;
      saveStorage('wr.country', state.selectedCountry);
      executeSearch();
    }
  });
}