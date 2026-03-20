/*
 * TreeView selection class
 */
export class Selection {
    keySet;
    selectedKeys;

    constructor() {
        this.keySet = new Set();
        this.selectedKeys = [];
    }

    syncKeys() {
        this.selectedKeys.splice(0, this.selectedKeys.length);

        this.keySet.forEach((key) => {
            this.selectedKeys.push(key);
        });
    }

    has(key) {
        return this.keySet.has(key);
    }

    set(key) {
        this.keySet.clear();
        this.keySet.add(key);
        this.syncKeys();
    }

    add(key) {
        this.keySet.add(key);
        this.syncKeys();
    }

    addOrInvert(key) {
        if (this.keySet.has(key)) {
            this.keySet.delete(key);
        }
        else {
            this.keySet.add(key);
        }

        this.syncKeys();
    }

    getElementMidVertical($element) {
        return ($element.offset() + $element.height()) / 2;
    }

    addRange(key, clickedElement, prevSelectedElement) {
        const $currentFocus = $(prevSelectedElement).find('> .item-label-outer-container');
        const $clickedElement = $(clickedElement).find('> .item-label-outer-container');
        const currentFocusRoot = $currentFocus.closest('li.root-node');
        const clickedRoot = $clickedElement.closest('li.root-node');

        if (!currentFocusRoot.length || !clickedRoot.length) {
            return;
        }

        if (currentFocusRoot.get(0) !== clickedRoot.get(0)) {
            return;
        }

        const treeNodes = currentFocusRoot
            .get(0)
            .querySelectorAll('li[data-treenode] > .item-label-outer-container');
        const treeNodesArr = [...treeNodes];
        const currentFocusIndex = treeNodesArr.indexOf($currentFocus.get(0));
        const clickedIndex = treeNodesArr.indexOf($clickedElement.get(0));
        const startIndex = Math.min(currentFocusIndex, clickedIndex);
        const endIndex = Math.max(currentFocusIndex, clickedIndex);

        for (let index = startIndex; index <= endIndex; index++) {
            const nodeElement = $(treeNodesArr[index]).closest('li[data-treenode]');

            if (!nodeElement.hasClass('selectable-node')) {
                continue;
            }

            const key = nodeElement.attr('data-unique-key');

            if (index == startIndex || index == endIndex) {
                this.add(key);
            }
            else {
                this.addOrInvert(key);
            }
        }
    }
}

export default Selection;
