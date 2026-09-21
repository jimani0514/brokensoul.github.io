(() => {
  'use strict';
  const dictionaries = window.SERIES_COPY || {};
  const legal = document.body.dataset.legal === 'true';
  const storage = {get(key){try{return localStorage.getItem(key);}catch{return null;}},set(key,value){try{localStorage.setItem(key,value);}catch{}}};
  const query = new URLSearchParams(location.search);
  let language = 'en';
  const text = key => dictionaries[language]?.[key] ?? dictionaries.en?.[key] ?? key;
  const selector = document.getElementById('languageSelect');
  const nav = document.querySelector('.primary-nav');
  const menu = document.querySelector('.menu-toggle');
  function applyLanguage(next, persist = false) {
    language = dictionaries[next] && (!legal || ['en','ko'].includes(next)) ? next : 'en';
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    if(selector) selector.value = language;
    if(persist){storage.set('brokenSoulLanguage',language);storage.set('language',language);}
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.dataset.i18n;
      if (dictionaries[language]?.[key]) node.textContent = text(key);
    });
    for(const attr of ['alt','aria']) document.querySelectorAll(`[data-i18n-${attr}]`).forEach(node => {
      const key = node.getAttribute(`data-i18n-${attr}`);
      if(dictionaries[language]?.[key]) node.setAttribute(attr === 'aria' ? 'aria-label' : 'alt',text(key));
    });
    document.querySelectorAll('[data-art-alt]').forEach(node => node.alt = `${node.dataset.artAlt} — ${text('keyart')}`);
    document.querySelectorAll('[data-locale]').forEach(node => node.hidden = node.dataset.locale !== language);
    if(selector) selector.setAttribute('aria-label',text('language'));
    nav?.setAttribute('aria-label',text('navGames'));
    document.querySelector('[role="tablist"]')?.setAttribute('aria-label',text('navGames'));
    if(legal)document.querySelector('.legal-nav')?.setAttribute('aria-label',language==='ko'?'문서 목차':'Document contents');
    if(document.body.dataset.legalTitle) document.title = (language==='ko' ? document.body.dataset.legalTitle : document.body.dataset.legalTitleEn)+' | Broken Soul';
    // Keep links usable without storage, including file previews and private browsing.
    document.querySelectorAll('a[href]').forEach(a => {
      const raw = a.getAttribute('href');
      if(!raw || !raw.startsWith('./') || !/\.html(?:[?#]|$)/.test(raw) || raw.includes('auth-callback')) return;
      const url = new URL(raw,location.href);
      url.searchParams.set('lang',language);
      a.setAttribute('href','./'+url.pathname.split('/').pop()+url.search+url.hash);
    });
    if(persist){query.set('lang',language);try{history.replaceState(null,'',location.pathname+'?'+query.toString()+location.hash);}catch{}}
    // Language changes must not strand a visitor at the now-hidden translation.
    const fragment = decodeURIComponent(location.hash.slice(1));
    if(legal && fragment){const target=document.getElementById(fragment);if(target) target.scrollIntoView({behavior:'instant',block:'start'});}
    document.dispatchEvent(new CustomEvent('series:language',{detail:{language}}));
  }
  menu?.addEventListener('click',()=>{const opened=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(opened));nav?.classList.toggle('is-open',opened);});
  nav?.addEventListener('click',event=>{if(event.target.closest('a')){nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav?.classList.contains('is-open')){nav.classList.remove('is-open');menu?.setAttribute('aria-expanded','false');menu?.focus();}});
  selector?.addEventListener('change',event=>applyLanguage(event.target.value,true));
  window.SeriesI18n = {text, getLanguage:()=>language};
  const initial=query.get('lang')||storage.get('brokenSoulLanguage')||storage.get('language')||(navigator.language||'en').slice(0,2);
  applyLanguage(initial);
  const consentKey='brokenSoulWebsiteConsentV1';
  const consentPanel=document.querySelector('.cookie-panel');
  let consent=null;
  try{const saved=JSON.parse(storage.get(consentKey));if(saved&&Date.now()-saved.at<180*86400000&&['granted','denied'].includes(saved.choice))consent=saved.choice;}catch{}
  let measurementLoaded=false;
  function loadMeasurement(){
    // Local previews never send marketing events to the production account.
    if(measurementLoaded || !/^(www\.)?brokensoul\.xyz$/.test(location.hostname))return;
    measurementLoaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    window.gtag('consent','default',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'denied',analytics_storage:'granted'});
    window.gtag('js',new Date());
    window.gtag('config','AW-17228901940',{allow_ad_personalization_signals:false});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id=AW-17228901940';document.head.append(script);
  }
  function clearMeasurementCookies(){
    for(const name of document.cookie.split(';').map(c=>c.trim().split('=')[0]).filter(n=>/^(_gcl_|_ga|_gid|_gat)/.test(n))){
      for(const domain of ['',location.hostname,'.'+location.hostname,'.brokensoul.xyz']) document.cookie=`${name}=; Max-Age=0; path=/; SameSite=Lax${domain?'; domain='+domain:''}`;
    }
  }
  if(consent==='granted')loadMeasurement();
  if(!consent&&consentPanel)consentPanel.hidden=false;
  document.querySelectorAll('[data-cookie-settings]').forEach(button=>button.addEventListener('click',()=>{if(consentPanel){consentPanel.hidden=false;consentPanel.querySelector('button')?.focus();}}));
  document.querySelectorAll('[data-consent]').forEach(button=>button.addEventListener('click',()=>{
    const old=consent;consent=button.dataset.consent;storage.set(consentKey,JSON.stringify({choice:consent,at:Date.now()}));
    if(consentPanel)consentPanel.hidden=true;
    if(consent==='granted')loadMeasurement();
    else{clearMeasurementCookies();if(old==='granted'&&measurementLoaded)location.reload();}
  }));
  document.addEventListener('click',event=>{
    const a=event.target.closest('a[data-store]');
    if(a && consent==='granted' && measurementLoaded && window.gtag)window.gtag('event','conversion',{send_to:'AW-17228901940/gproCNewrLUcELTcsJdA',value:1,currency:'KRW'});
  });
})();
