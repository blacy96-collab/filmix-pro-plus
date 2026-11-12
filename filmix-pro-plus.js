(function () {
    'use strict';

    var PLUGIN = 'filmix_pro_plus';
    var VERSION = '0.2.2';
    var initialized = false;
    var menuAdded = false;

    if (window.filmix_pro_plus_v022_loaded) return;

    function log(message, error) {
        if (window.console && console.log) {
            console.log('[Filmix PRO+ ' + VERSION + ']', message, error || '');
        }
    }

    function showError(message) {
        if (window.Lampa && Lampa.Noty && typeof Lampa.Noty.show === 'function') {
            Lampa.Noty.show(message);
        } else {
            log(message);
        }
    }

    function openHome() {
        try {
            if (!window.Lampa || !Lampa.Activity) {
                showError('Lampa ещё загружается. Попробуйте позже.');
                return;
            }

            Lampa.Activity.push({
                url: '',
                title: 'Filmix PRO+',
                component: PLUGIN,
                page: 1
            });
        } catch (error) {
            log('Не удалось открыть экран плагина.', error);
            showError('Filmix PRO+: не удалось открыть экран.');
        }
    }

    function Home() {
        var $ = window.jQuery || window.$;
        var html;
        var controllerActive = false;

        if (!$) throw new Error('Не найден jQuery Lampa');

        html = $('<div class="filmix-pro-plus" style="width:100%;min-height:100%;padding:3em 2em;box-sizing:border-box;background:#090d18;color:#fff;"></div>');

        function render() {
            html.empty();

            html.append(
                '<div style="max-width:900px;margin:0 auto;text-align:center;">' +
                    '<div style="font-size:2em;font-weight:bold;letter-spacing:.08em;color:#e2c783;">FILMIX PRO+</div>' +
                    '<div style="margin:.6em 0 2em;color:#c4cad7;">Тест запуска интерфейса · версия ' + VERSION + '</div>' +
                    '<h2 style="margin-bottom:1.5em;">Выберите профиль</h2>' +
                '</div>'
            );

            var adult = $('<div class="selector" tabindex="0" style="max-width:650px;margin:1em auto;padding:1.5em;border:1px solid #9c8147;border-radius:14px;background:#151b29;text-align:center;"><h2 style="color:#e2c783;margin:0 0 .4em;">Взрослый</h2><div>Фильмы и сериалы</div></div>');

            var child = $('<div class="selector" tabindex="0" style="max-width:650px;margin:1em auto;padding:1.5em;border:1px solid #9c8147;border-radius:14px;background:#151b29;text-align:center;"><h2 style="color:#e2c783;margin:0 0 .4em;">Ребёнок</h2><div>Мультфильмы и семейное кино</div></div>');

            adult.on('hover:enter click', function () {
                showProfile('Взрослый', 'Здесь появится каталог фильмов и сериалов Filmix.');
            });

            child.on('hover:enter click', function () {
                showProfile('Детский', 'Здесь появится каталог мультфильмов и семейного кино.');
            });

            html.append(adult, child);

            if (window.Lampa && Lampa.Controller &&
                typeof Lampa.Controller.collectionSet === 'function') {
                Lampa.Controller.collectionSet(html);

                if (typeof Lampa.Controller.collectionFocus === 'function') {
                    Lampa.Controller.collectionFocus(adult, html);
                }
            }
        }

        function showProfile(title, description) {
            html.empty();

            html.append(
                $('<div style="max-width:850px;margin:0 auto;text-align:center;padding-top:2em;"></div>')
                    .append($('<div style="font-size:1.8em;color:#e2c783;font-weight:bold;">FILMIX PRO+</div>'))
                    .append($('<h2></h2>').text(title))
                    .append($('<p style="color:#c4cad7;"></p>').text(description))
                    .append($('<p style="color:#aeb6c5;margin:2em 0;">Тестовая версия. Каталог и авторизация Filmix ещё не подключены.</p>'))
            );

            var back = $('<div class="selector" tabindex="0" style="max-width:500px;margin:2em auto;padding:1.2em;border:1px solid #9c8147;border-radius:12px;text-align:center;color:#e2c783;background:#151b29;">← Назад к профилям</div>');

            back.on('hover:enter click', render);
            html.append(back);

            if (window.Lampa && Lampa.Controller &&
                typeof Lampa.Controller.collectionSet === 'function') {
                Lampa.Controller.collectionSet(html);

                if (typeof Lampa.Controller.collectionFocus === 'function') {
                    Lampa.Controller.collectionFocus(back, html);
                }
            }
        }

        this.create = function () {
            render();
            return html;
        };

        this.render = function () {
            return html;
        };

        this.start = function () {
            if (window.Lampa && Lampa.Controller &&
                typeof Lampa.Controller.toggle === 'function') {
                Lampa.Controller.toggle('content');
                controllerActive = true;
            }
        };

        this.stop = function () {};

        this.destroy = function () {
            html.off();
            html.find('*').off();
            html.remove();

            if (controllerActive && window.Lampa && Lampa.Controller &&
                typeof Lampa.Controller.toggle === 'function') {
                Lampa.Controller.toggle('content');
            }

            controllerActive = false;
        };
    }

    function registerPlugin() {
        if (initialized) return true;

        if (!window.Lampa || !Lampa.Component || !Lampa.Activity) {
            return false;
        }

        try {
            if (typeof Lampa.Component.add !== 'function') {
                throw new Error('Lampa.Component.add недоступен');
            }

            Lampa.Component.add(PLUGIN, Home);

            if (Lampa.Menu && typeof Lampa.Menu.addButton === 'function' && !menuAdded) {
                var icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M4 4h16v3H4zm0 6h16v3H4zm0 6h16v3H4z"/></svg>';

                Lampa.Menu.addButton(icon, 'Filmix PRO+', openHome);
                menuAdded = true;
            } else if (!menuAdded) {
                throw new Error('Lampa.Menu.addButton недоступен в этой версии');
            }

            initialized = true;
            window.filmix_pro_plus_ready = true;
            window.filmix_pro_plus_v022_loaded = true;

            log('Плагин зарегистрирован. Нажмите Filmix PRO+ в главном меню.');

            return true;

        } catch (error) {
            window.filmix_pro_plus_ready = false;
            log('Ошибка регистрации плагина.', error);
            showError('Filmix PRO+: ошибка регистрации. Проверьте совместимость Luxo.');

            return false;
        }
    }

    function bootstrap() {
        var attempts = 0;
        var maxAttempts = 100;

        function check() {
            attempts++;

            if (window.Lampa && window.appready) {
                if (registerPlugin()) return;
            }

            if (attempts < maxAttempts) {
                setTimeout(check, 300);
            } else {
                log('Lampa не стала готова за 30 секунд.');
                showError('Filmix PRO+: Lampa не завершила загрузку.');
            }
        }

        if (window.appready) {
            check();
        } else if (window.Lampa && Lampa.Listener &&
                   typeof Lampa.Listener.follow === 'function') {

            Lampa.Listener.follow('app', function (event) {
                if (event && event.type === 'ready') {
                    check();
                }
            });

            setTimeout(check, 1000);
        } else {
            check();
        }
    }

    bootstrap();
})();
