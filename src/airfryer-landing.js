const programs = [{"name": "بطاطس مقلية", "english": "Fries", "temp": 200, "time": 20, "shake": true}, {"name": "أجنحة الدجاج", "english": "Wings", "temp": 190, "time": 22, "shake": true}, {"name": "خضروات", "english": "Vegetables", "temp": 180, "time": 10, "shake": true}, {"name": "سمك", "english": "Fish", "temp": 190, "time": 10, "shake": true}, {"name": "روبيان", "english": "Shrimp", "temp": 160, "time": 15, "shake": true}, {"name": "ستيك", "english": "Steak", "temp": 200, "time": 10, "shake": true}, {"name": "كباب", "english": "Kebab", "temp": 200, "time": 15, "shake": true}, {"name": "بطاطس", "english": "Potato", "temp": 200, "time": 30, "shake": true}, {"name": "كيك", "english": "Cake", "temp": 160, "time": 30, "shake": false}, {"name": "بسكويت", "english": "Biscuits", "temp": 180, "time": 15, "shake": true}, {"name": "بيض", "english": "Egg", "temp": 150, "time": 18, "shake": false}, {"name": "إعادة التسخين", "english": "Reheat", "temp": 175, "time": 4, "shake": false}];
const programButtons = [...document.querySelectorAll('[data-program]')];
programButtons.forEach((button, index) => button.addEventListener('click', () => {
  const program = programs[index];
  programButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#program-name').textContent = program.name;
  document.querySelector('#program-english').textContent = program.english;
  document.querySelector('#program-temp').textContent = program.temp;
  document.querySelector('#program-time').textContent = program.time;
  document.querySelector('#program-shake').textContent = program.shake ? 'يتضمن تنبيهًا لتقليب الطعام.' : 'لا يتضمن هذا البرنامج تنبيهًا للتقليب.';
}));
const viewButtons = [...document.querySelectorAll('[data-view]')];
viewButtons.forEach(button => button.addEventListener('click', () => {
  viewButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const photo = document.querySelector('#gallery-image');
  photo.src = '/products/RE-11-065/assets/' + button.dataset.view;
  photo.alt = button.dataset.alt;
  document.querySelector('#gallery-caption').textContent = button.dataset.alt;
}));
