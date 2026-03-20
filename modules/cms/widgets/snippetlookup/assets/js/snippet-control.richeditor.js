/*
 * Snippet Rich Editor Context
 */

export default class SnippetRicheditorContext
{
    constructor(delegate, control, element) {
        this.delegate = delegate;
        this.control = control;
        this.element = element;
    }

    onInspectorClosed() {
        //
    }

    onConnect() {
        this.element.contentEditable = false;
        this.element.classList.add('fr-draggable');
        this.element.setAttribute('tabindex', '0');
        this.element.setAttribute('draggable', 'true');
        this.element.setAttribute('contenteditable', 'false');
        this.element.setAttribute('data-ui-block', 'true');
    }

    onDisconnect() {
        var removeAttrs = [
            'class',
            'draggable',
            'tabindex',
            'contenteditable',
            'data-ui-block',
            'data-name',
            'data-inspector-css-class',
            'data-inspector-class',
            'data-inspector-handler-alias',
            'data-property-inspectorclassname',
            'data-property-inspectorproperty',
        ];

        removeAttrs.forEach(attr => this.element.removeAttribute(attr));
    }
}
