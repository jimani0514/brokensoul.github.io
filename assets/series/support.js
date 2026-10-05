(() => {
  'use strict';
  const links = {
  "soul": "https://forms.gle/f6BQBnZHYbZTczMc8",
  "tactics": "https://docs.google.com/forms/d/e/1FAIpQLSdiRzV1L4hlFgPEifJPOwSyvG-lanjEz2phAnQNiQ7N8XSheg/viewform?usp=publish-editor",
  "flowers": "https://docs.google.com/forms/d/e/1FAIpQLScqH-dOkE4iwSHtxgK7bn_IGq_llwWuDYmWQcePoJdOOxYh-A/viewform?usp=publish-editor"
};
  const labels = {soul:'supportSoul',tactics:'supportTactics',flowers:'supportFlowers'};
  const aliases = {mobile:'soul',steam:'soul',sequel:'tactics'};
  function apply(selected) {
    const i18n=window.SeriesI18n;
    const query=new URLSearchParams(location.search);
    const requested=aliases[query.get('game')]||query.get('game');
    const active=typeof selected==='string'?selected:document.body.dataset.gameTheme||(document.body.hasAttribute('data-game-detail')?(requested==='soul'?'soul':'tactics'):null);
    document.querySelectorAll('a[data-support]').forEach(a=>{
      const game=a.dataset.support||active;
      if(links[game]){a.href=links[game];a.target='_blank';a.rel='noopener noreferrer';}
      else {a.href='./index.html?lang='+encodeURIComponent(i18n?.getLanguage()||'en')+'#support';a.removeAttribute('target');a.removeAttribute('rel');}
    });
    document.querySelectorAll('[data-support-title]').forEach(el=>{
      if(labels[active]&&i18n){el.dataset.i18n=labels[active];el.textContent=i18n.text(labels[active]);}
    });
  }
  window.SeriesSupport={apply};
  document.addEventListener('series:language',()=>apply());
  document.addEventListener('DOMContentLoaded',()=>apply());
  apply();
})();
