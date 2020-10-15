/*
 * Scripts for the Reorder controller behavior.
 *
 * The following functions are observed:
 * - Simple sorting: Post back the original sort orders and the new ordered identifiers.
 * - Nested sorting: Post back source and target nodes IDs and the move positioning.
 */
+function ($) { "use strict";
    var ReorderBehavior = function() {

        this.sortMode = null
        this.context = 'default'

        this.simpleSortOrders = []

        this.initSorting = function (mode, context) {
            this.sortMode = mode
            this.context = context

            if (mode == 'simple') {
                this.initSortingSimple()
            }

            $('#reorderTreeList').on('move.oc.treelist', $.proxy(this.processReorder, this))
        }


        this.processReorder = function(ev, sortData){
            var postData

            if (this.sortMode == 'simple') {
                postData = { sort_orders: this.simpleSortOrders }
            }
            else if (this.sortMode == 'nested') {
                postData = this.getNestedMoveData(sortData)
            }

            var handler = this.context === 'relation' ? 'onReorderRelation' : 'onReorder'

            $('#reorderTreeList').request(handler, {
                data: postData
            })
        }

        this.getNestedMoveData = function (sortData) {
            var
                $el,
                $item = sortData.item,
                moveData = {
                    targetNode: 0,
                    sourceNode: $item.data('recordId'),
                    position: 'root'
                }

            if (($el = $item.next()) && $el.length) {
                moveData.position = 'before'
            }
            else if (($el = $item.prev()) && $el.length) {
                moveData.position = 'after'
            }
            else if (($el = $item.parents('li:first')) && $el.length) {
                moveData.position = 'child'
            }

            if ($el.length) {
                moveData.targetNode = $el.data('recordId')
            }

            return moveData
        }

        this.initSortingSimple = function () {
            var sortOrders = []

            $('#reorderTreeList li').each(function(){
                sortOrders.push($(this).data('recordSortOrder'))
            })

            this.simpleSortOrders = sortOrders
        }

    }

    $.oc.reorderBehavior = new ReorderBehavior;
}(window.jQuery);
