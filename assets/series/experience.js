(() => {
  'use strict';
  const i18n = window.SeriesI18n;
  if (!i18n) return;
  const t = key => i18n.text(key);
  const root = './images/';
  const detail = document.body.hasAttribute('data-game-detail');
  const query = new URLSearchParams(location.search);
  const aliases = { mobile: 'soul', steam: 'soul', sequel: 'tactics' };
  const games = {
    soul: { name: 'Broken Soul', nameKey: 'soulName', image: 'soul-world.webp', logo: 'soul-logo.webp', tag: 'soulTag', line: 'soulLine', desc: 'soulDesc', genre: 'soulGenre', status: 'available', cta: 'playNow', art: 'soul-combat-v3.webp' },
    tactics: { name: 'Broken Tactics', nameKey: 'tacticsName', image: 'tactics-world.webp', logo: 'tactics-logo.webp', tag: 'tacticsTag', line: 'tacticsLine', desc: 'tacticsDesc', genre: 'tacticsGenre', status: 'preregStatus', cta: 'preregister', art: 'tactics-combat-v4.webp' }
  };
  const links = {
    mobile: 'https://play.google.com/store/apps/details?id=xyz.brokensoul.mygame',
    steam: 'https://store.steampowered.com/app/4424450/BROKEN_SOUL__Boss_Rush/',
    tactics: 'https://play.google.com/store/apps/details?id=com.brokensoul2.mygame'
  };
  const requested = aliases[query.get('game')] || query.get('game');
  let selected = games[requested] ? requested : 'tactics';
  const hero = document.getElementById('top');
  const image = document.getElementById('hero-image');
  const tabs = [...document.querySelectorAll('[data-game-tab]')];
  function translated(id, key) {
    const element = document.getElementById(id);
    if (!element) return;
    element.dataset.i18n = key;
    element.textContent = t(key);
  }
  function storeLink(id, title, platform) {
    const a = document.createElement('a');
    a.className = 'store-link';
    a.href = links[id];
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.store = id;
    const content = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = title;
    const small = document.createElement('small');
    small.textContent = t(platform);
    content.append(strong, small);
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden','true');
    arrow.textContent = '↗';
    a.append(content, arrow);
    return a;
  }
  function renderGame(id) {
    selected = id;
    const game = games[id];
    hero.dataset.activeGame = id;
    hero.setAttribute('aria-label', game.name);
    const src = root + game.image;
    if (image.getAttribute('src') !== src) image.src = src;
    const logo = document.getElementById('hero-logo');
    const logoSrc = root + game.logo;
    if (logo.getAttribute('src') !== logoSrc) logo.src = logoSrc;
    logo.alt = game.name;
    // Match the source aspect ratio to avoid layout jumps on a title switch.
    logo.width = id === 'soul' ? 900 : 1000;
    logo.height = id === 'soul' ? 417 : 358;
    translated('hero-kicker', game.tag);
    translated('hero-line', game.line);
    translated('hero-description', game.desc);
    translated('hero-cta-label', game.cta);
    document.getElementById('hero-platform-store').textContent = id === 'soul' ? 'Google Play · Steam' : 'Google Play';
    const cta = document.getElementById('hero-cta');
    if (id === 'soul') {
      cta.href = detail ? '#about' : `./game.html?game=soul&lang=${i18n.getLanguage()}#about`;
      cta.removeAttribute('target');
      cta.removeAttribute('rel');
      delete cta.dataset.store;
    } else {
      cta.href = links.tactics;
      cta.target = '_blank';
      cta.rel = 'noopener noreferrer';
      cta.dataset.store = 'tactics';
    }
    document.getElementById('hero-more').href = detail ? '#about' : `./game.html?game=${id}&lang=${i18n.getLanguage()}`;
    tabs.forEach(tab => {
      const active = tab.dataset.gameTab === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (!detail) document.getElementById('hero-panel').setAttribute('aria-labelledby', 'tab-' + id);
    if (detail) {
      translated('detail-title', game.nameKey);
      translated('detail-description', game.desc);
      translated('detail-genre', game.genre);
      translated('detail-status', game.status);
      const art = document.getElementById('detail-art');
      art.src = root + game.art;
      art.srcset = `${root + game.art.replace('.webp', '-960.webp')} 960w, ${root + game.art} 1536w`;
      art.alt = t(id === 'soul' ? 'soulBattleArt' : 'tacticsBattleArt');
      const stores = document.getElementById('detail-stores');
      stores.replaceChildren(...(id === 'soul' ? [storeLink('mobile', 'Google Play', 'mobilePC'), storeLink('steam', 'Steam', 'pcOnly')] : [storeLink('tactics', 'Google Play', 'mobilePC')]));
      translated('release-note', id === 'soul' ? 'platformNote' : 'preregisterNote');
      translated('detail-screens-intro', game.desc);
      translated('detail-screens-note', id === 'soul' ? 'screenZoomNote' : 'screensNote');
      document.querySelectorAll('[data-detail-gallery] [data-gallery-game]').forEach(figure => {
        figure.hidden = figure.dataset.galleryGame !== id;
      });
      document.querySelectorAll('[data-detail-press]').forEach(section => { section.hidden = id !== 'soul'; });
    }
    const title = detail ? `${t(game.nameKey)} | Double J Labs` : t('siteTitle');
    const description = detail ? t(game.desc) : t('siteDescription');
    document.title = title;
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:title"]').content = title;
    document.querySelector('meta[property="og:description"]').content = description;
    if (detail) {
      const canonical = `https://brokensoul.xyz/game.html?game=${id}`;
      document.querySelector('link[rel="canonical"]').href = canonical;
      document.querySelector('meta[property="og:url"]').content = canonical;
      document.querySelectorAll('link[rel="alternate"]').forEach(link => {
        const url = new URL(link.href);
        url.searchParams.set('game', id);
        link.href = url.href;
      });
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => renderGame(tab.dataset.gameTab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      renderGame(tabs[next].dataset.gameTab);
    });
  });
  const lightbox = document.querySelector('.lightbox');
  const galleryButtons = [...document.querySelectorAll('[data-lightbox]')];
  let visibleGallery = galleryButtons;
  let galleryIndex = 0;
  let opener = null;
  function updateImage() {
    if (!visibleGallery.length) return;
    const button = visibleGallery[galleryIndex];
    const img = document.getElementById('lightbox-image');
    img.src = button.dataset.lightbox;
    img.alt = t(button.dataset.caption);
    document.getElementById('lightbox-caption').textContent = t(button.dataset.caption);
    document.querySelector('.lightbox-counter').textContent = `${galleryIndex + 1} / ${visibleGallery.length}`;
  }
  galleryButtons.forEach(button => button.addEventListener('click', () => {
    opener = button;
    visibleGallery = [...button.closest('[data-gallery]').querySelectorAll('[data-lightbox]')].filter(item => !item.closest('figure').hidden);
    galleryIndex = visibleGallery.indexOf(button);
    updateImage();
    lightbox.showModal();
    document.body.style.overflow = 'hidden';
  }));
  function moveImage(direction) {
    galleryIndex = (galleryIndex + direction + visibleGallery.length) % visibleGallery.length;
    updateImage();
  }
  document.querySelector('[data-gallery-prev]').addEventListener('click', () => moveImage(-1));
  document.querySelector('[data-gallery-next]').addEventListener('click', () => moveImage(1));
  document.querySelector('[data-close-lightbox]').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      moveImage(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  lightbox.addEventListener('close', () => {
    document.body.style.overflow = '';
    opener?.focus({ preventScroll: true });
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    const gallery = button.closest('[data-gallery]');
    gallery.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    gallery.querySelectorAll('[data-gallery-game]').forEach(figure => { figure.hidden = filter !== 'all' && figure.dataset.galleryGame !== filter; });
  }));
  function updatePressLinks() {
    const articles = {ko:'archives/31595',en:'en/archives/31610',ja:'ja/archives/31611',zh:'zh/archives/31612'};
    document.querySelectorAll('[data-indie-article]').forEach(link => {
      link.href = 'https://indiegame.com/' + (articles[i18n.getLanguage()] || articles.en);
    });
  }
  document.addEventListener('series:language', () => {
    renderGame(selected);
    updatePressLinks();
    if (lightbox.open) updateImage();
  });
  renderGame(selected);
  updatePressLinks();
})();
