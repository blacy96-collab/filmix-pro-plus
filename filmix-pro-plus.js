
(function () {
    'use strict';

    var PLUGIN = 'filmix_pro_plus';
    var VERSION = '0.1.0';

    if (window.filmix_pro_plus_ready) return;

    function notify(message) {
        if (window.Lampa && Lampa.Noty) {
            Lampa.Noty.show(message);
        }
    }

    function openHome() {
        if (!window.Lampa || !Lampa.Activity || !Lampa.Component) {
            notify('Lampa пока не готова');
            return;
        }

        Lampa.Activity.push({
            url: '',
            title: 'Filmix PRO+',
            component: PLUGIN,
            page: 1
        });
    }

    function Home() {
        var self = this;
        var html;

        this.create = function () {
            html = $('<div class="filmix-pro-plus"></div>');

            html.append(
                '<div style="padding:2em;text-align:center;color:#d9c18b">' +
                '<h1>FILMIX PRO+</h1>' +
                '<p>Ваше пространство кино</p>' +
                '</div>'
            );

            html.append(
                '<div style="padding:1em;text-align:center">' +
                '<h2>Выберите профиль</h2>' +
                '<div class="selector filmix-profile" data-profile="adult">' +
                '<h2>Взрослый</h2>' +
                '<p>Фильмы и сериалы</p>' +
                '</div>' +
                '<div class="selector filmix-profile" data-profile="child">' +
                '<h2>Ребёнок</h2>' +
                '<p>Мультфильмы и семейное кино</p>' +
                '</div>' +
                '</div>'
            );

            html.on('hover:enter click', '.filmix-profile',
                function () {
                    var profile = $(this).attr('data-profile');
                    self.showCatalog(profile);
                }
            );

            this.render();
        };

        this.showCatalog = function (profile) {
            var title = profile === 'child'
                ? 'Детский профиль'
                : 'Взрослый профиль';

            html.empty();

            html.append(
                '<div style="padding:2em;text-align:center">' +
                '<h1>FILMIX PRO+</h1>' +
                '<h2>' + title + '</h2>' +
                '<p>Каталог будет подключён на следующем этапе</p>' +
                '<div class="selector filmix-back" style="padding:1em">' +
                '← Выбрать другой профиль</div>' +
                '</div>'
            );

            html.find('.filmix-back').on(
                'hover:enter click',
                function () {
                    self.create();
                }
            );
        };

        this.render = function () {
            return html;
        };

        this.start = function () {};
        this.pause = function () {};
        this.stop = function () {};

        this.destroy = function () {
            if (html) html.remove();
        };
    }

    function init() {
        if (!window.Lampa || !Lampa.Component) return;

        window.filmix_pro_plus_ready = true;

        Lampa.Component.add(PLUGIN, Home);

        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addComponent({
                component: PLUGIN,
                name: 'Filmix PRO+',
                icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 3h16v18H4z"/></svg>'
            });

            Lampa.SettingsApi.addParam({
                component: PLUGIN,
                param: {
                    name: 'filmix_pro_plus_open',
                    type: 'button'
                },
                field: {
                    name: 'Открыть Filmix PRO+',
                    description: 'Открыть главную страницу плагина'
                },
                onChange: openHome
            });
        }

        console.log('[Filmix PRO+] Initialized, version ' + VERSION);
    }

    if (window.appready) {
        init();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') init();
        });
    }
})();
