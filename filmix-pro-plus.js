
(function () {
'use strict';

/* Filmix PRO+ for Lampa — v1.3.0 */
var VERSION = '1.3.0';
var STYLE_ID = 'filmix-pro-plus-css';
var BUTTON_ID = 'filmix-pro-plus-button';
var THEME_KEY = 'filmix_pro_plus_theme_enabled';
var API = 'http://filmixapp.cyou/api/v2/';

if (window.__FILMIX_PRO_PLUS_STARTED__) return;
window.__FILMIX_PRO_PLUS_STARTED__ = true;

var enabled = true;
var observer = null;
var initialized = false;
var profileRequest = null;
var authRequest = null;
var pollTimer = null;
var authBody = null;
var authCode = '';
var authToken = '';
var authDeviceQuery = '';
var authInProgress = false;

var css = `
:root{--fp-bg:#090c11;--fp-panel:#171d25;--fp-gold:#d7b56d;--fp-gold-light:#f5dfaa;--fp-text:#f4f1e9}
body.filmix-pro-plus-theme{background:var(--fp-bg)!important;color:var(--fp-text)!important}
body.filmix-pro-plus-theme .head,body.filmix-pro-plus-theme .head__body{background:rgba(9,12,17,.97)!important}
body.filmix-pro-plus-theme .head__title,body.filmix-pro-plus-theme .menu__title,body.filmix-pro-plus-theme .category__title,body.filmix-pro-plus-theme .full-start__title,body.filmix-pro-plus-theme .full-start-new__title{color:var(--fp-gold-light)!important}
body.filmix-pro-plus-theme .items-line__head{border-bottom:1px solid rgba(215,181,109,.35)!important}
body.filmix-pro-plus-theme .card__view{border-radius:10px!important;overflow:hidden!important}
body.filmix-pro-plus-theme .card.focus .card__view,body.filmix-pro-plus-theme .card.traverse .card__view{outline:2px solid var(--fp-gold)!important;outline-offset:2px!important;box-shadow:0 0 18px rgba(215,181,109,.3)!important}
body.filmix-pro-plus-theme .card__title{color:var(--fp-text)!important}
body.filmix-pro-plus-theme .menu{background:var(--fp-panel)!important}
body.filmix-pro-plus-theme .menu__item.focus,body.filmix-pro-plus-theme .selector.focus,body.filmix-pro-plus-theme .full-start__button.focus,body.filmix-pro-plus-theme .full-start-new__button.focus{background:var(--fp-gold)!important;color:#17130b!important;border-color:var(--fp-gold-light)!important}
body.filmix-pro-plus-theme .modal__content,body.filmix-pro-plus-theme .selectbox,body.filmix-pro-plus-theme .settings{background:var(--fp-panel)!important;color:var(--fp-text)!important}
#${BUTTON_ID}{display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:19px!important;height:19px!important;min-width:19px!important;min-height:19px!important;max-width:19px!important;max-height:19px!important;flex:0 0 19px!important;padding:0!important;margin:0 4px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.12)!important;background:#202127!important;color:#e7c77f!important;overflow:hidden!important}
#${BUTTON_ID} svg{display:block!important;width:10px!important;height:10px!important;fill:currentColor!important}
#${BUTTON_ID}.off{color:#9299a2!important}#${BUTTON_ID}:focus{outline:1px solid var(--fp-gold)!important;outline-offset:1px!important}
`;

function log(message, error) {
    console.log('[Filmix PRO+ ' + VERSION + '] ' + message);
    if (error) console.error('[Filmix PRO+]', error);
}

function notify(message) {
    try {
        if (window.Lampa && Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(message);
    } catch (e) {
        log('Notification error', e);
    }
}

function readTheme() {
    try {
        return Lampa.Storage.get(THEME_KEY, true) !== false;
    } catch (e) {
        try {
            return localStorage.getItem(THEME_KEY) !== 'false';
        } catch (x) {
            return true;
        }
    }
}

function saveTheme() {
    try {
        Lampa.Storage.set(THEME_KEY, enabled);
    } catch (e) {}
    try {
        localStorage.setItem(THEME_KEY, enabled ? 'true' : 'false');
    } catch (e) {}
}

function installStyle() {
    if (!document.head || !document.body) return;

    var style = document.getElementById(STYLE_ID);

    if (!style) {
        style = document.createElement('style');
        style.id = STYLE_ID;
        document.head.appendChild(style);
    }

    if (style.textContent !== css) style.textContent = css;

    document.body.classList.toggle('filmix-pro-plus-theme', enabled);
}

function updateButton() {
    var button = document.getElementById(BUTTON_ID);
    if (!button) return;

    button.classList.toggle('off', !enabled);
    button.setAttribute('aria-label', enabled ? 'Выключить оформление' : 'Включить оформление');
}

function toggleTheme() {
    enabled = !enabled;
    saveTheme();
    installStyle();
    updateButton();

    notify(enabled ? 'Filmix PRO+: оформление включено' : 'Filmix PRO+: оформление выключено');
}

function findHeader() {
    return document.querySelector('.head__actions, .head__actions-list, .head__right');
}

function installButton() {
    var header = findHeader();
    if (!header) return false;

    var button = document.getElementById(BUTTON_ID);

    if (button && button.isConnected && header.contains(button)) return true;
    if (button) button.remove();

    button = document.createElement('button');
    button.id = BUTTON_ID;
    button.type = 'button';
    button.className = 'selector';

    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.5 6.2L21 10l-6.5 2.1L12 18l-2.5-5.9L3 10l6.5-1.8z"/></svg>';

    button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        toggleTheme();
    });

    var more = header.querySelector('.head__action--more,[data-action="more"],.head__action--menu');

    if (more) header.insertBefore(button, more);
    else header.appendChild(button);

    updateButton();
    return true;
}

function refresh() {
    installStyle();
    installButton();
}

function startObserver() {
    if (observer || !window.MutationObserver || !document.documentElement) return;

    observer = new MutationObserver(function () {
        if (!document.getElementById(STYLE_ID) ||
            !document.getElementById(BUTTON_ID) ||
            (document.body && document.body.classList.contains('filmix-pro-plus-theme') !== enabled)) {
            refresh();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}

/* Авторизация Filmix */
function deviceQuery() {
    if (!authDeviceQuery) {
        var uid = Lampa.Utils && Lampa.Utils.uid
            ? Lampa.Utils.uid(16)
            : 'filmixproplus0001';

        authDeviceQuery =
            '?user_dev_apk=1.1.3&user_dev_id=' + encodeURIComponent(uid) +
            '&user_dev_name=Xiaomi&user_dev_os=11&user_dev_vendor=Xiaomi&user_dev_token=';
    }

    return authDeviceQuery;
}

function networkProfile() {
    if (!profileRequest) profileRequest = new Lampa.Reguest();
    return profileRequest;
}

function networkAuth() {
    if (!authRequest) authRequest = new Lampa.Reguest();
    return authRequest;
}

function accountStatusText(status) {
    if (!status || !status.login) return 'Устройство не авторизовано';

    if (status.is_pro_plus) {
        return status.login + ' — PRO+ до ' + (status.pro_date || 'не указано');
    }

    if (status.is_pro) {
        return status.login + ' — PRO до ' + (status.pro_date || 'не указано');
    }

    return status.login + ' — FREE';
}

function renderAccountStatus(body) {
    if (!body || !body.length) return;

    body.find('[data-name="filmix_status"]').remove();

    var status = Lampa.Storage.get('filmix_status', {});

    var row = $('<div class="settings-param" data-name="filmix_status" data-static="true"><div class="settings-param__name">Статус аккаунта</div><div class="settings-param__value"></div></div>');

    row.find('.settings-param__value').text(accountStatusText(status));

    body.find('[data-name="filmix_add"]').after(row);
}

function checkProfile(token, callback, silent) {
    if (!token) return;

    var request = networkProfile();

    request.clear();
    request.timeout(8000);

    request.silent(API + 'user_profile' + deviceQuery() + token, function (json) {
        if (json && json.user_data) {
            Lampa.Storage.set('filmix_status', json.user_data);

            if (typeof callback === 'function') callback(json.user_data);
        } else {
            Lampa.Storage.set('filmix_status', {});
        }

        if (authBody) renderAccountStatus(authBody);
    }, function (a, c) {
        if (!silent) notify(request.errorDecode(a, c));
    });
}

function stopAuth() {
    if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
    }

    authInProgress = false;
}

function openDeviceAuth(body) {
    if (authInProgress) return;

    authInProgress = true;
    authBody = body;
    authCode = '';
    authToken = '';

    var request = networkAuth();

    var modal = $('<div><div class="broadcast__text">Открой filmix.ac/consoles в своём аккаунте Filmix и введи показанный код.</div><div class="broadcast__device selector" style="text-align:center;font-size:1.5em;padding:1em 0">Получаем код…</div><div style="text-align:center;opacity:.75">Нажми OK на коде, чтобы скопировать его</div></div>');

    Lampa.Modal.open({
        title: 'Подключение Filmix',
        html: modal,

        onBack: function () {
            stopAuth();
            Lampa.Modal.close();
            Lampa.Controller.toggle('settings_component');
        },

        onSelect: function () {
            if (!authCode) return;

            if (Lampa.Utils && Lampa.Utils.copyTextToClipboard) {
                Lampa.Utils.copyTextToClipboard(
                    authCode,
                    function () { notify('Код скопирован'); },
                    function () { notify('Не удалось скопировать код'); }
                );
            } else {
                notify('Код для ввода: ' + authCode);
            }
        }
    });

    request.clear();
    request.timeout(10000);

    request.quiet(API + 'token_request' + deviceQuery(), function (result) {
        if (!result || result.status !== 'ok' || !result.code || !result.user_code) {
            stopAuth();
            Lampa.Modal.close();
            notify('Filmix не выдал код привязки. Попробуй позже.');
            return;
        }

        authToken = result.code;
        authCode = result.user_code;

        modal.find('.broadcast__device').text(authCode);

        pollTimer = setInterval(function () {
            if (!authInProgress || !authToken) return;

            checkProfile(authToken, function (profile) {
                if (!profile || !authInProgress) return;

                stopAuth();
                Lampa.Modal.close();

                Lampa.Storage.set('filmix_token', authToken);
                Lampa.Storage.set('filmix_status', profile);

                renderAccountStatus(body);

                notify('Filmix подключён: ' + accountStatusText(profile));

                Lampa.Controller.toggle('settings_component');
            }, true);
        }, 10000);
    }, function (a, c) {
        stopAuth();
        Lampa.Modal.close();
        notify(request.errorDecode(a, c));
    });
}

/* Раздел Filmix в настройках Lampa */
function addSettingsFilmix() {
    if (!Lampa.Settings || !Lampa.Settings.main) return;

    var main = Lampa.Settings.main();

    if (!main || !main.render) return;

    var render = main.render();

    if (render.find('[data-component="filmix"]').length) return;

    var folder = $('<div class="settings-folder selector" data-component="filmix"><div class="settings-folder__icon"><svg height="57" viewBox="0 0 58 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20.3735V45H26.8281V34.1262H36.724V26.9806H26.8281V24.3916C26.8281 21.5955 28.9062 19.835 31.1823 19.835H39V13H26.8281C23.6615 13 20 15.49 20 20.3735Z" fill="white"/><rect x="2" y="2" width="54" height="53" rx="5" stroke="white" stroke-width="4"/></svg></div><div class="settings-folder__name">Filmix PRO+ — авторизация</div></div>');

    var more = render.find('[data-component="more"]');

    if (more.length) more.after(folder);
    else render.append(folder);

    if (main.update) main.update();
}

function bindFilmixSettings() {
    Lampa.Settings.listener.follow('open', function (event) {
        if (event.name !== 'filmix' || !event.body) return;

        authBody = event.body;

        event.body.find('[data-name="filmix_add"]')
            .off('hover:enter')
            .on('hover:enter', function () {
                openDeviceAuth(event.body);
            });

        renderAccountStatus(event.body);

        var token = Lampa.Storage.get('filmix_token', '');

        if (token) checkProfile(token, null, true);
    });
}

function initializeFilmixAuth() {
    if (!Lampa.Settings || !Lampa.Storage || !Lampa.Reguest || !Lampa.Template) return;

    try {
        if (Lampa.Params && Lampa.Params.select) {
            Lampa.Params.select('filmix_token', '', '');
        }
    } catch (e) {
        log('filmix_token parameter registration failed', e);
    }

    Lampa.Template.add('settings_filmix',
        '<div>' +
            '<div class="settings-param selector" data-name="filmix_token" data-type="input" placeholder="Вставь токен Filmix">' +
                '<div class="settings-param__name">Токен Filmix</div>' +
                '<div class="settings-param__value"></div>' +
                '<div class="settings-param__descr">Необязательно: можно добавить токен вручную</div>' +
            '</div>' +
            '<div class="settings-param selector" data-name="filmix_add" data-static="true">' +
                '<div class="settings-param__name">Привязать устройство</div>' +
                '<div class="settings-param__value">Получить одноразовый код</div>' +
                '<div class="settings-param__descr">Введи код на filmix.ac/consoles</div>' +
            '</div>' +
        '</div>'
    );

    addSettingsFilmix();
    bindFilmixSettings();

    Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') addSettingsFilmix();
    });

    Lampa.Storage.listener.follow('change', function (event) {
        if (event.name === 'filmix_token') {
            if (event.value) {
                checkProfile(event.value, null, false);
            } else {
                Lampa.Storage.set('filmix_status', {});
                if (authBody) renderAccountStatus(authBody);
            }
        }
    });

    var savedToken = Lampa.Storage.get('filmix_token', '');

    if (savedToken) checkProfile(savedToken, null, true);

    log('Native Filmix settings component registered');
}

function runChecks() {
    var checks = {
        Lampa: !!window.Lampa,
        appReady: !!window.appready,
        settings: !!(Lampa.Settings && Lampa.Settings.main),
        settingsListener: !!(Lampa.Settings && Lampa.Settings.listener),
        template: !!(Lampa.Template && Lampa.Template.add),
        storage: !!(Lampa.Storage && Lampa.Storage.get && Lampa.Storage.set),
        filmixFolder: !!document.querySelector('[data-component="filmix"]'),
        themeButton: !!document.getElementById(BUTTON_ID)
    };

    window.filmix_pro_plus_status = {
        version: VERSION,
        checks: checks
    };

    Object.keys(checks).forEach(function (key) {
        log(key + ': ' + (checks[key] ? 'OK' : 'NOT FOUND'));
    });
}

function initialize() {
    if (initialized || !window.Lampa || !document.body) return;

    initialized = true;
    enabled = readTheme();

    refresh();
    startObserver();
    initializeFilmixAuth();

    window.filmix_pro_plus = {
        version: VERSION,
        toggle: toggleTheme,
        refresh: refresh,
        status: function () {
            runChecks();
            return window.filmix_pro_plus_status;
        }
    };

    runChecks();
    log('Plugin initialized');
}

function bootstrap() {
    var attempts = 0;

    var timer = setInterval(function () {
        attempts++;

        if (window.Lampa && window.appready && document.body) {
            clearInterval(timer);
            initialize();
        } else if (attempts >= 100) {
            clearInterval(timer);
            log('Timeout waiting for Lampa ready');
        }
    }, 300);
}

log('Script loaded');
bootstrap();

})();
