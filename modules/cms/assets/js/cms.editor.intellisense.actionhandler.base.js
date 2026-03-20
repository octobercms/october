export class ActionHandlerBase {
    editor;
    action;
    intellisense;
    monacoComponent;

    constructor(intellisense, editor, monacoComponent) {
        this.editor = editor;
        this.intellisense = intellisense;
        this.monacoComponent = monacoComponent;

        this.initEditor();
    }

    initEditor() {}

    getModelTags(editor) {
        let tags = editor.getModel().octoberEditorCmsTags;
        if (!Array.isArray(tags)) {
            return [];
        }

        return tags;
    }

    modelHasTag(editor, tag) {
        const tags = this.getModelTags(editor);
        return tags.indexOf(tag) !== -1;
    }

    getTagAtPosition(editor, tagRegexPattern, position) {
        const tagRegex = new RegExp(tagRegexPattern, 'ig');
        const model = editor.getModel();
        const mouseColumnIndex = position.column - 1;
        const lineContent = model.getLineContent(position.lineNumber);

        let match = '';
        while ((match = tagRegex.exec(lineContent)) !== null) {
            const tag = match[0];
            if (match.index <= mouseColumnIndex && mouseColumnIndex < match.index + tag.length) {
                return {
                    tag: tag,
                    range: {
                        endColumn: match.index + tag.length + 1,
                        endLineNumber: position.lineNumber,
                        startColumn: match.index + 1,
                        startLineNumber: position.lineNumber
                    }
                };
            }
        }

        return null;
    }

    run(editor) {}

    onFilterSupportedActions(payload) {}

    onContextMenu(editor, target) {}

    dispose() {
        this.monacoComponent = null;

        if (this.action) {
            this.action.dispose();
        }
    }
}
