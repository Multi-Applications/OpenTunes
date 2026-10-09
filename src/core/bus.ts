export type AppEvent = 'search' | 'playback' | 'library';

export interface EventDetails {
  failed?: boolean;
}

type Handler = (details: EventDetails) => void;

const handlers: Record<AppEvent, Handler[]> = {
  search: [],
  playback: [],
  library: []
};

export function on(event: AppEvent, handler: Handler): void {
  handlers[event].push(handler);
}

export function emit(event: AppEvent, details: EventDetails = {}): void {
  for (const handler of handlers[event]) handler(details);
}