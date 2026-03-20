import { HoverProviderBase } from './cms.editor.intellisense.hoverprovider.base.js';

export class HoverProviderTwigFilters extends HoverProviderBase {
    getTwigFilters() {
        return this.intellisense.getCustomData().twigFilters;
    }

    provideHover(model, position) {
        if (!this.intellisense.modelHasTag(model, 'cms-markup')) {
            return;
        }

        const textUntilPosition = this.intellisense.utils.textUntilPosition(model, position);
        if (!textUntilPosition.match(/(\{%)|(\{\{).*[^\s]+\|\w*$/)) {
            return;
        }

        const openingTags = (textUntilPosition.match(/(\{%)|(\{\{)/g) || []).length;
        const closingTags = (textUntilPosition.match(/(%\})|(\}\})/g) || []).length;

        if (openingTags <= closingTags) {
            return;
        }

        const wordAtPosition = model.getWordAtPosition(position);
        if (!wordAtPosition) {
            return;
        }

        const word = wordAtPosition.word;
        const filter = this.getTwigFilters().find((item) => {
            if (Array.isArray(item.hoverKeyword)) {
                return item.hoverKeyword.some((keyword) => keyword == word);
            }

            return item.hoverKeyword == word;
        });

        if (!filter) {
            return;
        }

        return {
            contents: [
                { value: '**' + filter.label + '**' },
                {
                    value: this.intellisense.utils.makeTagDocumentationString(filter)
                }
            ]
        };
    }
}
