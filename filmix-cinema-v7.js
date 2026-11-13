
(function () {
    'use strict';

    var ID = 'filmix-smart-tv-theme';
    var BODY = 'filmix-smart-tv';

    if (window.filmixSmartTVLoaded) return;
    window.filmixSmartTVLoaded = true;

    var css = [
        /* ОСНОВНАЯ ПАЛИТРА */
        'body.' + BODY + ' {',
        ' background:#101113 !important;',
        ' color:#f2f2f2 !important;',
        ' --ft-orange:#ed762e;',
        ' --ft-panel:#1b1d20;',
        ' --ft-muted:#a4a5a7;',
        '}',

        /* ГЛАВНАЯ ОБЛАСТЬ */
        'body.' + BODY + '.is_main .activity,',
        'body.' + BODY + ' .activity {',
        ' background:#101113 !important;',
        '}',

        /* ШАПКА */
        'body.' + BODY + ' .head,',
        'body.' + BODY + ' .head__body {',
        ' background:#101113 !important;',
        ' border:0 !important;',
        ' box-shadow:none !important;',
        '}',

        'body.' + BODY + ' .head__title {',
        ' color:#f4f4f4 !important;',
        ' font-weight:600 !important;',
        ' letter-spacing:.015em;',
        '}',

        'body.' + BODY + ' .head__action {',
        ' background:#202226 !important;',
        ' border-radius:50% !important;',
        '}',

        /* ЗАГОЛОВКИ РАЗДЕЛОВ */
        'body.' + BODY + ' .items-line__head {',
        ' display:flex !important;',
        ' align-items:center !important;',
        ' justify-content:space-between !important;',
        ' padding:0 1.1em .65em !important;',
        ' margin-bottom:1em !important;',
        ' border-bottom:1px solid rgba(255,255,255,.08) !important;',
        '}',

        'body.' + BODY + ' .items-line__title {',
        ' color:#f5f5f5 !important;',
        ' font-size:1.65em !important;',
        ' font-weight:600 !important;',
        '}',

        'body.' + BODY + ' .items-line__more {',
        ' background:#242629 !important;',
        ' color:#f5f5f5 !important;',
        ' border:1px solid #393b3e !important;',
        ' border-radius:.55em !important;',
        ' padding:.45em 1em !important;',
        '}',

        /* КАРТОЧКИ КАТАЛОГА */
        'body.' + BODY + ' .items-cards {',
        ' display:flex !important;',
        ' align-items:flex-start !important;',
        ' gap:1em !important;',
        ' padding:.4em 1.1em 1.5em !important;',
        '}',

        'body.' + BODY + ' .items-cards .card {',
        ' background:#1b1d20 !important;',
        ' border:1px solid rgba(255,255,255,.06) !important;',
        ' border-radius:.75em !important;',
        ' padding:.45em !important;',
        ' box-sizing:border-box !important;',
        ' overflow:hidden !important;',
        '}',

        /* 6 КАРТОЧЕК В ШИРОКОМ РЕЖИМЕ */
        '@media screen and (min-width:1400px) {',
        ' body.' + BODY + ' .items-cards .card {',
        '  width:calc((100vw - 25em) / 6) !important;',
        '  flex:0 0 calc((100vw - 25em) / 6) !important;',
        '  min-width:0 !important;',
        ' }',
        '}',

        /* 3–4 КАРТОЧКИ НА СРЕДНИХ ЭКРАНАХ */
        '@media screen and (min-width:800px) and (max-width:1399px) {',
        ' body.' + BODY + ' .items-cards .card {',
        '  width:17em !important;',
        '  flex:0 0 17em !important;',
        ' }',
        '}',

        /* ПОСТЕР */
        'body.' + BODY + ' .card__view {',
        ' width:100% !important;',
        ' height:auto !important;',
        ' padding-bottom:150% !important;',
        ' position:relative !important;',
        ' overflow:hidden !important;',
        ' border-radius:.55em !important;',
        ' background:#101113 !important;',
        '}',

        'body.' + BODY + ' .card__img {',
        ' width:100% !important;',
        ' height:100% !important;',
        ' object-fit:contain !important;',
        ' object-position:center !important;',
        '}',

        /* НАЗВАНИЯ И ГОДЫ */
        'body.' + BODY + ' .card__title {',
        ' color:#f4f4f4 !important;',
        ' font-size:1.12em !important;',
        ' font-weight:500 !important;',
        ' line-height:1.3 !important;',
        '}',

        'body.' + BODY + ' .card__age {',
        ' color:#a8aaad !important;',
        ' font-size:.95em !important;',
        '}',

        /* ФОКУС ПУЛЬТА */
        'body.' + BODY + ' .card.focus {',
        ' border:2px solid var(--ft-orange) !important;',
        ' background:#292b2e !important;',
        ' box-shadow:0 0 20px rgba(237,118,46,.25) !important;',
        ' transform:scale(1.035);',
        ' z-index:5 !important;',
        '}',

        'body.' + BODY + ' .card.focus .card__title {',
        ' color:#ffb17f !important;',
        '}',

        /* БОКОВАЯ НАВИГАЦИЯ */
        'body.' + BODY + ' .menu {',
        ' background:#191b1e !important;',
        ' border-right:1px solid #303236 !important;',
        ' box-shadow:12px 0 35px rgba(0,0,0,.3) !important;',
        '}',

        'body.' + BODY + ' .menu__item {',
        ' border-radius:.55em !important;',
        ' margin:.2em .45em !important;',
        '}',

        'body.' + BODY + ' .menu__item.focus,',
        'body.' + BODY + ' .menu__item.traverse {',
        ' background:#30251f !important;',
        ' color:#ff9a5b !important;',
        ' border-left:3px solid var(--ft-orange) !important;',
        '}',

        'body.' + BODY + ' .menu__item.focus .menu__text,',
        'body.' + BODY + ' .menu__item.focus .menu__ico {',
        ' color:#ff9a5b !important;',
        '}',

        /* СТРАНИЦА ФИЛЬМА */
        'body.' + BODY + ' .full-start {',
        ' background:#101113 !important;',
        '}',

        'body.' + BODY + ' .full-start__background {',
        ' opacity:.88 !important;',
        '}',

        'body.' + BODY + ' .full-start__body {',
        ' background:linear-gradient(135deg,rgba(27,29,32,.97),rgba(13,14,16,.96)) !important;',
        ' border:1px solid rgba(255,255,255,.08) !important;',
        ' border-radius:1em !important;',
        ' padding:1.5em !important;',
        '}',

        'body.' + BODY + ' .full-start__title {',
        ' color:#fff !important;',
        ' font-size:2.8em !important;',
        ' font-weight:700 !important;',
        '}',

        'body.' + BODY + ' .full-start__descr {',
        ' color:#c5c6c8 !important;',
        ' line-height:1.5 !important;',
        '}',

        'body.' + BODY + ' .full-start__button.focus {',
        ' background:#ed762e !important;',
        ' color:#fff !important;',
        ' border-color:#ed762e !important;',
        '}',

        /* ОКНА */
        'body.' + BODY + ' .modal__content,',
        'body.' + BODY + ' .selectbox,',
        'body.' + BODY + ' .settings {',
        ' background:#1b1d20 !important;',
        ' color:#f4f4f4 !important;',
        '}',

        /* ОТКЛЮЧАЕМ АНИМАЦИИ ПРИ СИСТЕМНОМ REDUCED MOTION */
        '@media (prefers-reduced-motion:reduce) {',
        ' body.' + BODY + ' *,',
        ' body.' + BODY + ' *::before {',
        '  animation:none !important;',
        '  transition:none !important;',
        ' }',
        '}'
    ].join('\n');

    function apply() {
        if (!document.head || !document.body) return;

        document.body.classList.add(BODY);

        var style = document.getElementById(ID);

        if (!style) {
            style = document.createElement('style');
            style.id = ID;
            style.type = 'text/css';
            document.head.appendChild(style);
        }

        style.textContent = css;
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

        console.log('[Filmix PRO+] Smart TV theme loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
