const load3d = document.querySelector('#load-3d');
load3d.addEventListener('click', async () => {
  load3d.disabled = true;
  const host = document.querySelector('#iron-viewer');
  const status = document.querySelector('#viewer-status');
  host.setAttribute('aria-busy', 'true');
  status.textContent = 'جارٍ تحميل النموذج…';
  try {
    const { mountIronViewer } = await import('./iron-viewer.js');
    await mountIronViewer(host, '/products/RE-1-132/assets/model.glb', 'غلاية ريبون');
    document.querySelector('#viewer-controls').hidden = false;
    status.textContent = 'العرض جاهز — اسحب المنتج لاستكشافه.';
  } catch (error) {
    console.error('Iron viewer:', error);
    status.textContent = 'تعذّر تشغيل العرض ثلاثي الأبعاد. يمكنك إعادة المحاولة أو مشاهدة صور المنتج في الصفحة.';
    load3d.disabled = false;
  } finally { host.setAttribute('aria-busy', 'false'); }
});

const range = document.querySelector('#temperature-range');
function updateTemperature(value) {
 range.value = value; range.setAttribute('aria-valuetext', value + ' درجة مئوية');
 document.querySelector('#temperature').textContent = value + '°C';
 document.querySelectorAll('[data-temp]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.temp === String(value))));
}
range.addEventListener('input', () => updateTemperature(range.value));
document.querySelectorAll('[data-temp]').forEach(button => button.addEventListener('click', () => updateTemperature(button.dataset.temp)));
