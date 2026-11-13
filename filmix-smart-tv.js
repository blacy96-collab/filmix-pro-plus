(function () {
    'use strict';

    var ID = 'filmix-gold-switch';
    var STYLE = 'filmix-gold-switch-style';
    var KEY = 'filmix_smart_tv_enabled';

    if (window.__filmixGoldSwitchInstalled) return;
    window.__filmixGoldSwitchInstalled = true;

    var enabled = true;

    var css = `
    #filmix-gold-switch {
        width: 2.6em;
        height: 2.6em;
        min-width: 2.6em;
        min-height: 2.6em;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        margin: 0 .35em;
        padding: 0;
        border-radius: 50%;
        box-sizing: border-box;
        background: #242629;
        color: #999;
        border: 1px solid #555;
        cursor: pointer;
        z-index: 999999;
    }

    #filmix-gold-switch svg {
        width: 1.5em;
        height: 1.5em;
        fill: currentColor;
    }

    #filmix-gold-switch.gold-on {
        color: #ffe6a0;
        background: radial-gradient(circle,#70572a,#252018);
        border-color: #e9c36b;
        box-shadow: 0 0 9px #e9c36b,
                    0 0 22px rgba(238,190,85,.9),
                    0 0 36px rgba(238,190,85,.5);
        animation: filmixGoldPulse 2s infinite ease-in-out;
    }

    #filmix-gold-switch.gold-off {
        color: #888;
        box-shadow: none;
        animation: none;
    }

    @keyframes filmixGoldPulse {
        50% {
            filter: brightness(1.5);
            box-shadow: 0 0 14px #ffe6a0,
                        0 0 30px #e9c36b;
        }
    }

    body.ft-theme-on {
        background: #101113 !important;
        color: #f4f4f4 !important;
    }

    body.ft-theme-on .head,
    body.ft-theme-on .head__body {
        background: #101113 !important;
    }
    `;

    function readSetting() {
        try {
            if (window.Lampa && Lampa.Storage) {
                return Lampa.Storage.get(KEY, true) !== false;
            }
        } catch (e) {}

        try {
            return localStorage.getItem(KEY) !== 'false';
        } catch (e) {}

        return true;
    }

    function saveSetting() {
        try {
            if (window.Lampa && Lampa.Storage) {
                Lampa.Storage.set(KEY, enabled);
            }
        } catch (e) {}

        try {
            localStorage.setItem(KEY, enabled ? 'true' : 'false');
        } catch (e) {}
    }

    function applyStyle() {
        if (!document.head || !document.body) return;

        var style = document.getElementById(STYLE);

        if (!style) {
            style = document.createElement('style');
            style.id = STYLE;
            document.head.appendChild(style);
        }

        style.textContent = css;
        document.body.classList.toggle('ft-theme-on', enabled);
    }

    function updateButton(button) {
        button.classList.toggle('gold-on', enabled);
        button.classList.toggle('gold-off', !enabled);
    }

    function toggle() {
        enabled = !enabled;
        saveSetting();
        applyStyle();

        var button = document.getElementById(ID);
        if (button) updateButton(button);

        try {
            if (window.Lampa && Lampa.Noty && Lampa.Noty.show) {
                Lampa.Noty.show(
                    enabled
                        ? 'Filmix PRO+: золотой стиль включён'
                        : 'Filmix PRO+: стиль выключен'
                );
            }
        } catch (e) {}
    }

    function findHeaderActions() {
        var selectors = [
            '.head__actions',
            '.head__actions-list',
            '.head__right',
            '.head__body .head__actions',
            '.head'
        ];

        for (var i = 0; i < selectors.length; i++) {
            var element = document.querySelector(selectors[i]);
            if (element) return element;
        }

        return null;
    }

    function install() {
        if (document.getElementById(ID)) return;

        var actions = findHeaderActions();
        if (!actions) return;

        var button = document.createElement('div');
        button.id = ID;
        button.className = 'selector gold-on';
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.setAttribute('title', 'Filmix PRO+ — переключить оформление');

        button.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M12 2.5l2.8 6 6.5.8-4.8 4.5 1.2 6.5-5.7-3.2-5.7 3.2 1.2-6.5-4.8-4.5 6.5-.8z"/>' +
            '</svg>';

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            toggle();
        });

        button.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggle();
            }
        });

        var bell = actions.querySelector(
            '.head__action--notice, [data-action="notice"], [aria-label*="уведом"]'
        );

        if (bell && bell.parentNode === actions) {
            actions.insertBefore(button, bell);
        } else {
            actions.appendChild(button);
        }

        updateButton(button);
    }

    function start() {
        enabled = readSetting();
        applyStyle();
        install();

        if (!window.__filmixGoldObserver && document.documentElement) {
            window.__filmixGoldObserver = new MutationObserver(function () {
                applyStyle();
                install();
            });

            window.__filmixGoldObserver.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }

        console.log('[Filmix PRO+] Gold switch started');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event && event.type === 'ready') start();
        });
    }
})();
