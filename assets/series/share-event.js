(() => {
  'use strict';
  const update = () => {
    const t = window.SeriesI18n.text;
    document.title = t('eventMetaTitle');
    document.querySelector('meta[property="og:title"]').content = t('eventMetaTitle');
    document.querySelector('meta[name="description"]').content = t('eventLead');
    document.querySelector('meta[property="og:description"]').content = t('eventLead');
  };
  document.addEventListener('series:language', update);
  update();
})();
