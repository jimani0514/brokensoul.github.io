(() => {
  'use strict';
  const i18n=window.SeriesI18n;
  const shots=[...document.querySelectorAll('[data-flower-shot]')];
  const gallery=document.querySelector('.lightbox');
  let selected=0,opener;
  const locales={ko:'ko',en:'en',ja:'ja',zh:'zh-CN',es:'es',pt:'pt-BR',de:'de',fr:'fr',ru:'en'};
  const src=i=>'./images/today-flowers/'+locales[i18n.getLanguage()]+'-0'+(i+1)+'.webp';
  function updateImage(){const key=shots[selected].dataset.caption;document.getElementById('lightbox-image').src=src(selected);document.getElementById('lightbox-image').alt=i18n.text(key);document.getElementById('lightbox-caption').textContent=i18n.text(key);document.querySelector('.lightbox-counter').textContent=(selected+1)+' / '+shots.length;}
  function update(){shots.forEach((button,i)=>button.querySelector('img').src=src(i));const title=i18n.text('flowersName')+' | Double J Labs';document.title=title;document.querySelector('meta[name="description"]').content=i18n.text('flowersDesc');document.querySelector('meta[property="og:title"]').content=title;document.querySelector('meta[property="og:description"]').content=i18n.text('flowersDesc');if(gallery.open)updateImage();}
  shots.forEach((button,i)=>button.addEventListener('click',()=>{selected=i;opener=button;updateImage();gallery.showModal();document.body.style.overflow='hidden';}));
  const move=step=>{selected=(selected+step+shots.length)%shots.length;updateImage();};
  document.querySelector('[data-gallery-prev]').addEventListener('click',()=>move(-1));document.querySelector('[data-gallery-next]').addEventListener('click',()=>move(1));document.querySelector('[data-close-lightbox]').addEventListener('click',()=>gallery.close());
  gallery.addEventListener('click',e=>{if(e.target===gallery)gallery.close();});gallery.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});gallery.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus({preventScroll:true});});
  document.addEventListener('series:language',update);update();
})();
