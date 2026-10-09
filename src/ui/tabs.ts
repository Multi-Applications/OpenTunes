import { executeSearch } from '../core/api';
import { state } from '../core/state';
import type { ViewName } from '../types';
import { $ } from './dom';
import { renderGrid } from './grid';

const TAB_ACTIVE = ['bg-white', 'font-semibold', 'text-gray-900', 'shadow-sm', 'dark:bg-zinc-800', 'dark:text-zinc-50'];
const TAB_INACTIVE = ['text-gray-500', 'dark:text-zinc-400'];

export function syncTabs(): void {
  document.querySelectorAll<HTMLButtonElement>('.tab').forEach((tab) => {
    const active = tab.dataset.view === state.currentView;
    TAB_ACTIVE.forEach((c) => tab.classList.toggle(c, active));
    TAB_INACTIVE.forEach((c) => tab.classList.toggle(c, !active));
  });
}

export function setView(view: ViewName): void {
  state.currentView = view;
  syncTabs();

  if (view === 'discover') {
    executeSearch();
  } else {
    renderGrid();
  }
}

export function initTabs(): void {
  $('#tabs').addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const tabBtn = target.closest<HTMLButtonElement>('.tab');
    if (tabBtn && tabBtn.dataset.view) setView(tabBtn.dataset.view as ViewName);
  });
}