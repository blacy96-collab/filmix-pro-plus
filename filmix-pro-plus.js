
(function () {
    'use strict';

    var VERSION = '1.0.0';
    var NAME = 'filmix_pro_plus';
    var STYLE_ID = 'filmix-pro-plus-css';
    var BUTTON_ID = 'filmix-pro-plus-button';
    var STORAGE_KEY = 'filmix_pro_plus_theme_enabled';
    var CLASS_NAME = 'filmix-pro-plus-theme';

    if (window.__FILMIX_PRO_PLUS_STARTED__) return;
    window.__FILMIX_PRO_PLUS_STARTED__ = true;

    var enabled = true;
    var observer = null;
    var initialized = false;
    var errors = [];

    var css = `
:root {
    --fp-bg: #090c11;
    --fp-panel: #171d25;
    --fp-gold: #d7b56d;
    --fp-gold-light: #f5dfaa;
    --fp-text: #f4f1e9;
}

/* ОСНОВНОЕ ОФОРМЛЕНИЕ */

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
body.${CLASS_NAME} .full-start__title,
body.${CLASS_NAME} .full-start-new__title {
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
body.${CLASS_NAME} .full-start__button.focus,
body.${CLASS_NAME} .full-start-new__button.focus {
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

/* КОМПАКТНАЯ КНОПКА FILMIX */

#${BUTTON_ID} {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    box-sizing: border-box !important;

    width: 19px !important;
    height: 19px !important;
    min-width: 19px !important;
    min-height: 19px !important;
    max-width: 19px !important;
    max-height: 19px !important;

    flex: 0 0 19px !important;
    padding: 0 !important;
    margin: 0 4px !important;

    border-radius: 50% !important;
    border: 1px solid rgba(255,255,255,.12) !important;
    background: #202127 !important;
    color: #e7c77f !important;

    box-shadow: none !important;
    overflow: hidden !important;
    transform: none !important;
}

#${BUTTON_ID} svg {
    display: block !important;
    width: 10px !important;
    height: 10px !important;
    min-width: 10px !important;
    min-height: 10px !important;
    max-width: 10px !important;
    max-height: 10px !important;
    flex: 0 0 10px !important;
    margin: 0 !important;
    padding: 0 !important;
    fill: currentColor !important;
}

#${BUTTON_ID}.off {
    color: #9299a2 !important;
    background: #202127 !important;
    border-color: rgba(255,255,255,.12) !important;
}

#${BUTTON_ID}:focus {
    outline: 1px solid var(--fp-gold) !important;
    outline-offset: 1px !important;
}

@media (max-width: 700px) {
    body.${CLASS_NAME} .card__view {
        border-radius: 7px !important;
    }
}
`;

    function log(message, error) {
        console.log('[Filmix PRO+ ' + VERSION + '] ' + message);

        if (error) {
            errors.push({
                message: message,
                error: String(error.message || error)
            });

            console.error('[Filmix PRO+]', error);
        }
    }

    function readSetting() {
        try {
            if (
                window.Lampa &&
                Lampa.Storage &&
                typeof Lampa.Storage.get === 'function'
            ) {
                return Lampa.Storage.get(STORAGE_KEY, true) !== false;
            }
        } catch (e) {
            log('Ошибка чтения настройки Lampa.Storage', e);
        }

        try {
            return localStorage.getItem(STORAGE_KEY) !== 'false';
        } catch (e) {
            log('Ошибка чтения localStorage', e);
        }

        return true;
    }

    function saveSetting() {
        try {
            if (
                window.Lampa &&
                Lampa.Storage &&
                typeof Lampa.Storage.set === 'function'
            ) {
                Lampa.Storage.set(STORAGE_KEY, enabled);
            }
        } catch (e) {
            log('Ошибка сохранения настройки Lampa.Storage', e);
        }

        try {
            localStorage.setItem(
                STORAGE_KEY,
                enabled ? 'true' : 'false'
            );
        } catch (e) {
            log('Ошибка сохранения localStorage', e);
        }
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

    function notify(message) {
        try {
            if (
                window.Lampa &&
                Lampa.Noty &&
                typeof Lampa.Noty.show === 'function'
            ) {
                Lampa.Noty.show(message);
            }
        } catch (e) {
            log('Ошибка уведомления', e);
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

        button.setAttribute(
            'title',
            enabled ? 'Filmix PRO+ — тема включена' : 'Filmix PRO+ — тема выключена'
        );
    }

    function toggleTheme() {
        enabled = !enabled;

        saveSetting();
        installStyle();
        updateButton();

        notify(
            enabled
                ? 'Filmix PRO+: оформление включено'
                : 'Filmix PRO+: оформление выключено'
        );

        log('Тема: ' + (enabled ? 'включена' : 'выключена'));
    }

    function findHeader() {
        return document.querySelector(
            '.head__actions, .head__actions-list, .head__right'
        );
    }

    function installButton() {
        var header = findHeader();

        if (!header) return false;

        var button = document.getElementById(BUTTON_ID);

        if (button && button.isConnected) {
            if (header.contains(button)) return true;
            button.remove();
        }

        button = document.createElement('button');
        button.id = BUTTON_ID;
        button.type = 'button';
        button.className = 'selector filmix-pro-plus-button';

        button.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M12 2l2.5 6.2L21 10l-6.5 2.1L12 18l-2.5-5.9L3 10l6.5-1.8z"/>' +
            '</svg>';

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            toggleTheme();
        });

        var moreButton = header.querySelector(
            '.head__action--more, ' +
            '[data-action="more"], ' +
            '.head__action--menu'
        );

        if (moreButton) {
            header.insertBefore(button, moreButton);
        } else {
            header.appendChild(button);
        }

        updateButton();

        return true;
    }

    function refresh() {
        installStyle();
        installButton();
    }

    function startObserver() {
        if (
            observer ||
            !window.MutationObserver ||
            !document.documentElement
        ) {
            return;
        }

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

        log('Наблюдатель интерфейса запущен');
    }

    function runChecks() {
        var checks = {
            Lampa: !!window.Lampa,
            appready: !!window.appready,
            Storage: !!(
                window.Lampa &&
                Lampa.Storage &&
                typeof Lampa.Storage.get === 'function' &&
                typeof Lampa.Storage.set === 'function'
            ),
            Noty: !!(
                window.Lampa &&
                Lampa.Noty &&
                typeof Lampa.Noty.show === 'function'
            ),
            header: !!findHeader(),
            style: !!document.getElementById(STYLE_ID),
            button: !!document.getElementById(BUTTON_ID)
        };

        window.filmix_pro_plus_status = {
            version: VERSION,
            checks: checks,
            errors: errors
        };

        Object.keys(checks).forEach(function (key) {
            log(key + ': ' + (checks[key] ? 'OK' : 'не найдено'));
        });
    }

    function initialize() {
        if (initialized) return;
        if (!window.Lampa || !document.body) return;

        initialized = true;
        enabled = readSetting();

        refresh();
        startObserver();

        window.filmix_pro_plus = {
            version: VERSION,
            toggle: toggleTheme,
            refresh: refresh,
            status: function () {
                runChecks();
                return window.filmix_pro_plus_status;
            }
        };

        runChecks();

        log('Плагин успешно инициализирован');
        log('Версия ' + VERSION);
    }

    function bootstrap() {
        var attempts = 0;
        var maxAttempts = 100;

        var timer = setInterval(function () {
            attempts++;

            if (window.Lampa && window.appready && document.body) {
                clearInterval(timer);
                initialize();
            } else if (attempts >= maxAttempts) {
                clearInterval(timer);
                log('Тайм-аут ожидания готовности Lampa');

                window.filmix_pro_plus_status = {
                    version: VERSION,
                    initialized: false,
                    error: 'Lampa не стала готова за 30 секунд'
                };
            }
        }, 300);
    }

    log('Скрипт загружен');
    bootstrap();

})();
