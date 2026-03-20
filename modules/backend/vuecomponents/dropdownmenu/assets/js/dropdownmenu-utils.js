class DropdownmenuUtils {
    alignToTriggerElement(triggerElementOrEvent, positionContainer, isSubmenu, preferablePosition) {
        var calculatedLeft = 0,
            calculatedTop = 0,
            $positionContainer = $(positionContainer),
            containerOffsetParentOffset = $positionContainer.offsetParent().offset();

        if (triggerElementOrEvent.pageX !== undefined && triggerElementOrEvent.pageY !== undefined) {
            calculatedLeft = triggerElementOrEvent.pageX - containerOffsetParentOffset.left;
            calculatedTop = triggerElementOrEvent.pageY - containerOffsetParentOffset.top;
        }
        else {
            // Here we calculate the position of the menu element
            // relative to its offset parent, using the coordinates
            // of the trigger element relative to the document.
            //
            var $triggerElement = $(triggerElementOrEvent),
                $triggerOffset = $triggerElement.offset(),
                calculatedLeft = $triggerOffset.left - containerOffsetParentOffset.left,
                calculatedTop =
                    $triggerOffset.top - containerOffsetParentOffset.top + $triggerElement.outerHeight();

            if (isSubmenu) {
                calculatedLeft += $triggerElement.width();
                calculatedTop -= $triggerElement.height();
            }
            else if (preferablePosition === 'right') {
                calculatedLeft += $triggerElement.outerWidth() + 12;
                calculatedTop -= $triggerElement.outerHeight();
            }
            else if (preferablePosition === 'bottom-right') {
                calculatedLeft -= $positionContainer.outerWidth() - $triggerElement.outerWidth();
            }
        }

        // Adjust the position if the menu is close to the
        // right edge of the page.
        //
        var containerWidth = $positionContainer.width(),
            documentWidth = $(document.body).width(),
            calculatedLeftInDocCoords = calculatedLeft + containerOffsetParentOffset.left;

        if (calculatedLeftInDocCoords + containerWidth + 15 >= documentWidth) {
            var offset = calculatedLeftInDocCoords + containerWidth - documentWidth + 15;

            calculatedLeft -= offset;
        }

        // Adjust the bottom edge if the menu is close
        // to the bottom of the page
        //
        var containerHeight = $positionContainer.height(),
            documentHeight = $(document).height(),
            calculatedTopInDocCoords = calculatedTop + containerOffsetParentOffset.top;

        if (calculatedTopInDocCoords + containerHeight + 15 >= documentHeight) {
            var offset = calculatedTopInDocCoords + containerHeight - documentHeight + 15;

            calculatedTop -= offset;

            var newTopInDocCoords = calculatedTop + containerOffsetParentOffset.top;
            if (newTopInDocCoords < 15) {
                calculatedTop -= calculatedTop + containerOffsetParentOffset.top - 15;
            }
        }

        $positionContainer.css('left', calculatedLeft);
        $positionContainer.css('top', calculatedTop);
    }

    findMenuItem(items, keyPathArray, property) {
        return $.oc.vueUtils.findObjectByKeyPath(items, keyPathArray, 'items', property);
    }

    findMenuItems(items, keyPathArrays, property) {
        var result = {};

        for (var index = 0; index < keyPathArrays.length; index++) {
            var keyPathArray = keyPathArrays[index];

            result[keyPathArray.join('-')] = this.findMenuItem(items, keyPathArray, property);
        }

        return result;
    }

    checkItemInGroup(groupItems, checkedItemCommand) {
        for (var index = 0; index < groupItems.length; index++) {
            var item = groupItems[index];
            item.checked = item.command == checkedItemCommand;
        }
    }
}

export default new DropdownmenuUtils();
