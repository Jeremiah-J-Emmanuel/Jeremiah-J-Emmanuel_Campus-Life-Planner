export function escapeHTML(s) {
  return String(s)
    .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
    .replaceAll('"','&quot;').replaceAll("'",'&#39;');
}

export function highlightSafe(text, re) {
  if (!re) return escapeHTML(text);
  return escapeHTML(text).replace(re, m => `<mark>${escapeHTML(m)}</mark>`);
}

export function renderListWithHighlight(list, cardsEl, template) {
  if (!cardsEl || !template) return;
  cardsEl.innerHTML = '';
  const frag = document.createDocumentFragment();

  list.forEach(rec => {
    const node = template.content.cloneNode(true);
    const tEl = node.querySelector('[data-title]');
    const dEl = node.querySelector('[data-due]');
    const uEl = node.querySelector('[data-duration]');
    const gEl = node.querySelector('[data-tags]');
    const art = node.querySelector('.event-card');
    if (!tEl || !dEl || !uEl || !gEl || !art) return;

    tEl.innerHTML = highlightSafe(rec.title || '', null);
    dEl.textContent = rec.dueDate || '';
    uEl.textContent = rec.duration ?? '';
    (rec.tags || []).forEach(tag => {
      const span = document.createElement('span');
      span.innerHTML = highlightSafe(`#${tag}`, null);
      gEl.appendChild(span);
      gEl.append(' ');
    });
    art.dataset.id = rec.id;
    frag.appendChild(art);
  });
  cardsEl.appendChild(frag);
}

