document.addEventListener("DOMContentLoaded", function () {
  const scheduleData = [
    { id: 1, date: '2025-06-14', type: 'Кардио', title: 'Утренняя зумба', freeSlots: 3 },
    { id: 2, date: '2025-06-14', type: 'Силовые', title: 'Фитнес с железом', freeSlots: 1 },
    { id: 3, date: '2025-06-15', type: 'Йога', title: 'Йога на рассвете', freeSlots: 0 },
  ];

  const scheduleContainer = document.getElementById('schedule-items');
  const filterDate = document.getElementById('filter-date');
  const filterType = document.getElementById('filter-type');
  const filterFree = document.getElementById('filter-free');
  const recordSection = document.getElementById('record-section');
  const selectedEventName = document.getElementById('selected-event-name');
  const recordForm = document.getElementById('record-form');
  const clockSvg = document.getElementById('clock');
  const successText = document.getElementById('success-text');
  const formBody = recordForm;

  function renderSchedule(items) {
    scheduleContainer.innerHTML = '';
    if (items.length === 0) {
      scheduleContainer.innerHTML = '<p class="text-muted">Нет подходящих мероприятий</p>';
      return;
    }
    items.forEach(event => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-3';
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h5>${event.title}</h5>
            <p><strong>Дата:</strong> ${event.date}</p>
            <p><strong>Тип:</strong> ${event.type}</p>
            <p><strong>Свободных мест:</strong> ${event.freeSlots}</p>
            <button class="btn btn-success" ${event.freeSlots <= 0 ? 'disabled' : ''} data-id="${event.id}">Записаться</button>
          </div>
        </div>
      `;
      scheduleContainer.appendChild(card);
    });
  }

  function filterSchedule() {
    const date = filterDate.value;
    const type = filterType.value;
    const onlyFree = filterFree.checked;

    let filtered = scheduleData;
    if (date) filtered = filtered.filter(e => e.date === date);
    if (type) filtered = filtered.filter(e => e.type === type);
    if (onlyFree) filtered = filtered.filter(e => e.freeSlots > 0);

    renderSchedule(filtered);
  }

  scheduleContainer.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
      const id = parseInt(e.target.dataset.id);
      const event = scheduleData.find(ev => ev.id === id);
      if (!event || event.freeSlots <= 0) return;

      selectedEventName.textContent = event.title;
      recordForm.dataset.id = id;
      document.getElementById('abonement-number').value = '';
      formBody.style.display = 'block';
      clockSvg.style.display = 'none';
      successText.style.display = 'none';
      recordSection.style.display = 'block';
    }
  });

  recordForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const abonement = document.getElementById('abonement-number').value.trim();
    if (!abonement.match(/^\d{4}$/)) {
      alert('Введите корректный номер абонемента (4 цифры)');
      return;
    }

    const id = parseInt(recordForm.dataset.id);
    const event = scheduleData.find(ev => ev.id === id);
    if (!event || event.freeSlots <= 0) {
      alert('Мест больше нет');
      return;
    }

    formBody.style.display = 'none';
    clockSvg.style.display = 'block';
    successText.style.display = 'none';

    setTimeout(() => {
      clockSvg.style.display = 'none';
      successText.style.display = 'block';
      event.freeSlots -= 1;
      renderSchedule(scheduleData);

      setTimeout(() => {
        recordSection.style.display = 'none';
      }, 3000);
    }, 1500);
  });

  filterDate.addEventListener('change', filterSchedule);
  filterType.addEventListener('change', filterSchedule);
  filterFree.addEventListener('change', filterSchedule);

  renderSchedule(scheduleData);
});