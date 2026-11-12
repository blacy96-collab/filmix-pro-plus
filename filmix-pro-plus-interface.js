
(function () {
    'use strict';

    var STYLE_ID = 'filmix-cinema-list-v5';
    var BODY_CLASS = 'filmix-cinema-v5';

    if (window.filmixCinemaV5Loaded) return;
    window.filmixCinemaV5Loaded = true;

    var css = [

        /* ОСНОВА */
        'body.' + BODY_CLASS + ' {',
        ' background: #080a10 !important;',
        ' color: #f5f1e9 !important;',
        '}',

        /* ЗАГОЛОВКИ СПИСКОВ */
        'body.' + BODY_CLASS + ' .items-line {',
        ' padding-bottom: 3.5em !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-line__head {',
        ' margin: 0 0 1.7em 0 !important;',
        ' padding: 0 1.2em .8em 1.2em !important;',
        ' border-bottom: 2px solid rgba(216,182,107,.35);',
        '}',

        'body.' + BODY_CLASS + ' .items-line__title {',
        ' color: #e8c77f !important;',
        ' font-size: 1.8em !important;',
        ' font-weight: 500 !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-line__more {',
        ' color: #e8c77f !important;',
        ' background: #171b25 !important;',
        ' border: 1px solid #665632 !important;',
        ' border-radius: 2em !important;',
        ' padding: .5em 1.2em !important;',
        '}',

        /* НОВЫЙ РАЗМЕР КАРТОЧЕК */
        'body.' + BODY_CLASS + ' .items-cards .card {',
        ' width: 16em !important;',
        ' margin-right: .35em !important;',
        ' padding: .65em !important;',
        ' background: #121722 !important;',
        ' border: 1px solid rgba(216,182,107,.14);',
        ' border-radius: 1em !important;',
        ' box-sizing: border-box !important;',
        '}',

        /* ОБЛАСТЬ ПОСТЕРА */
        'body.' + BODY_CLASS + ' .card__view {',
        ' width: 100% !important;',
        ' height: auto !important;',
        ' padding-bottom: 150% !important;',
        ' margin-bottom: 1em !important;',
        ' position: relative !important;',
        ' overflow: hidden !important;',
        ' background: #090c13 !important;',
        ' border-radius: .7em !important;',
        ' box-shadow: 0 5px 18px rgba(0,0,0,.45);',
        '}',

        /* ПОСТЕР ЦЕЛИКОМ, БЕЗ ОБРЕЗКИ */
        'body.' + BODY_CLASS + ' .card__img {',
        ' position: absolute !important;',
        ' inset: 0 !important;',
        ' width: 100% !important;',
        ' height: 100% !important;',
        ' object-fit: contain !important;',
        ' object-position: center center !important;',
        ' background: #090c13 !important;',
        ' border-radius: .7em !important;',
        '}',

        /* НАЗВАНИЕ ФИЛЬМА */
        'body.' + BODY_CLASS + ' .card__title {',
        ' color: #f5f1e9 !important;',
        ' font-size: 1.35em !important;',
        ' font-weight: 500 !important;',
        ' line-height: 1.3 !important;',
        ' min-height: 2.6em !important;',
        ' max-height: 2.6em !important;',
        ' overflow: hidden !important;',
        ' display: -webkit-box !important;',
        ' -webkit-line-clamp: 2 !important;',
        ' -webkit-box-orient: vertical !important;',
        '}',

        /* ГОД */
        'body.' + BODY_CLASS + ' .card__age {',
        ' color: #d8b66b !important;',
        ' font-size: 1.05em !important;',
        ' margin-top: .5em !important;',
        '}',

        /* ВЫБРАННАЯ КАРТОЧКА */
        'body.' + BODY_CLASS + ' .card.focus,',
        'body.' + BODY_CLASS + ' .card.hover {',
        ' z-index: 5 !important;',
        ' transform: scale(1.035);',
        ' background: #24202a !important;',
        ' border-color: #e4c477 !important;',
        ' box-shadow: 0 0 20px rgba(216,182,107,.3);',
        '}',

        'body.' + BODY_CLASS + ' .card.focus .card__title {',
        ' color: #f5d995 !important;',
        '}',

        /* КАЧЕСТВО И МЕТКИ */
        'body.' + BODY_CLASS + ' .card__quality,',
        'body.' + BODY_CLASS + ' .card__type {',
        ' border-radius: .35em !important;',
        ' font-weight: 600 !important;',
        '}',

        /* БОКОВОЕ МЕНЮ */
        'body.' + BODY_CLASS + ' .menu {',
        ' background: #10141e !important;',
        ' border-right: 1px solid rgba(216,182,107,.3);',
        '}',

        'body.' + BODY_CLASS + ' .menu__item {',
        ' border-radius: .7em !important;',
        ' margin: .2em .4em !important;',
        '}',

        'body.' + BODY_CLASS + ' .menu__item.focus,',
        'body.' + BODY_CLASS + ' .menu__item.traverse,',
        'body.' + BODY_CLASS + ' .menu__item.hover {',
        ' background: rgba(216,182,107,.2) !important;',
        ' color: #f5d995 !important;',
        ' box-shadow: inset 4px 0 #d8b66b;',
        '}',

        /* ВЕРХНЯЯ ПАНЕЛЬ */
        'body.' + BODY_CLASS + ' .head,',
        'body.' + BODY_CLASS + ' .head__body {',
        ' background: #090c13 !important;',
        '}',

        'body.' + BODY_CLASS + ' .head__title {',
        ' color: #e8c77f !important;',
        '}',

        /* СТРАНИЦА ФИЛЬМА */
        'body.' + BODY_CLASS + ' .full-start__title,',
        'body.' + BODY_CLASS + ' .full-start-new__title {',
        ' color: #e8c77f !important;',
        '}',

        'body.' + BODY_CLASS + ' .full-start__button.focus,',
        'body.' + BODY_CLASS + ' .full-start-new__button.focus {',
        ' background: #d8b66b !important;',
        ' color: #111 !important;',
        '}'

    ].join('\n');

    function apply() {
        if (!document.body || !document.head) return;

        document.body.classList.add(BODY_CLASS);

        var old = document.getElementById(STYLE_ID);

        if (!old) {
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

        console.log('[Filmix PRO+] Cinema List V5 loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
