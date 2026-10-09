import { loadStorage } from './storage';
import type { Station, StatusKey, ViewName } from '../types';

export const state = {
  currentView: 'discover' as ViewName,
  selectedCountry: loadStorage<string>('wr.country', 'US'),
  selectedGenre: 'all',
  favorites: loadStorage<Station[]>('wr.favs', []),
  myStations: loadStorage<Station[]>('wr.custom', []),
  volumeSetting: loadStorage<number>('wr.vol', 0.8),
  searchQuery: '',
  discoverResults: [] as Station[],
  currentStation: null as Station | null,
  isLoading: false,
  activeRequestId: 0,
  statusKey: 'statusIdle' as StatusKey
};