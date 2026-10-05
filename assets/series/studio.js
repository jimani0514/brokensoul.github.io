(() => {
  const update = () => {
    const t = window.SeriesI18n.text;
    document.title = t('siteTitle');
    for (const key of ['description','og:description']) document.querySelector('[name="'+key+'"], [property="'+key+'"]')?.setAttribute('content',t('siteDescription'));
    document.querySelector('[property="og:title"]')?.setAttribute('content',t('siteTitle'));
  };
  document.addEventListener('series:language', update);
  update();
})();
