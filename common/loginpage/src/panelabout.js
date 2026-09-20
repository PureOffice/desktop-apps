/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/*
    'about' panel
    controller + view
*/

+function(){ 'use strict'
    var ControllerAbout = function(args={}) {
        args.caption = 'About panel';
        this.action = "about";
    };

    ControllerAbout.prototype = Object.create(baseController.prototype);
    ControllerAbout.prototype.constructor = ControllerAbout;

    var ViewAbout = function(args) {
        var _lang = utils.Lang;

        args.tplPage = `<div class="action-panel ${args.action}"></div>`;
        args.itemcls = 'bottom extra';
        args.menu = '.main-column.tool-menu';
        args.field = '.main-column.col-center';
        // args.itemindex = 3;
        args.itemtext = _lang.actAbout;
        args.tplItem = 'nomenuitem';

        baseView.prototype.constructor.call(this, args);
    };

    const version = function(commercial) {
        return commercial === true ? utils.Lang.strVersionCommercial : utils.Lang.strVersionCommunity;
    };

    ViewAbout.prototype = Object.create(baseView.prototype);
    ViewAbout.prototype.constructor = ViewAbout;
    ViewAbout.prototype.paneltemplate = function(args) {
        var _opts = args.opts;
        !!_opts.active && (_opts.edition = !!_opts.edition ? _opts.edition + ' ' + _opts.active : _opts.active);
        _opts.edition = !!_opts.edition ? `<div id="idx-ver-edition" class="about-field">${_opts.edition}</div>` : '';
        const strVersion = version(args.opts.commercial);

        let _ext_ver = '';
        if ( !!_opts.arch ) _ext_ver += _opts.arch;
        if ( !!_opts.pkg ) _ext_ver += ` ${_opts.pkg}`;
        if ( !!_ext_ver ) _opts.version += ` (${_ext_ver.trim()})`;

        var _lang = utils.Lang;
        const _updates_status = `<section id="idx-update-cnt">
                                    <div class="status-field hbox">
                                        <svg class="icon" id="idx-update-status-icon">
                                            <use href=""></use>
                                        </svg>
                                        <label id="idx-update-status-text"></label>
                                    </div>
                                    <div class="status-field">
                                        <button id="idx-update-btnaction" class="btn btn--landing btn-update-action"></button>
                                    </div>
                                </section>`;
        let _html = `<div class="flexbox">
                        <div class="box-ver">
                            <section class="hbox">
                                <!-- [OHOS: about-brand] 官方 logo 图示隐藏（图示内含超大
                                     ONLYOFFICE 字样，主品牌为 Pure Office）；appname 写死
                                     （事件 opts.appname 同值双保险）；版本行去「商业版/社区版」
                                     前缀 label（本壳为 AGPL 社区构建，label 不成立） -->
                                <div id="idx-about-cut-logo" class="${_opts.logocls}" style="display:none">
                                    <svg class="ver-logo">
                                        <use id="idx-ver-logo--light" href="#idx-logo-light" />
                                        <use id="idx-ver-logo--dark" href="#idx-logo-dark" />
                                    </svg>
                                </div>
                                <div class="vbox">
                                    <p id="idx-about-appname">Pure Office</p>
                                    <p id="idx-about-version">${_opts.version}</p>
                                </div>
                            </section><p></p>
                            <div class="separator"></div>
                            ${_updates_status}
                            <div class="box-copyright">
                                <div id='id-features-available' l10n>${_lang.aboutProFeaturesAvailable}</div>
                                ${_opts.edition}
                                <a class="ver-checkupdate link hidden" draggable='false' data-state='check' href="#" l10n>${_lang.checkUpdates}</a>
                                <div class="about-field"><a class="ver-changelog link" draggable='false' target="popup" href=${_opts.changelog} l10n>${_lang.aboutChangelog}</a></div>
                                <!-- [OHOS: about-brand] 官网行删除（面板不留两处 AGPL 文案）；
                                     版权行 = 归属声明（AGPL-3.0 即许可全文入口）+ 源码/声明行
                                     （AGPL §6 对应源码可得），点击 lic-open 弹层渲染全文
                                     （ArkWeb 无多窗口语义，绑定见 _on_native_message 建 view 后） -->
                                <div class="ver-copyright about-field">基于 ONLYOFFICE DesktopEditors（<a class="link lic-open" href="/onlyoffice/licenses/LICENSE.txt">AGPL-3.0</a>）</div>
                                <div class="ver-copyright about-field">完整源码与第三方声明见&nbsp;<a class="link lic-open" href="/onlyoffice/licenses/NOTICE.txt">NOTICE</a></div>
                            </div>
                        </div>`+
                        // '<div class="box-license flex-fill">'+
                        //   '<iframe id="framelicense" src="license.htm"></iframe>'+
                        // '</div>'+
                    '</div>';

        if (window.utils.inParams.osver == 'winxp' || /windows nt 5/i.test(navigator.appVersion)) {
            _html = _html.replace(' href=', ' xlink:href=');
        }

        return _html;
    };

    window.ControllerAbout = ControllerAbout;

    utils.fn.extend(ControllerAbout.prototype, (function() {
        let features = undefined;
        let action = null;

        let _on_features_avalable = function (params) {
            if ( !!this.view ) {
                let _label = $('#id-features-available', this.view.$body);
                if ( _label )
                    if ( !!params )
                        _label.show();
                    else _label.hide();
            }

            if ( !Array.isArray(params) ) params = [];
            sdk.execCommand('extra:features', JSON.stringify({available:params}));
        };

        const _on_native_message = function(cmd, param) {
            if (/app\:version/.test(cmd)) {
                let args = {action: this.action};
                try {
                    args.opts = JSON.parse( $('<div>').html(param).text() );
                } catch (e) {
                    delete args.opts;
                }

                if (args.opts) {
                    !args.opts.site && (args.opts.site = utils.skipUrlProtocol(args.opts.link));
                }

                if (!this.view) {
                    this.view = new ViewAbout(args);
                    this.view.args = args;
                    this.view.$menuitem && this.view.$menuitem.removeClass('extra');
                    this.view.$body = $(this.view.paneltemplate(args));
                    this.view.$dialog = new AboutDialog();
                    // [OHOS: lic-dialog] 归属/源码行的许可全文弹层绑定（ArkWeb 无
                    // 多窗口，target=_blank 会被静默丢弃——原 ascshim 55_lic 注入段
                    // 的全局捕获拦截收敛为面板内精准触发；弹层实现见文件尾）
                    this.view.$body.on('click', 'a.lic-open', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var href = $(this).attr('href');
                        window.__ohosShowLicDialog(href,
                            /\/NOTICE\.txt$/i.test(href) ? '第三方声明与源码获取' : '许可证文本');
                        return false;
                    });
                } else {
                    if ( !!args.opts && !!args.opts.edition ) {
                        $('#idx-ver-edition', this.view.$body).html(args.opts.edition);
                    }
                }

                // const $label = this.view.$panel.find('.ver-checkupdate');
                // $label.on('click', (e) => {
                //     if ( performance.now() - last_click_time < 1000 ) return;
                //     last_click_time = performance.now();

                //     window.sdk.execCommand('update', $label.data('state'));
                // });
                // $label[this.updates===true?'show':'hide']();
                if ( args.opts ) {
                    this.view.$body.find('.ver-changelog')[!!args.opts.changelog?'show':'hide']();
                }

                if ( !!features && features.length )
                    _on_features_avalable.call(this, features);
            } else
            if (/^updates:turn/.test(cmd)) {
                this.updates = param == 'on';

                if ( this.view ) {
                    // this.view.$panel.find('.ver-checkupdate')[this.updates?'show':'hide']();
                    this.view.$body.find('#idx-update-cnt')[this.updates?'show':'hide']();

                    if ( this.updates ) {
                        $('body').on('click', '.btn-update-action', e=>{
                            sdk.execCommand('updates:action', action);
                        });
                    }
                }
            } else
            if (/^updates:checking/.test(cmd)) {
                // const $label = this.view.$panel.find('.ver-checkupdate');
                // const opts = JSON.parse(param);
                // if ( opts.version == 'no' ) {
                //     $label.text(utils.Lang.updateNoUpdates);
                // } else {
                //     $label.text(utils.Lang.updateAvialable.replace('$1', opts.version));
                //     $label.data('state', 'download');
                // }
                // $label.show();
            } else
            if (/updates:download/.test(cmd)) {
                // const opts = JSON.parse(param);
                // const $label = this.view.$panel.find('.ver-checkupdate');

                // if ( opts.progress == 'done' ) {
                //     $label.text(utils.Lang.updateDownloadFinished);
                //     $label.data('state', 'install');
                // } else
                // if ( opts.progress == 'aborted' ) {
                //     $label.text(utils.Lang.updateDownloadCanceled);
                // } else {
                //     $label.text(utils.Lang.updateDownloadProgress.replace('$1', opts.progress));
                //     $label.data('state', 'abort');
                // }
            } else
            if (/updates:link/.test(cmd)) {
                // const $label = this.view.$panel.find('.ver-checkupdate');
                // let opts = {};
                // if ( param == 'lock' || param == 'unlock' )
                //     opts.disabled = param == 'lock';
                // else opts = JSON.parse(param);

                // if ( opts.disabled != undefined ) {
                    // $label.attr('disabled', opts.disabled ? 'disabled' : false);
                // }
            } else
            if (/updates:status/.test(cmd)) {
                on_updates_info.call(this, JSON.parse(param))
            }
        };

        const on_updates_info = function(info) {
                if ( info.text ) {
                    $('#idx-update-status-text', this.view.$body).text(info.text);
                }

                if ( info.icon ) {
                    const $icon = $('#idx-update-status-icon', this.view.$body);

                    let icon_id;
                    switch (info.icon) {
                    case 'error': icon_id = 'error'; break;
                    case 'load': icon_id = 'load'; break;
                    case 'lastcheck': icon_id = 'lastcheck'; break;
                    default: icon_id = 'success'; break;
                    }

                    $icon.attr('data-icon', icon_id);
                    $('use', $icon).attr('href', `#${icon_id}`)
                }

                if ( info.button ) {
                    const $button = $('#idx-update-btnaction', this.view.$body);
                    if ( info.button.text ) {
                        $button.text(info.button.text);
                        action = info.button.action;
                    }

                    if ( info.button.lock ) {
                        $button.disable(info.button.lock=='true');
                    }

                    if ( info.button == 'lock' ) {
                        $button.disable(true);
                    } else
                    if ( info.button == 'unlock' ) {
                        $button.disable(false);
                    }

                }
        }

        const onPanelShow = function(panel) {
            if (panel === this.action) {
                this.view.$dialog.show();
                this.view.$dialog.setBody(this.view.$body);
            }
        }

        return {
            init: function() {
                baseController.prototype.init.apply(this, arguments);

                window.sdk.on('on_native_message', _on_native_message.bind(this));

                if ( utils.brandCheck('onfeaturesavailable') ) {
                    features = sdk.GetLocalFeatures();
                    if ( !!features && features.length )
                        _on_features_avalable.call(this, features);

                    sdk.on('onfeaturesavailable', _on_features_avalable.bind(this));
                } else sdk.GetLocalFeatures = e => false;

                CommonEvents.on('panel:show', onPanelShow.bind(this));
                CommonEvents.on('lang:changed', () => {
                    if (this.view) {
                        this.view.$dialog.titleText = utils.Lang.actAbout;
                        $('#idx-about-version span', this.view.$body).text(version(this.view.args.opts.commercial));
                    }
                });

                // [OHOS: about] 本壳无官方 C++ 壳注入 app:version——官方桌面壳经
                // on_native_message 事件注入版本信息，这是「关于」侧栏项（默认
                // hidden）显示与 About 视图创建的唯一通道。页面自治补位：init 时
                // 两处订阅（本控制器与 panels.js 的侧栏显示）必然已就位，fetch
                // 构建产物 version.json（ver=产品版本，构建期 PRODUCT_VERSION）
                // 后单次 fire 官方事件即可——消费链全部官方原样。品牌字段对齐
                // 构建链 patch_about_brand：不提供 link/site（官网行已 patch 为
                // 许可链接）与 rights（版权行 patch 为 CREDIT 归属行）。
                (function (_self) {
                    var _fire = function (ver) {
                        var opts = {
                            appname: 'Pure Office',
                            version: (ver ? '版本 ' + ver : ''),
                            commercial: false,
                            active: false,
                            changelog: false
                        };
                        try {
                            window.sdk.fire('on_native_message', ['app:version', JSON.stringify(opts)]);
                        } catch (e) {
                            console.log('OHOS about fire error: ' + e);
                        }
                    };
                    try {
                        fetch('version.json')
                            .then(function (r) { return r.json(); })
                            .then(function (j) { _fire(j && j.ver ? String(j.ver) : ''); })
                            .catch(function () { _fire(''); });
                    } catch (e2) {
                        _fire('');
                    }
                })(this);

                return this;
            },
            onfeaturesavailable: _on_features_avalable
        }
    })());
}();

