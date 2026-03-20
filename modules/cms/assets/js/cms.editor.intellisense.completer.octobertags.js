import { CompleterBase } from './cms.editor.intellisense.completer.base.js';

export class CompleterOctoberTags extends CompleterBase {
    getOctoberTags() {
        return this.intellisense.getCustomData().octoberTags;
    }

    get triggerCharacters() {
        return [...[' '], ...this.alphaNumCharacters];
    }

    getNormalizedTags() {
        if (this.normalizedTags) {
            return this.normalizedTags;
        }

        this.normalizedTags = this.getOctoberTags().map((tag) => {
            var result = $.oc.vueUtils.getCleanObject(tag);

            result.kind = monaco.languages.CompletionItemKind.Function;
            result.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
            result.detail = 'October CMS tag';
            result.documentation = {
                value: this.intellisense.utils.makeTagDocumentationString(result)
            };

            return result;
        });

        return this.normalizedTags;
    }

    getPartialEnum() {
        const partialNameList = this.utils.getPartials().map((partial) => {
            return partial.name;
        });

        if (!partialNameList.length) {
            return '';
        }

        return '|' + partialNameList.join(',') + '|';
    }

    getContentEnum() {
        const contentNameList = this.utils.getContentFiles().map((contentFile) => {
            return contentFile.name;
        });

        if (!contentNameList.length) {
            return '';
        }

        return '|' + contentNameList.join(',') + '|';
    }

    applyNormalizedTags(range) {
        const tags = this.getNormalizedTags();

        return tags.map((tag) => {
            var result = $.oc.vueUtils.getCleanObject(tag);
            if (tag.insertText && tag.insertText.indexOf('%}') !== -1) {
                result.range = range;
            }

            if (tag.insertText && tag.insertText.indexOf('{partial-list}' !== -1)) {
                tag.insertText = tag.insertText.replace('{partial-list}', this.getPartialEnum());
            }

            if (tag.insertText && tag.insertText.indexOf('{content-list}' !== -1)) {
                tag.insertText = tag.insertText.replace('{content-list}', this.getContentEnum());
            }

            return result;
        });
    }

    provideCompletionItems(model, position) {
        if (!this.intellisense.modelHasTag(model, 'cms-markup')) {
            return;
        }

        const textUntilPosition = this.intellisense.utils.textUntilPosition(model, position);
        const textAfterPosition = this.intellisense.utils.textAfterPosition(model, position);

        const wordMatches = textUntilPosition.match(/\{%\s+\w*$/);
        if (!wordMatches) {
            return;
        }

        const word = model.getWordUntilPosition(position);
        if (word.word === '%') {
            return;
        }

        let range = null;
        const matches = textAfterPosition.match(/\s+%}/);
        if (matches) {
            range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.endColumn - wordMatches[0].length,
                endColumn: word.endColumn + matches[0].length
            };
        }

        return {
            suggestions: this.applyNormalizedTags(range)
        };
    }
}
