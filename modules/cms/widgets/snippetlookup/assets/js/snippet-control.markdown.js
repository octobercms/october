/*
 * Snippet Markdown Context
 */

export default class SnippetMarkdownContext
{
    constructor(delegate, control, element) {
        this.delegate = delegate;
        this.control = control;
        this.element = element;
        this.textarea = this.findTextareaForControl();
    }

    findTextareaForControl() {
        return this.control.querySelector('.editor-write > textarea');
    }

    findPreviewForControl() {
        return this.element.closest('.editor-preview-side');
    }

    onInspectorClosed() {
        if (!this.textarea) {
            return;
        }

        this.textarea.value = this.replaceSnippetAtIndex(
            this.findSnippetIndex(),
            this.element.outerHTML,
            this.textarea.value
        );

        oc.Events.dispatch('change', { target: this.textarea });
    }

    onConnect() {
        //
    }

    onDisconnect() {
        //
    }

    findSnippetIndex() {
        var preview = this.findPreviewForControl();
        if (!preview) {
            return;
        }

        var snippet = this.element,
            foundIndex = null;


        preview.querySelectorAll('figure[data-snippet]').forEach(function(otherSnippet, index) {
            if (otherSnippet === snippet) {
                foundIndex = index;
            }
        });

        return foundIndex;
    }

    replaceSnippetAtIndex(index, newSnippet, textareaContent) {
        const figures = textareaContent.match(/\<figure[^\>]+data-snippet[^\>]+\>[^<]*\<\/figure\>/g);

        if (figures && figures[index]) {
            textareaContent = textareaContent.replace(figures[index], this.cleanSnippetContent(newSnippet))
        }

        return textareaContent;
    }

    cleanSnippetContent(html) {
        var $domTree = $('<div>'+html+'</div>');

        $('[data-snippet]', $domTree).each(function(){
            var $snippet = $(this);

            oc.importControl('snippet').cleanSnippet($snippet.get(0));

            $snippet.removeAttr('class data-control data-inspector-id');
        });

        return $domTree.html();
    }
}
