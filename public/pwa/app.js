(() => {
 if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
 const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
 let deferred = null;
 const button = document.createElement('button');
 button.type = 'button'; button.className = 'rebune-install'; button.textContent = 'تثبيت مكتبة ريبون'; button.hidden = standalone();
 const dialog = document.createElement('dialog'); dialog.className = 'rebune-install-dialog';
 dialog.innerHTML = `<form method="dialog"><button class="rebune-close" aria-label="إغلاق">×</button></form><img src="/pwa/icon-192.png" alt="ريبون" width="64" height="64"><h2>مكتبة ريبون على جوالك</h2><p class="rebune-install-help"></p><button type="button" class="rebune-install-action" hidden>تثبيت التطبيق</button><p class="rebune-install-status" role="status"></p>`;
 document.body.append(button, dialog);
 const help = dialog.querySelector('.rebune-install-help');
 const action = dialog.querySelector('.rebune-install-action');
 const status = dialog.querySelector('.rebune-install-status');
 const render = () => {
 const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
 action.hidden = !deferred;
 help.textContent = deferred ? 'أضف أيقونة ريبون إلى شاشة جهازك وافتح المكتبة كالتطبيق.' : ios ? 'افتح المكتبة في Safari، ثم اضغط مشاركة واختر «إضافة إلى الشاشة الرئيسية»، ثم «إضافة».' : 'من قائمة المتصفح اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» إن كان الخيار متاحًا. قد تحتاج إلى فتح الموقع في Chrome أو Edge.';
 };
 button.addEventListener('click', () => { render(); status.textContent = ''; dialog.showModal(); });
 dialog.addEventListener('click', e => { if (e.target === dialog) { const box = dialog.getBoundingClientRect(); if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close(); } });
 window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferred = event; button.hidden = standalone(); render(); });
 action.addEventListener('click', async () => {
  if (!deferred) return;
  const prompt = deferred; deferred = null; action.disabled = true;
  try { await prompt.prompt(); const choice = await prompt.userChoice; status.textContent = choice.outcome === 'accepted' ? 'تم قبول طلب التثبيت.' : 'يمكنك التثبيت لاحقًا من قائمة المتصفح.'; }
  catch { status.textContent = 'استخدم خيار التثبيت في قائمة المتصفح.'; }
  finally { action.disabled = false; render(); }
 });
 window.addEventListener('appinstalled', () => { deferred = null; button.hidden = true; dialog.close(); });
 matchMedia('(display-mode: standalone)').addEventListener('change', () => { button.hidden = standalone(); });
 let updating = false;
 navigator.serviceWorker.addEventListener('controllerchange', () => { if (updating) location.reload(); });
 navigator.serviceWorker.register('/sw.js', {scope:'/', updateViaCache:'none'}).then(registration => {
  const showUpdate = () => {
   if (!registration.waiting || !navigator.serviceWorker.controller || document.querySelector('.rebune-update')) return;
   const update = document.createElement('button'); update.className = 'rebune-update'; update.type = 'button'; update.textContent = 'تحديث مكتبة ريبون';
   update.onclick = () => { updating = true; registration.waiting?.postMessage({type:'SKIP_WAITING'}); }; document.body.append(update);
  };
  showUpdate(); registration.addEventListener('updatefound', () => { const worker = registration.installing; worker?.addEventListener('statechange', () => { if (worker.state === 'installed') showUpdate(); }); });
 }).catch(() => { /* The online site remains available if worker registration fails. */ });
})();
