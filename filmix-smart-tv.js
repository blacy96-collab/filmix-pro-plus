
(function () {
    'use strict';

    var PLUGIN = 'filmix_smart_tv';
    var STYLE_ID = 'filmix-smart-tv-global-style';
    var BUTTON_ID = 'filmix-smart-tv-toggle';
    var STORAGE_KEY = 'filmix_smart_tv_enabled';
    var IMAGE_BASE = 'https://image.tmdb.org/t/p/';

    if (window.filmixSmartTVRealLoaded) return;
    window.filmixSmartTVRealLoaded = true;

    var enabled = true;
    var observer = null;
    var headerObserver = null;

    var css = `
    :root {
        --ft-orange:#ed762e; --ft-gold:#d8b66b; --ft-gold-light:#f2d99b;
        --ft-bg:#101113; --ft-panel:#1b1d20; --ft-text:#f4f4f4;
    }

    html.ft-theme-on, body.ft-theme-on {
        background:var(--ft-bg) !important;
        color:var(--ft-text) !important;
    }

    body.ft-theme-on .head,
    body.ft-theme-on .head__body {
        background:rgba(16,17,19,.97) !important;
        color:var(--ft-text) !important;
    }
    body.ft-theme-on .head__title,
    body.ft-theme-on .category__title,
    body.ft-theme-on .title,
    body.ft-theme-on .full-start__title,
    body.ft-theme-on .full-start-new__title {
        color:var(--ft-gold-light) !important;
    }

    body.ft-theme-on .menu {
        background:#17191c !important;
        color:var(--ft-text) !important;
        border-right:1px solid rgba(216,182,107,.18) !important;
    }
    body.ft-theme-on .menu__item {
        border-radius:9px !important;
        transition:all .2s ease !important;
    }
    body.ft-theme-on .menu__item.focus {
        background:#30251f !important;
        color:var(--ft-gold-light) !important;
        border-left:3px solid var(--ft-orange) !important;
        box-shadow:0 0 15px rgba(237,118,46,.15) !important;
    }
    body.ft-theme-on .menu__item.focus .menu__text,
    body.ft-theme-on .menu__item.focus .menu__ico {
        color:#fff !important;
    }

    body.ft-theme-on .selector,
    body.ft-theme-on button,
    body.ft-theme-on .button,
    body.ft-theme-on .head__action,
    body.ft-theme-on .menu__item,
    body.ft-theme-on .full-start__button,
    body.ft-theme-on .modal__button,
    body.ft-theme-on .selectbox__item,
    body.ft-theme-on .settings-param {
        transition:background-color .2s ease,color .2s ease,
        border-color .2s ease,box-shadow .2s ease !important;
    }
    body.ft-theme-on .selector.focus,
    body.ft-theme-on button.focus,
    body.ft-theme-on .button.focus,
    body.ft-theme-on .head__action.focus,
    body.ft-theme-on .full-start__button.focus,
    body.ft-theme-on .modal__button.focus,
    body.ft-theme-on .selectbox__item.focus,
    body.ft-theme-on .settings-param.focus {
        background:var(--ft-orange) !important;
        color:#fff !important;
        border-color:var(--ft-gold-light) !important;
        box-shadow:0 0 17px rgba(237,118,46,.35) !important;
        outline:none !important;
    }

    body.ft-theme-on .full-start__body,
    body.ft-theme-on .full-start-new__body {
        color:var(--ft-text) !important;
    }
    body.ft-theme-on .full-start__button,
    body.ft-theme-on .full-start-new__button {
        background:#202226 !important;
        color:#f5f5f5 !important;
        border:1px solid rgba(216,182,107,.35) !important;
        border-radius:9px !important;
    }
    body.ft-theme-on .full-start__button.focus,
    body.ft-theme-on .full-start-new__button.focus {
        background:var(--ft-orange) !important;
        color:#fff !important;
    }

    body.ft-theme-on .modal,
    body.ft-theme-on .modal__content,
    body.ft-theme-on .selectbox,
    body.ft-theme-on .settings {
        background:#191b1e !important;
        color:var(--ft-text) !important;
    }
    body.ft-theme-on input,
    body.ft-theme-on textarea {
        background:#202226 !important;
        color:#fff !important;
        border:1px solid #494b4e !important;
        border-radius:8px !important;
    }
    body.ft-theme-on input:focus,
    body.ft-theme-on textarea:focus {
        border-color:var(--ft-orange) !important;
    }
    body.ft-theme-on ::-webkit-scrollbar-thumb {
        background:var(--ft-orange) !important;
        border-radius:10px;
    }

    /* Theme switch beside the notification bell */
    #${BUTTON_ID} {
        width:2.65em !important;
        height:2.65em !important;
        min-width:2.65em !important;
        min-height:2.65em !important;
        display:flex !important;
        align-items:center !important;
        justify-content:center !important;
        margin:0 .35em !important;
        padding:0 !important;
        border:1px solid rgba(255,255,255,.12) !important;
        border-radius:50% !important;
        background:rgba(35,37,40,.96) !important;
        color:#a6a6a6 !important;
        box-sizing:border-box !important;
        cursor:pointer !important;
        position:relative !important;
        z-index:99999 !important;
        transition:all .25s ease !important;
    }
    #${BUTTON_ID} svg {
        width:1.45em !important;
        height:1.45em !important;
        display:block !important;
        fill:none !important;
        stroke:currentColor !important;
        stroke-width:1.8 !important;
        stroke-linecap:round !important;
        stroke-linejoin:round !important;
    }
    #${BUTTON_ID}.ft-enabled {
        color:#ffe6a0 !important;
        border-color:#e6bd67 !important;
        background:radial-gradient(circle,#66502a 0%,#28231a 65%,#202124 100%) !important;
        box-shadow:0 0 7px #e9c36b,0 0 17px rgba(238,190,85,.8),
                   0 0 29px rgba(238,190,85,.38),
                   inset 0 0 9px rgba(255,224,145,.28) !important;
        animation:ftGoldPulse 2.4s ease-in-out infinite !important;
    }
    #${BUTTON_ID}.ft-disabled {
        color:#8c8c8c !important;
        border-color:rgba(255,255,255,.12) !important;
        box-shadow:none !important;
        animation:none !important;
    }
    #${BUTTON_ID}.focus,
    #${BUTTON_ID}:focus {
        outline:2px solid #fff0bd !important;
        outline-offset:3px !important;
    }
    @keyframes ftGoldPulse {
        0%,100% { filter:brightness(1); box-shadow:0 0 6px #d8b66b,0 0 13px rgba(238,190,85,.55),inset 0 0 7px rgba(255,224,145,.2); }
        50% { filter:brightness(1.35); box-shadow:0 0 11px #ffe4a0,0 0 24px rgba(238,190,85,.95),0 0 36px rgba(238,190,85,.48),inset 0 0 12px rgba(255,224,145,.4); }
    }

    /* Filmix catalog screen */
    .filmix-tv { background:#101113; color:#f4f4f4; width:100%; min-height:100%; padding:1.2em 2em 8em; box-sizing:border-box; }
    .filmix-tv__hero { display:flex; flex-direction:column; overflow:hidden; border-radius:1em; background:#191b1e; margin-bottom:2.5em; }
    .filmix-tv__hero-bg { display:block; width:100%; height:23em; object-fit:cover; object-position:center 30%; background:#202226; }
    .filmix-tv__hero-content { padding:2em 2.3em; background:linear-gradient(180deg,#242629,#151619); box-sizing:border-box; }
    .filmix-tv__eyebrow { color:var(--ft-orange); font-weight:700; letter-spacing:.15em; margin-bottom:.8em; }
    .filmix-tv__hero-title { color:#fff; font-size:3em; font-weight:700; line-height:1.1; margin-bottom:.4em; }
    .filmix-tv__hero-meta { color:#e8b18e; font-size:1.1em; margin-bottom:1em; }
    .filmix-tv__hero-description { color:#d0d0d0; font-size:1.05em; line-height:1.5; max-width:65em; margin-bottom:1.5em; display:-webkit-box; -webkit-line-clamp:5; -webkit-box-orient:vertical; overflow:hidden; }
    .filmix-tv__actions { display:flex; gap:1em; flex-wrap:wrap; }
    .filmix-tv__action { background:#ed762e; color:#fff; border:2px solid transparent; border-radius:.55em; padding:.85em 1.5em; font-weight:700; }
    .filmix-tv__action.secondary { background:#292b2f; border-color:#666; }
    .filmix-tv__action.focus { background:#ff8a43 !important; border-color:#ffbd91 !important; color:#fff !important; box-shadow:0 0 18px rgba(237,118,46,.4) !important; }
    .filmix-tv__section { margin-bottom:2.5em; width:100%; }
    .filmix-tv__section-title { font-size:1.7em; font-weight:650; color:#f2d99b; margin:0 0 1em; padding-bottom:.65em; border-bottom:1px solid rgba(216,182,107,.2); }
    .filmix-tv__row { display:flex; flex-direction:row; gap:1em; align-items:flex-start; overflow:visible; padding:.5em .3em 1em; }
    .filmix-tv__card { flex:0 0 13em; width:13em; min-width:0; background:#1b1d20; border:2px solid transparent; border-radius:.7em; padding:.45em; box-sizing:border-box; overflow:hidden; }
    .filmix-tv__card.focus { border-color:#f2d99b !important; background:#292a2c !important; box-shadow:0 0 20px rgba(237,118,46,.35) !important; transform:scale(1.035); z-index:3; }
    .filmix-tv__poster { width:100%; aspect-ratio:2/3; height:auto; object-fit:contain; background:#101113; border-radius:.45em; display:block; }
    .filmix-tv__card-title { color:#f5f5f5; font-size:1.05em; line-height:1.3; font-weight:600; margin-top:.65em; min-height:2.6em; }
    .filmix-tv__card-meta { color:#a9aaad; font-size:.9em; margin-top:.35em; }
    .filmix-tv__rating { color:#ffb17f; }
    .filmix-tv__status,.filmix-tv__error { padding:2em; color:#d0d0d0; }
    `;

    function readEnabled() {
        try {
            if (window.Lampa && Lampa.Storage) {
                return Lampa.Storage.get(STORAGE_KEY, true) !== false;
            }
        } catch (e) {}
        try {
            return window.localStorage.getItem(STORAGE_KEY) !== 'false';
        } catch (e) {}
        return true;
    }

    function saveEnabled(value) {
        try {
            if (window.Lampa && Lampa.Storage) Lampa.Storage.set(STORAGE_KEY, value);
        } catch (e) {}
        try {
            window.localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
        } catch (e) {}
    }

    function applyStyle() {
        if (!document.head || !document.body) return;
        var style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            style.type = 'text/css';
            document.head.appendChild(style);
        }
        if (style.textContent !== css) style.textContent = css;
        document.body.classList.toggle('ft-theme-on', enabled);
    }

    function updateSwitch() {
        var button = document.getElementById(BUTTON_ID);
        if (!button) return;
        button.classList.toggle('ft-enabled', enabled);
        button.classList.toggle('ft-disabled', !enabled);
        button.setAttribute('aria-label', enabled ? 'Filmix PRO+ стиль включён' : 'Filmix PRO+ стиль выключен');
        button.setAttribute('title', enabled ? 'Стиль включён — нажмите, чтобы выключить' : 'Стиль выключен — нажмите, чтобы включить');
    }

    function toggleTheme() {
        enabled = !enabled;
        saveEnabled(enabled);
        applyStyle();
        updateSwitch();
        try {
            if (window.Lampa && Lampa.Noty && Lampa.Noty.show) {
                Lampa.Noty.show(enabled ? 'Filmix PRO+: золотой стиль включён' : 'Filmix PRO+: стиль выключен');
            }
        } catch (e) {}
    }

    function findBell() {
        var selectors = [
            '.head__action--notice',
            '.head__action[data-action="notice"]',
            '.head__action[data-action="notification"]',
            '.head__action:has(.icon--bell)',
            '.head__action'
        ];
        for (var i = 0; i < selectors.length; i++) {
            var nodes = document.querySelectorAll(selectors[i]);
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                var hint = ((node.className || '') + ' ' +
                    (node.getAttribute('title') || '') + ' ' +
                    (node.getAttribute('aria-label') || '') + ' ' +
                    (node.innerHTML || '')).toLowerCase();
                if (/bell|notice|notif|уведом|колокол/.test(hint) ||
                    (selectors[i] === '.head__action' && j === 0)) return node;
            }
        }
        return null;
    }

    function installSwitch() {
        if (document.getElementById(BUTTON_ID)) {
            updateSwitch();
            return;
        }

        var bell = findBell();
        if (!bell || !bell.parentNode) return;

        var button = document.createElement('div');
        button.id = BUTTON_ID;
        button.className = 'selector ft-theme-toggle ' + (enabled ? 'ft-enabled' : 'ft-disabled');
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M12 2.8l2.2 5.1 5.5.5-4.2 3.6 1.3 5.4-4.8-2.9-4.8 2.9 1.3-5.4-4.2-3.6 5.5-.5z"/>' +
            '<path d="M19 16.5l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8z"/>' +
            '</svg>';

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            toggleTheme();
        });

        button.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleTheme();
            }
        });

        bell.parentNode.insertBefore(button, bell);
        updateSwitch();
    }

    function ensureInterface() {
        applyStyle();
        installSwitch();
    }

    function startObservers() {
        if (observer || !document.documentElement) return;
        observer = new MutationObserver(function () {
            if (!document.getElementById(STYLE_ID)) applyStyle();
            if (!document.body.classList.contains('ft-theme-on') && enabled) {
                document.body.classList.add('ft-theme-on');
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });

        if (!headerObserver) {
            headerObserver = new MutationObserver(function () {
                if (!document.getElementById(BUTTON_ID)) installSwitch();
            });
            headerObserver.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    function safe(value) {
        return String(value || '').replace(/[&<>"']/g, function (c) {
            return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
        });
    }

    function titleOf(item) {
        return item.title || item.name || item.original_title || item.original_name || 'Без названия';
    }

    function dateOf(item) {
        var date = item.release_date || item.first_air_date || '';
        return date ? date.slice(0, 4) : '';
    }

    function posterOf(item) {
        return item.poster_path ? IMAGE_BASE + 'w500' + item.poster_path : '';
    }

    function backdropOf(item) {
        return item.backdrop_path ? IMAGE_BASE + 'w1280' + item.backdrop_path : posterOf(item);
    }

    function request(path, callback, fail) {
        try {
            Lampa.Api.sources.tmdb.get(path, { language: 'ru-RU' }, function (data) {
                callback(data && data.results ? data.results : []);
            });
        } catch (error) {
            if (fail) fail(error);
        }
    }

    function openMovie(item) {
        if (Lampa.Router && typeof Lampa.Router.call === 'function') {
            Lampa.Router.call('full', item);
        } else {
            Lampa.Activity.push({
                url: '', title: titleOf(item), component: 'full',
                id: item.id, movie: item, source: 'tmdb', page: 1
            });
        }
    }

    function SmartTV() {
        var self = this;
        var root = $('<div class="filmix-tv"></div>');
        var scroll = new Lampa.Scroll({ mask: true, over: true, nopadding: true });
        var alive = true;

        this.create = function () {
            root.append('<div class="filmix-tv__status">Загружаем каталог...</div>');
            scroll.append(root);
            var head = $('.head').first();
            if (head.length) scroll.minus(head);
            loadCatalog();
            return this.render();
        };

        this.start = function () {
            ensureInterface();
            Lampa.Controller.toggle('content');
        };

        this.render = function () { return scroll.render(); };

        this.destroy = function () {
            alive = false;
            scroll.destroy();
            root.remove();
        };

        this.empty = function () {
            root.html('<div class="filmix-tv__error">Не удалось загрузить каталог. Проверь подключение.</div>');
        };

        function loadCatalog() {
            var sections = [
                {title:'Сейчас смотрят',path:'trending/movie/week'},
                {title:'Популярные фильмы',path:'movie/popular'},
                {title:'Новинки кино',path:'movie/now_playing'},
                {title:'Популярные сериалы',path:'tv/popular'},
                {title:'Сериалы сейчас',path:'tv/on_the_air'}
            ];

            request('trending/all/week', function (items) {
                if (!alive) return;
                var hero = items.find(function (item) {
                    return item.backdrop_path && item.poster_path;
                }) || items[0];
                if (hero) renderHero(hero);
                loadSections(sections);
            }, function () {
                if (alive) self.empty();
            });
        }

        function renderHero(item) {
            var hero = $(
                '<section class="filmix-tv__hero">' +
                '<img class="filmix-tv__hero-bg" />' +
                '<div class="filmix-tv__hero-content">' +
                '<div class="filmix-tv__eyebrow">FILMIX PRO+ · ВЫБОР НЕДЕЛИ</div>' +
                '<div class="filmix-tv__hero-title"></div>' +
                '<div class="filmix-tv__hero-meta"></div>' +
                '<div class="filmix-tv__hero-description"></div>' +
                '<div class="filmix-tv__actions">' +
                '<div class="filmix-tv__action selector">▶ Смотреть</div>' +
                '<div class="filmix-tv__action secondary selector">Подробнее</div>' +
                '</div></div></section>'
            );

            hero.find('.filmix-tv__hero-bg').attr('src', backdropOf(item));
            hero.find('.filmix-tv__hero-title').text(titleOf(item));

            var rating = item.vote_average ? Number(item.vote_average).toFixed(1) : '';
            hero.find('.filmix-tv__hero-meta').text(
                [dateOf(item), rating ? '★ ' + rating + ' TMDB' : ''].filter(Boolean).join('  •  ')
            );
            hero.find('.filmix-tv__hero-description').text(item.overview || 'Описание пока недоступно.');

            hero.find('.filmix-tv__action').on('hover:enter', function () {
                openMovie(item);
            });

            root.find('.filmix-tv__status').remove();
            root.prepend(hero);
        }

        function loadSections(sections) {
            sections.forEach(function (section) {
                request(section.path, function (items) {
                    if (alive) renderSection(section.title, items);
                }, function () {
                    if (alive) renderSection(section.title, []);
                });
            });
        }

        function renderSection(title, items) {
            if (!items.length || !alive) return;

            var section = $('<section class="filmix-tv__section"></section>');
            var heading = $('<div class="filmix-tv__section-title"></div>').text(title);
            var row = $('<div class="filmix-tv__row"></div>');

            items.slice(0, 20).forEach(function (item) {
                var card = $(
                    '<div class="filmix-tv__card selector">' +
                    '<img class="filmix-tv__poster" loading="lazy" />' +
                    '<div class="filmix-tv__card-title"></div>' +
                    '<div class="filmix-tv__card-meta"></div></div>'
                );

                var image = posterOf(item);
                if (image) card.find('img').attr('src', image);
                card.find('.filmix-tv__card-title').text(titleOf(item));

                var rating = item.vote_average ? '★ ' + Number(item.vote_average).toFixed(1) : 'Рейтинг не указан';
                card.find('.filmix-tv__card-meta').html(
                    '<span>' + safe(dateOf(item)) + '</span> ' +
                    '<span class="filmix-tv__rating">' + safe(rating) + '</span>'
                );

                card.on('hover:enter', function () { openMovie(item); });
                card.on('hover:focus', function () { card.addClass('focus'); });
                card.on('hover:blur', function () { card.removeClass('focus'); });

                row.append(card);
            });

            section.append(heading).append(row);
            root.append(section);
        }
    }

    function init() {
        enabled = readEnabled();
        ensureInterface();
        startObservers();

        if (Lampa.Component && Lampa.Component.add &&
            (!Lampa.Component.get || !Lampa.Component.get(PLUGIN))) {
            Lampa.Component.add(PLUGIN, SmartTV);
        }

        function addMenuButton() {
            var menu = $('.menu .menu__list').eq(0);
            if (!menu.length || menu.find('.filmix-smart-tv-menu').length) return;

            var button = $(
                '<li class="menu__item selector filmix-smart-tv-menu">' +
                '<div class="menu__ico">▶</div>' +
                '<div class="menu__text">Filmix PRO+ Smart TV</div></li>'
            );

            button.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '', title: 'Filmix PRO+', component: PLUGIN, page: 1
                });
            });

            menu.append(button);
        }

        addMenuButton();

        if (!window.filmixMenuObserver && document.body) {
            window.filmixMenuObserver = new MutationObserver(addMenuButton);
            window.filmixMenuObserver.observe(document.body, { childList: true, subtree: true });
        }

        console.log('[Filmix PRO+] Theme and header switch initialized');
    }

    if (window.appready) {
        init();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event && event.type === 'ready') init();
        });
    }
})();
