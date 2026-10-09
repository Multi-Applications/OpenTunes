export type LangCode = 'en' | 'de' | 'nl' | 'it' | 'fr';
export type ViewName = 'discover' | 'favs' | 'mine';
export type StatusKey =
  | 'statusIdle'
  | 'statusConnecting'
  | 'statusLive'
  | 'statusPaused'
  | 'statusBuffering'
  | 'statusUnavailable'
  | 'statusFailed';

export interface Station {
  id: string;
  name: string;
  url: string;
  logo: string;
  country: string;
  tags: string;
  bitrate: number;
  custom?: boolean;
}

export interface ApiStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  favicon: string;
  countrycode: string;
  tags: string;
  bitrate: number;
}

export interface Locale {
  common: Record<string, string>;
  genres: Record<string, string>;
}