const fabrics = [
  ['●', 'حرارة منخفضة', 'للأقمشة الصناعية مثل النايلون. ابدأ بالأقمشة التي تتطلب أقل حرارة.'],
  ['● ●', 'حرارة متوسطة', 'للصوف والحرير، مع اتباع بطاقة العناية. تجنّب رش الماء على الحرير وفق دليل الاستخدام.'],
  ['● ● ●', 'حرارة مرتفعة', 'للقطن والكتان إذا سمحت بطاقة العناية. تُستخدم دفعة البخار عند درجات الحرارة المرتفعة فقط.'],
];
const buttons = [...document.querySelectorAll('[data-fabric]')];
buttons.forEach(button => button.addEventListener('click', () => {
  const [symbol, title, copy] = fabrics[Number(button.dataset.fabric)];
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#heat-symbol').textContent = symbol;
  document.querySelector('#heat-title').textContent = title;
  document.querySelector('#heat-copy').textContent = copy;
}));

const load3d = document.querySelector('#load-3d');
load3d.addEventListener('click', async () => {
  load3d.disabled = true;
  const host = document.querySelector('#iron-viewer');
  const status = document.querySelector('#viewer-status');
  host.setAttribute('aria-busy', 'true');
  status.textContent = 'جارٍ تحميل النموذج…';
  try {
    const { mountIronViewer } = await import('./iron-viewer.js');
    await mountIronViewer(host);
    document.querySelector('#viewer-controls').hidden = false;
    status.textContent = 'العرض جاهز — اسحب المنتج لاستكشافه.';
  } catch (error) {
    console.error('Iron viewer:', error);
    status.textContent = 'تعذّر تشغيل العرض ثلاثي الأبعاد. يمكنك إعادة المحاولة أو مشاهدة صور المنتج في الصفحة.';
    load3d.disabled = false;
  } finally { host.setAttribute('aria-busy', 'false'); }
});
