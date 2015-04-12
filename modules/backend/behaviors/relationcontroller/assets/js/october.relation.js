/*
 * Scripts for the Relation controller behavior.
 */
+function ($) { "use strict";

    var RelationBehavior = function() {

        this.toggleListCheckbox = function(el) {
            $(el).closest('.control-list').listWidget('toggleChecked', [el])
        }

        this.clickViewListRecord = function(recordId, relationField, sessionKey) {
            var newPopup = $('<a />')

            newPopup.popup({
                handler: 'onRelationClickViewList',
                size: 'huge',
                extraData: {
                    'manage_id': recordId,
                    '_relation_field': relationField,
                    '_session_key': sessionKey
                }
            })
        }

        this.clickManageListRecord = function(recordId, relationField, sessionKey) {
            var oldPopup = $('#relationManagePopup')

            $.request('onRelationClickManageList', {
                data: {
                    'record_id': recordId,
                    '_relation_field': relationField,
                    '_session_key': sessionKey
                }
            })

            oldPopup.popup('hide')
        }

        this.clickManagePivotListRecord = function(foreignId, relationField, sessionKey) {
            var oldPopup = $('#relationManagePivotPopup'),
                newPopup = $('<a />')

            if (oldPopup.length) {
                oldPopup.popup('hide')
            }

            newPopup.popup({
                handler: 'onRelationClickManageListPivot',
                size: 'huge',
                extraData: {
                    'foreign_id': foreignId,
                    '_relation_field': relationField,
                    '_session_key': sessionKey
                }
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

    }

    $.oc.relationBehavior = new RelationBehavior;
}(window.jQuery);