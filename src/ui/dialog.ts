import { genreLabel, t } from '../core/i18n';
import { addCustomStation } from '../core/library';
import { STATION_GENRES } from '../config/app.config';
import type { Station } from '../types';
import { $, esc } from './dom';
import { showToast } from './toast';
import { setView } from './tabs';
export function renderGenreSelect(): void {
  const sel = $<HTMLSelectElement>('#dlgGenre');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML =
    `<option value="">${esc(t('phGenre'))}</option>` +
    STATION_GENRES
      .map((g) => `<option value="${esc(g)}">${esc(genreLabel(g))}</option>`)
      .join('');
  if (current) sel.value = current;
}

export function initDialog(): void {
  const dlg = $<HTMLDialogElement>('#customDlg');
  const form = $<HTMLFormElement>('#customForm');

  $('#addBtn').addEventListener('click', () => {
    form.reset();
    $('#formErr').textContent = '';
    renderGenreSelect();
    dlg.showModal();
  });

  $('#cancelDlg').addEventListener('click', () => dlg.close());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const url = String(formData.get('url') || '').trim();

    if (!/^https?:\/\//i.test(url)) {
      $('#formErr').textContent = t('errUrl');
      return;
    }

    if (location.protocol === 'https:' && url.startsWith('http://')) {
      $('#formErr').textContent = t('errHttps');
      return;
    }

    const newStation: Station = {
      id: 'custom-' + Date.now().toString(36),
      name: String(formData.get('name') || '').trim(),
      url: url,
      tags: String(formData.get('tags') || '').trim(),
      logo: String(formData.get('logo') || '').trim(),
      country: 'Custom',
      bitrate: 0,
      custom: true
    };

    addCustomStation(newStation);
    dlg.close();
    showToast(t('stationSaved'));
    setView('mine');
  });
}