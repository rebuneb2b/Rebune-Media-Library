const film = document.querySelector('details');
film?.addEventListener('toggle', () => {
  if (!film.open) film.querySelector('video')?.pause();
});
const choices = [...document.querySelectorAll('.toast-choice')];
const slider = document.querySelector('#toast-level');
const preview = document.querySelector('#toast-preview');
const description = document.querySelector('#toast-description');
function selectLevel(level) {
  const selected = choices.find(button => Number(button.dataset.level) === Number(level));
  if (!selected) return;
  choices.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
  preview.style.setProperty('--toast', selected.dataset.color);
  description.textContent = `المستوى ${level} · ${selected.dataset.label}`;
  slider.value = String(level);
  slider.setAttribute('aria-valuetext', `المستوى ${level}: ${selected.dataset.label}`);
}
if (choices.length && slider && preview && description) {
  document.querySelector('.toast-preview').hidden = false;
  document.querySelector('.toast-slider').hidden = false;
  choices.forEach(button => button.addEventListener('click', () => selectLevel(button.dataset.level)));
  slider.addEventListener('input', () => selectLevel(slider.value));
  selectLevel(slider.value);
}
