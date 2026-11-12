
(function () {
    'use strict';

    var STYLE_ID = 'filmix-cinema-v7-style';
    var BODY_CLASS = 'filmix-cinema-v7';

    if (window.filmixCinemaV7Loaded) return;
    window.filmixCinemaV7Loaded = true;

    var css = [
        '@keyframes filmixGoldFlow {',
        ' 0% { background-position: 200% 50%; }',
        ' 100% { background-position: -200% 50%; }',
        '}',

        /* ЗОЛОТОЕ ПЕРЕЛИВАНИЕ ТЕКСТА */
        'body.' + BODY_CLASS + ' .head__title,',
        'body.' + BODY_CLASS + ' .items-line__title,',
        'body.' + BODY_CLASS + ' .full-start__title {',
        ' background: linear-gradient(',
        ' 100deg, #98753b, #e6c77e, #fff4c9,',
        ' #c49a4e, #fff0b4, #98753b);',
        ' background-size: 300% 100% !important;',
        ' background-clip: text !important;',
        ' -webkit-background-clip: text !important;',
        ' -webkit-text-fill-color: transparent !important;',
        ' animation: filmixGoldFlow 7s linear infinite;',
        '}',

        /* ШЕСТЬ ФИЛЬМОВ В РЯД НА ШИРОКОМ ЭКРАНЕ */
        '@media screen and (min-width: 1100px) {',
        ' body.' + BODY_CLASS + ' .items-cards .card {',
        '  width: calc((100vw - 18em) / 6) !important;',
        '  flex: 0 0 calc((100vw - 18em) / 6) !important;',
        '  min-width: 0 !important;',
        '  margin: 0 .25em !important;',
        '  padding: .35em !important;',
        '  box-sizing: border-box !important;',
        ' }',

        ' body.' + BODY_CLASS + ' .items-cards {',
        '  display: flex !important;',
        '  align-items: flex-start !important;',
        '  gap: .45em !important;',
        ' }',

        ' body.' + BODY_CLASS + ' .items-cards .card__title {',
        '  font-size: 1.05em !important;',
        '  line-height: 1.25 !important;',
        '  max-height: 2.5em !important;',
        '  -webkit-line-clamp: 2 !important;',
        ' }',
        '}',

        /* ПОСТЕРЫ БЕЗ ОБРЕЗАНИЯ */
        'body.' + BODY_CLASS + ' .items-cards .card__view {',
        ' overflow: hidden !important;',
        ' border-radius: .8em !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-cards .card__img {',
        ' object-fit: contain !important;',
        ' object-position: center center !important;',
        '}',

        /* ВЫДЕЛЕНИЕ ВЫБРАННОГО ФИЛЬМА */
        'body.' + BODY_CLASS + ' .items-cards .card.focus {',
        ' border: 1px solid #e8ca82 !important;',
        ' border-radius: .9em !important;',
        ' box-shadow: 0 0 18px rgba(225,190,105,.42) !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-cards .card.focus .card__title {',
        ' color: #f5d995 !important;',
        '}',

        /* КНОПКА ЕЩЁ */
        'body.' + BODY_CLASS + ' .items-line__more.focus {',
        ' background: #d7b66d !important;',
        ' color: #17130b !important;',
        ' border-color: #f4dfa0 !important;',
        '}'
    ].join('\n');

    function apply() {
        if (!document.head || !document.body) return;

        document.body.classList.add(BODY_CLASS);

        var style = document.getElementById(STYLE_ID);

        if (style) {
            style.textContent = css;
        } else {
            style = document.createElement('style');
            style.id = STYLE_ID;
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }
    }

    function start() {
        apply();

        if (window.Lampa &&
            Lampa.Listener &&
            typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function () {
                apply();
            });
        }

        console.log('[Filmix PRO+] Cinema V7 updated');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
