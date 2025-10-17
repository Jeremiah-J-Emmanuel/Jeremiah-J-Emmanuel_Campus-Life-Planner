document.addEventListener('DOMContentLoaded', () => {
  const EVENTS_KEY = 'campus:events';
  const SETTINGS_KEY = 'campus:settings';
  const addBtn = document.querySelector('.add-event');
  const addSection = document.getElementById('add-event-section');
  const addForm = document.getElementById('add-event-form');
  const cancelBtn = document.getElementById('cancel-add');
  function loadEvents() { try { return JSON.parse(localStorage.getItem(EVENTS_KEY)) || []; } catch { return []; } }
  function saveEvents(v) { localStorage.setItem(EVENTS_KEY, JSON.stringify(v)); }
  function loadSettings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; } }
  addBtn?.addEventListener('click', () => { addSection.hidden = false; });
  cancelBtn?.addEventListener('click', () => { addSection.hidden = true; addForm.reset(); });
  addForm?.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('new-title').value.trim();
    const dueDate = document.getElementById('new-date').value;
    const duration = parseInt(document.getElementById('new-duration').value, 10);
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
    document.dispatchEvent(new CustomEvent('events:updated', { detail: { events } }));
  });
});
