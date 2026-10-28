(() => {
  'use strict';
  const i18n=window.SeriesI18n, games=window.PORTAL_GAMES;
  if(!i18n || !games) return;
  const t=key=>i18n.text(key);
  const url=page=>`./${page}${page.includes('?')?'&':'?'}lang=${i18n.getLanguage()}`;
  const hero=document.querySelector('[data-portal-hero]');
  let featured='soul', filter='all';
  const setText=(selector,key)=>{const el=document.querySelector(selector);if(el){el.dataset.i18n=key;el.textContent=t(key);}};
  function renderHero(){
    if(!hero)return;
    const game=games.find(g=>g.id===featured),img=hero.querySelector('img');
    hero.dataset.feature=game.id;
    img.src=`./images/portal/${game.art}.webp`;
    const width=game.id==='tactics'?1671:1672, height=941;
    img.srcset=`./images/portal/${game.art}-800.webp 800w, ./images/portal/${game.art}.webp ${width}w`;
    img.sizes='(max-width:760px) calc(100vw - 36px), (max-width:1050px) calc(100vw - 56px), (max-width:1480px) calc(100vw - 96px), 1384px';
    img.width=width;img.height=height;
    img.alt=`${t(game.name)} — ${t('portalArtAlt')}`;
    setText('[data-feature-status]',game.statusLabel);
    hero.querySelector('[data-feature-status]').className=`portal-status status-${game.status}`;
    setText('[data-feature-name]',game.name);
    setText('[data-feature-line]',game.line);
    setText('[data-feature-desc]',game.description);
    hero.querySelector('a').href=url(game.page);
    document.querySelectorAll('[data-feature-button]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.featureButton===featured)));
  }
  function renderFilter(){
    let count=0;
    document.querySelectorAll('[data-catalog-game]').forEach(card=>{
      const visible=filter==='all'||card.dataset.status===filter;
      card.hidden=!visible;if(visible)count++;
    });
    document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.filter===filter)));
    const result=document.querySelector('[data-filter-result]');
    if(result) result.textContent=`${t({all:'portalAll',live:'portalLive',prereg:'portalPrereg',dev:'portalDev'}[filter])} · ${count} / 8`;
  }
  document.querySelectorAll('[data-feature-button]').forEach(button=>button.addEventListener('click',()=>{featured=button.dataset.featureButton;renderHero();}));
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;renderFilter();}));
  const project=games.find(g=>g.id===document.body.dataset.project);
  function renderProject(){
    if(!project)return;
    t(project.features).split('\n').forEach((text,index)=>{const el=document.querySelector(`[data-feature-index="${index}"]`);if(el)el.textContent=text;});
  }
  function metadata(){
    const title=project?`${t(project.name)} | Double J Labs`:t('portalTitle');
    const description=t(project?project.description:'portalDescription');
    document.title=title;
    document.querySelector('meta[name="description"]')?.setAttribute('content',description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content',description);
  }
  const dialog=document.querySelector('.art-dialog');
  if(dialog){
    document.querySelectorAll('[data-art-open]').forEach(button=>button.addEventListener('click',()=>{
      const image=dialog.querySelector('img');image.src=button.dataset.artOpen;image.alt=`${t(project.name)} — ${t('portalArtAlt')}`;
      dialog.showModal();
    }));
    dialog.querySelector('button').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  }
  function render(){renderHero();renderFilter();renderProject();metadata();}
  document.addEventListener('series:language',render);
  render();
})();
