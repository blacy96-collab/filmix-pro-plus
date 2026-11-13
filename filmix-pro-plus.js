
(function () {
'use strict';
var VERSION='1.1.0', STYLE_ID='filmix-pro-plus-css', BUTTON_ID='filmix-pro-plus-button';
var STORAGE_KEY='filmix_pro_plus_theme_enabled', CLASS_NAME='filmix-pro-plus-theme';
if(window.__FILMIX_PRO_PLUS_STARTED__) return;
window.__FILMIX_PRO_PLUS_STARTED__=true;

var enabled=true, observer=null, initialized=false, errors=[];
var filmixNetwork=null, filmixPollTimer=null, filmixAuthBusy=false, filmixAuthBody=null;
var FILMIX_API='http://filmixapp.cyou/api/v2/';
var FILMIX_DEVICE='?user_dev_apk=1.1.3&user_dev_id='+
 (window.Lampa&&Lampa.Utils&&Lampa.Utils.uid?Lampa.Utils.uid(16):'filmixproplus')+
 '&user_dev_name=Xiaomi&user_dev_os=11&user_dev_vendor=Xiaomi&user_dev_token=';

var css=`
:root{--fp-bg:#090c11;--fp-panel:#171d25;--fp-gold:#d7b56d;--fp-gold-light:#f5dfaa;--fp-text:#f4f1e9}
body.${CLASS_NAME}{background:var(--fp-bg)!important;color:var(--fp-text)!important}
body.${CLASS_NAME} .head,body.${CLASS_NAME} .head__body{background:rgba(9,12,17,.97)!important}
body.${CLASS_NAME} .head__title,body.${CLASS_NAME} .menu__title,body.${CLASS_NAME} .category__title,body.${CLASS_NAME} .full-start__title,body.${CLASS_NAME} .full-start-new__title{color:var(--fp-gold-light)!important}
body.${CLASS_NAME} .items-line__head{border-bottom:1px solid rgba(215,181,109,.35)!important}
body.${CLASS_NAME} .card__view{border-radius:10px!important;overflow:hidden!important}
body.${CLASS_NAME} .card.focus .card__view,body.${CLASS_NAME} .card.traverse .card__view{outline:2px solid var(--fp-gold)!important;outline-offset:2px!important;box-shadow:0 0 18px rgba(215,181,109,.3)!important}
body.${CLASS_NAME} .card__title{color:var(--fp-text)!important}
body.${CLASS_NAME} .menu{background:var(--fp-panel)!important}
body.${CLASS_NAME} .menu__item.focus,body.${CLASS_NAME} .selector.focus,body.${CLASS_NAME} .full-start__button.focus,body.${CLASS_NAME} .full-start-new__button.focus{background:var(--fp-gold)!important;color:#17130b!important;border-color:var(--fp-gold-light)!important}
body.${CLASS_NAME} .modal__content,body.${CLASS_NAME} .selectbox,body.${CLASS_NAME} .settings{background:var(--fp-panel)!important;color:var(--fp-text)!important}
#${BUTTON_ID}{display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:19px!important;height:19px!important;min-width:19px!important;min-height:19px!important;max-width:19px!important;max-height:19px!important;flex:0 0 19px!important;padding:0!important;margin:0 4px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.12)!important;background:#202127!important;color:#e7c77f!important;box-shadow:none!important;overflow:hidden!important;transform:none!important}
#${BUTTON_ID} svg{display:block!important;width:10px!important;height:10px!important;min-width:10px!important;min-height:10px!important;max-width:10px!important;max-height:10px!important;flex:0 0 10px!important;margin:0!important;padding:0!important;fill:currentColor!important}
#${BUTTON_ID}.off{color:#9299a2!important;background:#202127!important;border-color:rgba(255,255,255,.12)!important}
#${BUTTON_ID}:focus{outline:1px solid var(--fp-gold)!important;outline-offset:1px!important}
@media(max-width:700px){body.${CLASS_NAME} .card__view{border-radius:7px!important}}
`;

function log(message,error){console.log('[Filmix PRO+ '+VERSION+'] '+message);if(error){errors.push({message:message,error:String(error.message||error)});console.error('[Filmix PRO+]',error);}}
function notify(message){try{if(window.Lampa&&Lampa.Noty&&Lampa.Noty.show)Lampa.Noty.show(message);}catch(e){log('Ошибка уведомления',e);}}
function readSetting(){try{if(window.Lampa&&Lampa.Storage&&Lampa.Storage.get)return Lampa.Storage.get(STORAGE_KEY,true)!==false;}catch(e){log('Ошибка чтения настройки',e);}try{return localStorage.getItem(STORAGE_KEY)!=='false';}catch(e){return true;}}
function saveSetting(){try{if(window.Lampa&&Lampa.Storage&&Lampa.Storage.set)Lampa.Storage.set(STORAGE_KEY,enabled);}catch(e){log('Ошибка сохранения настройки',e);}try{localStorage.setItem(STORAGE_KEY,enabled?'true':'false');}catch(e){}}
function installStyle(){if(!document.head||!document.body)return;var s=document.getElementById(STYLE_ID);if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s);}if(s.textContent!==css)s.textContent=css;document.body.classList.toggle(CLASS_NAME,enabled);}
function updateButton(){var b=document.getElementById(BUTTON_ID);if(!b)return;b.classList.toggle('off',!enabled);b.setAttribute('aria-label',enabled?'Выключить оформление':'Включить оформление');b.setAttribute('title',enabled?'Filmix PRO+ — тема включена':'Filmix PRO+ — тема выключена');}
function toggleTheme(){enabled=!enabled;saveSetting();installStyle();updateButton();notify(enabled?'Filmix PRO+: оформление включено':'Filmix PRO+: оформление выключено');}
function findHeader(){return document.querySelector('.head__actions, .head__actions-list, .head__right');}
function installButton(){var h=findHeader();if(!h)return false;var b=document.getElementById(BUTTON_ID);if(b&&b.isConnected){if(h.contains(b))return true;b.remove();}b=document.createElement('button');b.id=BUTTON_ID;b.type='button';b.className='selector filmix-pro-plus-button';b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.5 6.2L21 10l-6.5 2.1L12 18l-2.5-5.9L3 10l6.5-1.8z"/></svg>';b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleTheme();});var more=h.querySelector('.head__action--more,[data-action="more"],.head__action--menu');if(more)h.insertBefore(b,more);else h.appendChild(b);updateButton();return true;}
function refresh(){installStyle();installButton();}
function startObserver(){if(observer||!window.MutationObserver||!document.documentElement)return;observer=new MutationObserver(function(){var sm=!document.getElementById(STYLE_ID),bm=!document.getElementById(BUTTON_ID),cm=document.body&&document.body.classList.contains(CLASS_NAME)!==enabled;if(sm||bm||cm)refresh();});observer.observe(document.documentElement,{childList:true,subtree:true});}

function filmixRequest(){if(!filmixNetwork&&window.Lampa&&Lampa.Reguest)filmixNetwork=new Lampa.Reguest();return filmixNetwork;}
function filmixStatusText(s){if(!s||!s.login)return 'Устройство не авторизовано';if(s.is_pro_plus)return s.login+' — PRO+ до '+(s.pro_date||'не указано');if(s.is_pro)return s.login+' — PRO до '+(s.pro_date||'не указано');return s.login+' — аккаунт без PRO';}
function filmixRenderStatus(body){if(!body||!body.length)return;body.find('[data-name="filmix-pro-plus-status"]').remove();var s=Lampa.Storage.get('filmix_status',{});var row=$('<div class="settings-param" data-name="filmix-pro-plus-status" data-static="true"><div class="settings-param__name">Статус аккаунта</div><div class="settings-param__value"></div></div>');row.find('.settings-param__value').text(filmixStatusText(s));var anchor=body.find('[data-name="filmix-pro-plus-device"]');if(anchor.length)anchor.after(row);else body.append(row);}
function filmixCheckProfile(token,callback,silent){var req=filmixRequest();if(!req){if(!silent)notify('Filmix: сетевой модуль Lampa недоступен');return;}req.clear();req.timeout(10000);req.silent(FILMIX_API+'user_profile'+FILMIX_DEVICE+token,function(json){if(json&&json.user_data){Lampa.Storage.set('filmix_status',json.user_data);if(typeof callback==='function')callback(json.user_data);}else Lampa.Storage.set('filmix_status',{});if(filmixAuthBody)filmixRenderStatus(filmixAuthBody);},function(a,c){if(!silent)notify(req.errorDecode(a,c));});}
function filmixStopPolling(){if(filmixPollTimer){clearInterval(filmixPollTimer);filmixPollTimer=null;}filmixAuthBusy=false;}
function filmixOpenDeviceAuth(body){
 if(filmixAuthBusy)return;filmixAuthBusy=true;filmixAuthBody=body;var req=filmixRequest();
 if(!req){filmixAuthBusy=false;notify('Filmix: сетевой модуль Lampa недоступен');return;}
 var userCode='',userToken='',completed=false;
 var modal=$('<div><div class="broadcast__text">Открой страницу <b>https://filmix.ac/consoles</b> в своём авторизованном аккаунте Filmix и введи показанный ниже код.</div><div class="broadcast__device selector" style="text-align:center;font-size:1.5em;padding:1em 0">Получаем код…</div><div style="text-align:center;opacity:.75">Нажми OK на коде, чтобы скопировать его</div></div>');
 function closeModal(){filmixStopPolling();if(window.Lampa&&Lampa.Modal)Lampa.Modal.close();}
 Lampa.Modal.open({title:'Подключение Filmix',html:modal,onBack:function(){closeModal();Lampa.Controller.toggle('settings_component');},onSelect:function(){if(!userCode)return;Lampa.Utils.copyTextToClipboard(userCode,function(){notify('Код скопирован');},function(){notify('Не удалось скопировать код');});}});
 req.clear();req.timeout(10000);req.quiet(FILMIX_API+'token_request'+FILMIX_DEVICE,function(result){
  if(!result||result.status!=='ok'||!result.code||!result.user_code){closeModal();notify('Filmix не выдал код привязки. Попробуй позже.');return;}
  userToken=result.code;userCode=result.user_code;modal.find('.broadcast__device').text(userCode);
  filmixPollTimer=setInterval(function(){if(completed||!userToken)return;filmixCheckProfile(userToken,function(profile){if(completed||!profile)return;completed=true;closeModal();Lampa.Storage.set('filmix_token',userToken);Lampa.Storage.set('filmix_status',profile);filmixRenderStatus(body);notify('Filmix успешно подключён: '+filmixStatusText(profile));Lampa.Controller.toggle('settings_component');},true);},10000);
 },function(a,c){closeModal();notify(req.errorDecode(a,c));});
}
function filmixAddSettings(){
 if(!window.Lampa||!Lampa.Settings||!Lampa.Settings.main)return;var main=Lampa.Settings.main();
 if(!main||!main.render||main.render().find('[data-component="filmix-pro-plus-auth"]').length)return;
 var folder=$('<div class="settings-folder selector" data-component="filmix-pro-plus-auth"><div class="settings-folder__icon"><svg height="57" viewBox="0 0 58 57" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20.37V45h6.83V34.13h9.9v-7.15h-9.9v-2.59c0-2.8 2.08-4.56 4.36-4.56H39V13H26.83C23.66 13 20 15.49 20 20.37Z" fill="white"/><rect x="2" y="2" width="54" height="53" rx="5" stroke="white" stroke-width="4"/></svg></div><div class="settings-folder__name">Filmix PRO+ — авторизация</div></div>');
 var more=main.render().find('[data-component="more"]');if(more.length)more.after(folder);else main.render().append(folder);if(main.update)main.update();
}
function filmixBindSettings(){
 if(!window.Lampa||!Lampa.Settings||!Lampa.Settings.listener)return;
 Lampa.Settings.listener.follow('open',function(e){
  if(e.name!=='filmix-pro-plus-auth'||!e.body)return;filmixAuthBody=e.body;
  if(!e.body.find('[data-name="filmix-pro-plus-device"]').length)e.body.append('<div class="settings-param selector" data-name="filmix-pro-plus-device" data-static="true"><div class="settings-param__name">Привязать устройство Filmix</div><div class="settings-param__value">Получить код для входа</div></div>');
  e.body.find('[data-name="filmix-pro-plus-device"]').off('hover:enter.filmixproplus').on('hover:enter.filmixproplus',function(){filmixOpenDeviceAuth(e.body);});
  filmixRenderStatus(e.body);var token=Lampa.Storage.get('filmix_token','');if(token)filmixCheckProfile(token,null,true);
 });
}
function filmixInitializeAuth(){
 if(!window.Lampa||!Lampa.Settings||!Lampa.Storage||!Lampa.Reguest)return;
 try{if(Lampa.Params&&Lampa.Params.select)Lampa.Params.select('filmix_token','','');}catch(e){log('Не удалось зарегистрировать параметр Filmix',e);}
 filmixAddSettings();filmixBindSettings();
 if(Lampa.Listener&&Lampa.Listener.follow)Lampa.Listener.follow('app',function(e){if(e.type==='ready')filmixAddSettings();});
 log('Авторизация Filmix подключена к настройкам');
}

function runChecks(){var checks={Lampa:!!window.Lampa,appready:!!window.appready,Storage:!!(window.Lampa&&Lampa.Storage&&Lampa.Storage.get&&Lampa.Storage.set),Noty:!!(window.Lampa&&Lampa.Noty&&Lampa.Noty.show),Settings:!!(window.Lampa&&Lampa.Settings&&Lampa.Settings.main),header:!!findHeader(),style:!!document.getElementById(STYLE_ID),button:!!document.getElementById(BUTTON_ID)};window.filmix_pro_plus_status={version:VERSION,checks:checks,errors:errors};Object.keys(checks).forEach(function(k){log(k+': '+(checks[k]?'OK':'не найдено'));});}
function initialize(){if(initialized||!window.Lampa||!document.body)return;initialized=true;enabled=readSetting();refresh();startObserver();filmixInitializeAuth();window.filmix_pro_plus={version:VERSION,toggle:toggleTheme,refresh:refresh,status:function(){runChecks();return window.filmix_pro_plus_status;}};runChecks();log('Плагин инициализирован');}
function bootstrap(){var attempts=0,timer=setInterval(function(){attempts++;if(window.Lampa&&window.appready&&document.body){clearInterval(timer);initialize();}else if(attempts>=100){clearInterval(timer);log('Тайм-аут ожидания готовности Lampa');window.filmix_pro_plus_status={version:VERSION,initialized:false,error:'Lampa не стала готова за 30 секунд'};}},300);}
log('Скрипт загружен');bootstrap();
})();
