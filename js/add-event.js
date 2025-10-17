document.addEventListener('DOMContentLoaded', function () {
  const EVENTS_KEY = 'campus:events';
  const SETTINGS_KEY = 'campus:settings';
  const addBtn = document.querySelector('.add-event');
  const addSection = document.getElementById('add-event-section');
  const addForm = document.getElementById('add-event-form');
  const cancelBtn = document.getElementById('cancel-add');

  function loadEvents() { try { return JSON.parse(localStorage.getItem(EVENTS_KEY)) || []; }
      catch { return []; } }

  function saveEvents(v) { localStorage.setItem(EVENTS_KEY, JSON.stringify(v)); }

  function loadSettings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
  catch { return {}; } }
  
  addBtn?.addEventListener('click', function () { addSection.hidden = false; });
  cancelBtn?.addEventListener('click', function () { addSection.hidden = true; addForm.reset(); });
  addForm?.addEventListener('submit', e => {
    e.preventDefault();
    
    const title = document.getElementById('new-title').value.trim();
    const dueDate = document.getElementById('new-date').value;
    const duration = parseInt(document.getElementById('new-duration').value, 10);
    const dupWordRe = /(?<!\p{L})(\p{L}+)\s+\1(?!\p{L})/iu;
    if (dupWordRe.test(title)) {
      const statusEl = document.querySelector('#search-status') || document.getElementById('add-status');
      const msg = 'Title contains repeated adjacent words (e.g. "the the"). Please correct.';
      if (statusEl) statusEl.textContent = msg; else alert(msg);
      return;
    }
    const tagsInput = document.getElementById('new-tags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];
    if (!title || !dueDate || !Number.isFinite(duration) || duration < 0) return;
    const settings = loadSettings();
    const cap = typeof settings.weeklyCapMinutes === 'number' ? settings.weeklyCapMinutes : 600;
    const events = loadEvents();
    const used = events.reduce((s, r) => s + (typeof r.duration === 'number' ? r.duration : 0), 0);
    if (used + duration > cap) { alert('Weekly cap reached. Cannot add more events.'); return; }
    const rec = { id: 'event_' + Date.now(), title, dueDate, duration, tags, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    events.push(rec);
    saveEvents(events);
    addForm.reset();
    addSection.hidden = true;

    // this is to update the display immediately
    const cardsEl = document.querySelector('#cards');
    const template = document.querySelector('#card-temp');
    if (cardsEl && template) {
      const filtered = events.filter(rec => true); // Show all events
      import('./index.js').then(module => {
        module.renderListWithHighlight(filtered, cardsEl, template);
      });
    }
  });
});
