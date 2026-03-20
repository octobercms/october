import { CompleterBase } from './cms.editor.intellisense.completer.base.js';

export class CompleterTwigFilters extends CompleterBase {
    getTwigFilters() {
        return this.intellisense.getCustomData().twigFilters;
    }

    get triggerCharacters() {
        return [...['|'], ...this.alphaNumCharacters];
    }

    getNormalizedFilters() {
        return this.getTwigFilters().map((filter) => {
            var result = $.oc.vueUtils.getCleanObject(filter);

            result.kind = monaco.languages.CompletionItemKind.Function;
            result.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
            result.detail = filter.isNativeTwigFilter ? 'Twig filter' : 'October CMS filter';
            result.documentation = {
                value: this.intellisense.utils.makeTagDocumentationString(result)
            };

            return result;
        });
    }

    provideCompletionItems(model, position) {
        if (!this.intellisense.modelHasTag(model, 'cms-markup')) {
            return;
        }

        const textUntilPosition = this.intellisense.utils.textUntilPosition(model, position);
        if (!textUntilPosition.match(/((\{%)|(\{\{)).*[^\s]+\|\w*$/)) {
            return;
        }

        const openingTags = (textUntilPosition.match(/(\{%)|(\{\{)/g) || []).length;
        const closingTags = (textUntilPosition.match(/(%\})|(\}\})/g) || []).length;

        if (openingTags <= closingTags) {
            return;
        }

        return {
            suggestions: this.getNormalizedFilters()
        };
    }
}
