
(function () {
    'use strict';

    /* Filmix PRO+ Cardify Edition — unified plugin for Lampa */
    var VERSION = '2.0.0';
    var COMPONENT = 'filmix_pro_plus';
    var STYLE_ID = 'filmix-pro-plus-unified-style';
    var API_URL = 'http://filmixapp.cyou/api/v2/';
    var STORAGE = {
        enabled: 'filmix_pro_plus_enabled',
        cardify: 'filmix_pro_plus_cardify',
        theme: 'filmix_pro_plus_theme',
        token: 'filmix_token',
        status: 'filmix_status',
        device: 'filmix_pro_plus_device_id'
    };

    if (window.__FILMIX_PRO_PLUS_UNIFIED__) return;
    window.__FILMIX_PRO_PLUS_UNIFIED__ = true;

    var network = null;
    var pollTimer = null;
    var authToken = '';
    var authCode = '';
    var authModal = null;
    var deviceQuery = '';
    var initialized = false;
    var settingsRegistered = false;

    function log() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('[Filmix PRO+ ' + VERSION + ']');
        if (window.console && console.log) console.log.apply(console, args);
    }

    function storageGet(key, fallback) {
        try {
            var value = Lampa.Storage.get(key, fallback);
            return value === undefined || value === null ? fallback : value;
        } catch (e) { return fallback; }
    }

    function storageSet(key, value) {
        try { Lampa.Storage.set(key, value); }
        catch (e) { log('Storage error', key, e); }
    }

    function isEnabled() {
        return storageGet(STORAGE.enabled, true) !== false;
    }

    function isCardify() {
        return storageGet(STORAGE.cardify, true) !== false;
    }

    function themeName() {
        return storageGet(STORAGE.theme, 'navy_gold');
    }

    var themes = {
        navy_gold: {
            bg: '#090c11',
            panel: '#171d25',
            gold: '#d7b56d',
            text: '#f4f1e9'
        },
        graphite: {
            bg: '#101114',
            panel: '#202329',
            gold: '#c7cbd1',
            text: '#f5f5f5'
        },
        black_red: {
            bg: '#090909',
            panel: '#191313',
            gold: '#d65b55',
            text: '#f5eeee'
        }
    };

    function applyTheme() {
        var old = document.getElementById(STYLE_ID);

        if (old) old.parentNode.removeChild(old);

        document.body.classList.remove('filmix-pro-plus-theme');

        if (!isEnabled()) return;

        var t = themes[themeName()] || themes.navy_gold;

        var css = `
        :root {
            --fpp-bg:${t.bg};
            --fpp-panel:${t.panel};
            --fpp-accent:${t.gold};
            --fpp-text:${t.text};
        }

        body.filmix-pro-plus-theme {
            background:var(--fpp-bg)!important;
            color:var(--fpp-text)!important;
        }

        body.filmix-pro-plus-theme .head,
        body.filmix-pro-plus-theme .head__body {
            background:rgba(9,12,17,.96)!important;
        }

        body.filmix-pro-plus-theme .menu {
            background:var(--fpp-panel)!important;
        }

        body.filmix-pro-plus-theme .head__title,
        body.filmix-pro-plus-theme .menu__title,
        body.filmix-pro-plus-theme .category__title,
        body.filmix-pro-plus-theme .full-start__title,
        body.filmix-pro-plus-theme .full-start-new__title {
            color:var(--fpp-accent)!important;
        }

        body.filmix-pro-plus-theme .items-line__head {
            border-bottom:1px solid rgba(215,181,109,.38)!important;
        }

        body.filmix-pro-plus-theme .card__view {
            border-radius:10px!important;
            overflow:hidden!important;
        }

        body.filmix-pro-plus-theme .card.focus .card__view,
        body.filmix-pro-plus-theme .card.traverse .card__view {
            outline:2px solid var(--fpp-accent)!important;
            outline-offset:2px!important;
            box-shadow:0 0 18px rgba(215,181,109,.30)!important;
        }

        body.filmix-pro-plus-theme .card__title {
            color:var(--fpp-text)!important;
        }

        body.filmix-pro-plus-theme .settings-folder.focus,
        body.filmix-pro-plus-theme .settings-param.focus {
            border-color:var(--fpp-accent)!important;
        }

        ${isCardify() ? `
        .full-start-new.cardify-fpp .full-start-new__body {
            height:80vh;
        }

        .full-start-new.cardify-fpp .full-start-new__right {
            display:flex;
            align-items:flex-end;
            gap:1.5em;
        }

        .full-start-new.cardify-fpp .full-start-new__left {
            flex:1;
            min-width:0;
        }

        .full-start-new.cardify-fpp .full-start-new__reactions {
            margin:0;
            margin-right:-2.8em;
        }

        .full-start-new.cardify-fpp .full-start-new__reactions:not(.focus) {
            margin:0;
        }

        .full-start-new.cardify-fpp .full-start-new__reactions:not(.focus)>div:not(:first-child) {
            display:none;
        }

        .full-start-new.cardify-fpp .full-start-new__rate-line {
            margin:0;
            margin-left:3.5em;
        }

        .full-start-new.cardify-fpp .full-start-new__rate-line>*:last-child {
            margin-right:0!important;
        }

        .full-start-new.cardify-fpp .full-start-new__background {
            left:0;
        }
        ` : ''}
        `;

        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = css;

        document.head.appendChild(style);
        document.body.classList.add('filmix-pro-plus-theme');
    }

    function updateCardifyClass() {
        var nodes = document.querySelectorAll('.full-start-new');

        for (var i = 0; i < nodes.length; i++) {
            if (isEnabled() && isCardify()) {
                nodes[i].classList.add('cardify-fpp');
            } else {
                nodes[i].classList.remove('cardify-fpp');
            }
        }
    }

    function addFullListener() {
        if (!Lampa.Listener || !Lampa.Listener.follow) return;

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite' || e.type === 'complete') {
                setTimeout(updateCardifyClass, 0);
            }
        });
    }

    function notify(message) {
        if (Lampa.Noty && Lampa.Noty.show) {
            Lampa.Noty.show(message);
        } else {
            log(message);
        }
    }

    function getDeviceQuery() {
        if (deviceQuery) return deviceQuery;

        var uid = storageGet(STORAGE.device, '');

        if (!uid) {
            uid = Lampa.Utils && Lampa.Utils.uid
                ? Lampa.Utils.uid(16)
                : ('fpp' + Math.random().toString(36).slice(2, 14));

            storageSet(STORAGE.device, uid);
        }

        deviceQuery =
            '?user_dev_apk=1.1.3' +
            '&user_dev_id=' + encodeURIComponent(uid) +
            '&user_dev_name=AppleTV' +
            '&user_dev_os=tvOS' +
            '&user_dev_vendor=Apple' +
            '&user_dev_token=';

        return deviceQuery;
    }

    function stopPolling() {
        if (pollTimer) clearInterval(pollTimer);
        pollTimer = null;
    }

    function closeAuthModal() {
        stopPolling();

        if (Lampa.Modal && Lampa.Modal.close) {
            Lampa.Modal.close();
        }

        authModal = null;
    }

    function profileRequest(token, callback, silentError) {
        if (!network) network = new Lampa.Reguest();

        network.clear();
        network.timeout(10000);

        network.silent(
            API_URL + 'user_profile' + getDeviceQuery() + token,

            function (json) {
                if (json && json.user_data) {
                    storageSet(STORAGE.status, json.user_data);

                    if (callback) callback(json.user_data);
                } else {
                    storageSet(STORAGE.status, {});
                }

                renderStatus();
            },

            function (a, c) {
                if (!silentError) {
                    notify(network.errorDecode(a, c));
                }
            }
        );
    }

    function accountStatusText() {
        var status = storageGet(STORAGE.status, {});

        if (typeof status === 'string') {
            try {
                status = JSON.parse(status);
            } catch (e) {
                status = {};
            }
        }

        if (!status || !status.login) {
            return 'Устройство не авторизовано';
        }

        var tier = status.is_pro_plus
            ? 'PRO+'
            : (status.is_pro ? 'PRO' : 'FREE');

        var until = status.pro_date
            ? ' · до ' + status.pro_date
            : '';

        return status.login + ' · ' + tier + until;
    }

    function renderStatus() {
        var row = document.querySelector(
            '[data-name="fpp_account_status"]'
        );

        if (!row) return;

        var value = row.querySelector('.settings-param__value');
        var descr = row.querySelector('.settings-param__descr');

        if (value) value.textContent = accountStatusText();
        if (descr) descr.textContent = accountStatusText();
    }

    function startAuthorization() {
        if (!Lampa.Reguest || !Lampa.Modal) {
            notify('В этой версии Lampa недоступен модуль авторизации');
            return;
        }

        stopPolling();
        authToken = '';
        authCode = '';
        deviceQuery = '';

        if (!network) network = new Lampa.Reguest();

        var body = $('<div class="broadcast">' +
            '<div class="broadcast__text">' +
            'Откройте <b>https://filmix.ac/consoles</b> в браузере, ' +
            'войдите в свой аккаунт и введите показанный код.' +
            '</div>' +
            '<div class="broadcast__device selector" ' +
            'style="text-align:center;font-size:2em;padding:1em">' +
            'Получаем код…</div>' +
            '<div class="broadcast__text" style="text-align:center">' +
            'Нажмите OK на коде, чтобы скопировать его' +
            '</div></div>');

        authModal = body;

        Lampa.Modal.open({
            title: 'Подключение Filmix',
            html: body,

            onBack: function () {
                closeAuthModal();
                Lampa.Controller.toggle('settings_component');
            },

            onSelect: function () {
                if (!authCode) return;

                if (Lampa.Utils && Lampa.Utils.copyTextToClipboard) {
                    Lampa.Utils.copyTextToClipboard(
                        authCode,
                        function () {
                            notify('Код скопирован');
                        },
                        function () {
                            notify('Не удалось скопировать код');
                        }
                    );
                } else {
                    notify('Код: ' + authCode);
                }
            }
        });

        network.clear();
        network.timeout(10000);

        network.quiet(
            API_URL + 'token_request' + getDeviceQuery(),

            function (found) {
                if (
                    found &&
                    found.status === 'ok' &&
                    found.code &&
                    found.user_code
                ) {
                    authToken = found.code;
                    authCode = found.user_code;

                    body.find('.broadcast__device').text(authCode);

                    stopPolling();

                    pollTimer = setInterval(function () {
                        profileRequest(authToken, function () {
                            storageSet(STORAGE.token, authToken);
                            notify('Filmix успешно подключён');
                            closeAuthModal();
                            Lampa.Controller.toggle('settings_component');
                        }, true);
                    }, 10000);
                } else {
                    notify(
                        found && (found.message || found.error)
                            ? (found.message || found.error)
                            : 'Filmix не выдал код авторизации'
                    );

                    body.find('.broadcast__device').text(
                        'Не удалось получить код'
                    );
                }
            },

            function (a, c) {
                notify(network.errorDecode(a, c));
                body.find('.broadcast__device').text(
                    'Ошибка соединения с Filmix'
                );
            }
        );
    }

    function addSettings() {
        if (settingsRegistered) return true;

        if (
            !Lampa.SettingsApi ||
            !Lampa.SettingsApi.addComponent ||
            !Lampa.SettingsApi.addParam
        ) {
            return false;
        }

        try {
            Lampa.SettingsApi.addComponent({
                component: COMPONENT,
                name: 'Filmix PRO+ · Cardify',
                icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
                    '<path fill="white" d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm1 3v12h14V6H5zm2 2h5v8H7V8zm7 0h5v2h-5V8zm0 4h5v2h-5v-2z"/>' +
                    '</svg>'
            });

            Lampa.SettingsApi.addParam({
                component: COMPONENT,
                param: {
                    name: STORAGE.enabled,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: 'Включить Filmix PRO+'
                },
                onChange: function () {
                    applyTheme();
                    updateCardifyClass();
                }
            });

            Lampa.SettingsApi.addParam({
                component: COMPONENT,
                param: {
                    name: STORAGE.cardify,
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: 'Оформление карточек Cardify',
                    description: 'Компактное расположение информации и рейтингов'
                },
                onChange: function () {
                    applyTheme();
                    updateCardifyClass();
                }
            });

            Lampa.SettingsApi.addParam({
                component: COMPONENT,
                param: {
                    name: STORAGE.theme,
                    type: 'select',
                    values: {
                        navy_gold: 'Navy Gold',
                        graphite: 'Graphite',
                        black_red: 'Black Red'
                    },
                    default: 'navy_gold'
                },
                field: {
                    name: 'Цветовая тема'
                },
                onChange: applyTheme
            });

            Lampa.SettingsApi.addParam({
                component: COMPONENT,
                param: {
                    name: 'fpp_auth_action',
                    type: 'static',
                    default: true
                },
                field: {
                    name: 'Подключить / переподключить Filmix',
                    description: 'Получить одноразовый код привязки'
                },
                onRender: function (item) {
                    item.addClass('selector');
                    item.on('hover:enter', startAuthorization);
                }
            });

            Lampa.SettingsApi.addParam({
                component: COMPONENT,
                param: {
                    name: 'fpp_status_refresh',
                    type: 'static',
                    default: true
                },
                field: {
                    name: 'Обновить статус аккаунта'
                },
                onRender: function (item) {
                    item.addClass('selector');

                    item.on('hover:enter', function () {
                        var token = storageGet(STORAGE.token, '');

                        if (token) profileRequest(token);
                        else notify('Сначала подключите Filmix');
                    });
                }
            });

            Lampa.SettingsApi.addParam({
                component: COMPONENT,
                param: {
                    name: 'fpp_account_status',
                    type: 'static',
                    default: true
                },
                field: {
                    name: 'Статус аккаунта Filmix',
                    description: accountStatusText()
                },
                onRender: function (item) {
                    item.find('.settings-param__descr').text(
                        accountStatusText()
                    );
                }
            });

            settingsRegistered = true;
            return true;
        } catch (error) {
            log(
                'SettingsApi registration failed; using native settings template',
                error
            );
            return false;
        }
    }

    function legacySettingsFallback() {
        if (
            !Lampa.Settings ||
            !Lampa.Settings.main ||
            !Lampa.Template ||
            !Lampa.Template.add
        ) {
            return false;
        }

        var main = Lampa.Settings.main();

        if (!main || !main.render) return false;

        Lampa.Template.add(
            'settings_' + COMPONENT,
            '<div>' +
                '<div class="settings-param selector" data-name="fpp_auth" data-static="true">' +
                    '<div class="settings-param__name">Подключить / переподключить Filmix</div>' +
                    '<div class="settings-param__descr">Получить одноразовый код привязки</div>' +
                '</div>' +
                '<div class="settings-param selector" data-name="fpp_refresh" data-static="true">' +
                    '<div class="settings-param__name">Обновить статус аккаунта</div>' +
                '</div>' +
                '<div class="settings-param" data-name="fpp_account_status" data-static="true">' +
                    '<div class="settings-param__name">Статус аккаунта Filmix</div>' +
                    '<div class="settings-param__value">Устройство не авторизовано</div>' +
                '</div>' +
                '<div class="settings-param selector" data-name="fpp_enable" data-static="true">' +
                    '<div class="settings-param__name">Включить / выключить оформление</div>' +
                '</div>' +
                '<div class="settings-param selector" data-name="fpp_cardify" data-static="true">' +
                    '<div class="settings-param__name">Включить / выключить Cardify</div>' +
                '</div>' +
            '</div>'
        );

        var root = main.render();

        if (!root.find('[data-component="' + COMPONENT + '"]').length) {
            var folder = $(
                '<div class="settings-folder selector" data-component="' +
                COMPONENT +
                '">' +
                '<div class="settings-folder__icon">✦</div>' +
                '<div class="settings-folder__name">Filmix PRO+ · Cardify</div>' +
                '</div>'
            );

            var more = root.find('[data-component="more"]');

            if (more.length) more.after(folder);
            else root.append(folder);

            if (main.update) main.update();
        }

        if (!window.__FPP_LEGACY_SETTINGS_BOUND__) {
            window.__FPP_LEGACY_SETTINGS_BOUND__ = true;

            Lampa.Settings.listener.follow('open', function (e) {
                if (e.name !== COMPONENT || !e.body) return;

                var body = e.body;

                body.find('[data-name="fpp_auth"]')
                    .off('hover:enter')
                    .on('hover:enter', startAuthorization);

                body.find('[data-name="fpp_refresh"]')
                    .off('hover:enter')
                    .on('hover:enter', function () {
                        var token = storageGet(STORAGE.token, '');

                        if (token) profileRequest(token);
                        else notify('Сначала подключите Filmix');
                    });

                body.find('[data-name="fpp_enable"]')
                    .off('hover:enter')
                    .on('hover:enter', function () {
                        storageSet(STORAGE.enabled, !isEnabled());
                        applyTheme();
                        updateCardifyClass();

                        notify(
                            isEnabled()
                                ? 'Оформление включено'
                                : 'Оформление выключено'
                        );
                    });

                body.find('[data-name="fpp_cardify"]')
                    .off('hover:enter')
                    .on('hover:enter', function () {
                        storageSet(STORAGE.cardify, !isCardify());
                        applyTheme();
                        updateCardifyClass();

                        notify(
                            isCardify()
                                ? 'Cardify включён'
                                : 'Cardify выключен'
                        );
                    });

                var status = body.find(
                    '[data-name="fpp_account_status"] .settings-param__value'
                );

                if (status.length) {
                    status.text(accountStatusText());
                }
            });
        }

        settingsRegistered = true;
        return true;
    }

    function initialize() {
        if (initialized || !window.Lampa || !Lampa.Storage) return;

        initialized = true;

        if (storageGet(STORAGE.enabled, null) === null) {
            storageSet(STORAGE.enabled, true);
        }

        if (storageGet(STORAGE.cardify, null) === null) {
            storageSet(STORAGE.cardify, true);
        }

        if (storageGet(STORAGE.theme, null) === null) {
            storageSet(STORAGE.theme, 'navy_gold');
        }

        applyTheme();
        addFullListener();

        try {
            if (Lampa.Params && Lampa.Params.select) {
                Lampa.Params.select(STORAGE.token, '', '');
            }
        } catch (e) {
            log('Filmix token parameter registration skipped', e);
        }

        if (!addSettings()) {
            legacySettingsFallback();
        }

        updateCardifyClass();

        var token = storageGet(STORAGE.token, '');

        if (token) profileRequest(token);

        log('Initialized');
    }

    if (window.appready) {
        initialize();
    } else if (Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initialize();
        });
    } else {
        var attempts = 0;

        var wait = setInterval(function () {
            attempts++;

            if (
                window.Lampa &&
                Lampa.Storage &&
                (window.appready || attempts > 30)
            ) {
                clearInterval(wait);
                initialize();
            }

            if (attempts > 100) clearInterval(wait);
        }, 300);
    }
})();
