import { ClickHandlerBase } from './cms.editor.intellisense.clickhandler.base.js';

export class ClickHandlerCssImport extends ClickHandlerBase {
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

    addUnderscore(fileName) {
        const parts = fileName.split('/');
        const baseName = '_' + parts.pop();

        return parts.join('/') + '/' + baseName;
    }

    getAssets() {
        return this.utils.getAssets().map((asset) => {
            return asset.name;
        });
    }

    makeLinks(model, re, links, basePath, options) {
        const matches = model.findMatches(re, false, true, false, null, true);
        let templateList = false;

        matches.forEach((findMatch) => {
            const templateName = findMatch.matches[2];
            let fullTemplateName = null;

            const extension = this.getFileExtension(templateName);
            if (options.allowedExtensions.indexOf(extension) === -1) {
                return;
            }

            if (templateList === false) {
                templateList = this.getAssets();
            }

            fullTemplateName = this.addExtensionIfMissing(templateName, this.options.extension);
            fullTemplateName = this.resolveRelativeFilePath(basePath, fullTemplateName);

            if (templateList.indexOf(fullTemplateName) === -1) {
                fullTemplateName = this.addUnderscore(fullTemplateName);
                if (templateList.indexOf(fullTemplateName) === -1) {
                    return;
                }
            }

            const templatePos = findMatch.matches[0].indexOf(templateName);
            const startColumn = findMatch.range.startColumn + templatePos;

            links.push({
                type: 'cms-asset',
                templateName: fullTemplateName,
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
        if (typeof this.options.extension !== 'string') {
            throw new Error('options.extension must be set for cssimports click handler');
        }

        if (!this.intellisense.modelHasTag(model, 'cms-asset-contents')) {
            return;
        }

        const basePath = 'assets/' + this.intellisense.getModelCustomAttribute(model, 'filePath');
        const result = {
            links: []
        };

        this.makeLinks(model, /@import\s+("|')([a-zA-Z0-9\-\/_\.]+)\1/gm, result.links, basePath, {
            allowedExtensions: [this.options.extension, null]
        });

        return result;
    }
}
