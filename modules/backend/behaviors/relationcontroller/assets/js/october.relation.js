/*
 * Scripts for the Relation controller behavior.
 */
+function ($) { "use strict";

    var RelationBehavior = function() {

        this.clickManageListRecord = function(relationField, recordId) {
            var newPopup = $('<a />')

            newPopup.popup({
                handler: 'onRelationManageForm',
                extraData: {
                    '_relation_field': relationField,
                    'manage_id': recordId
                }
            })
        }

        this.clickManagePivotListRecord = function(relationField, foreignId) {
            var oldPopup = $('#relationManagePivotPopup'),
                newPopup = $('<a />')

            oldPopup.popup('hide')

            newPopup.popup({
                handler: 'onRelationManagePivotForm',
                extraData: {
                    '_relation_field': relationField,
                    'foreign_id': foreignId
                }
            })
        }

    }

    $.oc.relationBehavior = new RelationBehavior;
}(window.jQuery);