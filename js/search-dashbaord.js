document.addEventListener('DOMContentLoaded', async function () {
    
 {
  const STORAGE_KEY = 'campus:events';

  async function loadRecords() {
    let data = [];
    try {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      data = [];
    }

    if (!Array.isArray(data) || data.length === 0) {
      try {
        const res = await fetch('./seed.json');
        data = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        data = [];
      }
    }
    return data;
  }

  function compileRegex(input, flags = 'i') {
    try {
      return input ? new RegExp(input, flags) : null;
    } catch {
      return null;
    }
  }

  function escapeHTML(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function highlightSafe(text, re) {
    if (!re) return escapeHTML(text);
    return escapeHTML(text).replace(re, m => `<mark>${escapeHTML(m)}</mark>`);
  }

  const cardsEl  = document.querySelector('#cards');
  const template = document.querySelector('#card-temp');
  const searchEl = document.querySelector('#search-bar');
  const ciEl     = document.querySelector('#search-ci');
  const sortEl   = document.querySelector('#sort-by');
  const statusEl = document.querySelector('#search-status');

  const records = await loadRecords();
  let currentRegex = null;
  let master = Array.isArray(records) ? records : [];

  const sorters = {
    date    : (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    title   : (a, b) => String(a.title || '').localeCompare(String(b.title || '')),
    duration: (a, b) => (a.duration || 0) - (b.duration || 0),
    tag     : (a, b) => String((a.tags || [])[0] || '').localeCompare(String((b.tags || [])[0] || '')),
  };

  function renderListWithHighlight(data) {
    cardsEl.innerHTML = '';

    const frag = document.createDocumentFragment();

    data.forEach(rec => {
      const node = template.content.cloneNode(true);

      node.querySelector('[data-title]').innerHTML      = highlightSafe(rec.title || '', currentRegex);
      node.querySelector('[data-due]').textContent       = rec.dueDate || '';
      node.querySelector('[data-duration]').textContent  = rec.duration ?? '';

      const tagsWrap = node.querySelector('[data-tags]');
      (rec.tags || []).forEach(tag => {
        const span = document.createElement('span');
        span.innerHTML = highlightSafe(`#${tag}`, currentRegex);
        tagsWrap.appendChild(span);
        tagsWrap.append(' ');
      });

      const article = node.querySelector('.event-card');
      article.dataset.id = rec.id;

      frag.appendChild(article);
    });

    cardsEl.appendChild(frag);
  }

  function applyQueryAndSort() {
    const q      = searchEl?.value?.trim() || '';
    const flags  = ciEl?.checked ? 'i' : '';
    currentRegex = compileRegex(q, flags);

    const filtered = master.filter(rec => {
      if (!currentRegex) return true;

      const tagPrefix = q.match(/^@tag:([A-Za-z0-9-]+)/);
      if (tagPrefix) {
        const tag = tagPrefix[1];
        return (rec.tags || []).some(t => String(t) === tag);
      }

      const haystack = [
        rec.title || '',
        rec.dueDate || '',
        String(rec.duration ?? ''),
        ...(rec.tags || []).map(String),
      ].join(' | ');

      return currentRegex.test(haystack);
    });

    const key    = sortEl?.value || 'date';
    const sorted = [...filtered].sort(sorters[key]);

    renderListWithHighlight(sorted);

    if (statusEl) {
      statusEl.textContent = currentRegex
        ? `Showing ${sorted.length} result(s) for pattern ${q}`
        : `Showing all ${sorted.length} record(s)`;
    }
  }

  searchEl?.addEventListener('input',  applyQueryAndSort);
  ciEl?.addEventListener('change',     applyQueryAndSort);
  sortEl?.addEventListener('change',   applyQueryAndSort);

  applyQueryAndSort();

  cardsEl.addEventListener('click', e => {
    const card = e.target.closest('.event-card');
    if (!card) return;

    const id = card.dataset.id;

    if (e.target.closest('.edit'))   console.log('Edit', id);
    if (e.target.closest('.delete')) console.log('Delete', id);
  });
}
});
