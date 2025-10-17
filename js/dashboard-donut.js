document.addEventListener('DOMContentLoaded', function () {
  const EVENTS_KEY = 'campus:events';
  const SETTINGS_KEY = 'campus:settings';
  function loadEvents() { try { return JSON.parse(localStorage.getItem(EVENTS_KEY)) || []; } catch { return []; } }
  function loadSettings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; } }
  function compute(hoursCapMinutes) {
    const recs = loadEvents();
    const used = recs.reduce((s, r) => s + (typeof r.duration === 'number' ? r.duration : 0), 0);
    const cap = typeof hoursCapMinutes === 'number' ? hoursCapMinutes : 600;
    const remaining = Math.max(cap - used, 0);
    return { usedHours: +(used / 60).toFixed(2), remainingHours: +(remaining / 60).toFixed(2), cap };
  }
  const canvas = document.getElementById('donut-time-percentage');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const s = loadSettings();
  const base = compute(s.weeklyCapMinutes);
  let chartRef = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: ['Used', 'Remaining'], datasets: [{ data: [base.usedHours, base.remainingHours], backgroundColor: ['#3c4f6bff', '#55b1bdff'], borderColor: ['#aec4e6ff', '#c5d8daff'], borderWidth: 1 }] },
    options: { responsive: true, legend: { position: 'top' }, title: { display: true, text: 'Percentage of Time Used (Weekly Cap)' }, cutoutPercentage: 70 }
  });
  document.addEventListener('events:updated', function () {
    const s2 = loadSettings();
    const next = compute(s2.weeklyCapMinutes);
    chartRef.data.datasets[0].data = [next.usedHours, next.remainingHours];
    chartRef.update();
  });
});
