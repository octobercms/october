import { CompleterBase } from './cms.editor.intellisense.completer.base.js';

export class CompleterOctoberPartials extends CompleterBase {
    get triggerCharacters() {
        return [...['"', "'", '/', '-'], ...this.alphaNumCharacters];
    }

    getNormalizedPartials(range) {
        return this.utils.getPartials().map((partial) => {
            var result = {
                label: partial.name,
                insertText: partial.name,
                kind: monaco.languages.CompletionItemKind.Enum,
                range: range,
                detail: 'October CMS partial'
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
        const wordMatches = textUntilPosition.match(/\{%\s+(partial|ajaxPartial)\s+("|')(\w|\/|\-)*$/);
        if (!wordMatches) {
            return;
        }

        const wordMatchBefore = textUntilPosition.match(/("|')[\w\/\-]*$/);
        if (!wordMatchBefore) {
            return;
        }

        const wordMatchAfter = textAfterPosition.match(/[\w\/\-]?("|')/);
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
            suggestions: this.getNormalizedPartials(range)
        };
    }
}
