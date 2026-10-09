import { countryName, t } from '../core/i18n';
import { audio, playStation } from '../core/player';
import { deleteStation, findStationById, getActiveStationList, isFavorite, toggleFavorite } from '../core/library';
import { state } from '../core/state';
import type { Station, ViewName } from '../types';
import { $, esc } from './dom';
import { showToast } from './toast';
import { renderToolbar } from './toolbar';

function favButtonClass(fav: boolean): string {
  const base = 'flex h-8 w-8 flex-none items-center justify-center rounded-full transition-colors';
  return fav
    ? base + ' text-red-500 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-zinc-800'
    : base + ' text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50';
}

function iconButtonClass(): string {
  return 'flex h-8 w-8 flex-none items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50';
}

function renderCard(s: Station): string {
  const isPlaying = !!state.currentStation && state.currentStation.id === s.id && !audio.paused;
  const isCurrent = !!state.currentStation && state.currentStation.id === s.id;
  const fav = isFavorite(s);
  const initial = esc(s.name.charAt(0).toUpperCase());

  const logoImg = s.logo
    ? `<img src="${esc(s.logo)}" loading="lazy" alt="" class="absolute inset-0 h-full w-full object-cover" onerror="this.remove()">`
    : '';

  const countryLabel = s.country && s.country.length === 2 ? countryName(s.country) : s.country;

  const metaInfo = [
    countryLabel,
    s.tags ? s.tags.split(',').slice(0, 2).join(', ') : '',
    s.bitrate ? s.bitrate + ' kbps' : ''
  ].filter(Boolean).join(' - ') || t('customStation');

  const cardBorder = isCurrent
    ? 'border-slate-900 dark:border-white'
    : 'border-gray-200 hover:border-gray-300 dark:border-zinc-800 dark:hover:border-zinc-700';

  const overlayClass = isCurrent
    ? 'absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45 text-white opacity-100 transition-opacity'
    : 'absolute inset-0 flex cursor-pointer items-center justify-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100';

  const overlayIcon = isPlaying
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>`;

  const equalizer = isPlaying
    ? `<span class="inline-flex h-3 flex-none items-end gap-[2px]" aria-hidden="true">
         <span class="block h-3 w-[3px] origin-bottom animate-eq-bounce rounded-[1.5px] bg-slate-900 dark:bg-white"></span>
         <span class="block h-3 w-[3px] origin-bottom animate-eq-bounce rounded-[1.5px] bg-slate-900 dark:bg-white" style="animation-delay:-0.3s"></span>
         <span class="block h-3 w-[3px] origin-bottom animate-eq-bounce rounded-[1.5px] bg-slate-900 dark:bg-white" style="animation-delay:-0.6s"></span>
       </span>`
    : '';

  return `
      <div class="group relative flex items-center gap-3.5 rounded-2xl border bg-white p-3 transition-shadow hover:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] dark:bg-zinc-900 ${cardBorder}"
           data-id="${esc(s.id)}">

        <div class="relative flex h-[58px] w-[58px] flex-none items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-xl font-bold text-gray-500 dark:bg-zinc-800 dark:text-zinc-400"
             data-action="play">
          ${initial}
          ${logoImg}
          <div class="${overlayClass}">${overlayIcon}</div>
        </div>

        <div class="min-w-0 flex-1 cursor-pointer" data-action="play">
          <div class="flex items-center gap-1.5 text-sm font-semibold">
            ${equalizer}
            <span class="truncate">${esc(s.name)}</span>
          </div>
          <div class="mt-0.5 truncate text-xs text-gray-500 dark:text-zinc-400">${esc(metaInfo)}</div>
        </div>

        <div class="flex flex-none items-center gap-1">
          <button type="button" class="${favButtonClass(fav)}" data-action="fav" title="${esc(t('favorite'))}" aria-label="${esc(t('favorite'))}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
          ${s.custom ? `
          <button type="button" class="${iconButtonClass()}" data-action="delete" title="${esc(t('delete'))}" aria-label="${esc(t('delete'))}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>` : ''}
        </div>
      </div>
    `;
}

export function renderGrid(): void {
  const titles: Record<ViewName, string> = {
    discover: t('titleDiscover'),
    favs: t('titleFavs'),
    mine: t('titleMine')
  };
  $('#sectionTitle').textContent = titles[state.currentView];
  renderToolbar();

  const grid = $<HTMLDivElement>('#grid');
  const items = getActiveStationList();

  if (state.currentView === 'discover' && state.isLoading && !state.discoverResults.length) {
    grid.innerHTML = `<div class="col-span-full py-16 text-center text-sm text-gray-500 dark:text-zinc-400">${esc(t('loading'))}</div>`;
    return;
  }

  if (!items.length) {
    const messages: Record<ViewName, string> = {
      discover: t('emptyDiscover'),
      favs: t('emptyFavs'),
      mine: t('emptyMine')
    };
    grid.innerHTML = `<div class="col-span-full py-16 text-center text-sm text-gray-500 dark:text-zinc-400">${esc(messages[state.currentView])}</div>`;
    return;
  }

  grid.innerHTML = items.map(renderCard).join('');
}

export function initGrid(): void {
  $('#grid').addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const actionEl = target.closest<HTMLElement>('[data-action]');
    const card = target.closest<HTMLElement>('.card, [data-id]');
    if (!actionEl || !card) return;

    const stationId = card.dataset.id;
    const station = stationId ? findStationById(stationId) : undefined;
    if (!station) return;

    const action = actionEl.dataset.action;

    if (action === 'play') {
      playStation(station);
    } else if (action === 'fav') {
      showToast(toggleFavorite(station) ? t('favAdded') : t('favRemoved'));
    } else if (action === 'delete') {
      deleteStation(station);
      showToast(t('stationDeleted'));
    }
  });
}