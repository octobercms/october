import { ClickHandlerBase } from './cms.editor.intellisense.clickhandler.base.js';

export class ClickHandlerTemplate extends ClickHandlerBase {
    get canManagePartials() {
        return this.options.canManagePartials;
    }

    get canManageContent() {
        return this.options.canManageContent;
    }

    get canManageAssets() {
        return this.options.canManageAssets;
    }

    get canManagePages() {
        return this.options.canManagePages;
    }

    get editableAssetExtensions() {
        return this.options.editableAssetExtensions;
    }

    resolveLink(link, token) {
        let path = link.templateName;
        if (link.type === 'cms-asset') {
            path = path.replace(/^assets\//, '');
        }

        this.intellisense.emit('onTokenClick', {
            type: link.type,
            path: path
        });
    }

    getListByName(listName) {
        if (listName === 'assets') {
            return this.utils.getAssets().map((asset) => {
                return asset.name;
            });
        }

        if (listName === 'pages') {
            return this.utils.getPages().map((asset) => {
                return asset.name;
            });
        }
    }

    makeLinks(model, re, links, documentType, options) {
        const matches = model.findMatches(re, false, true, false, null, true);
        let templateList = false;

        matches.forEach((findMatch) => {
            const templateName = findMatch.matches[2];

            if (options) {
                if (options.allowedExtensions) {
                    const extension = this.getFileExtension(templateName);
                    if (extension === null || options.allowedExtensions.indexOf(extension) === -1) {
                        return;
                    }
                }

                if (options.checkList) {
                    if (templateList === false) {
                        templateList = this.getListByName(options.checkList);
                    }

                    if (!Array.isArray(templateList) || templateList.indexOf(templateName) === -1) {
                        return;
                    }
                }
            }

            const templatePos = findMatch.matches[0].indexOf(templateName);
            const startColumn = findMatch.range.startColumn + templatePos;

            links.push({
                type: documentType,
                templateName: templateName,
                range: {
                    endColumn: startColumn + templateName.length,
                    endLineNumber: findMatch.range.endLineNumber,
                    startColumn: startColumn,
                    startLineNumber: findMatch.range.startLineNumber
                }
            });
        });
    }

    provideLinks(model, token) {
        if (!this.intellisense.modelHasTag(model, 'cms-markup')) {
            return;
        }

        const result = {
            links: []
        };

        if (this.canManagePartials) {
            this.makeLinks(model, /\{%\s+(?:partial|ajaxPartial)\s+("|')([a-zA-Z0-9\-\/_]+)\1/gm, result.links, 'cms-partial');
        }

        if (this.canManageContent) {
            this.makeLinks(model, /\{%\s+content\s+("|')([a-zA-Z0-9\-\/\._]+)\1/gm, result.links, 'cms-content');
        }

        if (this.canManageAssets) {
            this.makeLinks(model, /\{\{\s+("|')([a-zA-Z0-9\-\/\.\s_@]+)\1/gm, result.links, 'cms-asset', {
                allowedExtensions: this.editableAssetExtensions,
                checkList: 'assets'
            });
        }

        if (this.canManagePages) {
            this.makeLinks(model, /\{\{\s+("|')([a-zA-Z0-9\-\/\._]+)\1/gm, result.links, 'cms-page', {
                checkList: 'pages'
            });
        }

        return result;
    }
}
