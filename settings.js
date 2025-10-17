document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'campus:settings';
  const form = document.getElementById('settings-form');
  const nameEl = document.getElementById('user-name');
  const hoursEl = document.getElementById('hours-per-week');
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
  function save(v) { localStorage.setItem(KEY, JSON.stringify(v)); }
  const s = load();
  if (typeof s.displayName === 'string') nameEl.value = s.displayName;
  if (typeof s.weeklyCapMinutes === 'number') hoursEl.value = Math.round(s.weeklyCapMinutes / 60);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const displayName = nameEl.value.trim();
    const hours = Number(hoursEl.value);
    if (!Number.isFinite(hours) || hours < 0 || hours > 168) return;
    save({ displayName, weeklyCapMinutes: Math.round(hours * 60) });
    alert('Settings saved');
  });
  document.getElementById('cancel-add')?.addEventListener('click', () => { window.location.href = 'index.html'; });
});
