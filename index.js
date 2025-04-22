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

    // Модальное окно
    function getDrinkWord(count) {
        const lastTwo = count % 100;
        const lastOne = count % 10;
        
        if (lastTwo >= 11 && lastTwo <= 19) {
            return 'напитков';
        }
        if (lastOne === 1) {
            return 'напиток';
        }
        if (lastOne >= 2 && lastOne <= 4) {
            return 'напитка';
        }
        return 'напитков';
    }

    function getMilkName(value) {
        const milkTypes = {
            'usual': 'обычное',
            'no-fat': 'обезжиренное',
            'soy': 'соевое',
            'coconut': 'кокосовое'
        };
        return milkTypes[value] || '';
    }

    function getOptionsText(options) {
        const optionNames = {
            'whipped cream': 'взбитые сливки',
            'marshmallow': 'зефирки',
            'chocolate': 'шоколад',
            'cinnamon': 'корица'
        };
        return options.map(opt => optionNames[opt]).join(', ');
    }

    document.querySelector('.submit-button').addEventListener('click', function(e) {
        e.preventDefault();
        const beverages = document.querySelectorAll('.beverage');
        const drinkCount = beverages.length;
        const drinkWord = getDrinkWord(drinkCount);
        
        let tableHTML = `
            <div>Вы заказали ${drinkCount} ${drinkWord}</div>
            <table class="order-table">
                <thead>
                    <tr>
                        <th>Напиток</th>
                        <th>Молоко</th>
                        <th>Дополнительно</th>
                    </tr>
                </thead>
                <tbody>
        `;

        beverages.forEach(beverage => {
            const drinkType = beverage.querySelector('select').value;
            const drinkNames = {
                'espresso': 'Эспрессо',
                'capuccino': 'Капучино',
                'cacao': 'Какао'
            };
            const drinkName = drinkNames[drinkType] || drinkType;

            const milkRadio = beverage.querySelector('input[name^="milk"]:checked');
            const milkType = milkRadio ? milkRadio.value : '';
            const milkName = getMilkName(milkType);

            const options = Array.from(beverage.querySelectorAll('input[name="options"]:checked'))
                .map(checkbox => checkbox.value);
            const optionsText = getOptionsText(options);

            tableHTML += `
                <tr>
                    <td>${drinkName}</td>
                    <td>${milkName}</td>
                    <td>${optionsText}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
            <div class="time-selection">
                <label for="order-time">Выберите время заказа:</label>
                <input type="time" id="order-time" required>
            </div>
            <button class="confirm-button">Оформить</button>
        `;

        document.querySelector('.modal-content').innerHTML = tableHTML;
        document.getElementById('modalOverlay').style.display = 'flex';

        document.querySelector('.confirm-button')?.addEventListener('click', function() {
            const timeInput = document.getElementById('order-time');
            const selectedTime = timeInput.value;
            
            if (!selectedTime) {
                timeInput.style.borderColor = 'red';
                alert('Пожалуйста, укажите время заказа');
                return;
            }

            const now = new Date();
            const [hours, minutes] = selectedTime.split(':');
            const selectedDate = new Date();
            selectedDate.setHours(hours, minutes);
            
            if (selectedDate <= now) {
                timeInput.style.borderColor = 'red';
                alert('Мы не умеем перемещаться во времени. Выберите время позже, чем текущее');
            } else {
                timeInput.style.borderColor = '';
                document.getElementById('modalOverlay').style.display = 'none';

                //document.querySelector('form').reset();
                //window.location.href = 'index.html';

                document.querySelector('form').reset();
                const beverages = document.querySelectorAll('.beverage');
                for (let i = beverages.length - 1; i > 0; i--) {
                    beverages[i].remove();
                }
                updateHeaders();
                updateRemoveButtons();
            }
        });
    });

    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('modalOverlay').style.display = 'none';
    });

    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
});