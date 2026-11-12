
(function () {
    'use strict';

    var STYLE_ID = 'filmix-pro-plus-premium-v3';
    var BODY_CLASS = 'filmix-premium-v3';

    if (window.filmixPremiumV3Loaded) return;
    window.filmixPremiumV3Loaded = true;

    var css = [
        'body.' + BODY_CLASS + ' {',
        ' background: #080a0f !important;',
        ' color: #f2eee5 !important;',
        '}',

        /* Верхняя панель */
        'body.' + BODY_CLASS + ' .head,',
        'body.' + BODY_CLASS + ' .head__body {',
        ' background: rgba(8,10,15,.97) !important;',
        '}',
        'body.' + BODY_CLASS + ' .head__title {',
        ' color: #e4c783 !important;',
        ' font-weight: 400 !important;',
        ' letter-spacing: .04em;',
        '}',

        /* Карточки фильмов */
        'body.' + BODY_CLASS + ' .card {',
        ' width: 13.8em !important;',
        '}',

        'body.' + BODY_CLASS + ' .card__view {',
        ' border-radius: 1em !important;',
        ' overflow: visible !important;',
        ' margin-bottom: 1.1em !important;',
        ' box-shadow: 0 5px 18px rgba(0,0,0,.35);',
        '}',

        'body.' + BODY_CLASS + ' .card__img {',
        ' border-radius: 1em !important;',
        '}',

        'body.' + BODY_CLASS + ' .card__title {',
        ' color: #f4eee3 !important;',
        ' font-size: 1.28em !important;',
        ' font-weight: 400 !important;',
        ' line-height: 1.25 !important;',
        '}',

        'body.' + BODY_CLASS + ' .card__age {',
        ' color: #c9ad72 !important;',
        ' font-size: 1em !important;',
        ' margin-top: .55em !important;',
        '}',

        /* Выбранный фильм */
        'body.' + BODY_CLASS + ' .card.focus .card__view,',
        'body.' + BODY_CLASS + ' .card.hover .card__view {',
        ' box-shadow: 0 0 0 3px #d8b66b,',
        ' 0 0 24px rgba(216,182,107,.45) !important;',
        '}',

        'body.' + BODY_CLASS + ' .card.focus .card__title {',
        ' color: #f4d998 !important;',
        '}',

        /* Боковое меню */
        'body.' + BODY_CLASS + ' .menu {',
        ' background: #10141d !important;',
        '}',

        'body.' + BODY_CLASS + ' .menu__item {',
        ' border-radius: .7em !important;',
        ' transition: background .2s ease;',
        '}',

        'body.' + BODY_CLASS + ' .menu__item.focus,',
        'body.' + BODY_CLASS + ' .menu__item.traverse,',
        'body.' + BODY_CLASS + ' .menu__item.hover {',
        ' background: rgba(216,182,107,.2) !important;',
        ' color: #f5d994 !important;',
        ' box-shadow: inset 3px 0 #d8b66b;',
        '}',

        'body.' + BODY_CLASS + ' .menu__item.focus .menu__text,',
        'body.' + BODY_CLASS + ' .menu__item.focus .menu__ico {',
        ' color: #f5d994 !important;',
        '}',

        'body.' + BODY_CLASS + ' .menu__split {',
        ' border-color: rgba(216,182,107,.25) !important;',
        '}',

        /* Кнопки и окна */
        'body.' + BODY_CLASS + ' .full-start__title,',
        'body.' + BODY_CLASS + ' .full-start-new__title {',
        ' color: #e8ca86 !important;',
        '}',

        'body.' + BODY_CLASS + ' .full-start__button.focus,',
        'body.' + BODY_CLASS + ' .full-start-new__button.focus {',
        ' background: #d8b66b !important;',
        ' color: #111 !important;',
        '}',

        'body.' + BODY_CLASS + ' .modal__content,',
        'body.' + BODY_CLASS + ' .selectbox,',
        'body.' + BODY_CLASS + ' .settings {',
        ' background: #151a24 !important;',
        '}',

        /* Полосы прокрутки */
        'body.' + BODY_CLASS + ' ::-webkit-scrollbar-thumb {',
        ' background: #d8b66b !important;',
        ' border-radius: 1em;',
        '}'
    ].join('\n');

    function applyTheme() {
        if (!document.body || !document.head) return;

        document.body.classList.add(BODY_CLASS);

        if (!document.getElementById(STYLE_ID)) {
            var style = document.createElement('style');
            style.id = STYLE_ID;
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }
    }

    function start() {
        applyTheme();

        if (window.Lampa && Lampa.Listener &&
            typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function (event) {
                if (event && event.type === 'ready') {
                    applyTheme();
                }
            });
        }

        console.log('[Filmix PRO+] Premium Gold V3 enabled');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
