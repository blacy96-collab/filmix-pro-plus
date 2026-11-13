(function () {
    'use strict';

    var ID = 'filmix-gold-switch';
    var STYLE_ID = 'filmix-gold-switch-css';
    var STORAGE = 'filmix_smart_tv_enabled';

    if (window.__filmixGoldSwitchLoaded) return;
    window.__filmixGoldSwitchLoaded = true;

    var enabled = true;
    var observer = null;
    var timer = null;

    var css = `
    #${ID} {
        width: 2.65em !important;
        height: 2.65em !important;
        min-width: 2.65em !important;
        min-height: 2.65em !important;
        margin: 0 .35em !important;
        padding: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        border-radius: 50% !important;
        border: 1px solid rgba(255,255,255,.15) !important;
        background: #242629 !important;
        color: #999 !important;
        position: relative !important;
        z-index: 999999 !important;
        cursor: pointer !important;
        transition: all .3s ease !important;
    }

    #${ID} svg {
        width: 1.5em !important;
        height: 1.5em !important;
        display: block !important;
        fill: currentColor !important;
    }

    #${ID}.gold-on {
        color: #ffe5a0 !important;
        border-color: #e9c36b !important;
        background: radial-gradient(
            circle, #70572a 0%, #302719 65%, #202124 100%
        ) !important;
        box-shadow:
            0 0 8px #e9c36b,
            0 0 18px rgba(238,190,85,.85),
            0 0 32px rgba(238,190,85,.5),
            inset 0 0 10px rgba(255,224,145,.35) !important;
        animation: filmixGoldGlow 2s ease-in-out infinite !important;
    }

    #${ID}.gold-off {
        color: #888 !important;
        border-color: rgba(255,255,255,.12) !important;
        box-shadow: none !important;
        animation: none !important;
    }

    #${ID}.focus,
    #${ID}:focus {
        outline: 2px solid #ffe5a0 !important;
        outline-offset: 3px !important;
    }

    @keyframes filmixGoldGlow {
        0%, 100% {
            filter: brightness(1);
            box-shadow: 0 0 7px #d8b66b,
                0 0 15px rgba(238,190,85,.6),
                inset 0 0 8px rgba(255,224,145,.2);
        }
        50% {
            filter: brightness(1.4);
            box-shadow: 0 0 13px #ffe5a0,
                0 0 27px rgba(238,190,85,1),
                0 0 40px rgba(238,190,85,.55),
                inset 0 0 13px rgba(255,224,145,.45);
        }
    }

    body.ft-theme-on {
        background: #101113 !important;
        color: #f4f4f4 !important;
    }

    body.ft-theme-on .head,
    body.ft-theme-on .head__body {
        background: rgba(16,17,19,.97) !important;
    }

    body.ft-theme-on .head__title,
    body.ft-theme-on .category__title,
    body.ft-theme-on .title,
    body.ft-theme-on .full-start__title {
        color: #f2d99b !important;
    }

    body.ft-theme-on .selector.focus,
    body.ft-theme-on button.focus,
    body.ft-theme-on .button.focus,
    body.ft-theme-on .menu__item.focus {
        border-color: #e9c36b !important;
        box-shadow: 0 0 15px rgba(238,190,85,.35) !important;
    }
    `;

    function readSetting() {
        try {
            if (window.Lampa && Lampa.Storage) {
                return Lampa.Storage.get(STORAGE, true) !== false;
            }
        } catch (e) {}
        try {
            return localStorage.getItem(STORAGE) !== 'false';
        } catch (e) {}
        return true;
    }

    function saveSetting() {
        try {
            if (window.Lampa && Lampa.Storage) {
                Lampa.Storage.set(STORAGE, enabled);
            }
        } catch (e) {}
        try {
            localStorage.setItem(STORAGE, enabled ? 'true' : 'false');
        } catch (e) {}
    }

    function applyStyle() {
        if (!document.head || !document.body) return;

        var style = document.getElementById(STYLE_ID);

        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        if (style.textContent !== css) {
            style.textContent = css;
        }

        document.body.classList.toggle('ft-theme-on', enabled);
    }

    function findBell() {
        var header = document.querySelector('.head');

        if (!header) return null;

        var actions = header.querySelectorAll(
            '.head__action, button, [role="button"], .selector'
        );

        for (var i = 0; i < actions.length; i++) {
            var el = actions[i];

            if (el.id === ID) continue;

            var description = [
                el.className,
                el.getAttribute('title'),
                el.getAttribute('aria-label'),
                el.getAttribute('data-action'),
                el.innerHTML
            ].join(' ').toLowerCase();

            if (/bell|notice|notif|notification|уведом|колокол/.test(description)) {
                return el;
            }

            var svg = el.querySelector('svg');

            if (svg) {
                var svgDescription = [
                    svg.getAttribute('class'),
                    svg.innerHTML
                ].join(' ').toLowerCase();

                if (/bell|notice|notif/.test(svgDescription)) {
                    return el;
                }
            }
        }

        return null;
    }

    function updateButton(button) {
        button.classList.toggle('gold-on', enabled);
        button.classList.toggle('gold-off', !enabled);

        button.setAttribute(
            'aria-label',
            enabled ? 'Золотой стиль включён' : 'Золотой стиль выключен'
        );
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

    function installButton() {
        var existing = document.getElementById(ID);

        if (existing) {
            updateButton(existing);
            return;
        }

        var bell = findBell();

        if (!bell || !bell.parentNode) return;

        var button = document.createElement('div');

        button.id = ID;
        button.className = 'selector';
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');

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

        bell.parentNode.insertBefore(button, bell);
        updateButton(button);
    }

    function refresh() {
        applyStyle();
        installButton();
    }

    function start() {
        enabled = readSetting();
        refresh();

        if (!observer && document.documentElement) {
            observer = new MutationObserver(function () {
                if (!document.getElementById(STYLE_ID)) {
                    applyStyle();
                }

                if (enabled &&
                    !document.body.classList.contains('ft-theme-on')) {
                    document.body.classList.add('ft-theme-on');
                }

                if (!document.getElementById(ID)) {
                    installButton();
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }

        if (timer) clearInterval(timer);

        timer = setInterval(function () {
            if (!document.getElementById(ID)) {
                installButton();
            }
        }, 2000);

        console.log('[Filmix PRO+] Gold switch initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

    if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event && event.type === 'ready') {
                start();
            }
        });
    }
})();
