document.querySelector('#search-form')?.addEventListener('submit', e => e.preventDefault());

function applyQueryAndSort() {
  const q      = searchEl?.value?.trim() || '';
  const flags  = ciEl?.checked ? 'ig' : 'g';   // global so all matches highlight
  currentRegex = compileRegex(q, flags);

  if (q && !currentRegex) {
    renderListWithHighlight([]);               // show nothing on invalid regex
    if (statusEl) statusEl.textContent = `Invalid regex pattern: ${q}`;
    return;
  }

  const filtered = master.filter(rec => {
    if (!currentRegex) return true;            // empty query => show all

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
