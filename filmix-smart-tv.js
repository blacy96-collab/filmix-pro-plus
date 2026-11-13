(function () {
    'use strict';

    /* Filmix PRO+ Smart TV Theme */
    var STYLE_ID = 'filmix-pro-plus-smart-tv-style';
    var BUTTON_ID = 'filmix-pro-plus-gold-button';
    var STORAGE_KEY = 'filmix_pro_plus_gold_theme';
    var BODY_CLASS = 'filmix-pro-plus-active';

    if (window.__FILMIX_PRO_PLUS_SMART_TV__) return;
    window.__FILMIX_PRO_PLUS_SMART_TV__ = true;

    var enabled = true;
    var observer = null;

    var CSS = `
:root {
  --fp-bg: #090b0e;
  --fp-panel: #15191e;
  --fp-gold: #d7b56d;
  --fp-gold-bright: #fff0bd;
  --fp-text: #f5f3ee;
  --fp-muted: #aeb2b8;
}

body.${BODY_CLASS} {
  background:
    radial-gradient(ellipse at 50% 0%, rgba(47,66,76,.34), transparent 48%),
    linear-gradient(180deg,#10151a 0%,var(--fp-bg) 58%,#090a0c 100%) !important;
  color:var(--fp-text) !important;
}

body.${BODY_CLASS} .activity,
body.${BODY_CLASS} .content {
  background:transparent !important;
  color:var(--fp-text) !important;
}

body.${BODY_CLASS} .head,
body.${BODY_CLASS} .head__body {
  background:rgba(9,11,14,.97) !important;
  border:0 !important;
  box-shadow:0 8px 28px rgba(0,0,0,.22) !important;
}

body.${BODY_CLASS} .head__title,
body.${BODY_CLASS} .menu__title {
  color:var(--fp-gold-bright) !important;
  letter-spacing:.035em !important;
}

body.${BODY_CLASS} .head__action {
  background:#20252b !important;
  border:1px solid rgba(215,181,109,.2) !important;
  border-radius:50% !important;
}

body.${BODY_CLASS} .items-line {
  margin-bottom:2.1em !important;
}

body.${BODY_CLASS} .items-line__head {
  display:flex !important;
  align-items:center !important;
  justify-content:space-between !important;
  padding:0 1.1em .65em !important;
  margin-bottom:.9em !important;
  border-bottom:1px solid rgba(224,190,112,.24) !important;
}

body.${BODY_CLASS} .items-line__title,
body.${BODY_CLASS} .category__title {
  color:var(--fp-gold-bright) !important;
  font-weight:650 !important;
  letter-spacing:.015em !important;
  background:linear-gradient(
    100deg,#b68b42,#fff0bd,#d1a957,#fff2c8,#b68b42
  );
  background-size:220% auto;
  -webkit-background-clip:text;
  background-clip:text;
  -webkit-text-fill-color:transparent;
  animation:fpGoldFlow 5s linear infinite;
}

@keyframes fpGoldFlow {
  0% { background-position:200% center; }
  100% { background-position:-20% center; }
}

body.${BODY_CLASS} .items-line__more {
  color:var(--fp-gold-bright) !important;
  background:#191d22 !important;
  border:1px solid rgba(215,181,109,.45) !important;
  border-radius:2em !important;
  padding:.4em 1em !important;
}

/* Каталог */
body.${BODY_CLASS} .items-cards {
  display:flex !important;
  flex-flow:row nowrap !important;
  align-items:flex-start !important;
  gap:.85em !important;
  padding:.35em 1.1em 1.25em !important;
  overflow-x:auto !important;
  overflow-y:visible !important;
  scrollbar-width:none !important;
}

body.${BODY_CLASS} .items-cards::-webkit-scrollbar {
  display:none !important;
}

body.${BODY_CLASS} .items-cards > .card {
  flex:0 0 calc((100% - 4.25em) / 6) !important;
  width:calc((100% - 4.25em) / 6) !important;
  min-width:0 !important;
  padding:.38em !important;
  box-sizing:border-box !important;
  background:linear-gradient(160deg,#20252b,#111418) !important;
  border:1px solid rgba(255,255,255,.055) !important;
  border-radius:.75em !important;
  overflow:visible !important;
}

body.${BODY_CLASS} .items-cards > .card .card__view {
  width:100% !important;
  height:auto !important;
  aspect-ratio:2 / 3 !important;
  padding:0 !important;
  position:relative !important;
  overflow:hidden !important;
  border-radius:.52em !important;
  background:#0d1014 !important;
}

body.${BODY_CLASS} .items-cards > .card .card__img {
  display:block !important;
  width:100% !important;
  height:100% !important;
  object-fit:contain !important;
  object-position:center center !important;
}

body.${BODY_CLASS} .items-cards > .card .card__title {
  display:block !important;
  max-height:2.7em !important;
  margin:.55em .1em .12em !important;
  overflow:hidden !important;
  color:var(--fp-text) !important;
  font-size:1em !important;
  line-height:1.28 !important;
  white-space:normal !important;
}

body.${BODY_CLASS} .items-cards > .card .card__age {
  color:var(--fp-muted) !important;
  font-size:.86em !important;
}

body.${BODY_CLASS} .card.focus,
body.${BODY_CLASS} .card.traverse {
  outline:2px solid var(--fp-gold) !important;
  outline-offset:2px !important;
  box-shadow:0 0 18px rgba(215,181,109,.24) !important;
  z-index:5 !important;
}

body.${BODY_CLASS} .card.focus .card__title {
  color:var(--fp-gold-bright) !important;
}

/* Страница фильма */
body.${BODY_CLASS} .full-start {
  background:#0b0e12 !important;
}

body.${BODY_CLASS} .full-start__background {
  opacity:.28 !important;
  filter:blur(2px) saturate(.72) !important;
}

body.${BODY_CLASS} .full-start__body {
  position:relative !important;
  padding:1.35em !important;
  background:linear-gradient(145deg,rgba(24,29,35,.98),rgba(10,12,15,.99)) !important;
  border:1px solid rgba(224,190,112,.24) !important;
  border-radius:1em !important;
  box-shadow:0 18px 48px rgba(0,0,0,.32) !important;
}

body.${BODY_CLASS} .full-start__title {
  color:var(--fp-gold-bright) !important;
  font-weight:750 !important;
}

body.${BODY_CLASS} .full-start__descr {
  color:#d1d3d5 !important;
  line-height:1.55 !important;
  white-space:normal !important;
}

body.${BODY_CLASS} .full-start__button,
body.${BODY_CLASS} .button,
body.${BODY_CLASS} .selector {
  border-radius:.7em !important;
}

body.${BODY_CLASS} .full-start__button.focus,
body.${BODY_CLASS} .button.focus,
body.${BODY_CLASS} .selector.focus,
body.${BODY_CLASS} .menu__item.focus {
  background:linear-gradient(110deg,#9f7130,#f0d18a) !important;
  color:#15120c !important;
  border-color:#f0d18a !important;
  box-shadow:0 0 16px rgba(215,181,109,.34) !important;
}

/* Боковое меню */
body.${BODY_CLASS} .menu {
  background:rgba(17,21,26,.98) !important;
  border-right:1px solid rgba(224,190,112,.24) !important;
}

body.${BODY_CLASS} .menu__item {
  border-radius:.65em !important;
  margin:.18em .4em !important;
}

body.${BODY_CLASS} .menu__item.focus,
body.${BODY_CLASS} .menu__item.traverse {
  background:rgba(215,181,109,.13) !important;
  color:var(--fp-gold-bright) !important;
  border-left:3px solid var(--fp-gold) !important;
}

/* Окна */
body.${BODY_CLASS} .modal__content,
body.${BODY_CLASS} .selectbox,
body.${BODY_CLASS} .settings {
  background:#171b20 !important;
  color:var(--fp-text) !important;
  border-color:rgba(224,190,112,.24) !important;
}

/* Золотая кнопка */
#${BUTTON_ID} {
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  flex:0 0 2.65em !important;
  width:2.65em !important;
  height:2.65em !important;
  min-width:2.65em !important;
  min-height:2.65em !important;
  margin:0 .28em !important;
  padding:0 !important;
  border-radius:50% !important;
  box-sizing:border-box !important;
  color:#8d9298 !important;
  background:linear-gradient(145deg,#272c32,#15191e) !important;
  border:1px solid rgba(215,181,109,.28) !important;
  cursor:pointer !important;
  z-index:9999 !important;
}

#${BUTTON_ID} svg {
  width:1.45em !important;
  height:1.45em !important;
  fill:currentColor !important;
}

#${BUTTON_ID}.fp-gold-on {
  color:#fff0bd !important;
  border-color:#f0d18a !important;
  background:radial-gradient(circle,#70582b,#211d15) !important;
  box-shadow:0 0 8px #e3bd6d,
             0 0 19px rgba(227,189,109,.8),
             0 0 34px rgba(227,189,109,.42) !important;
  animation:fpButtonShine 2.4s ease-in-out infinite !important;
}

#${BUTTON_ID}.fp-gold-off {
  color:#858b91 !important;
  box-shadow:none !important;
  animation:none !important;
}

@keyframes fpButtonShine {
  0%,100% { filter:brightness(1); }
  50% { filter:brightness(1.55); }
}

@media (prefers-reduced-motion:reduce) {
  body.${BODY_CLASS} *,
  #${BUTTON_ID} {
    animation:none !important;
    transition:none !important;
  }
}
`;

    function readEnabled() {
        try {
            if (window.Lampa && Lampa.Storage &&
                typeof Lampa.Storage.get === 'function') {
                return Lampa.Storage.get(STORAGE_KEY, true) !== false;
            }
        } catch (e) {}

        try {
            return localStorage.getItem(STORAGE_KEY) !== 'false';
        } catch (e) {}

        return true;
    }

    function saveEnabled() {
        try {
            if (window.Lampa && Lampa.Storage &&
                typeof Lampa.Storage.set === 'function') {
                Lampa.Storage.set(STORAGE_KEY, enabled);
            }
        } catch (e) {}

        try {
            localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
        } catch (e) {}
    }

    function applyTheme() {
        if (!document.head || !document.body) return;

        var style = document.getElementById(STYLE_ID);

        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        style.textContent = CSS;
        document.body.classList.toggle(BODY_CLASS, enabled);
    }

    function notify(message) {
        try {
            if (window.Lampa && Lampa.Noty &&
                typeof Lampa.Noty.show === 'function') {
                Lampa.Noty.show(message);
            }
        } catch (e) {}
    }

    function toggleTheme() {
        enabled = !enabled;
        saveEnabled();
        applyTheme();

        var button = document.getElementById(BUTTON_ID);

        if (button) {
            button.classList.toggle('fp-gold-on', enabled);
            button.classList.toggle('fp-gold-off', !enabled);
        }

        notify(enabled
            ? 'Filmix PRO+: золотой стиль включён'
            : 'Filmix PRO+: стиль выключен');
    }

    function findHeader() {
        var selectors = [
            '.head__actions',
            '.head__actions-list',
            '.head__right',
            '.head__body .head__actions',
            '.head__body',
            '.head'
        ];

        for (var i = 0; i < selectors.length; i++) {
            var node = document.querySelector(selectors[i]);
            if (node) return node;
        }

        return null;
    }

    function createButton() {
        var button = document.createElement('div');

        button.id = BUTTON_ID;
        button.className = 'selector fp-gold-on';
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.setAttribute('aria-label', 'Filmix PRO+ — золотой стиль');
        button.setAttribute('title', 'Включить или выключить стиль');

        button.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M12 1.8l2.85 6.05 6.65.82-4.9 4.62 1.27 6.6L12 16.62l-5.87 3.27 1.27-6.6-4.9-4.62 6.65-.82z"/>' +
            '</svg>';

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            toggleTheme();
        });

        button.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                toggleTheme();
            }
        });

        return button;
    }

    function installButton() {
        var header = findHeader();
        if (!header) return;

        var existing = document.getElementById(BUTTON_ID);

        if (existing && existing.isConnected && header.contains(existing)) {
            return;
        }

        if (existing && existing.parentNode) {
            existing.parentNode.removeChild(existing);
        }

        var button = createButton();
        button.classList.toggle('fp-gold-on', enabled);
        button.classList.toggle('fp-gold-off', !enabled);

        var bell = header.querySelector(
            '.head__action--notice, ' +
            '.head__action--notification, ' +
            '[data-action="notice"], ' +
            '[data-action="notification"]'
        );

        if (bell && bell.parentNode) {
            bell.parentNode.insertBefore(button, bell);
        } else {
            header.appendChild(button);
        }
    }

    function refresh() {
        applyTheme();
        installButton();
    }

    function startObserver() {
        if (observer || !document.documentElement ||
            !window.MutationObserver) return;

        observer = new MutationObserver(function () {
            var button = document.getElementById(BUTTON_ID);

            if (!button || !button.isConnected ||
                !document.getElementById(STYLE_ID) ||
                !document.body.classList.contains(BODY_CLASS) === enabled) {
                refresh();
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function start() {
        enabled = readEnabled();
        refresh();
        startObserver();

        if (window.Lampa && Lampa.Listener &&
            typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function () {
                refresh();
            });
        }

        console.log('[Filmix PRO+] Smart TV theme ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
