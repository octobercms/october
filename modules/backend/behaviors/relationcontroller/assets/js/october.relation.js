/*
 * Scripts for the Relation controller behavior.
 */
+function ($) { "use strict";

    var RelationBehavior = function() {

        this.clickManageListRecord = function(recordId, relationField, sessionKey) {
            var newPopup = $('<a />')

            newPopup.popup({
                handler: 'onRelationManageForm',
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

            oldPopup.popup('hide')

            newPopup.popup({
                handler: 'onRelationManagePivotForm',
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