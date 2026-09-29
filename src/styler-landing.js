const load3d = document.querySelector('#load-3d');
load3d.addEventListener('click', async () => {
  load3d.disabled = true;
  const host = document.querySelector('#iron-viewer');
  const status = document.querySelector('#viewer-status');
  host.setAttribute('aria-busy', 'true');
  status.textContent = 'جارٍ تحميل النموذج…';
  try {
    const { mountIronViewer } = await import('./iron-viewer.js');
    await mountIronViewer(host, '/products/RE-2207-2/assets/model.glb', 'مصفف شعر ريبون');
    document.querySelector('#viewer-controls').hidden = false;
    status.textContent = 'العرض جاهز — اسحب المنتج لاستكشافه.';
  } catch (error) {
    console.error('Iron viewer:', error);
    status.textContent = 'تعذّر تشغيل العرض ثلاثي الأبعاد. يمكنك إعادة المحاولة أو مشاهدة صور المنتج في الصفحة.';
    load3d.disabled = false;
  } finally { host.setAttribute('aria-busy', 'false'); }
});

const attachments = {round: ['round-brush.png', 'الفرشاة الدائرية', 'ملحق دائري لتصفيف الخصل وتشكيل الأطراف.'], half: ['half-brush.png', 'الفرشاة النصفية', 'ملحق نصفي لتصفيف خصل الشعر.']};
document.querySelectorAll('[data-attachment]').forEach(button => button.addEventListener('click', () => {
 const [image, title, copy] = attachments[button.dataset.attachment];
 document.querySelectorAll('[data-attachment]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
 const visual = document.querySelector('#attachment-image');
 visual.src = '/products/RE-2207-2/assets/' + image; visual.alt = title;
 document.querySelector('#attachment-title').textContent = title;
 document.querySelector('#attachment-copy').textContent = copy;
}));
