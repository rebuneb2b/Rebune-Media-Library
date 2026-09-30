const attachments = [["مجفف ما قبل التصفيف", 1, "لتجفيف الشعر قبل متابعة التصفيف."], ["فوهة التصفيف", 2, "لتوجيه تدفق الهواء أثناء التصفيف."], ["أسطوانة 30 مم", 3, "لتشكيل خصل الشعر باستخدام الأسطوانة الأصغر."], ["أسطوانة 40 مم", 4, "لتشكيل خصل الشعر باستخدام الأسطوانة الأكبر."], ["فرشاة التمليس", 5, "لتمشيط الخصل وتصفيفها."], ["الفرشاة البيضاوية", 6, "لتصفيف الشعر وتشكيل الأطراف."]];
document.querySelectorAll('[data-attachment]').forEach(button => button.addEventListener('click', () => {
const [title,number,copy] = attachments[Number(button.dataset.attachment)];
document.querySelectorAll('[data-attachment]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
const image = document.querySelector('#attachment-image'); image.src = '/products/RE0008/assets/attachment-' + number + '.jpg'; image.alt = title;
document.querySelector('#attachment-title').textContent = title;
document.querySelector('#attachment-copy').textContent = copy;
}));