document.addEventListener('DOMContentLoaded', async function () {
    /*The function below is used to display to you the starting messages
    If the messages are not in the local storage, it means that it's probably
    your first time of entering the web page, or you cleared your local storagey.
    If they are not in the local storage, youy will get an alert message*/

    window.onload = function() {
    // Check if the 'alerted' item exists in local storage
    if (localStorage.getItem('alerted') !== 'yes') {
    alert(`Welcome to Jeremiah's campus planner.\n
    The default number of hours you have for events in a week is 10 hours, which is 600 minutes\n
    To change this, go to the settings page. Thank you`);

    // And set the 'alerted' item in local storage
    localStorage.setItem('alerted', 'yes');
    }
    };
  document.querySelector('#search-form')?.addEventListener('submit', e => e.preventDefault());

  const STORAGE_KEY = 'campus:events';

  const cardsEl   = document.querySelector('#cards');
  const template  = document.querySelector('#card-temp');
  const searchEl  = document.querySelector('#search-bar');
  const ciEl      = document.querySelector('#search-ci');
  const sortEl    = document.querySelector('#sort-by');
  const statusEl  = document.querySelector('#search-status');

  if (!cardsEl || !template) return;

  async function loadRecords() {
    let data = [];
    try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { data = []; }
    if (!Array.isArray(data) || data.length === 0) {
      try {
        const res = await fetch('./seed.json', { cache: 'no-store' });
        data = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch { data = []; }
    }
    return data;
  }

  function compileRegex(input, flags = 'i') {
    try { return input ? new RegExp(input, flags) : null; } catch { return null; }
  }

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

  function renderListWithHighlight(list) {
    cardsEl.innerHTML = '';
    const frag = document.createDocumentFragment();

    list.forEach(rec => {
      const node = template.content.cloneNode(true);
      const tEl = node.querySelector('[data-title]');
      const dEl = node.querySelector('[data-due]');
      const uEl = node.querySelector('[data-duration]');
      const gEl = node.querySelector('[data-tags]');
      const art = node.querySelector('.event-card');
      if (!tEl || !dEl || !uEl || !gEl || !art) return;

      tEl.innerHTML = highlightSafe(rec.title || '', currentHighlightRegex);
      dEl.textContent = rec.dueDate || '';
      uEl.textContent = rec.duration ?? '';
      (rec.tags || []).forEach(tag => {
        const span = document.createElement('span');
        span.innerHTML = highlightSafe(`#${tag}`, currentHighlightRegex);
        gEl.appendChild(span);
        gEl.append(' ');
      });
      art.dataset.id = rec.id;
      frag.appendChild(art);
    });
    cardsEl.appendChild(frag);
  }

  const master = await loadRecords();
  let currentRegex = null;
  let currentHighlightRegex = null;

  function applyQueryAndSort() {
    const q = searchEl?.value?.trim() || '';
    const flags = ciEl?.checked ? 'i' : '';
    currentRegex = compileRegex(q, flags);
    currentHighlightRegex = currentRegex ? new RegExp(currentRegex.source, currentRegex.flags + 'g') : null;

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

  searchEl?.addEventListener('input', applyQueryAndSort);
  ciEl?.addEventListener('change', applyQueryAndSort);
  sortEl?.addEventListener('change', applyQueryAndSort);

  applyQueryAndSort();


  function readAll() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  }

  function writeAll(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  // turn the string of tags into a listThe 
  function splitTags(str) {
    return String(str || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  // remove record
  function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const data = readAll().filter(r => r.id !== id);
    writeAll(data);

    const idx = master.findIndex(r => r.id === id);
    if (idx !== -1) master.splice(idx, 1);

    applyQueryAndSort();
  }

  // This function transforms the event card into a form that allows you to edit it
  function enterEditMode(id) {
    const rec = master.find(r => r.id === id);
    if (!rec) return;

    const card = document.querySelector(`.event-card[data-id="${CSS.escape(id)}"]`);
    if (!card) return;

    const form = document.createElement('form');
    form.className = 'edit-form';
    form.innerHTML = `
      <h3>
        <input name="title" type="text" value="${escapeHTML(rec.title || '')}">
      </h3>

      <p><strong>Due</strong>:
        <input name="dueDate" type="date" value="${escapeHTML(rec.dueDate || '')}">
      </p>

      <p><strong>Duration</strong>:
        <input name="duration" type="number" min="0" step="1" value="${escapeHTML(String(rec.duration ?? 0))}"> mins
      </p>

      <p><strong>Tags</strong>:
        <input name="tags" type="text" value="${escapeHTML((rec.tags || []).join(', '))}">
      </p>

      <div class="actions">
        <button type="submit" class="save">Save</button>
        <button type="button" class="cancel">Cancel</button>
      </div>
    `;

    const shell = document.createElement('article');
    shell.className = 'event-card';
    shell.dataset.id = id;
    shell.appendChild(form);

    card.replaceWith(shell);

    form.querySelector('input[name="title"]')?.focus();
  }

  // put card back
  function exitEditMode(id) {
    applyQueryAndSort();
  }

  // save changes
  function handleEditSubmit(formEl) {
    const wrapper = formEl.closest('.event-card');
    if (!wrapper) return;
    const id = wrapper.dataset.id;

    const title    = formEl.elements.title.value.trim();
    const dueDate  = formEl.elements.dueDate.value.trim();
    const duration = Number(formEl.elements.duration.value);
    const tags     = splitTags(formEl.elements.tags.value);

    const idx = master.findIndex(r => r.id === id);
    if (idx === -1) return;

    master[idx] = {
      ...master[idx],
      title,
      dueDate,
      duration: Number.isFinite(duration) ? duration : 0,
      tags,
      updatedAt: new Date().toISOString()
    };

    writeAll(master);
    applyQueryAndSort();
  }

  // When the user clicks on edit/delete/cancel
  cardsEl.addEventListener('click', e => {
    const card = e.target.closest('.event-card');
    if (!card) return;
    const id = card.dataset.id;

    if (e.target.closest('.edit')) {
      enterEditMode(id);
      return;
    }
    if (e.target.closest('.delete')) {
      handleDelete(id);
      return;
    }
    if (e.target.closest('.cancel')) {
      exitEditMode(id);
      return;
    }
  });

  // submit edit form
  cardsEl.addEventListener('submit', e => {
    const form = e.target.closest('.edit-form');
    if (!form) return;
    e.preventDefault();
    handleEditSubmit(form);
  });
});
