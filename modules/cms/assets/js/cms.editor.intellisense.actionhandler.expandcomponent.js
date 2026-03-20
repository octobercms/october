import { ActionHandlerBase } from './cms.editor.intellisense.actionhandler.base.js';

export class ActionHandlerExpandComponent extends ActionHandlerBase {
    tagRePattern;

    constructor(intellisense, editor, monacoComponent) {
        super(intellisense, editor, monacoComponent);
        this.tagRePattern = '{%\\s+component\\s*[^}]+\\s*%}';
    }

    initEditor() {
        const condition = this.editor.createContextKey('octoberExpandComponentDefinitionCondition', false);
        condition.set(true);
        this.editor.octoberExpandComponentDefinitionCondition = condition;
        const that = this;

        this.action = this.editor.addAction({
            id: 'october-expand-component-definition',
            label: $.oc.editor.getLangStr('cms::lang.component.expand_partial'),
            precondition: 'octoberExpandComponentDefinitionCondition',
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1.5,
            run: function(editor) {
                that.run(editor);
                return null;
            }
        });
    }

    run(editor) {
        const position = editor.getPosition();
        const tag = this.getTagAtPosition(editor, this.tagRePattern, position);
        if (!tag) {
            return;
        }

        const re = /^{%\s*component\s(['"])([^"']+)(?:\1)[^(?:%})]+%}$/;
        const matches = re.exec(tag.tag);

        if (!matches || !matches[2]) {
            return;
        }

        this.monacoComponent.emitCustomEvent('expandComponent', {
            alias: matches[2],
            range: tag.range,
            model: editor.getModel()
        });
    }

    onFilterSupportedActions(payload) {
        payload.actions = payload.actions.filter((action) => {
            return action.id.indexOf('october-expand-component-definition') === -1;
        });
    }

    onContextMenu(editor, target) {
        if (!editor.octoberExpandComponentDefinitionCondition || !target) {
            return;
        }

        if (!this.modelHasTag(editor, 'cms-markup')) {
            editor.octoberExpandComponentDefinitionCondition.set(false);
            return;
        }

        const tag = this.getTagAtPosition(editor, this.tagRePattern, target.position);
        if (!tag) {
            editor.octoberExpandComponentDefinitionCondition.set(false);
            return;
        }

        editor.octoberExpandComponentDefinitionCondition.set(true);
    }
}
