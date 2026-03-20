import { ControlBase, registerControl } from 'larajax';
import SnippetMarkdownContext from './snippet-control.markdown.js';
import SnippetRicheditorContext from './snippet-control.richeditor.js';

/*
 * Snippet Control
 *
 * Manages the interactive figure state, if you add the control tag to this it will create
 * a snippet manager.
 *
 * <figure data-snippet="someSnippetCode" data-snippet-properties="{json}"></figure>
 */
registerControl('snippet', class extends ControlBase
{
    static defaultWidgetAlias = 'ocsnippetlookup';

    init() {
        this.snippetCode = this.config.snippet;
        this.componentClass = this.config.component;
    }

    connect() {
        this.snippetContext = this.guessSnippetContext();
        if (this.snippetContext) {
            this.snippetContext.onConnect();
        }

        this.constructor.blessSnippet(this.element);

        this.listen('click', this.createInspector);
        $(this.element).on('hidden.oc.inspector', this.proxy(this.closedInspector));
        $(this.element).on('error.oc.inspector', this.proxy(this.erroredInspector));

        this.loadSnippetDetails();
    }

    disconnect() {
        $(this.element).off('hidden.oc.inspector', this.proxy(this.closedInspector));
        $(this.element).off('error.oc.inspector', this.proxy(this.erroredInspector));

        this.constructor.cleanSnippet(this.element);

        $.oc.foundation.controlUtils.disposeControls(this.element);

        if (this.snippetContext) {
            this.snippetContext.onDisconnect();
            this.snippetContext = null;
        }
    }

    loadSnippetDetails() {
        this.element.dataset.name = 'Loading...';
        this.element.classList.add('loading');

        oc.snippetLookup.getSnippetDetails(this.snippetCode, this.componentClass).then((data) => {
            if (data) {
                this.element.dataset.name = data.name;
                this.element.classList.remove('loading');

                if (data.error) {
                    this.element.classList.add('has-error');
                }
            }
        });
    }

    guessSnippetContext() {
        const markdownEl = this.element.closest('[data-control="markdowneditor"]');
        if (markdownEl) {
            return new SnippetMarkdownContext(this, markdownEl, this.element);
        }

        const richeditorEl = this.element.closest('[data-control="richeditor"]');
        if (richeditorEl) {
            return new SnippetRicheditorContext(this, richeditorEl, this.element);
        }
    }

    closedInspector() {
        oc.snippetLookup.pauseRendering = false;

        if (this.snippetContext) {
            this.snippetContext.onInspectorClosed();
        }
    }

    erroredInspector() {
        oc.snippetLookup.pauseRendering = false;

        this.element.classList.remove('inspector-open');
        this.element.classList.add('has-error');
    }

    createInspector(ev) {
        if (this.element.classList.contains('has-error')) {
            return;
        }

        oc.snippetLookup.pauseRendering = true;
        $.oc.inspector.manager.createInspector(ev.target);
        return false;
    }

    static blessSnippet(el) {
        el.setAttribute('data-inspector-handler-alias', this.defaultWidgetAlias);

        if (el.dataset.component) {
            el.setAttribute('data-inspector-class', el.dataset.component);
        }
    }

    static cleanSnippet(el) {
        var removeAttrs = [
            'data-name',
            'data-inspector-handler-alias',
            'data-inspector-id',
            'data-inspector-class',
            'data-inspector-css-class',
            'data-property-inspectorclassname',
            'data-property-inspectorproperty'
        ];

        removeAttrs.forEach(attr => el.removeAttribute(attr));
    }
});
