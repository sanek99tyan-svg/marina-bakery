const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];
const menu=q('#menuBtn'), drawer=q('#drawer'), close=q('#drawerClose');
function setDrawer(v){drawer.classList.toggle('open',v);drawer.setAttribute('aria-hidden',String(!v));document.body.style.overflow=v?'hidden':''}
menu?.addEventListener('click',()=>setDrawer(true)); close?.addEventListener('click',()=>setDrawer(false)); qa('.drawer a').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.14}); qa('.reveal').forEach(el=>io.observe(el));

const counterIO=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return; const el=e.target, end=+el.dataset.count; let n=0; const step=Math.max(1,Math.round(end/45)); const t=setInterval(()=>{n=Math.min(end,n+step);el.textContent=n+(end===100?'':''); if(n>=end)clearInterval(t)},28); counterIO.unobserve(el)}),{threshold:.5}); qa('[data-count]').forEach(el=>counterIO.observe(el));

const heroArt=q('#heroArt'); window.addEventListener('scroll',()=>{const y=window.scrollY;if(heroArt&&y<window.innerHeight*1.2){heroArt.style.transform=`translate3d(0,${y*.08}px,0) scale(${1-y*.00005})`; qa('.floating').forEach((el,i)=>el.style.transform=`translate3d(${Math.sin(y/90+i)*12}px,${y*(.06+i*.015)}px,0) rotate(${y*.03*(i+1)}deg)`)}} ,{passive:true});

if(matchMedia('(pointer:fine)').matches){const c=q('.cursor'),d=q('.cursor-dot');window.addEventListener('mousemove',e=>{c.style.left=d.style.left=e.clientX+'px';c.style.top=d.style.top=e.clientY+'px'});qa('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>c.classList.add('hover'));el.addEventListener('mouseleave',()=>c.classList.remove('hover'))})}

qa('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(); const x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.08}px,${y*.12}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')});

function openMap(type,address){const qaddr=encodeURIComponent(address); const isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent); let app,web;
  if(type==='kakao'){app=`kakaomap://search?q=${qaddr}`;web=`https://map.kakao.com/link/search/${qaddr}`}
  else{app=`nmap://search?query=${qaddr}&appname=marinabakery`;web=`https://map.naver.com/p/search/${qaddr}`}
  if(!isMobile){window.open(web,'_blank','noopener');return}
  const start=Date.now(); location.href=app; setTimeout(()=>{if(Date.now()-start<1800) location.href=web},900)
}
qa('.branch-card').forEach(card=>qa('[data-map]',card).forEach(btn=>btn.addEventListener('click',()=>openMap(btn.dataset.map,card.dataset.address))));

if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js').catch(()=>{}));

// Premium hero slider. Original design is preserved; only content/motion changes.
const heroSlides=[
  {eyebrow:'PREMIUM BAKERY · KOREA',title:'Торты и сладкая выпечка',subtitle:'Cakes & Sweet Pastry',text:'Мягкий медовик, нежные кремы и десерты, которые превращают обычный день в маленький праздник.',word:'PASTRY'},
  {eyebrow:'SIGNATURE · MARINA',title:'Медовик, который запоминают',subtitle:'Honey Cake · Signature',text:'Тонкие медовые коржи, воздушный крем и тёплый аромат мёда — фирменный вкус MARINA в эффектной подаче.',word:'HONEY'},
  {eyebrow:'SWEET MOMENTS · EVERY DAY',title:'Создано для особенных моментов',subtitle:'Made to Celebrate',text:'Праздник, встреча с близкими или просто хороший вечер — у каждого момента может быть свой десерт MARINA.',word:'CAKES'}
];
const heroTitle=q('#heroTitle'), heroSubtitle=q('#heroSubtitle'), heroText=q('#heroText'), heroEyebrow=q('#heroEyebrow'), heroCopy=q('#heroSlideCopy'), hugeWord=q('#hugeWord'), cakeWrap=q('#cakeWrap'), heroProgress=q('#heroProgress'), heroIndex=q('#heroIndex');
let heroSlide=0, heroTimerId, touchStartX=0;
function restartHeroProgress(){if(!heroProgress)return; const bar=heroProgress.parentElement; bar.classList.remove('paused'); heroProgress.style.animation='none'; void heroProgress.offsetWidth; heroProgress.style.animation='heroTimer 6s linear infinite'}
function setHeroSlide(n,user=false){if(!heroTitle)return; heroSlide=(n+heroSlides.length)%heroSlides.length; const d=heroSlides[heroSlide]; heroCopy.classList.remove('is-entering');heroCopy.classList.add('is-changing');hugeWord?.classList.add('word-change');cakeWrap?.classList.add('transitioning');
  setTimeout(()=>{heroEyebrow.textContent=d.eyebrow;heroTitle.textContent=d.title;heroSubtitle.textContent=d.subtitle;heroText.textContent=d.text;hugeWord.textContent=d.word;qa('.hero-dot',heroIndex).forEach((b,i)=>b.classList.toggle('active',i===heroSlide));cakeWrap.classList.remove('slide-0','slide-1','slide-2');cakeWrap.classList.add('slide-'+heroSlide);heroCopy.classList.remove('is-changing');heroCopy.classList.add('is-entering');hugeWord.classList.remove('word-change');setTimeout(()=>cakeWrap.classList.remove('transitioning'),760)},220);
  restartHeroProgress(); clearInterval(heroTimerId); heroTimerId=setInterval(()=>setHeroSlide(heroSlide+1),6000);
}
qa('.hero-dot',heroIndex).forEach(btn=>btn.addEventListener('click',()=>setHeroSlide(+btn.dataset.slide,true)));
const hero=q('.hero'); if(hero){hero.addEventListener('touchstart',e=>touchStartX=e.touches[0].clientX,{passive:true});hero.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchStartX;if(Math.abs(dx)>48)setHeroSlide(heroSlide+(dx<0?1:-1),true)},{passive:true});}
// Floating sparkle particles around cake
const sparkField=q('#sparkField'); if(sparkField){for(let i=0;i<22;i++){const s=document.createElement('i');s.className='hero-spark';s.style.left=(8+Math.random()*84)+'%';s.style.top=(8+Math.random()*80)+'%';s.style.setProperty('--d',(3.5+Math.random()*4.5)+'s');s.style.setProperty('--delay',(-Math.random()*5)+'s');sparkField.appendChild(s)}}
cakeWrap?.classList.add('slide-0'); heroTimerId=setInterval(()=>setHeroSlide(heroSlide+1),6000);
// Extra subtle pointer parallax in hero on desktop
if(matchMedia('(pointer:fine)').matches && hero){hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;cakeWrap.style.setProperty('--mx',x);cakeWrap.style.setProperty('--my',y);cakeWrap.style.translate=`${x*10}px ${y*8}px`;});hero.addEventListener('mouseleave',()=>{cakeWrap.style.translate=''})}
