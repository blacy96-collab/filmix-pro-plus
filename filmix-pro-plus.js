
(function () {
    'use strict';

    var PLUGIN = 'filmix_pro_plus';
    var VERSION = '0.2.0';
    var MENU_ID = 'filmix-pro-plus-menu-entry';
    var CONTROLLER = 'filmix_pro_plus_controller';

    if (window.filmix_pro_plus_ready) return;
    window.filmix_pro_plus_ready = true;

    function log(message, error) {
        if (window.console && console.log) {
            if (error) console.log('[Filmix PRO+]', message, error);
            else console.log('[Filmix PRO+]', message);
        }
    }

    function notify(message) {
        if (window.Lampa && Lampa.Noty && Lampa.Noty.show) {
            Lampa.Noty.show(message);
        }
    }

    function openHome() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Component) {
            notify('Lampa ещё загружается. Попробуйте позже.');
            return;
        }

        if (!Lampa.Component.get || !Lampa.Component.get(PLUGIN)) {
            notify('Компонент Filmix PRO+ не зарегистрирован.');
            return;
        }

        Lampa.Activity.push({
            url: '',
            title: 'Filmix PRO+',
            component: PLUGIN,
            page: 1
        });
    }

    function Home(object) {
        var html = $('<div class="filmix-pro-plus" style="width:100%;min-height:100%;padding:2em;box-sizing:border-box;color:#fff;background:#090d18;"></div>');
        var lastFocused = null;

        function makeButton(profile, heading, description) {
            var button = $('<div class="selector filmix-pro-plus__profile" tabindex="0" role="button" style="max-width:680px;margin:1em auto;padding:1.5em;border:1px solid #9c8147;border-radius:14px;background:#151b29;text-align:center;"></div>');

            button.attr('data-profile', profile);
            button.append($('<h2 style="margin:0 0 .4em;color:#e2c783;"></h2>').text(heading));
            button.append($('<p style="margin:0;color:#d0d4df;"></p>').text(description));

            button.on('hover:focus', function () {
                lastFocused = button;
            });

            button.on('hover:enter click', function () {
                showProfile(profile);
            });

            return button;
        }

        function refreshFocus() {
            if (!window.Lampa || !Lampa.Controller) return;

            Lampa.Controller.collectionSet(html);
            Lampa.Controller.collectionFocus(lastFocused || false, html);
        }

        function renderProfiles() {
            html.empty();

            html.append(
                '<div style="max-width:900px;margin:0 auto;text-align:center;">' +
                '<div style="padding:1.5em 0 2em;">' +
                '<div style="font-size:2em;font-weight:700;letter-spacing:.08em;color:#e2c783;">FILMIX PRO+</div>' +
                '<div style="margin-top:.5em;color:#c4cad7;">Ваше пространство кино</div>' +
                '</div>' +
                '<h2 style="margin:0 0 1em;">Выберите профиль</h2>' +
                '</div>'
            );

            html.append(makeButton(
                'adult',
                'Взрослый',
                'Фильмы и сериалы'
            ));

            html.append(makeButton(
                'child',
                'Ребёнок',
                'Мультфильмы и семейное кино'
            ));

            refreshFocus();
        }

        function showProfile(profile) {
            var isChild = profile === 'child';

            html.empty();

            html.append(
                '<div style="max-width:900px;margin:0 auto;text-align:center;padding-top:2em;">' +
                '<div style="font-size:1.8em;font-weight:700;color:#e2c783;">FILMIX PRO+</div>' +
                '</div>'
            );

            html.append(
                $('<h2 style="text-align:center;margin:1.5em 0 .5em;"></h2>')
                    .text(isChild ? 'Детский профиль' : 'Взрослый профиль')
            );

            html.append(
                $('<p style="text-align:center;color:#c4cad7;"></p>')
                    .text(isChild
                        ? 'Здесь будут мультфильмы и семейное кино.'
                        : 'Здесь будут фильмы и сериалы.')
            );

            html.append(
                '<p style="text-align:center;color:#aeb6c5;margin:2em auto;max-width:620px;">' +
                'Каталог Filmix пока не подключён. Это тестовая версия интерфейса.' +
                '</p>'
            );

            var back = $('<div class="selector" tabindex="0" role="button" style="max-width:500px;margin:2em auto;padding:1.2em;border:1px solid #9c8147;border-radius:12px;text-align:center;color:#e2c783;background:#151b29;">← Выбрать другой профиль</div>');

            back.on('hover:focus', function () {
                lastFocused = back;
            });

            back.on('hover:enter click', renderProfiles);

            html.append(back);
            lastFocused = back;

            refreshFocus();
        }

        this.create = function () {
            renderProfiles();
            return this.render();
        };

        this.start = function () {
            if (!window.Lampa || !Lampa.Controller) return;

            Lampa.Controller.add(CONTROLLER, {
                toggle: function () {
                    Lampa.Controller.collectionSet(html);
                    Lampa.Controller.collectionFocus(lastFocused || false, html);
                },

                left: function () {
                    if (window.Lampa && Lampa.Controller) {
                        Lampa.Controller.toggle('menu');
                    }
                },

                right: function () {
                    if (typeof Navigator !== 'undefined' &&
                        Navigator.canmove('right')) {
                        Navigator.move('right');
                    }
                },

                up: function () {
                    if (typeof Navigator !== 'undefined' &&
                        Navigator.canmove('up')) {
                        Navigator.move('up');
                    }
                },

                down: function () {
                    if (typeof Navigator !== 'undefined' &&
                        Navigator.canmove('down')) {
                        Navigator.move('down');
                    }
                },

                back: function () {
                    if (window.Lampa && Lampa.Activity) {
                        Lampa.Activity.backward();
                    }
                }
            });

            Lampa.Controller.toggle(CONTROLLER);
        };

        this.stop = function () {};

        this.render = function () {
            return html;
        };

        this.destroy = function () {
            html.off();
            html.remove();
            lastFocused = null;
        };
    }

    function addMenuEntry() {
        if (!window.jQuery && !window.$) return;

        var $ = window.jQuery || window.$;
        var menu = $('.menu .menu__list').eq(0);

        if (!menu.length) {
            log('Menu container not found.');
            return;
        }

        if ($('#' + MENU_ID).length) return;

        var item = $('<li id="' + MENU_ID + '" class="menu__item selector"><div class="menu__text">Filmix PRO+</div></li>');

        item.on('hover:enter click', openHome);
        menu.append(item);
    }

    function init() {
        if (!window.Lampa || !Lampa.Component || !Lampa.Activity) {
            log('Lampa API is not available at app-ready time.');
            window.filmix_pro_plus_ready = false;
            return;
        }

        try {
            if (!Lampa.Component.get || !Lampa.Component.get(PLUGIN)) {
                Lampa.Component.add(PLUGIN, Home);
            }

            addMenuEntry();

            log('Initialized, version ' + VERSION);
        }
        catch (error) {
            window.filmix_pro_plus_ready = false;
            log('Initialization failed.', error);
            notify('Не удалось запустить Filmix PRO+.');
        }
    }

    function start() {
        if (window.appready) {
            init();
        }
        else if (window.Lampa &&
                 Lampa.Listener &&
                 Lampa.Listener.follow) {

            Lampa.Listener.follow('app', function (event) {
                if (event.type === 'ready') init();
            });
        }
        else {
            window.filmix_pro_plus_ready = false;
            log('Waiting for Lampa app-ready event.');
        }
    }

    start();
})();
