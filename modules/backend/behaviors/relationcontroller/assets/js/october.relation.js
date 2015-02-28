/*
 * Scripts for the Relation controller behavior.
 */
+function ($) { "use strict";

    var RelationBehavior = function() {

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

    }

    $.oc.relationBehavior = new RelationBehavior;
}(window.jQuery);