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
const viewButtons = [...document.querySelectorAll('.gallery-tabs [data-view]')];
viewButtons.forEach(button => button.addEventListener('click', () => {
 viewButtons.forEach(item => item.setAttribute('aria-pressed',String(item === button)));
 const image=document.querySelector('#gallery-image'); image.src='/products/RE-3-076/assets/'+button.dataset.view; image.alt=button.dataset.alt;
 document.querySelector('#gallery-caption').textContent=button.dataset.alt;
}));


const load3d = document.querySelector("#load-3d");
if (load3d) {
  load3d.addEventListener("click", async () => {
    load3d.disabled = true;
    const host = document.querySelector("#iron-viewer");
    const status = document.querySelector("#viewer-status");
    host.setAttribute("aria-busy", "true");
    status.textContent = "جارٍ تحميل النموذج…";
    try {
      const { mountIronViewer } = await import("./iron-viewer.js");
      await mountIronViewer(host, "/products/RE-3-076/assets/RE-3-076.glb", "كاوية الملابس البخارية ريبون RE-3-076");
      document.querySelector("#viewer-controls").hidden = false;
      status.textContent = "العرض جاهز — اسحب المنتج لاستكشافه.";
    } catch (error) {
      console.error("Steamer viewer:", error);
      status.textContent = "تعذّر تشغيل العرض ثلاثي الأبعاد. يمكنك إعادة المحاولة أو مشاهدة صور المنتج في الصفحة.";
      load3d.disabled = false;
    } finally {
      host.setAttribute("aria-busy", "false");
    }
  });
}
