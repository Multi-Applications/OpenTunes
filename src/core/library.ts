import { emit } from './bus';
import { saveStorage } from './storage';
import { state } from './state';
import type { Station } from '../types';

export function isFavorite(station: Station): boolean {
  return state.favorites.some((f) => f.id === station.id);
}

export function filterByQuery(list: Station[]): Station[] {
  if (!state.searchQuery) return list;
  const q = state.searchQuery.toLowerCase();
  return list.filter((s) =>
    s.name.toLowerCase().includes(q) ||
    (!!s.tags && s.tags.toLowerCase().includes(q))
  );
}

export function getActiveStationList(): Station[] {
  if (state.currentView === 'favs') return filterByQuery(state.favorites);
  if (state.currentView === 'mine') return filterByQuery(state.myStations);
  return state.discoverResults;
}

export function findStationById(id: string): Station | undefined {
  const allStations: Station[] = [...state.discoverResults, ...state.favorites, ...state.myStations];
  return allStations.find((s) => s.id === id);
}

export function toggleFavorite(station: Station): boolean {
  const wasFavorite = isFavorite(station);

  if (wasFavorite) {
    state.favorites = state.favorites.filter((f) => f.id !== station.id);
  } else {
    state.favorites.unshift(station);
  }

  saveStorage('wr.favs', state.favorites);
  emit('library');
  return !wasFavorite;
}

export function deleteStation(station: Station): void {
  state.myStations = state.myStations.filter((m) => m.id !== station.id);
  state.favorites = state.favorites.filter((f) => f.id !== station.id);
  saveStorage('wr.custom', state.myStations);
  saveStorage('wr.favs', state.favorites);
  emit('library');
}

export function addCustomStation(station: Station): void {
  state.myStations.unshift(station);
  saveStorage('wr.custom', state.myStations);
}