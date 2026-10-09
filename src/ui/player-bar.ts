import { t } from '../core/i18n';
import { isFavorite, toggleFavorite } from '../core/library';
import { audio, setVolume, togglePlayPause } from '../core/player';
import { state } from '../core/state';
import { $, esc } from './dom';
import { showToast } from './toast';

function setFavButtonState(btn: HTMLButtonElement, fav: boolean): void {
  btn.classList.remove('text-gray-500', 'dark:text-zinc-400', 'text-red-500', 'dark:text-red-500');
  if (fav) {
    btn.classList.add('text-red-500', 'dark:text-red-500');
  } else {
    btn.classList.add('text-gray-500', 'dark:text-zinc-400');
  }
  const svg = btn.querySelector('svg');
  if (svg) svg.setAttribute('fill', fav ? 'currentColor' : 'none');
}

export function renderPlayerBar(): void {
  const bar = $<HTMLDivElement>('#playerBar');

  if (!state.currentStation) {
    bar.classList.add('player-hidden');
    return;
  }
  bar.classList.remove('player-hidden');

  const initial = esc(state.currentStation.name.charAt(0).toUpperCase());
  const logoImg = state.currentStation.logo
    ? `<img src="${esc(state.currentStation.logo)}" alt="" class="absolute inset-0 h-full w-full object-cover" onerror="this.remove()">`
    : '';

  $('#pArt').innerHTML = initial + logoImg;
  $('#pName').textContent = state.currentStation.name;
  $('#pStatus').textContent = t(state.statusKey);

  const isPaused = audio.paused;
  ($('#playIcon') as HTMLElement).style.display = isPaused ? 'block' : 'none';
  ($('#pauseIcon') as HTMLElement).style.display = isPaused ? 'none' : 'block';

  setFavButtonState($<HTMLButtonElement>('#pFavBtn'), isFavorite(state.currentStation));
}

export function initPlayerBar(): void {
  $<HTMLInputElement>('#vol').value = String(state.volumeSetting);

  $('#pPlayBtn').addEventListener('click', () => togglePlayPause());

  $('#pFavBtn').addEventListener('click', () => {
    if (!state.currentStation) return;
    showToast(toggleFavorite(state.currentStation) ? t('favAdded') : t('favRemoved'));
  });

  $('#vol').addEventListener('input', (e) => {
    setVolume(parseFloat((e.target as HTMLInputElement).value));
  });
}