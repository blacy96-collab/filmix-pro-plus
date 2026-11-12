
(function () {
    'use strict';

    var STYLE_ID = 'filmix-premium-v4';
    var CLASS_NAME = 'filmix-premium-v4';

    if (window.filmixPremiumV4Loaded) return;
    window.filmixPremiumV4Loaded = true;

    var css = [
        /* Общий стиль */
        'body.' + CLASS_NAME + ' {',
        ' background: #080a10 !important;',
        ' color: #f4eee4 !important;',
        '}',

        /* Верхняя панель */
        'body.' + CLASS_NAME + ' .head,',
        'body.' + CLASS_NAME + ' .head__body {',
        ' background: #090c13 !important;',
        '}',
        'body.' + CLASS_NAME + ' .head__title {',
        ' color: #e8c77f !important;',
        ' font-size: 1.8em !important;',
        ' letter-spacing: .05em;',
        '}',

        /* Заголовки рядов */
        'body.' + CLASS_NAME + ' .items-line {',
        ' padding-bottom: 4em !important;',
        '}',
        'body.' + CLASS_NAME + ' .items-line__head {',
        ' margin-bottom: 1.8em !important;',
        ' border-bottom: 1px solid rgba(216,182,107,.28);',
        ' padding-bottom: .7em !important;',
        '}',
        'body.' + CLASS_NAME + ' .items-line__title {',
        ' color: #e8c77f !important;',
        ' font-size: 1.85em !important;',
        ' letter-spacing: .02em;',
        '}',
        'body.' + CLASS_NAME + ' .items-line__more {',
        ' background: #171b25 !important;',
        ' color: #e8c77f !important;',
        ' border: 1px solid rgba(216,182,107,.35);',
        ' border-radius: 2em !important;',
        '}',

        /* Увеличенные постеры */
        'body.' + CLASS_NAME + ' .card {',
        ' width: 15.5em !important;',
        ' margin-right: .25em;',
        '}',
        'body.' + CLASS_NAME + ' .card__view {',
        ' border-radius: 1.1em !important;',
        ' overflow: visible !important;',
        ' margin-bottom: 1.2em !important;',
        ' box-shadow: 0 8px 24px rgba(0,0,0,.48);',
        '}',
        'body.' + CLASS_NAME + ' .card__img {',
        ' border-radius: 1.1em !important;',
        '}',
        'body.' + CLASS_NAME + ' .card__title {',
        ' color: #f5f0e7 !important;',
        ' font-size: 1.35em !important;',
        ' line-height: 1.25 !important;',
        '}',

        'body.' + CLASS_NAME + ' .card__age {',
        ' color: #c9ad72 !important;',
        ' font-size: 1em !important;',
        ' margin-top: .6em !important;',
        '}',

        /* Золотое выделение выбранного фильма */
        'body.' + CLASS_NAME + ' .card.focus,',
        'body.' + CLASS_NAME + ' .card.hover {',
        ' z-index: 5 !important;',
        ' transform: scale(1.055);',
        '}',

        'body.' + CLASS_NAME + ' .card.focus .card__view::after,',
        'body.' + CLASS_NAME + ' .card.hover .card__view::after {',
        ' border: .22em solid #e5c477 !important;',
        ' border-radius: 1.35em !important;',
        ' box-shadow: 0 0 22px rgba(229,196,119,.5);',
        '}',

        'body.' + CLASS_NAME + ' .card.focus .card__title {',
        ' color: #f5d994 !important;',
        '}',

        /* Боковое меню */
        'body.' + CLASS_NAME + ' .menu {',
        ' background: #10141e !important;',
        ' border-right: 1px solid rgba(216,182,107,.22);',
        ' box-shadow: 12px 0 35px rgba(0,0,0,.35);',
        '}',

        'body.' + CLASS_NAME + ' .menu__item {',
        ' border-radius: .8em !important;',
        ' margin: .2em .45em !important;',
        ' padding-top: 1em !important;',
        ' padding-bottom: 1em !important;',
        '}',

        'body.' + CLASS_NAME + ' .menu__item.focus,',
        'body.' + CLASS_NAME + ' .menu__item.traverse,',
        'body.' + CLASS_NAME + ' .menu__item.hover {',
        ' background: rgba(216,182,107,.18) !important;',
        ' color: #f4d68e !important;',
        ' box-shadow: inset 4px 0 #d8b66b;',
        '}',

        'body.' + CLASS_NAME + ' .menu__item.focus .menu__text,',
        'body.' + CLASS_NAME + ' .menu__item.focus .menu__ico {',
        ' color: #f4d68e !important;',
        '}',

        'body.' + CLASS_NAME + ' .menu__split {',
        ' border-color: rgba(216,182,107,.28) !important;',
        '}',

        /* Страницы фильмов и кнопки */
        'body.' + CLASS_NAME + ' .full-start__title,',
        'body.' + CLASS_NAME + ' .full-start-new__title {',
        ' color: #e8c77f !important;',
        '}',

        'body.' + CLASS_NAME + ' .full-start__button.focus,',
        'body.' + CLASS_NAME + ' .full-start-new__button.focus {',
        ' background: #d8b66b !important;',
        ' color: #111 !important;',
        '}',

        /* Окна */
        'body.' + CLASS_NAME + ' .modal__content,',
        'body.' + CLASS_NAME + ' .selectbox,',
        'body.' + CLASS_NAME + ' .settings {',
        ' background: #141a25 !important;',
        '}',

        /* Полоса прокрутки */
        'body.' + CLASS_NAME + ' ::-webkit-scrollbar-thumb {',
        ' background: #d8b66b !important;',
        ' border-radius: 1em;',
        '}'
    ].join('\n');

    function apply() {
        if (!document.body || !document.head) return;

        document.body.classList.add(CLASS_NAME);

        if (!document.getElementById(STYLE_ID)) {
            var style = document.createElement('style');
            style.id = STYLE_ID;
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }
    }

    function start() {
        apply();

        if (window.Lampa && Lampa.Listener &&
            typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function (event) {
                if (event && event.type === 'ready') apply();
            });
        }

        console.log('[Filmix PRO+] Premium V4 active');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
