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
