/* Cookie consent + Google Analytics.
   GA is loaded only after the visitor accepts; the choice is kept in localStorage.
   Usage: <script src="/js/consent.js" data-lang="pl|en" defer></script> */
(function () {
  var GA_ID = 'G-1C9PSTRXR1';
  var KEY = 'cookie-consent';

  var texts = {
    pl: {
      message: 'Ta strona używa plików cookies Google Analytics do anonimowych statystyk odwiedzin.',
      accept: 'Akceptuję',
      decline: 'Odrzuć',
      settings: 'Cookies'
    },
    en: {
      message: 'This site uses Google Analytics cookies for anonymous visit statistics.',
      accept: 'Accept',
      decline: 'Decline',
      settings: 'Cookies'
    }
  };

  var script = document.currentScript;
  var t = texts[(script && script.dataset.lang) || 'pl'] || texts.pl;

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function setChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function loadAnalytics() {
    if (window.gtag) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  function removeAnalyticsCookies() {
    window['ga-disable-' + GA_ID] = true;
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function showBanner() {
    if (document.querySelector('.cookie-banner')) return;

    var banner = document.createElement('div');
    banner.className = 'cookie-banner no-print';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookies');

    var msg = document.createElement('p');
    msg.textContent = t.message;

    var actions = document.createElement('div');
    actions.className = 'cookie-banner-actions';

    var decline = document.createElement('button');
    decline.type = 'button';
    decline.textContent = t.decline;
    decline.addEventListener('click', function () {
      setChoice('denied');
      removeAnalyticsCookies();
      banner.remove();
    });

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'primary';
    accept.textContent = t.accept;
    accept.addEventListener('click', function () {
      setChoice('granted');
      window['ga-disable-' + GA_ID] = false;
      loadAnalytics();
      banner.remove();
    });

    actions.appendChild(decline);
    actions.appendChild(accept);
    banner.appendChild(msg);
    banner.appendChild(actions);
    document.body.appendChild(banner);
  }

  function addSettingsLink() {
    var footer = document.querySelector('.page-footer');
    if (!footer) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cookie-settings no-print';
    btn.textContent = t.settings;
    btn.addEventListener('click', showBanner);
    footer.appendChild(btn);
  }

  function init() {
    var choice = getChoice();
    if (choice === 'granted') loadAnalytics();
    else if (choice !== 'denied') showBanner();
    addSettingsLink();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
