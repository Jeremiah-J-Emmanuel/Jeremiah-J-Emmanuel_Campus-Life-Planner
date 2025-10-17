
document.addEventListener('DOMContentLoaded', async () => {
  // ---- prevent page reload on Enter in search form
  document.querySelector('#search-form')?.addEventListener('submit', e => e.preventDefault());

  const STORAGE_KEY = 'campus:events';

  // ---- DOM refs + guards
  const cardsEl   = document.querySelector('#cards');
  const template  = document.querySelector('#card-temp');
  const searchEl  = document.querySelector('#search-bar');
  const ciEl      = document.querySelector('#search-ci');
  const sortEl    = document.querySelector('#sort-by');
  const statusEl  = document.querySelector('#search-status');

  if (!cardsEl)  { console.error('Missing #cards container'); return; }
  if (!template) { console.error('Missing #card-temp <template>'); return; }

  // ---- data load (localStorage → seed.json fallback)
  async function loadRecords() {
    let data = [];
    try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { data = []; }
    if (!Array.isArray(data) || data.length === 0) {
      try {
        const res = await fetch('./seed.json', { cache: 'no-store' });
        data = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to load seed.json', e);
        data = [];
      }
    }
    return data;
  }

  // ---- regex + highlight helpers
  function compileRegex(input, flags = 'i') { try { return input ? new RegExp(input, flags) : null; } catch { return null; } }
  function escapeHTML(s) {
    return String(s)
      .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
      .replaceAll('"','&quot;').replaceAll("'",'&#39;');
  }
  function highlightSafe(text, re) {
    if (!re) return escapeHTML(text);
    return escapeHTML(text).replace(re, m => `<mark>${escapeHTML(m)}</mark>`);
  }

  const sorters = {
    date    : (a,b) => new Date(a.dueDate) - new Date(b.dueDate),
    title   : (a,b) => String(a.title||'').localeCompare(String(b.title||'')),
    duration: (a,b) => (a.duration||0) - (b.duration||0),
    tag     : (a,b) => String((a.tags||[])[0]||'').localeCompare(String((b.tags||[])[0]||'')),
  };

  // ---- renderer (null-safe)
  function renderListWithHighlight(list) {
    cardsEl.innerHTML = '';
    const frag = document.createDocumentFragment();

    list.forEach(rec => {
      try {
        const node = template.content.cloneNode(true);

        const tEl = node.querySelector('[data-title]');
        const dEl = node.querySelector('[data-due]');
        const uEl = node.querySelector('[data-duration]');
        const gEl = node.querySelector('[data-tags]');
        const art = node.querySelector('.event-card');

        if (!tEl || !dEl || !uEl || !gEl || !art) throw new Error('Template slots missing');

        tEl.innerHTML = highlightSafe(rec.title || '', currentRegex);
        dEl.textContent = rec.dueDate || '';
        uEl.textContent = rec.duration ?? '';

        (rec.tags || []).forEach(tag => {
          const span = document.createElement('span');
          span.innerHTML = highlightSafe(`#${tag}`, currentRegex);
          gEl.appendChild(span);
          gEl.append(' ');
        });

        art.dataset.id = rec.id;
        frag.appendChild(art);
      } catch (e) {
        console.error('Render error for record:', rec, e);
      }
    });

    cardsEl.appendChild(frag);
  }

  const master = await loadRecords();
  let currentRegex = null;

  // ---- search + sort
  function applyQueryAndSort() {
    const q     = searchEl?.value?.trim() || '';
    const flags = ciEl?.checked ? 'ig' : 'g';
    currentRegex = compileRegex(q, flags);

    if (q && !currentRegex) {
      renderListWithHighlight([]);
      if (statusEl) statusEl.textContent = `Invalid regex pattern: ${q}`;
      return;
    }

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

    const key = sortEl?.value || 'date';
    const sorted = [...filtered].sort(sorters[key]);

    renderListWithHighlight(sorted);
    if (statusEl) {
      statusEl.textContent = currentRegex
        ? `Showing ${sorted.length} result(s) for pattern ${q}`
        : `Showing all ${sorted.length} record(s)`;
    }
  }

  // ---- wire events
  searchEl?.addEventListener('input', applyQueryAndSort);
  ciEl?.addEventListener('change', applyQueryAndSort);
  sortEl?.addEventListener('change', applyQueryAndSort);

  // ---- initial paint
  applyQueryAndSort();

  // ---- card button demo handlers
  cardsEl.addEventListener('click', (e) => {
    const card = e.target.closest('.event-card');
    if (!card) return;
    const id = card.dataset.id;
    if (e.target.closest('.edit'))   console.log('Edit', id);
    if (e.target.closest('.delete')) console.log('Delete', id);
  });
});
