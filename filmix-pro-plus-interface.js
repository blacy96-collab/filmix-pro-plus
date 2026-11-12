
(function () {
    'use strict';

    var STYLE_ID = 'filmix-premium-v2';

    if (window.filmixPremiumV2Loaded) return;
    window.filmixPremiumV2Loaded = true;

    var css = [
        'body { background: #080a0e !important; color: #eee9df !important; }',

        '.head, .head__body { background: #0b0e14 !important; }',
        '.head__title { color: #e4c783 !important; letter-spacing: 1px; }',
        '.head__menu-icon, .head__action { color: #e4c783 !important; }',

        '.card { background: transparent !important; }',
        '.card__view {',
        ' border-radius: 13px !important;',
        ' overflow: hidden !important;',
        ' border: 1px solid rgba(214,182,109,.18) !important;',
        ' box-shadow: 0 5px 18px rgba(0,0,0,.35) !important;',
        ' transition: transform .2s ease, border-color .2s ease;',
        '}',
        '.card__img { border-radius: 12px !important; }',
        '.card__title {',
        ' color: #f4eee3 !important;',
        ' font-weight: 500 !important;',
        ' letter-spacing: .2px;',
        '}',
        '.card__age { color: #c5ad7b !important; }',

        '.card.focus .card__view,',
        '.card.hover .card__view,',
        '.card:focus .card__view {',
        ' border: 2px solid #e1bd70 !important;',
        ' box-shadow: 0 0 0 2px rgba(225,189,112,.2),',
        ' 0 8px 28px rgba(0,0,0,.65) !important;',
        ' transform: scale(1.035);',
        '}',

        '.menu { background: #10141c !important; }',
        '.menu__item { border-radius: 9px !important; }',
        '.menu__item.focus {',
        ' background: rgba(214,182,109,.16) !important;',
        ' border-left: 3px solid #d6b66d !important;',
        '}',
        '.menu__text, .menu__ico { color: #eee5d4 !important; }',

        '.selector.focus { outline-color: #d6b66d !important; }',

        '.full-start__title, .full-start-new__title {',
        ' color: #e6c77f !important;',
        '}',
        '.full-start__button, .full-start-new__button {',
        ' border-radius: 9px !important;',
        '}',
        '.full-start__button.focus, .full-start-new__button.focus {',
        ' background: #d6b66d !important;',
        ' color: #111 !important;',
        '}',

        '.modal__content, .selectbox, .settings {',
        ' background: #141923 !important;',
        '}',

        '::-webkit-scrollbar-thumb {',
        ' background: #d6b66d !important;',
        ' border-radius: 10px;',
        '}'
    ].join('\n');

    function apply() {
        if (!document.head || !document.body) return;

        document.body.style.setProperty(
            'background',
            '#080a0e',
            'important'
        );

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

        console.log('[Filmix PRO+] Premium V2 active');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
