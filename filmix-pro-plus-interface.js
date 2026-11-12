
(function () {
    'use strict';

    var VERSION = '1.0.0';
    var NAME = 'filmix_pro_plus_interface';
    var STYLE_ID = 'filmix-pro-plus-theme';
    var STORAGE_KEY = 'filmix_pro_plus_theme_enabled';

    if (window[NAME + '_loaded']) return;
    window[NAME + '_loaded'] = true;

    var enabled = true;
    var styleElement = null;
    var menuAdded = false;

    var ICON =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
        '<path fill="currentColor" d="M12 2l2.3 6.1L21 10l-6.7 1.9L12 18l-2.3-6.1L3 10l6.7-1.9zM19 16l1.1 2.9L23 20l-2.9 1.1L19 24l-1.1-2.9L15 20l2.9-1.1z"/>' +
        '</svg>';

    var CSS = `
/* FILMIX PRO+ INTERFACE */

:root {
    --filmix-gold: #d8b66b;
    --filmix-gold-light: #f2d99b;
    --filmix-background: #090c13;
    --filmix-panel: #141a25;
    --filmix-text: #f4f1e9;
}

/* Общий фон */

body.filmix-pro-plus-theme {
    background: var(--filmix-background) !important;
    color: var(--filmix-text);
}

/* Верхнее меню */

.filmix-pro-plus-theme .head,
.filmix-pro-plus-theme .head__body {
    background: rgba(9, 12, 19, .96) !important;
}

.filmix-pro-plus-theme .head__title,
.filmix-pro-plus-theme .menu__title {
    color: var(--filmix-gold-light) !important;
}

/* Заголовки разделов */

.filmix-pro-plus-theme .category__title,
.filmix-pro-plus-theme .title,
.filmix-pro-plus-theme .full-start__title,
.filmix-pro-plus-theme .full-start-new__title {
    color: var(--filmix-gold-light) !important;
}

/* Карточки */

.filmix-pro-plus-theme .card__view {
    border-radius: 12px !important;
    overflow: hidden;
    transition: transform .2s ease, box-shadow .2s ease;
}

.filmix-pro-plus-theme .card.focus .card__view,
.filmix-pro-plus-theme .card:hover .card__view {
    box-shadow: 0 0 0 2px var(--filmix-gold),
                0 8px 24px rgba(0, 0, 0, .45);
}

.filmix-pro-plus-theme .card__title {
    color: var(--filmix-text);
}

/* Выделение элементов */

.filmix-pro-plus-theme .selector.focus,
.filmix-pro-plus-theme .menu__item.focus {
    border-color: var(--filmix-gold) !important;
}

/* Кнопки на странице фильма */

.filmix-pro-plus-theme .full-start__button,
.filmix-pro-plus-theme .full-start-new__button {
    border-radius: 9px;
}

.filmix-pro-plus-theme .full-start__button.focus,
.filmix-pro-plus-theme .full-start-new__button.focus {
    background: var(--filmix-gold) !important;
    color: #111 !important;
}

/* Панели */

.filmix-pro-plus-theme .modal__content,
.filmix-pro-plus-theme .selectbox,
.filmix-pro-plus-theme .settings {
    background: var(--filmix-panel);
}

/* Полосы прокрутки */

.filmix-pro-plus-theme ::-webkit-scrollbar-thumb {
    background: var(--filmix-gold);
    border-radius: 10px;
}
`;

    function log(message, error) {
        if (window.console) {
            console.log('[Filmix PRO+ ' + VERSION + ']', message, error || '');
        }
    }

    function getEnabled() {
        try {
            if (window.Lampa && Lampa.Storage) {
                return Lampa.Storage.get(STORAGE_KEY, true) !== false;
            }
        } catch (e) {
            log('Не удалось прочитать настройки', e);
        }

        return true;
    }

    function saveEnabled(value) {
        try {
            if (window.Lampa && Lampa.Storage) {
                Lampa.Storage.set(STORAGE_KEY, value);
            }
        } catch (e) {
            log('Не удалось сохранить настройки', e);
        }
    }

    function applyTheme() {
        var body = document.body;

        if (!body) return;

        if (enabled) {
            body.classList.add('filmix-pro-plus-theme');

            if (!styleElement) {
                styleElement = document.getElementById(STYLE_ID);

                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = STYLE_ID;
                    styleElement.type = 'text/css';
                    styleElement.textContent = CSS;
                    document.head.appendChild(styleElement);
                }
            }
        } else {
            body.classList.remove('filmix-pro-plus-theme');

            if (styleElement) {
                styleElement.remove();
                styleElement = null;
            }
        }
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

    function toggleTheme() {
        enabled = !enabled;

        saveEnabled(enabled);
        applyTheme();

        notify(
            enabled
                ? 'Filmix PRO+: оформление включено'
                : 'Filmix PRO+: стандартное оформление'
        );

        log('Theme enabled: ' + enabled);
    }

    function init() {
        if (!window.Lampa) {
            log('Lampa API не найден');
            return;
        }

        enabled = getEnabled();
        applyTheme();

        try {
            if (
                Lampa.Menu &&
                typeof Lampa.Menu.addButton === 'function'
            ) {
                Lampa.Menu.addButton(
                    ICON,
                    'Filmix PRO+ — изменить оформление',
                    toggleTheme
                );

                menuAdded = true;
            }
        } catch (e) {
            log('Ошибка добавления кнопки меню', e);
        }

        log('Плагин запущен');
        log('Тема: ' + (enabled ? 'включена' : 'выключена'));
        log('Кнопка меню: ' + (menuAdded ? 'добавлена' : 'недоступна'));

        notify('Filmix PRO+ Interface ' + VERSION + ' загружен');
    }

    function bootstrap() {
        if (window.appready) {
            init();
        } else if (
            window.Lampa &&
            Lampa.Listener &&
            typeof Lampa.Listener.follow === 'function'
        ) {
            Lampa.Listener.follow('app', function (event) {
                if (event && event.type === 'ready') {
                    init();
                }
            });
        } else {
            setTimeout(function () {
                if (window.Lampa && window.appready) {
                    init();
                } else {
                    log('Не удалось дождаться готовности Lampa');
                }
            }, 3000);
        }
    }

    bootstrap();

})();
