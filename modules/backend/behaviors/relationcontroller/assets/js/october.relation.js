/*
 * Scripts for the Relation controller behavior.
 */
+function ($) { "use strict";

    class RelationBehavior extends oc.ControlBase
    {
        static instanceCounter = 0;

        init() {
            this.instanceNumber = ++this.constructor.instanceCounter;
        }

        connect() {
            this.listen('trigger:after-update', this.extendExternalToolbar);

            // External toolbar
            oc.pageReady().then(() => {
                this.initToolbarExtensionPoint();
                this.mountExternalToolbarEventBusEvents();
                this.extendExternalToolbar();
            });
        }

        disconnect() {
        }

        initToolbarExtensionPoint() {
            if (!this.config.externalToolbarAppState) {
                return;
            }

            const point = $.oc.vueUtils.getToolbarExtensionPoint(
                this.config.externalToolbarAppState,
                this.element
            );

            if (point) {
                this.toolbarExtensionPoint = point.state;
                this.externalToolbarEventBusObj = point.bus;
            }
        }

        mountExternalToolbarEventBusEvents() {
            if (!this.externalToolbarEventBusObj) {
                return;
            }

            this.externalToolbarEventBusObj.on('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
            this.externalToolbarEventBusObj.on('extendapptoolbar', this.proxy(this.extendExternalToolbar));
        }

        unmountExternalToolbarEventBusEvents() {
            if (!this.externalToolbarEventBusObj) {
                return;
            }

            this.externalToolbarEventBusObj.off('toolbarcmd', this.proxy(this.onToolbarExternalCommand));
            this.externalToolbarEventBusObj.off('extendapptoolbar', this.proxy(this.extendExternalToolbar));
        }

        onToolbarExternalCommand(ev) {
            var $el = $(this.element);
            var cmdPrefix = 'relationcontroller-toolbar-' + this.instanceNumber + '-';

            if (ev.command.substring(0, cmdPrefix.length) != cmdPrefix) {
                return;
            }

            var buttonClassName = ev.command.substring(cmdPrefix.length),
                $toolbar = $el.find('.relation-toolbar .control-toolbar'),
                $button = $toolbar.find('[class="'+buttonClassName+'"]');

            $button.get(0).click(ev.ev);
        }

        extendExternalToolbar() {
            var $el = $(this.element);
            if (!$el.is(":visible") || !this.toolbarExtensionPoint) {
                return;
            }

            this.toolbarExtensionPoint.splice(0, this.toolbarExtensionPoint.length);

            this.toolbarExtensionPoint.push({
                type: 'separator'
            });

            var $buttons = $el.find('.relation-toolbar .control-toolbar .btn');

            $buttons.each((index, button) => {
                var $button = $(button),
                    $icon = $button.find('i[class^=icon]');

                this.toolbarExtensionPoint.push(
                    {
                        type: 'button',
                        icon: $icon.attr('class'),
                        label: $button.text(),
                        command: 'relationcontroller-toolbar-' + this.instanceNumber + '-' + $button.attr('class'),
                        disabled: $button.attr('disabled') !== undefined
                    }
                );
            });
        }

        static toggleListCheckbox(el) {
            $(el).closest('.control-list').listWidget('toggleChecked', [el]);
        }

        static clickViewListRecord(target, recordId, relationId, sessionKey) {
            var newPopup = $(target),
                $container = $('#'+relationId),
                requestData = paramToObj('data-request-data', $container.data('request-data'));

            newPopup.popup({
                handler: 'onRelationClickViewList',
                extraData: $.extend({}, requestData, {
                    'manage_id': recordId,
                    '_relation_session_key': sessionKey
                })
            });
        }

        static clickViewPivotListRecord(target, recordId, relationId, sessionKey) {
            var newPopup = $(target),
                $container = $('#'+relationId),
                requestData = paramToObj('data-request-data', $container.data('request-data'));

            newPopup.popup({
                handler: 'onRelationClickViewListPivot',
                extraData: $.extend({}, requestData, {
                    'pivot_id': recordId,
                    '_relation_session_key': sessionKey
                })
            });
        }

        static clickManageListRecord(target, recordId, relationId, sessionKey) {
            var oldPopup = $('#relationManagePopup'),
                $container = $('#'+relationId),
                requestData = paramToObj('data-request-data', $container.data('request-data'));

            $(target).request('onRelationClickManageList', {
                data: $.extend({}, requestData, {
                    'record_id': recordId,
                    '_relation_session_key': sessionKey
                })
            })
            .done(() => {
                if (requestData['_relation_field']) {
                    this.changed(requestData['_relation_field'], 'added');
                }
            });

            oldPopup.popup('hide');
        }

        static clickManagePivotListRecord(target, foreignId, relationId, sessionKey) {
            var oldPopup = $('#relationManagePivotPopup'),
                newPopup = $(target),
                $container = $('#'+relationId),
                requestData = paramToObj('data-request-data', $container.data('request-data'));

            if (oldPopup.length) {
                oldPopup.popup('hide');
            }

            newPopup.popup({
                handler: 'onRelationClickManageListPivot',
                extraData: $.extend({}, requestData, {
                    'foreign_id': foreignId,
                    '_relation_session_key': sessionKey
                })
            });
        }

        // This function is called every time a record is created, added, removed
        // or deleted using the relation widget. It triggers the change.oc.formwidget
        // event to notify other elements on the page about the changed form state.
        static changed(relationId, event) {
            $('[data-field-name="' + relationId + '"]').trigger('change.oc.formwidget', { event: event });
        }

        // @deprecated use oc.popup.bindToPopups
        static bindToPopups(container, vars) {
            return oc.popup.bindToPopups(container, vars);
        }
    }

    function paramToObj(name, value) {
        if (value === undefined) value = ''
        if (typeof value == 'object') return value

        try {
            return oc.parseJSON("{" + value + "}")
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e)
        }
    }

    oc.registerControl('relation-controller', RelationBehavior);

    oc.relationBehavior = RelationBehavior;

    // @deprecated
    $.oc.relationBehavior = RelationBehavior;

}(window.jQuery);
