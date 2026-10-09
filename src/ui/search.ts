import { executeSearch } from '../core/api';
import { state } from '../core/state';
import { $ } from './dom';
import { renderGrid } from './grid';

export function updateClearVisibility(): void {
  $<HTMLButtonElement>('#qClear').classList.toggle('is-active', !!$<HTMLInputElement>('#q').value);
}

export function initSearch(): void {
  const qInput = $<HTMLInputElement>('#q');
  const qClear = $<HTMLButtonElement>('#qClear');

  qClear.addEventListener('click', () => {
    qInput.value = '';
    state.searchQuery = '';
    updateClearVisibility();
    qInput.focus();
    if (state.currentView === 'discover') executeSearch();
    else renderGrid();
  });

  let searchDebounceTimer = 0;
  qInput.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    state.searchQuery = target.value.trim();
    updateClearVisibility();
    window.clearTimeout(searchDebounceTimer);
    searchDebounceTimer = window.setTimeout(() => {
      if (state.currentView === 'discover') executeSearch();
      else renderGrid();
    }, 350);
  });
}