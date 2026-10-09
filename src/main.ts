import './ui/css/index.css';

import { executeSearch } from './core/api';
import { on } from './core/bus';
import { t } from './core/i18n';
import { initPlayer, togglePlayPause } from './core/player';
import { state } from './core/state';
import { initDialog, renderGenreSelect } from './ui/dialog';
import { initGrid, renderGrid } from './ui/grid';
import { applyStaticI18n, initLanguage, renderLangSelect } from './ui/language';
import { initPlayerBar, renderPlayerBar } from './ui/player-bar';
import { initSearch, updateClearVisibility } from './ui/search';
import { initTabs, syncTabs } from './ui/tabs';
import { initToolbar } from './ui/toolbar';
import { showToast } from './ui/toast';

on('search', ({ failed }) => {
  if (failed) showToast(t('loadError'));
  renderGrid();
});

on('playback', () => {
  renderPlayerBar();
  renderGrid();
});

on('library', () => {
  renderGrid();
  renderPlayerBar();
});

function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', (e) => {
    const tag = (e.target as HTMLElement).tagName;
    if (e.code === 'Space' && state.currentStation && ['INPUT', 'SELECT', 'BUTTON', 'TEXTAREA'].indexOf(tag) === -1) {
      e.preventDefault();
      togglePlayPause();
    }
  });
}

function init(): void {
  renderLangSelect();
  applyStaticI18n();
  renderGenreSelect();
  syncTabs();
  updateClearVisibility();

  initTabs();
  initToolbar();
  initGrid();
  initPlayerBar();
  initPlayer();
  initSearch();
  initLanguage();
  initDialog();
  initKeyboardShortcuts();

  if (state.currentView === 'discover') {
    executeSearch();
  } else {
    renderGrid();
  }
}
init();