const attachments = [{"title": "أسطوانة 30 مم", "src": "/products/RE0008/assets/barrel-30.png", "copy": "لتشكيل خصل الشعر باستخدام أسطوانة بقطر 30 مم."}, {"title": "أسطوانة 40 مم", "src": "/products/RE0008/assets/barrel-40.png", "copy": "لتشكيل خصل الشعر باستخدام أسطوانة بقطر 40 مم."}, {"title": "الفرشاة البيضاوية", "src": "/products/RE0008/assets/oval-brush.png", "copy": "لتصفيف الشعر وتشكيل الأطراف."}, {"title": "فرشاة التمليس", "src": "/products/RE0008/assets/smoothing-brush.png", "copy": "لتمشيط الخصل وتصفيفها أثناء مرور الهواء."}, {"title": "فوهة التصفيف", "src": "/products/RE0008/assets/styling-nozzle.png", "copy": "لتوجيه تدفق الهواء أثناء التصفيف."}, {"title": "معطر", "src": "/products/RE0008/assets/fragrance.png", "copy": "ملحق المعطر الموضّح ضمن مجموعة الجهاز."}];
const buttons = [...document.querySelectorAll('[data-attachment]')];
const photo = document.querySelector('#attachment-image');
const dialog = document.querySelector('#attachment-dialog');
let active = 0;
function select(index) {
  active = (index + attachments.length) % attachments.length;
  const item = attachments[active];
  buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === active)));
  photo.src = item.src; photo.alt = item.title;
  document.querySelector('#attachment-title').textContent = item.title;
  document.querySelector('#attachment-copy').textContent = item.copy;
  document.querySelector('#attachment-count').textContent = `${String(active + 1).padStart(2, '0')} / 06`;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    photo.animate([{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 260});
  }
}
buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
document.querySelector('#attachment-prev').addEventListener('click', () => select(active - 1));
document.querySelector('#attachment-next').addEventListener('click', () => select(active + 1));
document.querySelector('.attachment-tabs').addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const focused = buttons.indexOf(document.activeElement);
  select(event.key === 'Home' ? 0 : event.key === 'End' ? 5 : (focused < 0 ? active : focused) + (event.key === 'ArrowLeft' ? 1 : -1));
  buttons[active].focus();
});
let start;
photo.addEventListener('pointerdown', event => {start = {x:event.clientX,y:event.clientY};});
photo.addEventListener('pointerup', event => {
  if (!start) return;
  const dx = event.clientX - start.x, dy = event.clientY - start.y;
  start = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) select(active + (dx > 0 ? 1 : -1));
});
photo.addEventListener('pointercancel', () => {start = null;});
photo.addEventListener('dragstart', event => event.preventDefault());
document.querySelector('#attachment-zoom').addEventListener('click', () => {
  const item = attachments[active];
  document.querySelector('#zoom-title').textContent = item.title;
  const zoom = document.querySelector('#zoom-image'); zoom.src = item.src; zoom.alt = item.title;
  dialog.showModal();
});
document.querySelector('#attachment-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if (event.target === dialog) {const r=dialog.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close();}});
