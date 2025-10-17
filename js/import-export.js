document.addEventListener('DOMContentLoaded', function () {
    const STORAGE_KEY = 'campus:events';
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-json');
    const exportBtn = document.getElementById('export-json');
    const statusEl  = document.getElementById('import-status');


    exportBtn?.addEventListener('click', function () {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); /* Recieval and parsing of stored campus events*/
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    /*The above code makes use of a conditional, exportBtn?.addEventListener, to help prevent errors
    if the button does not exist*/

    const a = document.createElement('a');
    a.href = url;
    a.download = 'campus-events-export.json';
    a.click();

    URL.revokeObjectURL(url);
    if (statusEl) statusEl.textContent = 'Export successful.';
    });

    importBtn?.addEventListener('click', function() {importFile.click()});

    importFile?.addEventListener('change', async function () {
    const file = this.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const json = JSON.parse(text);

        if (!Array.isArray(json)) throw new Error('File does not contain a valid array.');

        const isValid = json.every(rec =>
        rec.id && rec.title && rec.dueDate && typeof rec.duration === 'number'
        );

        if (!isValid) throw new Error('Invalid record structure in file.');

        localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
        if (statusEl) statusEl.textContent = 'Import successful. Reloading...';
        setTimeout(() => location.reload(), 1000);
    } catch (err) {
        console.error('Import failed:', err);
        if (statusEl) statusEl.textContent = 'Import failed: ' + err.message;
    }

    importFile.value = ''; // reset file input
    });
    });
