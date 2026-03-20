import { CompleterBase } from './cms.editor.intellisense.completer.base.js';

export class CompleterPages extends CompleterBase {
    get triggerCharacters() {
        return [...['"', "'", '/', '-', '.', '@'], ...this.alphaNumCharacters];
    }

    getNormalizedPages(range) {
        return this.utils.getPages().map((asset) => {
            var result = {
                label: asset.name,
                insertText: asset.name,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                range: range,
                detail: 'CMS Page'
            };

            return result;
        });
    }

    provideCompletionItems(model, position) {
        if (!this.intellisense.modelHasTag(model, 'cms-markup')) {
            return;
        }

        const textUntilPosition = this.intellisense.utils.textUntilPosition(model, position);
        const textAfterPosition = this.intellisense.utils.textAfterPosition(model, position);
        const wordMatches = textUntilPosition.match(/\{\{\s+("|')(\w|\/|\-|\.|@)*$/);
        if (!wordMatches) {
            return;
        }

        const wordMatchBefore = textUntilPosition.match(/("|')[\w\/\-\.@]*$/);
        if (!wordMatchBefore) {
            return;
        }

        const wordMatchAfter = textAfterPosition.match(/[\w\/\-\.@]?("|')/);
        if (!wordMatchAfter) {
            return;
        }

        const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: wordMatchBefore.index + 2,
            endColumn: position.column + wordMatchAfter[0].length - 1
        };

        return {
            suggestions: this.getNormalizedPages(range)
        };
    }
}
