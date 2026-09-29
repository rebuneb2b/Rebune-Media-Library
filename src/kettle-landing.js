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

const display = document.querySelector('#segment-display');
const output = document.querySelector('#temperature');
const status = document.querySelector('#panel-status');
let temperature = 80;
let warming = false;
let boiling = false;
const digits = ['abcdef', 'bc', 'abged', 'abgcd', 'fgbc', 'afgcd', 'afgecd', 'abc', 'abcdefg', 'abcdfg'];
const bars = {a:'9,4 39,4 44,9 39,14 9,14 4,9',b:'40,15 45,10 50,15 50,43 45,48 40,43',c:'40,55 45,50 50,55 50,83 45,88 40,83',d:'9,84 39,84 44,89 39,94 9,94 4,89',e:'0,55 5,50 10,55 10,83 5,88 0,83',f:'0,15 5,10 10,15 10,43 5,48 0,43',g:'9,44 39,44 44,49 39,54 9,54 4,49'};
function renderTemperature() {
 const chars = String(temperature).padStart(3, ' ');
 display.innerHTML = [...chars].map((char,index) => `<g transform="translate(${index*58},0)">${Object.entries(bars).map(([key,points]) => `<polygon points="${points}" class="${char !== ' ' && digits[Number(char)].includes(key) ? 'segment-on' : 'segment-off'}"/>`).join('')}</g>`).join('') + '<text x="174" y="91" fill="white" font-size="23" font-family="sans-serif">°C</text>';
 output.textContent = temperature + ' درجة مئوية';
 document.querySelectorAll('[data-temp]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.temp) === temperature)));
 document.querySelector('#temp-plus').disabled = temperature === 100;
 document.querySelector('#temp-minus').disabled = temperature === 40;
 document.querySelector('#keep-warm').setAttribute('aria-pressed', String(warming));
 document.querySelector('#panel-power').setAttribute('aria-pressed', String(boiling));
 document.querySelector('#panel-power').setAttribute('aria-label', boiling ? 'إيقاف محاكاة الغلي' : 'تشغيل محاكاة الغلي');
}
function setTemperature(value) {
 temperature = Math.max(40, Math.min(100,value)); boiling = false;
 status.textContent = `الحرارة المحددة: ${temperature}°C${warming ? ' · حفظ الحرارة مفعّل في المحاكاة لمدة ساعتين.' : ''}`;
 renderTemperature();
}
document.querySelectorAll('[data-temp]').forEach(button => button.addEventListener('click', () => setTemperature(Number(button.dataset.temp))));
document.querySelector('#temp-plus').addEventListener('click', () => setTemperature(temperature + 5));
document.querySelector('#temp-minus').addEventListener('click', () => setTemperature(temperature - 5));
document.querySelector('#keep-warm').addEventListener('click', () => {
 warming = !warming; boiling = false;
 status.textContent = warming ? `محاكاة حفظ الحرارة عند ${temperature}°C لمدة ساعتين.` : 'تم إيقاف حفظ الحرارة في المحاكاة.';
 renderTemperature();
});
document.querySelector('#panel-power').addEventListener('click', () => {
 boiling = !boiling; warming = false;
 if (boiling) temperature = 100;
 status.textContent = boiling ? 'محاكاة وضع الغلي: الدرجة المستهدفة 100°C.' : 'تم إيقاف محاكاة الغلي.';
 renderTemperature();
});
renderTemperature();
