
(function () {
    'use strict';

    var STYLE_ID = 'filmix-cinema-v6-style';
    var BODY_CLASS = 'filmix-cinema-v6';

    if (window.filmixCinemaV6Loaded) return;
    window.filmixCinemaV6Loaded = true;

    var css = [

        /* ОСНОВНОЙ ФОН */
        'body.' + BODY_CLASS + ' {',
        ' background: #080a10 !important;',
        ' color: #f5f1e9 !important;',
        '}',

        /* СТРАНИЦА ФИЛЬМА */
        'body.' + BODY_CLASS + ' .full-start,',
        'body.' + BODY_CLASS + ' .full-start-new {',
        ' position: relative !important;',
        ' background: #080a10 !important;',
        ' overflow: hidden;',
        '}',

        /* ФОНОВОЕ ИЗОБРАЖЕНИЕ */
        'body.' + BODY_CLASS + ' .full-start__background,',
        'body.' + BODY_CLASS + ' .full-start-new__background {',
        ' opacity: .9 !important;',
        ' filter: saturate(1.15) !important;',
        '}',

        /* ГРАДИЕНТ ДЛЯ ЧИТАЕМОСТИ */
        'body.' + BODY_CLASS + ' .full-start::before,',
        'body.' + BODY_CLASS + ' .full-start-new::before {',
        ' content: "";',
        ' position: absolute;',
        ' inset: 0;',
        ' z-index: 1;',
        ' pointer-events: none;',
        ' background: linear-gradient(',
        ' 90deg, rgba(5,7,12,.96) 0%,',
        ' rgba(5,7,12,.78) 38%,',
        ' rgba(5,7,12,.25) 75%,',
        ' rgba(5,7,12,.10) 100%),',
        ' linear-gradient(',
        ' 0deg, #080a10 0%, transparent 55%);',
        '}',

        /* СОДЕРЖИМОЕ ПОВЕРХ ФОНА */
        'body.' + BODY_CLASS + ' .full-start__body,',
        'body.' + BODY_CLASS + ' .full-start-new__body {',
        ' position: relative !important;',
        ' z-index: 2 !important;',
        '}',

        /* НАЗВАНИЕ ФИЛЬМА */
        'body.' + BODY_CLASS + ' .full-start__title,',
        'body.' + BODY_CLASS + ' .full-start-new__title {',
        ' color: #ffffff !important;',
        ' font-size: 3.2em !important;',
        ' font-weight: 600 !important;',
        ' line-height: 1.12 !important;',
        ' max-width: 12em;',
        ' text-shadow: 0 3px 18px rgba(0,0,0,.75);',
        '}',

        /* ОПИСАНИЕ */
        'body.' + BODY_CLASS + ' .full-start__description,',
        'body.' + BODY_CLASS + ' .full-start-new__description {',
        ' color: #e2e0dc !important;',
        ' font-size: 1.15em !important;',
        ' line-height: 1.55 !important;',
        ' text-shadow: 0 2px 8px #000;',
        '}',

        /* ИНФОРМАЦИЯ О ФИЛЬМЕ */
        'body.' + BODY_CLASS + ' .full-start__details,',
        'body.' + BODY_CLASS + ' .full-start-new__details {',
        ' color: #e2c782 !important;',
        ' font-size: 1.05em !important;',
        '}',

        /* КНОПКИ */
        'body.' + BODY_CLASS + ' .full-start__button,',
        'body.' + BODY_CLASS + ' .full-start-new__button {',
        ' background: rgba(20,23,31,.9) !important;',
        ' border: 1px solid rgba(225,196,119,.5) !important;',
        ' border-radius: 2em !important;',
        ' color: #f6f1e7 !important;',
        ' padding: .85em 1.5em !important;',
        '}',

        /* ВЫБРАННАЯ КНОПКА */
        'body.' + BODY_CLASS + ' .full-start__button.focus,',
        'body.' + BODY_CLASS + ' .full-start-new__button.focus {',
        ' background: #d8b66b !important;',
        ' color: #111111 !important;',
        ' border-color: #f1d99d !important;',
        ' box-shadow: 0 0 22px rgba(216,182,107,.4);',
        '}',

        /* ПОСТЕР НА СТРАНИЦЕ ФИЛЬМА */
        'body.' + BODY_CLASS + ' .full-start__poster,',
        'body.' + BODY_CLASS + ' .full-start-new__poster {',
        ' border-radius: 1em !important;',
        ' overflow: hidden !important;',
        ' box-shadow: 0 12px 35px rgba(0,0,0,.55);',
        '}',

        /* ВЕРХНЯЯ ПАНЕЛЬ */
        'body.' + BODY_CLASS + ' .head,',
        'body.' + BODY_CLASS + ' .head__body {',
        ' background: rgba(8,10,16,.9) !important;',
        '}',

        'body.' + BODY_CLASS + ' .head__title {',
        ' color: #e8c77f !important;',
        '}',

        /* ОКНА И НАСТРОЙКИ */
        'body.' + BODY_CLASS + ' .modal__content,',
        'body.' + BODY_CLASS + ' .selectbox,',
        'body.' + BODY_CLASS + ' .settings {',
        ' background: #141923 !important;',
        '}',

        /* СКРОЛЛБАР */
        'body.' + BODY_CLASS + ' ::-webkit-scrollbar-thumb {',
        ' background: #d8b66b !important;',
        ' border-radius: 10px;',
        '}'

    ].join('\n');

    function removeOldStyles() {
        var oldIds = [
            'filmix-premium-v2',
            'filmix-pro-plus-premium-v3',
            'filmix-premium-v4',
            'filmix-cinema-list-v5',
            'filmix-pro-plus-theme'
        ];

        oldIds.forEach(function (id) {
            var element = document.getElementById(id);

            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
    }

    function apply() {
        if (!document.body || !document.head) return;

        document.body.classList.add(BODY_CLASS);

        if (!document.getElementById(STYLE_ID)) {
            var style = document.createElement('style');

            style.id = STYLE_ID;
            style.type = 'text/css';
            style.appendChild(
                document.createTextNode(css)
            );

            document.head.appendChild(style);
        }
    }

    function start() {
        removeOldStyles();
        apply();

        if (window.Lampa &&
            Lampa.Listener &&
            typeof Lampa.Listener.follow === 'function') {

            Lampa.Listener.follow('activity', function () {
                apply();
            });
        }

        console.log('[Filmix PRO+] Cinema V6 loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

})();

