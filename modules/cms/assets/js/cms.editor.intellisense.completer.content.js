import { CompleterBase } from './cms.editor.intellisense.completer.base.js';

export class CompleterOctoberContent extends CompleterBase {
    get triggerCharacters() {
        return [...['"', "'", '/', '-', '.'], ...this.alphaNumCharacters];
    }

    getNormalizedContentFiles(range) {
        return this.utils.getContentFiles().map((content) => {
            var result = {
                label: content.name,
                insertText: content.name,
                kind: monaco.languages.CompletionItemKind.Enum,
                range: range,
                detail: 'Content file'
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
        const wordMatches = textUntilPosition.match(/\{%\s+content\s+("|')(\w|\/|\-|\.)*$/);
        if (!wordMatches) {
            return;
        }

        const wordMatchBefore = textUntilPosition.match(/("|')[\w\/\-\.]*$/);
        if (!wordMatchBefore) {
            return;
        }

        const wordMatchAfter = textAfterPosition.match(/[\w\/\-\.]?("|')/);
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
            suggestions: this.getNormalizedContentFiles(range)
        };
    }
}
