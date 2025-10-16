document.addEventListener('DOMContentLoaded', async function () {
    const STORAGE_KEY = 'campus:events';

    function load() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            /*The above gets the JSON and parses it into a JS Object
            It also returns an empty array when there was nothing
            stored in local storage to prevent the app from crashing */
        } catch {
            return [];
        }
    }

    function save(records) { // Thus is for saving data in your local storage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    function editEvent(input) {
        return input.split(',').map(s => s.trim()).filter(Boolean);
    }

    function isValidTitle(title) {
        return /^\S(?:.*\S)?$/.test(title);
    }

    function isValidDate(d) {
        return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(d);
    }

    function isValidDuration(dur) {
        return /^(0|[1-9]\d*)$/.test(String(dur));
    }

    const cardsEl = document.querySelector('#cards');
    const template = document.querySelector('#card-temp');

    function renderCard(rec) {
        const node = template.content.cloneNode(true);

        node.querySelector('[data-title]').textContent = rec.title;
        node.querySelector('[data-due]').textContent = rec.dueDate;
        node.querySelector('[data-duration]').textContent = rec.duration;

        const tagsWrap = node.querySelector('[data-tags]');
        (rec.tags || []).forEach(tag => {
            const span = document.createElement('span');
            span.textContent = `#${tag}`;
            tagsWrap.appendChild(span);
            tagsWrap.append(' ');
        });

        const article = node.querySelector('.event-card');
        article.dataset.id = rec.id;

        return article;
    }

    // Edit-mode renderer
    function renderEditCard(rec) {
        const article = document.createElement('article');
        article.className = 'event-card';
        article.dataset.id = rec.id;

        article.innerHTML = `
          <form class="edit-form">
            <h3>
              <input name="title" type="text" value="${rec.title}">
            </h3>

            <p><strong>Due</strong>:
              <input name="dueDate" type="text" value="${rec.dueDate}" placeholder="YYYY-MM-DD">
            </p>

            <p><strong>Duration</strong>:
              <input name="duration" type="number" min="0" step="1" value="${rec.duration}"> mins
            </p>

            <p><strong>Tags</strong>:
              <input name="tags" type="text" value="${(rec.tags || []).join(', ')}" placeholder="e.g. Seminar, Ethics">
            </p>

            <div class="actions">
              <button type="submit" class="save">Save</button>
              <button type="button" class="cancel">Cancel</button>
            </div>
          </form>
        `;
        return article;
    }

    // Swap to edit mode
    function enterEditMode(id) {
        const rec = records.find(r => r.id === id);
        if (!rec) return;
        const editNode = renderEditCard(rec);
        const current = cardsEl.querySelector(`.event-card[data-id="${CSS.escape(id)}"]`);
        if (current) current.replaceWith(editNode);
        const firstInput = editNode.querySelector('input[name="title"]');
        if (firstInput) firstInput.focus();
    }

    // Swap back to view mode
    function exitEditMode(id) {
        const rec = records.find(r => r.id === id);
        if (!rec) return;
        const viewNode = renderCard(rec);
        const current = cardsEl.querySelector(`.event-card[data-id="${CSS.escape(id)}"]`);
        if (current) current.replaceWith(viewNode);
    }

    function renderList(data) {
        cardsEl.innerHTML = '';
        const frag = document.createDocumentFragment();
        data.forEach(rec => frag.appendChild(renderCard(rec)));
        cardsEl.appendChild(frag);
    }

    let records = load();
    if (records.length === 0) {
        try {
            const response = await fetch('./seed.json');
            records = await response.json();
            save(records); //
        } catch (err) {
            console.error('Failed to load seed.json', err);
            records = [];
        }
    }
    renderList(records);

    cardsEl.addEventListener('click', function (event) {
        const card = event.target.closest('.event-card');
        if (!card) return;
        const id = card.dataset.id;

        // Enter edit mode
        if (event.target.closest('.edit')) {
            enterEditMode(id);
            return;
        }

        // Cancel edit
        if (event.target.closest('.cancel')) {
            exitEditMode(id);
            return;
        }

        if (event.target.closest('.delete')) {
            if (confirm('Are you sure you want to delete this event?')) {
                /*The above is used to send a warning, to prevent accidental deletion
                If the user click Ok, true is returned and vice versa*/
                const updatedRecords = [];
                for (const record of records) {
                    if (record.id !== id) {
                        updatedRecords.push(record);
                    }
                    /*If a record's id does not match the one that we want to
                    delete, we will add it to the array.*/
                }
                records = updatedRecords;
                save(records);
                renderList(records);
            }
        }
    });

    cardsEl.addEventListener('submit', function (event) {
        const form = event.target.closest('.edit-form');
        if (!form) return;
        event.preventDefault();

        const card = form.closest('.event-card');
        const id = card.dataset.id;

        const title = form.elements.title.value.trim();
        const dueDate = form.elements.dueDate.value.trim();
        const duration = form.elements.duration.value.trim();
        const tags = editEvent(form.elements.tags.value);

        if (!isValidTitle(title)) return alert("Title invalid");
        if (!isValidDate(dueDate)) return alert("Date invalid");
        if (!isValidDuration(duration)) return alert("Duration invalid");

        const idx = records.findIndex(r => r.id === id);
        if (idx !== -1) {
            records[idx] = {
                ...records[idx],
                title,
                dueDate,
                duration: Number(duration),
                tags,
                updatedAt: new Date().toISOString()
                /*The above line of code is used to update the value of the
                updatedAt property of the card which was edited*/
            };
            save(records);
            exitEditMode(id);
        }
    });

    load();
});
