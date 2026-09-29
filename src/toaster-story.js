import { createToaster } from './toaster-model.js';
const scenes=[
['ريبون · RE-5-087','لصباحك.<br><em>قرمشة على ذوقك.</em>','اكتشف محمصة ريبون الذكية.','',1,0,1,.12],
['01 / التصميم','تفاصيل أنيقة.<br><em>كل صباح.</em>','هيكل أسود ولمسات فضية، مع فتحتين لتحميص شريحتين.','شريحتان في المرة الواحدة',1,0,1,.2],
['02 / التحميص','خفيف أم داكن؟<br><em>الاختيار لك.</em>','ستة مستويات لتختار درجة التحميص التي تفضّلها.','<b>6</b> مستويات تحميص',1,0,1,.3],
['03 / الشاشة','الوقت أمامك.<br><em>بوضوح.</em>','شاشة رقمية لعرض الوقت مع زري زيادة أو تقليل عشر ثوانٍ.','<bdi>+10s / −10s</bdi>',1,0,1,.25],
['04 / الوظائف','أكثر من تحميص.<br><em>خيارات يومية.</em>','وظائف البيغل وإذابة التجميد وإعادة التسخين، مع زر الإلغاء.','Bagel · Defrost · Reheat',1,0,1,.2],
['05 / الاستخدام','ضع الخبز.<br><em>واختر درجتك.</em>','أدخل شريحتي الخبز واضبط المستوى، ثم أنزل ذراع التحميص.','حركة توضيحية لدورة التحميص',1,0,1,.35],
['06 / جاهز للصباح','لحظة القرمشة.<br><em>حان وقتها.</em>','يرتفع الخبز عند اكتمال التحميص.','<b>800</b> واط',1,0,1,.2],
['محمصة ريبون · RE-5-087','ريبون.<br><em>أبعد من الخيال.</em>','تفاصيل تصنع بداية أجمل.','800 واط · 6 مستويات · شاشة رقمية',1,0,1,.2]
];const $=id=>document.getElementById(id),visual=document.querySelector('.visual'),copy=document.querySelector('.copy');let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,p=0,target=0,last=-1,raf=0;
let model;const productImage=document.getElementById('product'),modelCanvas=document.getElementById('toaster-canvas');
modelCanvas.style.display='none';
function fallback(error){model=null;modelCanvas.style.display='none';productImage.hidden=false;console.warn('3D unavailable',error)}
try{model=createToaster(modelCanvas);model.ready.then(()=>{modelCanvas.style.display='block';productImage.hidden=true;updateTarget()}).catch(fallback)}catch(error){fallback(error)}

function go(i){window.scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*i/7,behavior:reduced?'instant':'smooth'})}
scenes.forEach((s,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',s[0]);b.onclick=()=>go(i);$('chapters').append(b)});
function updateTarget(){target=Math.max(0,Math.min(7,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)*7));if(!raf)raf=requestAnimationFrame(draw)}
function draw(){raf=0;p=reduced?target:p+(target-p)*.09;if(Math.abs(target-p)<.001)p=target;const i=Math.min(7,Math.floor(p+.3)),s=scenes[i];if(i!==last){last=i;$('eyebrow').textContent=s[0];$('title').innerHTML=s[1];$('description').textContent=s[2];$('detail').innerHTML=s[3];$('actions').hidden=i!==7;$('count').textContent=`0${i+1} / 08`;$('next').textContent=i===7?'إعادة الرحلة ↑':'تابع الاكتشاف ↓';[...$('chapters').children].forEach((b,j)=>b.setAttribute('aria-current',j===i?'true':'false'))}
const a=Math.floor(p),b=Math.min(7,a+1),t=p-a,u=t*t*(3-2*t),mix=k=>scenes[a][k]+(scenes[b][k]-scenes[a][k])*u,mobile=innerWidth<701;
if(model)model.update(p,reduced);visual.style.transform=model?'none':reduced?'none':`translateY(${mix(5)*(mobile?.15:1)}%) scale(${mobile?1+(mix(4)-1)*.3:mix(4)})`;document.body.style.setProperty('--heat',mix(7));document.body.style.setProperty('--light',mix(6));const end=Math.max(0,(p-6.3)/.7),v=Math.round(17+end*230);document.body.style.setProperty('--bg',`rgb(${v},${Math.round(v*.973)},${Math.round(v*.943)})`);document.body.style.color=end>.55?'#211810':'#f9f3ea';document.body.style.setProperty('--ink',end>.55?'#211810':'#fff');document.body.style.setProperty('--muted',end>.55?'#756657':'#b8b1a8');$('progress').style.width=`${p/7*100}%`;if(p!==target)raf=requestAnimationFrame(draw)}
$('next').onclick=()=>go(last===7?0:last+1);$('replay').onclick=()=>go(0);function motionLabel(){$('motion').textContent=reduced?'تفعيل الحركة':'تقليل الحركة';$('motion').setAttribute('aria-pressed',String(reduced))}$('motion').onclick=()=>{reduced=!reduced;motionLabel();updateTarget()};addEventListener('scroll',updateTarget,{passive:true});addEventListener('resize',updateTarget);motionLabel();updateTarget();

const film=document.getElementById('film');document.getElementById('watch').onclick=()=>{film.showModal();film.querySelector('video').play().catch(()=>{})};document.getElementById('close-film').onclick=()=>film.close();film.addEventListener('close',()=>film.querySelector('video').pause());
