/*
 * Scripts for the Relation controller behavior.
 */
+function ($) { "use strict";

    var RelationBehavior = function() {

        this.toggleListCheckbox = function(el) {
            $(el).closest('.control-list').listWidget('toggleChecked', [el])
        }

        this.clickViewListRecord = function(recordId, relationId, sessionKey) {
            var newPopup = $('<a />'),
                $container = $('#'+relationId),
                requestData = paramToObj('data-request-data', $container.data('request-data'))

            newPopup.popup({
                handler: 'onRelationClickViewList',
                size: 'huge',
                extraData: $.extend({}, requestData, {
                    'manage_id': recordId,
                    '_session_key': sessionKey
                })
            })
        }

        this.clickManageListRecord = function(recordId, relationId, sessionKey) {
            var oldPopup = $('#relationManagePopup'),
                $container = $('#'+relationId),
                requestData = paramToObj('data-request-data', $container.data('request-data'))

            $.request('onRelationClickManageList', {
                data: $.extend({}, requestData, {
                    'record_id': recordId,
                    '_session_key': sessionKey
                })
            })

            oldPopup.popup('hide')
        }

        this.clickManagePivotListRecord = function(foreignId, relationId, sessionKey) {
            var oldPopup = $('#relationManagePivotPopup'),
                newPopup = $('<a />'),
                $container = $('#'+relationId),
                requestData = paramToObj('data-request-data', $container.data('request-data'))

            if (oldPopup.length) {
                oldPopup.popup('hide')
            }

            newPopup.popup({
                handler: 'onRelationClickManageListPivot',
                size: 'huge',
                extraData: $.extend({}, requestData, {
                    'foreign_id': foreignId,
                    '_session_key': sessionKey
                })
            })
        }

        /*
         * This function transfers the supplied variables as hidden form inputs,
         * to any popup that is spawned within the supplied container. The spawned 
         * popup must contain a form element.
         */
        this.bindToPopups = function(container, vars) {
            $(container).on('show.oc.popup', function(event, $trigger, $modal){
                var $form = $('form', $modal)
                $.each(vars, function(name, value){
                    $form.prepend($('<input />').attr({ type: 'hidden', name: name, value: value }))
                })
            })
        }

        function paramToObj(name, value) {
            if (value === undefined) value = ''
            if (typeof value == 'object') return value

            try {
                return JSON.parse(JSON.stringify(eval("({" + value + "})")))
            }
            catch (e) {
                throw new Error('Error parsing the '+name+' attribute value. '+e)
            }
        }

    }

    $.oc.relationBehavior = new RelationBehavior;
}(window.jQuery);