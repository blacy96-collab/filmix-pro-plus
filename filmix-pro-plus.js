
(function () {
    'use strict';

    var VERSION = '0.2.3-diagnostic';
    var PLUGIN = 'filmix_pro_plus_diag';
    var KEY = 'filmix_pro_plus_v023_loaded';

    var state = {
        version: VERSION,
        startedAt: new Date().toISOString(),
        appReady: false,
        checks: {},
        errors: [],
        menuAttempted: false,
        menuAdded: false,
        componentAdded: false
    };

    if (window[KEY]) {
        console.log('[Filmix PRO+ ' + VERSION + '] already loaded');
        return;
    }

    window[KEY] = true;
    window.filmix_pro_plus_diagnostics = state;

    function check(name, ok, detail) {
        state.checks[name] = {
            ok: !!ok,
            detail: detail || ''
        };

        console.log(
            '[Filmix PRO+ ' + VERSION + '] ' +
            name + ': ' + (ok ? 'OK' : 'FAIL') +
            (detail ? ' — ' + detail : '')
        );
    }

    function recordError(stage, err) {
        var message = err && err.message
            ? err.message
            : String(err || 'unknown error');

        state.errors.push({
            stage: stage,
            message: message
        });

        console.error(
            '[Filmix PRO+ ' + VERSION + '] ' + stage,
            err || ''
        );
    }

    function reportText() {
        var lines = [
            'Filmix PRO+ diagnostic ' + VERSION
        ];

        Object.keys(state.checks).forEach(function (name) {
            var item = state.checks[name];

            lines.push(
                (item.ok ? '[OK] ' : '[FAIL] ') +
                name +
                (item.detail ? ': ' + item.detail : '')
            );
        });

        if (state.errors.length) {
            lines.push('Ошибки:');

            state.errors.forEach(function (item) {
                lines.push(
                    item.stage + ': ' + item.message
                );
            });
        }

        return lines.join('\n');
    }

    function notify() {
        var message =
            'Filmix PRO+ диагностика ' + VERSION +
            ': компонент ' +
            (state.componentAdded ? 'OK' : 'ошибка') +
            ', кнопка меню ' +
            (state.menuAdded ? 'OK' : 'не добавлена') +
            '. Подробности — в консоли Luxo/Lampa.';

        try {
            if (
                window.Lampa &&
                Lampa.Noty &&
                typeof Lampa.Noty.show === 'function'
            ) {
                Lampa.Noty.show(message);
            }
        } catch (e) {
            recordError('Noty.show', e);
        }
    }

    function DiagnosticScreen() {
        var $ = window.jQuery || window.$;
        var root;

        this.create = function () {
            if (!$) {
                throw new Error('jQuery Lampa недоступен');
            }

            root = $(
                '<div class="filmix-pro-plus-diagnostic" ' +
                'style="padding:3em;color:#fff;white-space:pre-wrap;">' +
                '</div>'
            );

            root.text(reportText());

            return root;
        };

        this.render = function () {
            return root;
        };

        this.start = function () {
            if (
                window.Lampa &&
                Lampa.Controller &&
                typeof Lampa.Controller.toggle === 'function'
            ) {
                Lampa.Controller.toggle('content');
            }
        };

        this.pause = function () {};
        this.stop = function () {};

        this.destroy = function () {
            if (root) {
                root.remove();
            }

            if (
                window.Lampa &&
                Lampa.Controller &&
                typeof Lampa.Controller.toggle === 'function'
            ) {
                Lampa.Controller.toggle('content');
            }
        };
    }

    function openDiagnostics() {
        try {
            if (
                window.Lampa &&
                Lampa.Activity &&
                typeof Lampa.Activity.push === 'function'
            ) {
                Lampa.Activity.push({
                    url: '',
                    title: 'Filmix PRO+ — диагностика',
                    component: PLUGIN,
                    page: 1
                });
            }
        } catch (e) {
            recordError('Activity.push', e);
            notify();
        }
    }

    function runChecks() {
        state.appReady = !!window.appready;

        check('window.Lampa', !!window.Lampa);
        check('appready', state.appReady);

        check(
            'jQuery',
            !!(window.jQuery || window.$)
        );

        check(
            'Lampa.Component.add',
            !!(
                window.Lampa &&
                Lampa.Component &&
                typeof Lampa.Component.add === 'function'
            )
        );

        check(
            'Lampa.Activity.push',
            !!(
                window.Lampa &&
                Lampa.Activity &&
                typeof Lampa.Activity.push === 'function'
            )
        );

        check(
            'Lampa.Menu.addButton',
            !!(
                window.Lampa &&
                Lampa.Menu &&
                typeof Lampa.Menu.addButton === 'function'
            ),
            window.Lampa &&
            Lampa.Menu &&
            Lampa.Menu.addButton
                ? 'function.length=' + Lampa.Menu.addButton.length
                : 'метод отсутствует'
        );

        check(
            'Lampa.Noty.show',
            !!(
                window.Lampa &&
                Lampa.Noty &&
                typeof Lampa.Noty.show === 'function'
            )
        );

        check(
            'Lampa.Controller',
            !!(window.Lampa && Lampa.Controller)
        );

        check(
            'Lampa.Controller.collectionSet',
            !!(
                window.Lampa &&
                Lampa.Controller &&
                typeof Lampa.Controller.collectionSet === 'function'
            )
        );

        check(
            'Lampa.Listener.follow',
            !!(
                window.Lampa &&
                Lampa.Listener &&
                typeof Lampa.Listener.follow === 'function'
            )
        );

        try {
            if (
                window.Lampa &&
                Lampa.Component &&
                typeof Lampa.Component.add === 'function'
            ) {
                Lampa.Component.add(
                    PLUGIN,
                    DiagnosticScreen
                );

                state.componentAdded = true;

                check(
                    'register component',
                    true,
                    PLUGIN
                );
            } else {
                check(
                    'register component',
                    false,
                    'Lampa.Component.add отсутствует'
                );
            }
        } catch (e) {
            recordError('Component.add', e);

            check(
                'register component',
                false,
                e.message
            );
        }

        try {
            if (
                window.Lampa &&
                Lampa.Menu &&
                typeof Lampa.Menu.addButton === 'function'
            ) {
                state.menuAttempted = true;

                var icon =
                    '<svg xmlns="http://www.w3.org/2000/svg" ' +
                    'viewBox="0 0 24 24">' +
                    '<path fill="currentColor" ' +
                    'd="M4 4h16v3H4zm0 6h16v3H4zm0 6h16v3H4z"/>' +
                    '</svg>';

                Lampa.Menu.addButton(
                    icon,
                    'Filmix PRO+ диагностика',
                    openDiagnostics
                );

                state.menuAdded = true;

                check(
                    'add menu button',
                    true,
                    'вызов addButton завершился без ошибки'
                );
            } else {
                check(
                    'add menu button',
                    false,
                    'Lampa.Menu.addButton недоступен'
                );
            }
        } catch (e) {
            recordError('Menu.addButton', e);

            check(
                'add menu button',
                false,
                e.message
            );
        }

        state.finishedAt = new Date().toISOString();

        console.log(
            '[Filmix PRO+ ' + VERSION + '] FULL REPORT\n' +
            reportText()
        );

        notify();
    }

    function bootstrap() {
        var attempts = 0;
        var maxAttempts = 100;

        var timer = setInterval(function () {
            attempts++;

            if (window.Lampa && window.appready) {
                clearInterval(timer);
                runChecks();
            } else if (attempts >= maxAttempts) {
                clearInterval(timer);

                check(
                    'Lampa ready within 30s',
                    false,
                    'тайм-аут ожидания приложения'
                );

                state.finishedAt = new Date().toISOString();

                console.log(
                    '[Filmix PRO+ ' + VERSION + '] FULL REPORT\n' +
                    reportText()
                );

                notify();
            }
        }, 300);
    }

    console.log(
        '[Filmix PRO+ ' + VERSION + '] script loaded'
    );

    bootstrap();

})();
