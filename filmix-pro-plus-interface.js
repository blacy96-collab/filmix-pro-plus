
(function () {
    'use strict';

    var ID = 'filmix-pro-plus-premium';
    var CLASS_NAME = 'filmix-premium-gold';

    if (window.filmixPremiumGoldLoaded) return;
    window.filmixPremiumGoldLoaded = true;

    var CSS = [
        ':root {',
        ' --fp-gold: #d6b66d;',
        ' --fp-gold-light: #f4dfaa;',
        ' --fp-bg: #080a0e;',
        ' --fp-panel: #151923;',
        ' --fp-text: #f4f1e9;',
        '}',

        'html, body {',
        ' background: var(--fp-bg) !important;',
        ' color: var(--fp-text) !important;',
        '}',

        'body.' + CLASS_NAME + ' {',
        ' background: var(--fp-bg) !important;',
        ' color: var(--fp-text) !important;',
        '}',

        'body.' + CLASS_NAME + ' .head,',
        'body.' + CLASS_NAME + ' .head__body,',
        'body.' + CLASS_NAME + ' .head__split {',
        ' background: rgba(8,10,14,.98) !important;',
        '}',

        'body.' + CLASS_NAME + ' .head__title,',
        'body.' + CLASS_NAME + ' .menu__title,',
        'body.' + CLASS_NAME + ' .category__title,',
        'body.' + CLASS_NAME + ' .title,',
        'body.' + CLASS_NAME + ' .full-start__title,',
        'body.' + CLASS_NAME + ' .full-start-new__title {',
        ' color: var(--fp-gold-light) !important;',
        '}',

        'body.' + CLASS_NAME + ' .card__view {',
        ' border-radius: 15px !important;',
        ' overflow: hidden !important;',
        '}',

        'body.' + CLASS_NAME + ' .card.focus .card__view,',
        'body.' + CLASS_NAME + ' .card.hover .card__view,',
        'body.' + CLASS_NAME + ' .card:focus .card__view {',
        ' outline: 2px solid var(--fp-gold) !important;',
        ' box-shadow: 0 0 18px rgba(214,182,109,.45) !important;',
        '}',

        'body.' + CLASS_NAME + ' .card__title,',
        'body.' + CLASS_NAME + ' .card__name {',
        ' color: var(--fp-text) !important;',
        '}',

        'body.' + CLASS_NAME + ' .selector.focus,',
        'body.' + CLASS_NAME + ' .menu__item.focus,',
        'body.' + CLASS_NAME + ' .settings-param.focus {',
        ' border-color: var(--fp-gold) !important;',
        '}',

        'body.' + CLASS_NAME + ' .full-start__button.focus,',
        'body.' + CLASS_NAME + ' .full-start-new__button.focus {',
        ' background: var(--fp-gold) !important;',
        ' color: #111 !important;',
        '}',

        'body.' + CLASS_NAME + ' .modal__content,',
        'body.' + CLASS_NAME + ' .selectbox,',
        'body.' + CLASS_NAME + ' .settings,',
        'body.' + CLASS_NAME + ' .menu {',
        ' background-color: var(--fp-panel) !important;',
        '}',

        'body.' + CLASS_NAME + ' .scroll__body {',
        ' scrollbar-color: var(--fp-gold) var(--fp-bg);',
        '}',

        'body.' + CLASS_NAME + ' .tag,',
        'body.' + CLASS_NAME + ' .card__quality {',
        ' border-radius: 4px;',
        '}'
    ].join('\n');

    function apply() {
        if (!document.body || !document.head) return;

        document.body.classList.add(CLASS_NAME);

        if (!document.getElementById(ID)) {
            var style = document.createElement('style');
            style.id = ID;
            style.type = 'text/css';
            style.appendChild(document.createTextNode(CSS));
            document.head.appendChild(style);
        }
    }

    function start() {
        apply();

        if (window.Lampa && Lampa.Listener &&
            typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function (event) {
                if (event && event.type === 'ready') {
                    apply();
                }
            });
        }

        setInterval(apply, 3000);

        console.log('[Filmix PRO+] Premium Gold loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
