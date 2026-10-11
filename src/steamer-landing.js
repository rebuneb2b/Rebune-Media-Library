const modes = {
 vertical: {image:'vertical.png',alt:'وضع الكي الرأسي',number:'01 / VERTICAL',title:'عناية بالملابس المعلّقة.',description:'ثبّت لوح الكي رأسيًا وعلّق القطعة على العلاقة. حرّك رأس البخار على القماش وفق تعليمات الاستخدام والعناية بالملابس.',detail:'علاقة ملابس + دعم رأسي للكي'},
 horizontal: {image:'horizontal.png',alt:'وضع الكي الأفقي',number:'02 / HORIZONTAL',title:'دعم أفقي لتفاصيل القطعة.',description:'ثبّت اللوح أفقيًا لتوفير سطح يدعم القماش أثناء الكي. اضبط ارتفاع العمود وثبّت الأجزاء جيدًا وفق دليل الاستخدام.',detail:'لوح أفقي + ارتفاع قابل للتعديل'}
};
const modeButtons = [...document.querySelectorAll('[data-mode]')];
modeButtons.forEach(button => button.addEventListener('click', () => {
 const mode = modes[button.dataset.mode];
 modeButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
 const image = document.querySelector('#mode-image'); image.src='/products/RE-3-076/assets/'+mode.image; image.alt=mode.alt;
 for (const key of ['number','title','description','detail']) document.querySelector('#mode-'+key).textContent=mode[key];
}));
const viewButtons = [...document.querySelectorAll('[data-view]')];
viewButtons.forEach(button => button.addEventListener('click', () => {
 viewButtons.forEach(item => item.setAttribute('aria-pressed',String(item === button)));
 const image=document.querySelector('#gallery-image'); image.src='/products/RE-3-076/assets/'+button.dataset.view; image.alt=button.dataset.alt;
 document.querySelector('#gallery-caption').textContent=button.dataset.alt;
}));
