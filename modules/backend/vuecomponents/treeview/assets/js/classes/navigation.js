/*
 * TreeView navigation class
 */
export class TreeviewNavigation {
    findNodeIndex(nodeArr, node) {
        return nodeArr.indexOf(node);
    }

    getAllVisibleNodes(treeviewElement) {
        var allNodes = treeviewElement.querySelectorAll('li');

        return Array.prototype.slice.call(allNodes);
    }

    getToggleButton($node) {
        return $node.find('> .item-label-outer-container > .item-label-container button.node-toggle-control');
    }

    navigateNext(treeviewElement, currentFocus, ev) {
        var nodeArr = this.getAllVisibleNodes(treeviewElement),
            index = this.findNodeIndex(nodeArr, currentFocus);

        if (index === -1 || index === nodeArr.length - 1) {
            return;
        }

        nodeArr[index + 1].focus();
        ev.preventDefault();
        ev.stopPropagation();

        return 'selection-changed';
    }

    navigatePrev(treeviewElement, currentFocus, ev) {
        var nodeArr = this.getAllVisibleNodes(treeviewElement),
            index = this.findNodeIndex(nodeArr, currentFocus);

        if (index === -1 || index === 0) {
            return;
        }

        nodeArr[index - 1].focus();
        ev.preventDefault();
        ev.stopPropagation();

        return 'selection-changed';
    }

    navigateRight(currentFocus) {
        var $currentFocus = $(currentFocus);

        if ($currentFocus.hasClass('no-child-nodes')) {
            return;
        }

        if ($currentFocus.hasClass('collapsed-node')) {
            this.getToggleButton($currentFocus).click();
        }
        else {
            $currentFocus.find('> ul:first li:first').focus();
        }
    }

    navigateLeft(currentFocus) {
        var $currentFocus = $(currentFocus);

        if (!$currentFocus.hasClass('no-child-nodes') && $currentFocus.hasClass('expanded-node')) {
            return this.getToggleButton($currentFocus).click();
        }

        $currentFocus.parent().closest('li').focus();
    }

    navigateHome(treeviewElement, ev) {
        var nodeArr = this.getAllVisibleNodes(treeviewElement);

        if (nodeArr.length === 0) {
            return;
        }

        ev.stopPropagation();
        ev.preventDefault();
        return nodeArr[0].focus();
    }

    navigateEnd(treeviewElement, ev) {
        var nodeArr = this.getAllVisibleNodes(treeviewElement);

        if (nodeArr.length === 0) {
            return;
        }

        ev.stopPropagation();
        ev.preventDefault();
        return nodeArr[nodeArr.length - 1].focus();
    }

    expandSameLevelSiblings(treeviewElement, currentFocus) {
        var $currentFocus = $(currentFocus),
            $siblings = $currentFocus.siblings('li.collapsed-node:not(.no-child-nodes)');

        if ($currentFocus.hasClass('collapsed-node') && !$currentFocus.hasClass('no-child-nodes')) {
            this.getToggleButton($currentFocus).click();
        }

        this.getToggleButton($siblings).click();
    }

    navigateNextStartingWith(char, treeviewElement, currentFocus) {
        if (!char || typeof char !== 'string') {
            return;
        }

        var nodeArr = this.getAllVisibleNodes(treeviewElement),
            index = this.findNodeIndex(nodeArr, currentFocus);

        if (index === -1) {
            return;
        }

        char = char.toLowerCase();

        var wrappedArray = [];

        if (index === nodeArr.length - 1) {
            wrappedArray = nodeArr;
        }
        else {
            wrappedArray = nodeArr.slice(index + 1).concat(nodeArr.slice(0, index));
        }

        for (var nodeIndex = 0; nodeIndex < wrappedArray.length; nodeIndex++) {
            var text = $(wrappedArray[nodeIndex].querySelector('.node-label')).text();

            if (text.substring(0, 1).toLowerCase() == char) {
                wrappedArray[nodeIndex].focus();
                return;
            }
        }
    }
}

export const navigation = new TreeviewNavigation();
export default navigation;
