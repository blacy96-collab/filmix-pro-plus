
(function () {
    'use strict';

    var STYLE_ID = 'filmix-cinema-v7-style';
    var BODY_CLASS = 'filmix-cinema-v7';

    if (window.filmixCinemaV7Loaded) return;
    window.filmixCinemaV7Loaded = true;

    var css = [
        /* ОБЩИЙ СТИЛЬ */
        'body.' + BODY_CLASS + ' {',
        ' background:#080a0f !important;',
        ' color:#f4f1eb !important;',
        '}',

        /* ГЛАВНЫЙ КАТАЛОГ */
        'body.' + BODY_CLASS + ' .items-line {',
        ' padding-bottom:3.8em !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-line__head {',
        ' padding:0 1.4em .8em !important;',
        ' margin-bottom:1.35em !important;',
        ' border-bottom:1px solid rgba(215,184,112,.34);',
        '}',

        'body.' + BODY_CLASS + ' .items-line__title {',
        ' color:#e8ca8b !important;',
        ' font-size:1.85em !important;',
        ' font-weight:500 !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-line__more {',
        ' color:#e8ca8b !important;',
        ' background:#171b24 !important;',
        ' border:1px solid rgba(215,184,112,.45);',
        ' border-radius:2em !important;',
        '}',

        /* КАРТОЧКИ */
        'body.' + BODY_CLASS + ' .items-cards {',
        ' align-items:flex-start !important;',
        ' gap:.9em !important;',
        ' padding:.35em 1.35em 1em !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-cards .card {',
        ' width:14.5em !important;',
        ' flex:0 0 14.5em !important;',
        ' padding:.65em !important;',
        ' box-sizing:border-box !important;',
        ' border:1px solid rgba(215,184,112,.16) !important;',
        ' border-radius:1.05em !important;',
        ' background:linear-gradient(160deg,#171c27,#0e121a) !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-cards .card__view {',
        ' width:100% !important;',
        ' height:auto !important;',
        ' padding-bottom:150% !important;',
        ' margin-bottom:.8em !important;',
        ' overflow:hidden !important;',
        ' border-radius:.72em !important;',
        ' background:#090c12 !important;',
        '}',

        /* ПОСТЕРЫ ЦЕЛИКОМ */
        'body.' + BODY_CLASS + ' .items-cards .card__img {',
        ' width:100% !important;',
        ' height:100% !important;',
        ' object-fit:contain !important;',
        ' object-position:center center !important;',
        ' background:#090c12 !important;',
        ' border-radius:.72em !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-cards .card__title {',
        ' color:#f5f1e9 !important;',
        ' font-size:1.25em !important;',
        ' font-weight:500 !important;',
        ' line-height:1.28 !important;',
        ' max-height:2.56em !important;',
        ' -webkit-line-clamp:2 !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-cards .card__age {',
        ' color:#cdb783 !important;',
        ' font-size:1em !important;',
        ' margin-top:.55em !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-cards .card.focus,',
        'body.' + BODY_CLASS + ' .items-cards .card.hover {',
        ' z-index:3 !important;',
        ' transform:scale(1.045) !important;',
        ' border-color:#e4c47d !important;',
        ' box-shadow:0 0 0 2px rgba(228,196,125,.72),',
        ' 0 12px 28px rgba(0,0,0,.55) !important;',
        '}',

        'body.' + BODY_CLASS + ' .items-cards .card.focus .card__title {',
        ' color:#f4d99d !important;',
        '}',

        'body.' + BODY_CLASS + ' .card__quality {',
        ' background:#d9b96f !important;',
        ' color:#111 !important;',
        ' font-weight:700 !important;',
        ' border-radius:.35em !important;',
        '}',

        'body.' + BODY_CLASS + ' .card__vote {',
        ' background:rgba(8,10,15,.9) !important;',
        ' color:#f4d99d !important;',
        ' border:1px solid rgba(215,184,112,.55);',
        '}',

        /* КИНЕМАТОГРАФИЧЕСКАЯ СТРАНИЦА ФИЛЬМА */
        'body.' + BODY_CLASS + ' .full-start {',
        ' position:relative !important;',
        ' padding:0 2.2em 4em !important;',
        ' background:#080a0f !important;',
        ' overflow:hidden !important;',
        ' isolation:isolate;',
        '}',

        /* ШИРОКИЙ ФОНОВЫЙ КАДР */
        'body.' + BODY_CLASS + ' .full-start__background {',
        ' display:block !important;',
        ' position:absolute !important;',
        ' top:-1.5em !important;',
        ' left:0 !important;',
        ' width:100% !important;',
        ' max-width:none !important;',
        ' height:43em !important;',
        ' object-fit:cover !important;',
        ' object-position:center 28% !important;',
        ' opacity:.88 !important;',
        ' z-index:-1 !important;',
        ' mask-image:linear-gradient(to bottom,#000 0%,#000 55%,transparent 100%) !important;',
        ' -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 55%,transparent 100%) !important;',
        '}',

        /* СТЕКЛЯННАЯ ИНФОРМАЦИОННАЯ ПАНЕЛЬ */
        'body.' + BODY_CLASS + ' .full-start__body {',
        ' display:block !important;',
        ' position:relative !important;',
        ' z-index:2 !important;',
        ' height:auto !important;',
        ' min-height:0 !important;',
        ' margin-top:18em !important;',
        ' padding:2em 2.1em 2.2em !important;',
        ' border:1px solid rgba(255,255,255,.1) !important;',
        ' border-radius:1.5em !important;',
        ' background:linear-gradient(135deg,rgba(17,21,29,.97),rgba(8,10,15,.94)) !important;',
        ' box-shadow:0 18px 55px rgba(0,0,0,.55) !important;',
        ' backdrop-filter:blur(16px);',
        ' -webkit-backdrop-filter:blur(16px);',
        '}',

        /* УБИРАЕМ ДУБЛИРУЮЩИЙ ПОСТЕР СПРАВА */
        'body.' + BODY_CLASS + ' .full-start__right {',
        ' display:none !important;',
        '}',

        'body.' + BODY_CLASS + ' .full-start__left {',
        ' padding:0 !important;',
        ' margin:0 !important;',
        ' overflow:visible !important;',
        '}',

        /* НАЗВАНИЕ */
        'body.' + BODY_CLASS + ' .full-start__title {',
        ' color:#fff !important;',
        ' font-size:3.25em !important;',
        ' font-weight:650 !important;',
        ' line-height:1.08 !important;',
        ' max-width:100% !important;',
        ' max-height:none !important;',
        ' margin:.12em 0 .18em !important;',
        ' text-shadow:0 3px 18px rgba(0,0,0,.7);',
        '}',

        'body.' + BODY_CLASS + ' .full-start__title-original {',
        ' color:#d9dce2 !important;',
        ' font-size:1.65em !important;',
        ' font-weight:400 !important;',
        ' margin-bottom:1em !important;',
        '}',

        /* ЖАНРЫ И МЕТАДАННЫЕ */
        'body.' + BODY_CLASS + ' .full-start__tags {',
        ' padding-bottom:1.1em !important;',
        '}',

        'body.' + BODY_CLASS + ' .full-start__tag {',
        ' background:rgba(215,184,112,.13) !important;',
        ' border:1px solid rgba(215,184,112,.28) !important;',
        ' color:#ead8ae !important;',
        ' border-radius:.55em !important;',
        ' padding:.4em .65em !important;',
        '}',

        'body.' + BODY_CLASS + ' .full-start__deta {',
        ' color:#d7bd83 !important;',
        ' margin:1em 0 !important;',
        '}',

        'body.' + BODY_CLASS + ' .full-start__pg,',
        'body.' + BODY_CLASS + ' .full-start__status {',
        ' border-color:rgba(215,184,112,.65) !important;',
        ' border-radius:.4em !important;',
        '}',

        /* ОПИСАНИЕ */
        'body.' + BODY_CLASS + ' .full-start__descr {',
        ' display:block !important;',
        ' color:#d7dbe2 !important;',
        ' max-width:100% !important;',
        ' height:auto !important;',
        ' max-height:7em !important;',
        ' font-size:1.2em !important;',
        ' line-height:1.55 !important;',
        ' margin:1.2em 0 1.5em !important;',
        ' mask-image:linear-gradient(to bottom,#000 0%,#000 78%,transparent 100%) !important;',
        '}',

        /* КНОПКИ */
        'body.' + BODY_CLASS + ' .full-start__buttons {',
        ' margin-top:1.2em !important;',
        '}',

        'body.' + BODY_CLASS + ' .full-start__button {',
        ' min-width:3.2em !important;',
        ' height:3em !important;',
        ' justify-content:center !important;',
        ' background:rgba(255,255,255,.07) !important;',
        ' border:1px solid rgba(215,184,112,.5) !important;',
        ' border-radius:2em !important;',
        ' color:#f7f2e8 !important;',
        '}',

        'body.' + BODY_CLASS + ' .full-start__button.focus {',
        ' background:#d8b66b !important;',
        ' color:#111 !important;',
        ' border-color:#f1d99d !important;',
        ' box-shadow:0 0 22px rgba(216,182,107,.35) !important;',
        '}',

        'body.' + BODY_CLASS + ' .full-start__ratings {',
        ' color:#f0d38f !important;',
        '}',

        /* ШАПКА И МЕНЮ */
        'body.' + BODY_CLASS + ' .head,',
        'body.' + BODY_CLASS + ' .head__body {',
        ' background:rgba(8,10,15,.94) !important;',
        '}',

        'body.' + BODY_CLASS + ' .head__title {',
        ' color:#e8ca8b !important;',
        '}',

        'body.' + BODY_CLASS + ' .menu {',
        ' background:#10151f !important;',
        ' border-right:1px solid rgba(215,184,112,.22) !important;',
        '}',

        'body.' + BODY_CLASS + ' .menu__item.focus {',
        ' background:rgba(215,184,112,.16) !important;',
        ' color:#f0d38f !important;',
        ' box-shadow:inset .25em 0 #d8b66b !important;',
        '}',

        'body.' + BODY_CLASS + ' .modal__content,',
        'body.' + BODY_CLASS + ' .selectbox,',
        'body.' + BODY_CLASS + ' .settings {',
        ' background:#141a24 !important;',
        '}'
    ].join('\n');

    function removePreviousStyles() {
        var ids = [
            'filmix-cinema-v6-style',
            'filmix-premium-v2',
            'filmix-pro-plus-premium-v3',
            'filmix-premium-v4',
            'filmix-cinema-list-v5',
            'filmix-pro-plus-theme'
        ];

        ids.forEach(function (id) {
            var node = document.getElementById(id);
            if (node && node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });

        document.body.classList.remove(
            'filmix-cinema-v6',
            'filmix-premium-v3',
            'filmix-premium-v4',
            'filmix-cinema-v5',
            'filmix-premium-gold'
        );
    }

    function apply() {
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
        removePreviousStyles();
        apply();

        if (window.Lampa &&
            Lampa.Listener &&
            typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function (event) {
                if (event && event.type === 'ready') apply();
            });
        }

        console.log('[Filmix PRO+] Cinema V7 active');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
