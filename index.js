document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.add-button');
    const form = document.querySelector('form');

    function updateHeaders() {
        document.querySelectorAll('.beverage').forEach((fieldset, i) => {
            const header = fieldset.querySelector('.beverage-count');
            header.textContent = `Напиток №${i + 1}`;
        });
    }

    function updateRemoveButtons() {
        const all = document.querySelectorAll('.beverage');
        all.forEach(fs => {
            const btn = fs.querySelector('.remove-button');
            if (btn) {
                btn.disabled = all.length <= 1;
            }
        });
    }

    function insertRemoveButton(fieldset) {
        if (!fieldset.querySelector('.remove-button')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'remove-button';
            btn.innerHTML = '&times;';
            btn.setAttribute('aria-label', 'Удалить напиток');

            btn.style.position = 'absolute';
            btn.style.top = '5px';
            btn.style.right = '10px';
            btn.style.background = 'none';
            btn.style.border = 'none';
            btn.style.fontSize = '24px';
            btn.style.cursor = 'pointer';

            fieldset.style.position = 'relative';
            fieldset.insertBefore(btn, fieldset.firstElementChild);
        }
    }

    function attachRemoveHandler(fieldset) {
        const btn = fieldset.querySelector('.remove-button');
        btn.addEventListener('click', () => {
            const beverages = document.querySelectorAll('.beverage');
            if (beverages.length > 1) {
                fieldset.remove();
                updateHeaders();
                updateRemoveButtons();
            }
        });
    }

    document.querySelectorAll('.beverage').forEach(fs => {
        insertRemoveButton(fs);
        attachRemoveHandler(fs);
    });
    updateRemoveButtons();

    addButton.addEventListener('click', () => {
        const beverageTemplate = document.querySelector('.beverage');
        const newFieldset = beverageTemplate.cloneNode(true);

        newFieldset.querySelector('select').selectedIndex = 0;
        newFieldset.querySelectorAll('input[type="radio"]').forEach((el, i) => el.checked = i === 0);
        newFieldset.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);

        const fieldsetIndex = document.querySelectorAll('.beverage').length;
        const newRadioName = `milk-${fieldsetIndex}`;
        newFieldset.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.name = newRadioName;
        });

        insertRemoveButton(newFieldset);
        attachRemoveHandler(newFieldset);

        form.insertBefore(newFieldset, addButton.parentElement);
        updateHeaders();
        updateRemoveButtons();
    });
});

document.querySelector('.submit-button').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('modalOverlay').style.display = 'flex';
});

document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('modalOverlay').style.display = 'none';
});

document.getElementById('modalOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        this.style.display = 'none';
    }
});