/*
*   controller definition
*/

// [OHOS: lic-dialog] 许可/声明全文弹层（原 ascshim 55_lic 注入段源码化收敛到
// 本域）：全屏遮罩 + iframe srcdoc 渲染本地文本；点遮罩框外关闭；打开时关掉
// 其下的官方 dialog（遮罩全屏覆盖，叠着面板无意义）。
window.__ohosShowLicDialog = function (href, titleText) {
    var mask = window.__ohosLicMask;
    if (!mask) {
        mask = window.__ohosLicMask = document.createElement('div');
        mask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100001;display:none;';
        var box = document.createElement('div');
        box.style.cssText = 'position:absolute;width:84%;height:84%;left:8%;top:8%;' +
            'background:#fff;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;' +
            'box-shadow:0 6px 30px rgba(0,0,0,.3);';
        var bar = document.createElement('div');
        bar.style.cssText = 'height:44px;background:#f2f2f2;flex:none;display:flex;' +
            'align-items:center;justify-content:space-between;padding:0 14px;';
        var title = document.createElement('span');
        title.style.cssText = 'color:#444;font-size:14px;';
        var close = document.createElement('button');
        close.textContent = '✕ 关闭';
        close.style.cssText = 'border:none;background:transparent;color:#444;font-size:16px;' +
            'cursor:pointer;padding:4px 8px;';
        close.onclick = function () { mask.style.display = 'none'; };
        bar.appendChild(title);
        bar.appendChild(close);
        var frame = document.createElement('iframe');
        frame.style.cssText = 'flex:1;border:none;width:100%;background:#fff;';
        box.appendChild(bar);
        box.appendChild(frame);
        mask.appendChild(box);
        mask.__title = title;
        mask.__frame = frame;
        mask.addEventListener('click', function (e) {
            if (e.target === mask) { mask.style.display = 'none'; }
        });
        document.body.appendChild(mask);
    }
    try {
        document.querySelectorAll('dialog.dlg').forEach(function (d) {
            if (typeof d.close === 'function') { d.close(); }
        });
    } catch (e) {}
    mask.__title.textContent = titleText;
    mask.__frame.srcdoc = '<pre style="white-space:pre-wrap;padding:20px 24px;font:12px/1.6 monospace;color:#333;">加载中…</pre>';
    mask.style.display = 'block';
    fetch(href)
        .then(function (r) { return r.text(); })
        .then(function (txt) {
            var esc = String(txt).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            mask.__frame.srcdoc = '<pre style="white-space:pre-wrap;padding:20px 24px;' +
                'font:12px/1.6 monospace;color:#333;">' + esc + '</pre>';
        })
        .catch(function () {
            mask.__frame.srcdoc = '<pre style="padding:20px 24px;color:#c00;">加载失败：' + href + '</pre>';
        });
};

// window.CommonEvents.on('main:ready', function(){
//     var p = new ControllerAbout({});
//     p.init();
// });
