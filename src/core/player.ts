import { emit } from './bus';
import { t } from './i18n';
import { getActiveStationList } from './library';
import { saveStorage } from './storage';
import { state } from './state';
import type { Station, StatusKey } from '../types';

export const audio = new Audio();
audio.volume = state.volumeSetting;

export function setPlayerStatus(key: StatusKey): void {
  state.statusKey = key;
  emit('playback');
}

export function updateMediaSession(station: Station): void {
  if (!('mediaSession' in navigator)) return;

  const iconUrl = station.logo ||
    'https://placehold.co/512x512/0f172a/ffffff?text=' + encodeURIComponent(station.name.charAt(0));

  navigator.mediaSession.metadata = new MediaMetadata({
    title: station.name,
    artist: station.tags
      ? station.tags.split(',').slice(0, 3).join(', ')
      : (station.country || t('webRadio')),
    album: 'name',
    artwork: [
      { src: iconUrl, sizes: '96x96', type: 'image/png' },
      { src: iconUrl, sizes: '128x128', type: 'image/png' },
      { src: iconUrl, sizes: '192x192', type: 'image/png' },
      { src: iconUrl, sizes: '256x256', type: 'image/png' },
      { src: iconUrl, sizes: '384x384', type: 'image/png' },
      { src: iconUrl, sizes: '512x512', type: 'image/png' }
    ]
  });

  navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
  navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
  navigator.mediaSession.setActionHandler('previoustrack', () => playNeighborStation(-1));
  navigator.mediaSession.setActionHandler('nexttrack', () => playNeighborStation(1));
}

function playNeighborStation(direction: number): void {
  const list = getActiveStationList();
  if (!list.length || !state.currentStation) return;
  const index = list.findIndex((s) => s.id === state.currentStation!.id);
  if (index === -1) return;
  let newIndex = index + direction;
  if (newIndex < 0) newIndex = list.length - 1;
  if (newIndex >= list.length) newIndex = 0;
  playStation(list[newIndex]);
}

export function playStation(station: Station): void {
  if (state.currentStation && state.currentStation.id === station.id) {
    togglePlayPause();
    return;
  }

  state.currentStation = station;
  audio.src = station.url;
  setPlayerStatus('statusConnecting');

  audio.play().catch(() => {
    setPlayerStatus('statusFailed');
  });

  updateMediaSession(station);
  emit('playback');
}

export function togglePlayPause(): void {
  if (!state.currentStation) return;
  if (audio.paused) {
    audio.play().catch(() => setPlayerStatus('statusFailed'));
  } else {
    audio.pause();
  }
}

export function setVolume(value: number): void {
  audio.volume = value;
  saveStorage('wr.vol', value);
}

export function initPlayer(): void {
  audio.addEventListener('playing', () => {
    setPlayerStatus('statusLive');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing';
  });

  audio.addEventListener('pause', () => {
    setPlayerStatus('statusPaused');
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused';
  });

  audio.addEventListener('waiting', () => setPlayerStatus('statusBuffering'));
  audio.addEventListener('error', () => setPlayerStatus('statusUnavailable'));
}