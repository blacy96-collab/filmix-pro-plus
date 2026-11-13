
(function () {
    'use strict';

    var PLUGIN = 'filmix_smart_tv';
    var STYLE = 'filmix-smart-tv-global-style';

    if (window.filmixSmartTVRealLoaded) return;
    window.filmixSmartTVRealLoaded = true;

    var css = `
    /* FILMIX PRO+ GLOBAL THEME */

    :root {
        --ft-orange: #ed762e;
        --ft-gold: #d8b66b;
        --ft-gold-light: #f2d99b;
        --ft-bg: #101113;
        --ft-panel: #1b1d20;
        --ft-panel-light: #292b2f;
        --ft-text: #f4f4f4;
        --ft-muted: #a4a5a7;
    }

    html,
    body {
        background: var(--ft-bg) !important;
        color: var(--ft-text) !important;
    }

    /* HEADER */

    .head,
    .head__body {
        background: rgba(16,17,19,.97) !important;
        color: var(--ft-text) !important;
    }

    .head__title {
        color: var(--ft-gold-light) !important;
    }

    /* MENU */

    .menu {
        background: #17191c !important;
        color: var(--ft-text) !important;
        border-right: 1px solid rgba(216,182,107,.18) !important;
    }

    .menu__item {
        border-radius: 9px !important;
        transition: all .2s ease !important;
    }

    .menu__item.focus {
        background: #30251f !important;
        color: var(--ft-gold-light) !important;
        border-left: 3px solid var(--ft-orange) !important;
        box-shadow: 0 0 15px rgba(237,118,46,.15) !important;
    }

    .menu__item.focus .menu__text,
    .menu__item.focus .menu__ico {
        color: #fff !important;
    }

    /* ALL INTERACTIVE ELEMENTS */

    .selector,
    button,
    .button,
    .head__action,
    .menu__item,
    .full-start__button,
    .modal__button,
    .selectbox__item,
    .settings-param {
        transition:
            background-color .2s ease,
            color .2s ease,
            border-color .2s ease,
            box-shadow .2s ease !important;
    }

    .button,
    button,
    .full-start__button {
        border-radius: 9px !important;
    }

    .selector.focus,
    button.focus,
    .button.focus,
    .head__action.focus,
    .full-start__button.focus,
    .modal__button.focus,
    .selectbox__item.focus,
    .settings-param.focus {
        background: var(--ft-orange) !important;
        color: #fff !important;
        border-color: var(--ft-gold-light) !important;
        box-shadow: 0 0 17px rgba(237,118,46,.35) !important;
        outline: none !important;
    }

    /* MOVIE DETAILS */

    .full-start__title,
    .full-start-new__title {
        color: var(--ft-gold-light) !important;
    }

    .full-start__body,
    .full-start-new__body {
        color: var(--ft-text) !important;
    }

    .full-start__button,
    .full-start-new__button {
        background: #202226 !important;
        color: #f5f5f5 !important;
        border: 1px solid rgba(216,182,107,.35) !important;
    }

    .full-start__button.focus,
    .full-start-new__button.focus {
        background: var(--ft-orange) !important;
        color: #fff !important;
    }

    /* MODALS AND SETTINGS */

    .modal,
    .modal__content,
    .selectbox,
    .settings {
        background: #191b1e !important;
        color: var(--ft-text) !important;
    }

    .selectbox__item.focus,
    .settings-param.focus {
        background: #30251f !important;
        color: var(--ft-gold-light) !important;
    }

    /* SEARCH */

    input,
    textarea {
        background: #202226 !important;
        color: #fff !important;
        border: 1px solid #494b4e !important;
        border-radius: 8px !important;
    }

    input:focus,
    textarea:focus {
        border-color: var(--ft-orange) !important;
    }

    /* CATEGORIES AND TITLES */

    .category__title,
    .title {
        color: var(--ft-gold-light) !important;
    }

    /* SCROLLBAR */

    ::-webkit-scrollbar-thumb {
        background: var(--ft-orange) !important;
        border-radius: 10px;
    }

    /* FILMIX SMART TV PAGE */

    .filmix-tv {
        background: #101113;
        color: #f4f4f4;
        width: 100%;
        min-height: 100%;
        padding: 1.2em 2em 8em;
        box-sizing: border-box;
    }

    .filmix-tv__hero {
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
        border-radius: 1em;
        background: #191b1e;
        margin-bottom: 2.5em;
    }

    .filmix-tv__hero-bg {
        display: block;
        width: 100%;
        height: 23em;
        object-fit: cover;
        object-position: center 30%;
        background: #202226;
    }

    .filmix-tv__hero-content {
        padding: 2em 2.3em;
        background: linear-gradient(180deg,#242629,#151619);
        box-sizing: border-box;
    }

    .filmix-tv__eyebrow {
        color: var(--ft-orange);
        font-weight: 700;
        letter-spacing: .15em;
        margin-bottom: .8em;
    }

    .filmix-tv__hero-title {
        color: #fff;
        font-size: 3em;
        font-weight: 700;
        line-height: 1.1;
        margin-bottom: .4em;
    }

    .filmix-tv__hero-meta {
        color: #e8b18e;
        font-size: 1.1em;
        margin-bottom: 1em;
    }

    .filmix-tv__hero-description {
        color: #d0d0d0;
        font-size: 1.05em;
        line-height: 1.5;
        max-width: 65em;
        margin-bottom: 1.5em;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .filmix-tv__actions {
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
    }

    .filmix-tv__action {
        background: var(--ft-orange);
        color: #fff;
        border: 2px solid transparent;
        border-radius: .55em;
        padding: .85em 1.5em;
        font-weight: 700;
    }

    .filmix-tv__action.secondary {
        background: #292b2f;
        border-color: #666;
    }

    .filmix-tv__action.focus {
        background: #ff8a43 !important;
        border-color: #ffbd91 !important;
        color: #fff !important;
        box-shadow: 0 0 18px rgba(237,118,46,.4) !important;
    }

    .filmix-tv__section {
        margin-bottom: 2.5em;
        width: 100%;
    }

    .filmix-tv__section-title {
        font-size: 1.7em;
        font-weight: 650;
        color: var(--ft-gold-light);
        margin: 0 0 1em;
        padding-bottom: .65em;
        border-bottom: 1px solid rgba(216,182,107,.2);
    }

    .filmix-tv__row {
        display: flex;
        flex-direction: row;
        gap: 1em;
        align-items: flex-start;
        overflow: visible;
        padding: .5em .3em 1em;
    }

    .filmix-tv__card {
        flex: 0 0 13em;
        width: 13em;
        min-width: 0;
        background: #1b1d20;
        border: 2px solid transparent;
        border-radius: .7em;
        padding: .45em;
        box-sizing: border-box;
        overflow: hidden;
    }

    .filmix-tv__card.focus {
        border-color: var(--ft-gold-light) !important;
        background: #292a2c !important;
        box-shadow: 0 0 20px rgba(237,118,46,.35) !important;
        transform: scale(1.035);
        z-index: 3;
    }

    .filmix-tv__poster {
        width: 100%;
        aspect-ratio: 2 / 3;
        height: auto;
        object-fit: contain;
        background: #101113;
        border-radius: .45em;
        display: block;
    }

    .filmix-tv__card-title {
        color: #f5f5f5;
        font-size: 1.05em;
        line-height: 1.3;
        font-weight: 600;
        margin-top: .65em;
        min-height: 2.6em;
    }

    .filmix-tv__card-meta {
        color: #a9aaad;
        font-size: .9em;
        margin-top: .35em;
    }

    .filmix-tv__rating {
        color: #ffb17f;
    }

    .filmix-tv__status,
    .filmix-tv__error {
        padding: 2em;
        color: #d0d0d0;
    }

    @media screen and (min-width:1500px) {
        .filmix-tv__card {
            flex-basis: calc((100vw - 23em) / 6);
            width: calc((100vw - 23em) / 6);
        }
    }
    `;

    var imageBase = 'https://image.tmdb.org/t/p/';

    /* GLOBAL STYLE INSTALLER */

    function applyStyle() {
        if (!document.head) return;

        var style = document.getElementById(STYLE);

        if (!style) {
            style = document.createElement('style');
            style.id = STYLE;
            style.type = 'text/css';
            document.head.appendChild(style);
        }

        if (style.textContent !== css) {
            style.textContent = css;
        }
    }

    function watchStyle() {
        if (window.filmixGlobalStyleObserver) return;

        applyStyle();

        window.filmixGlobalStyleObserver = new MutationObserver(function () {
            if (!document.getElementById(STYLE)) {
                applyStyle();
            }
        });

        window.filmixGlobalStyleObserver.observe(document.head, {
            childList: true
        });
    }

    /* CATALOG HELPERS */

    function safe(value) {
        return String(value || '').replace(/[&<>"']/g, function (c) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[c];
        });
    }

    function titleOf(item) {
        return item.title || item.name ||
            item.original_title || item.original_name ||
            'Без названия';
    }

    function dateOf(item) {
        var date = item.release_date || item.first_air_date || '';
        return date ? date.slice(0, 4) : '';
    }

    function posterOf(item) {
        return item.poster_path
            ? imageBase + 'w500' + item.poster_path
            : '';
    }

    function backdropOf(item) {
        return item.backdrop_path
            ? imageBase + 'w1280' + item.backdrop_path
            : posterOf(item);
    }

    function request(path, callback, fail) {
        try {
            Lampa.Api.sources.tmdb.get(path, {
                language: 'ru-RU'
            }, function (data) {
                callback(data && data.results ? data.results : []);
            });
        } catch (error) {
            if (fail) fail(error);
        }
    }

    function openMovie(item) {
        if (Lampa.Router &&
            typeof Lampa.Router.call === 'function') {
            Lampa.Router.call('full', item);
        } else {
            Lampa.Activity.push({
                url: '',
                title: titleOf(item),
                component: 'full',
                id: item.id,
                movie: item,
                source: 'tmdb',
                page: 1
            });
        }
    }

    /* SMART TV PAGE */

    function SmartTV() {
        var self = this;
        var root = $('<div class="filmix-tv"></div>');

        var scroll = new Lampa.Scroll({
            mask: true,
            over: true,
            nopadding: true
        });

        var alive = true;

        this.create = function () {
            root.append(
                '<div class="filmix-tv__status">' +
                'Загружаем каталог...' +
                '</div>'
            );

            scroll.append(root);

            var head = $('.head').first();

            if (head.length) {
                scroll.minus(head);
            }

            loadCatalog();

            return this.render();
        };

        this.start = function () {
            applyStyle();
            Lampa.Controller.toggle('content');
        };

        this.render = function () {
            return scroll.render();
        };

        this.destroy = function () {
            alive = false;
            scroll.destroy();
            root.remove();
        };

        this.empty = function () {
            root.html(
                '<div class="filmix-tv__error">' +
                'Не удалось загрузить каталог. Проверь подключение.' +
                '</div>'
            );
        };

        function loadCatalog() {
            var sections = [
                {
                    title: 'Сейчас смотрят',
                    path: 'trending/movie/week'
                },
                {
                    title: 'Популярные фильмы',
                    path: 'movie/popular'
                },
                {
                    title: 'Новинки кино',
                    path: 'movie/now_playing'
                },
                {
                    title: 'Популярные сериалы',
                    path: 'tv/popular'
                },
                {
                    title: 'Сериалы сейчас',
                    path: 'tv/on_the_air'
                }
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
                        '<div class="filmix-tv__eyebrow">' +
                        'FILMIX PRO+ · ВЫБОР НЕДЕЛИ</div>' +
                        '<div class="filmix-tv__hero-title"></div>' +
                        '<div class="filmix-tv__hero-meta"></div>' +
                        '<div class="filmix-tv__hero-description"></div>' +
                        '<div class="filmix-tv__actions">' +
                            '<div class="filmix-tv__action selector">' +
                            '▶ Смотреть</div>' +
                            '<div class="filmix-tv__action secondary selector">' +
                            'Подробнее</div>' +
                        '</div>' +
                    '</div>' +
                '</section>'
            );

            hero.find('.filmix-tv__hero-bg').attr('src', backdropOf(item));
            hero.find('.filmix-tv__hero-title').text(titleOf(item));

            var rating = item.vote_average
                ? Number(item.vote_average).toFixed(1)
                : '';

            hero.find('.filmix-tv__hero-meta').text(
                [dateOf(item), rating ? '★ ' + rating + ' TMDB' : '']
                    .filter(Boolean).join('  •  ')
            );

            hero.find('.filmix-tv__hero-description')
                .text(item.overview || 'Описание пока недоступно.');

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
            var heading = $('<div class="filmix-tv__section-title"></div>');
            var row = $('<div class="filmix-tv__row"></div>');

            heading.text(title);

            items.slice(0, 20).forEach(function (item) {
                var card = $(
                    '<div class="filmix-tv__card selector">' +
                        '<img class="filmix-tv__poster" loading="lazy" />' +
                        '<div class="filmix-tv__card-title"></div>' +
                        '<div class="filmix-tv__card-meta"></div>' +
                    '</div>'
                );

                var img = posterOf(item);

                if (img) card.find('img').attr('src', img);

                card.find('.filmix-tv__card-title').text(titleOf(item));

                var rating = item.vote_average
                    ? '★ ' + Number(item.vote_average).toFixed(1)
                    : 'Рейтинг не указан';

                card.find('.filmix-tv__card-meta').html(
                    '<span>' + safe(dateOf(item)) + '</span> ' +
                    '<span class="filmix-tv__rating">' +
                    safe(rating) + '</span>'
                );

                card.on('hover:enter', function () {
                    openMovie(item);
                });

                card.on('hover:focus', function () {
                    card.addClass('focus');
                });

                card.on('hover:blur', function () {
                    card.removeClass('focus');
                });

                row.append(card);
            });

            section.append(heading).append(row);
            root.append(section);
        }
    }

    /* PLUGIN INITIALIZATION */

    function init() {
        applyStyle();
        watchStyle();

        if (!Lampa.Component.get(PLUGIN)) {
            Lampa.Component.add(PLUGIN, SmartTV);
        }

        var menu = $('.menu .menu__list').eq(0);

        if (menu.length &&
            !menu.find('.filmix-smart-tv-menu').length) {

            var button = $(
                '<li class="menu__item selector filmix-smart-tv-menu">' +
                    '<div class="menu__ico">▶</div>' +
                    '<div class="menu__text">Filmix PRO+ Smart TV</div>' +
                '</li>'
            );

            button.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: 'Filmix PRO+',
                    component: PLUGIN,
                    page: 1
                });
            });

            menu.append(button);
        }

        console.log('[Filmix PRO+] Global theme initialized');
    }

    if (window.appready) {
        init();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event && event.type === 'ready') init();
        });
    }
})();
