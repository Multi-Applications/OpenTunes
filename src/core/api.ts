import { API_HOSTS } from '../config/app.config';
import { emit } from './bus';
import { state } from './state';
import type { ApiStation, Station } from '../types';

async function fetchRadioAPI(path: string): Promise<ApiStation[]> {
  let lastError: unknown;
  for (const host of API_HOSTS) {
    try {
      const response = await fetch(host + path);
      if (response.ok) return (await response.json()) as ApiStation[];
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Failed to load stations');
}

function mapApiStation(item: ApiStation): Station {
  return {
    id: item.stationuuid,
    name: item.name ? item.name.trim() : 'Unknown Station',
    url: item.url_resolved || item.url,
    logo: item.favicon || '',
    country: item.countrycode || '',
    tags: item.tags || '',
    bitrate: item.bitrate || 0
  };
}

export async function executeSearch(): Promise<void> {
  const reqId = ++state.activeRequestId;
  state.isLoading = true;
  emit('search');

  const params = new URLSearchParams({
    limit: '48',
    hidebroken: 'true',
    order: 'clickcount',
    reverse: 'true'
  });

  if (state.searchQuery) params.set('name', state.searchQuery);
  if (state.selectedGenre && state.selectedGenre !== 'all') params.set('tag', state.selectedGenre);
  if (state.selectedCountry && state.selectedCountry !== 'ALL') params.set('countrycode', state.selectedCountry);

  let failed = false;

  try {
    const data = await fetchRadioAPI('/json/stations/search?' + params.toString());
    if (reqId !== state.activeRequestId) return;

    const seenNames = new Set<string>();
    state.discoverResults = data
      .filter((s) => {
        if (!s.url_resolved) return false;
        const key = (s.name || '').toLowerCase();
        if (seenNames.has(key)) return false;
        seenNames.add(key);
        return true;
      })
      .map(mapApiStation);
  } catch (e) {
    if (reqId !== state.activeRequestId) return;
    state.discoverResults = [];
    failed = true;
  }

  state.isLoading = false;
  emit('search', { failed });
}