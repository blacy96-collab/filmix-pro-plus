
(function () {
    'use strict';

    var ID = 'filmix-pro-plus-theme';
    var STYLE_ID = ID + '-css';
    var BUTTON_ID = ID + '-button';
    var STORAGE_KEY = 'filmix_pro_plus_theme_enabled';
    var CLASS_NAME = 'filmix-pro-plus-theme';

    if (window.__FILMIX_THEME_STARTED__) return;
    window.__FILMIX_THEME_STARTED__ = true;

    var enabled = true;
    var observer = null;

    var css = `
:root {
    --fp-bg: #090c11;
    --fp-panel: #171d25;
    --fp-gold: #d7b56d;
    --fp-gold-light: #f5dfaa;
    --fp-text: #f4f1e9;
}

body.${CLASS_NAME} {
    background: var(--fp-bg) !important;
    color: var(--fp-text) !important;
}

body.${CLASS_NAME} .head,
body.${CLASS_NAME} .head__body {
    background: rgba(9,12,17,.97) !important;
}

body.${CLASS_NAME} .head__title,
body.${CLASS_NAME} .menu__title,
body.${CLASS_NAME} .category__title,
body.${CLASS_NAME} .full-start__title {
    color: var(--fp-gold-light) !important;
}

body.${CLASS_NAME} .items-line__head {
    border-bottom: 1px solid rgba(215,181,109,.35) !important;
}

body.${CLASS_NAME} .card__view {
    border-radius: 10px !important;
    overflow: hidden !important;
}

body.${CLASS_NAME} .card.focus .card__view,
body.${CLASS_NAME} .card.traverse .card__view {
    outline: 2px solid var(--fp-gold) !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 18px rgba(215,181,109,.3) !important;
}

body.${CLASS_NAME} .card__title {
    color: var(--fp-text) !important;
}

body.${CLASS_NAME} .menu {
    background: var(--fp-panel) !important;
}

body.${CLASS_NAME} .menu__item.focus,
body.${CLASS_NAME} .selector.focus,
body.${CLASS_NAME} .full-start__button.focus {
    background: var(--fp-gold) !important;
    color: #17130b !important;
    border-color: var(--fp-gold-light) !important;
}

body.${CLASS_NAME} .modal__content,
body.${CLASS_NAME} .selectbox,
body.${CLASS_NAME} .settings {
    background: var(--fp-panel) !important;
    color: var(--fp-text) !important;
}

#${BUTTON_ID} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    min-width: 42px;
    margin: 0 6px;
    border-radius: 50%;
    color: var(--fp-gold-light);
    background: #202630;
    border: 1px solid var(--fp-gold);
    box-sizing: border-box;
    cursor: pointer;
}

#${BUTTON_ID} svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
}

#${BUTTON_ID}.off {
    color: #9299a2;
    border-color: #555d67;
}

@media (max-width: 700px) {
    body.${CLASS_NAME} .card__view {
        border-radius: 7px !important;
    }
}
`;

    function readSetting() {
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

    function saveSetting() {
        try {
            if (window.Lampa && Lampa.Storage &&
                typeof Lampa.Storage.set === 'function') {
                Lampa.Storage.set(STORAGE_KEY, enabled);
            }
        } catch (e) {}

        try {
            localStorage.setItem(
                STORAGE_KEY,
                enabled ? 'true' : 'false'
            );
        } catch (e) {}
    }

    function installStyle() {
        if (!document.head || !document.body) return;

        var style = document.getElementById(STYLE_ID);

        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        if (style.textContent !== css) {
            style.textContent = css;
        }

        document.body.classList.toggle(CLASS_NAME, enabled);
    }

    function showMessage(message) {
        try {
            if (window.Lampa && Lampa.Noty &&
                typeof Lampa.Noty.show === 'function') {
                Lampa.Noty.show(message);
            }
        } catch (e) {
            console.log('[Filmix Theme] Notification unavailable');
        }
    }

    function updateButton() {
        var button = document.getElementById(BUTTON_ID);
        if (!button) return;

        button.classList.toggle('off', !enabled);
        button.setAttribute(
            'aria-label',
            enabled ? 'Выключить оформление' : 'Включить оформление'
        );
    }

    function toggleTheme() {
        enabled = !enabled;
        saveSetting();
        installStyle();
        updateButton();

        showMessage(
            enabled
                ? 'Filmix PRO+: золотое оформление включено'
                : 'Filmix PRO+: стандартное оформление'
        );

        console.log('[Filmix Theme] Enabled:', enabled);
    }

    function findHeader() {
        return document.querySelector(
            '.head__actions, .head__actions-list, .head__right'
        );
    }

    function installButton() {
        var header = findHeader();
        if (!header) return;

        var button = document.getElementById(BUTTON_ID);

        if (button && button.isConnected) {
            if (header.contains(button)) return;
            button.remove();
        }

        button = document.createElement('button');
        button.id = BUTTON_ID;
        button.type = 'button';
        button.className = 'selector';
        button.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M12 2l2.5 6.2L21 10l-6.5 2.1L12 18l-2.5-5.9L3 10l6.5-1.8z"/>' +
            '</svg>';

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            toggleTheme();
        });

        header.appendChild(button);
        updateButton();
    }

    function refresh() {
        installStyle();
        installButton();
    }

    function startObserver() {
        if (observer || !window.MutationObserver ||
            !document.documentElement) return;

        observer = new MutationObserver(function () {
            var styleMissing = !document.getElementById(STYLE_ID);
            var buttonMissing = !document.getElementById(BUTTON_ID);
            var classMissing =
                document.body &&
                document.body.classList.contains(CLASS_NAME) !== enabled;

            if (styleMissing || buttonMissing || classMissing) {
                refresh();
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function start() {
        enabled = readSetting();
        refresh();
        startObserver();

        console.log('[Filmix Theme] Started');
        console.log('[Filmix Theme] Enabled:', enabled);
        console.log('[Filmix Theme] Version: 1.1.0');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
