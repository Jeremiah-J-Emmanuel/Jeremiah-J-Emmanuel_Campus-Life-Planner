document.addEventListener('DOMContentLoaded', async function() {
  const STORAGE_KEY = 'campus:events';
  const SETTINGS_KEY = 'campus:settings';
  const WEEKDAY_LABELS = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

  async function loadRecords() {
    let data = [];
    try {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { data = []; }

    if (!Array.isArray(data) || data.length === 0) {
      try {
        const res = await fetch('./seed.json');
        data = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to load seed.json', e);
        data = [];
      }
    }
    return data;
  }

  function loadSettings() {
    try {
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
      return { weeklyCapMinutes: typeof s.weeklyCapMinutes === 'number' ? s.weeklyCapMinutes : 600 };
    } catch {
      return { weeklyCapMinutes: 600 };
    }
  }

  const records = await loadRecords();
  const settings = loadSettings();

  function weekdayIndexMonFirst(dateStr) {
    const d = new Date(dateStr);
    const day = d.getDay();
    return day === 0 ? 6 : day - 1;
  }

  function minutesToHoursArray(minsArr) {
    return minsArr.map(m => +(m / 60).toFixed(2));
  }

  const minutesPerWeekday = Array(7).fill(0);
  records.forEach(r => {
    if (!r.dueDate || typeof r.duration !== 'number') return;
    const idx = weekdayIndexMonFirst(r.dueDate);
    minutesPerWeekday[idx] += r.duration;
  });
  const hoursPerWeekday = minutesToHoursArray(minutesPerWeekday);

  const tagMinutes = new Map();
  records.forEach(r => {
    const eventTags = Array.isArray(r.tags) ? r.tags : (r.tag ? [r.tag] : []);
    const dur = typeof r.duration === 'number' ? r.duration : 0;
    eventTags.forEach(t => {
      const key = String(t);
      tagMinutes.set(key, (tagMinutes.get(key) || 0) + dur);
    });
  });

  const topTagEntries = [...tagMinutes.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const tagLabels = topTagEntries.map(([t]) => t);
  const tagHours  = topTagEntries.map(([, m]) => +(m / 60).toFixed(2));

  const totalMinutesUsed = records.reduce((sum, r) => sum + (typeof r.duration === 'number' ? r.duration : 0), 0);
  const cap = settings.weeklyCapMinutes;
  const remaining = Math.max(cap - totalMinutesUsed, 0);
  const usedHours = +(totalMinutesUsed / 60).toFixed(2);
  const remainingHours = +(remaining / 60).toFixed(2);

  const BAR_COLOR = '#3c4f6bff';
  const BAR_GRID_COLOR = 'rgba(0,0,0,0.1)';
  const DONUT_COLORS = ['#3c4f6bff', '#55b1bdff'];
  const DONUT_BORDERS = ['#aec4e6ff', '#c5d8daff'];

  (function () {
    const ctx = document.getElementById('bar-time-tracker').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: WEEKDAY_LABELS,
        datasets: [{
          label: 'Hours Spent on Events Daily',
          backgroundColor: BAR_COLOR,
          data: hoursPerWeekday
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        title: {
          display: true,
          text: 'Hours Spent on Events Daily',
          fontSize: 16,
          fontStyle: 'bold'
        },
        tooltips: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          displayColors: false,
          callbacks: {
            label: function (tooltipItem, data) {
              const val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return 'Hours: ' + val + ' Hrs';
            }
          }
        },
        scales: {
          xAxes: [{
            gridLines: { display: false },
            scaleLabel: { display: true, labelString: 'Day of Week' }
          }],
          yAxes: [{
            ticks: { beginAtZero: true, stepSize: 1 },
            gridLines: { color: BAR_GRID_COLOR, borderDash: [5, 5] },
            scaleLabel: { display: true, labelString: 'Hours' }
          }]
        }
      }
    });
  })();

  (function () {
    const ctx = document.getElementById('bar-time-per-tag').getContext('2d');
    new Chart(ctx, {
      type: 'horizontalBar',
      data: {
        labels: tagLabels,
        datasets: [{
          label: 'Hours by Tag',
          data: tagHours,
          backgroundColor: BAR_COLOR
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        title: {
          display: true,
          text: 'Hours Spent by Tag',
          fontSize: 16,
          fontStyle: 'bold'
        },
        tooltips: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          displayColors: false,
          callbacks: {
            label: function (tooltipItem, data) {
              const val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return 'Hours: ' + val + ' Hrs';
            }
          }
        },
        scales: {
          xAxes: [{
            ticks: { beginAtZero: true, stepSize: 1 },
            gridLines: { display: false },
            scaleLabel: { display: true, labelString: 'Hours' }
          }],
          yAxes: [{
            gridLines: { color: BAR_GRID_COLOR, borderDash: [5, 5] },
            scaleLabel: { display: true, labelString: 'Tag' }
          }]
        }
      }
    });
  })();

  (function () {
    const canvas = document.getElementById('donut-time-percentage');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Used', 'Remaining'],
        datasets: [{
          data: [usedHours, remainingHours],
          backgroundColor: DONUT_COLORS,
          borderColor: DONUT_BORDERS,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        legend: { position: 'top' },
        title: {
          display: true,
          text: 'Percentage of Time Used (Weekly Cap)'
        },
        cutoutPercentage: 70
      }
    });
  })();
});
