export class IntellisenseUtils {
    intellisense;

    constructor(intellisense) {
        this.intellisense = intellisense;
    }

    getPartials() {
        const cmsExtension = $.oc.editor.store.getExtension('cms');
        const partialDocController = cmsExtension.getDocumentController('cms-partial');
        const partials = partialDocController.getAllPartialFilenames();

        return partials.map((partial) => {
            return {
                name: cmsExtension.removeFileExtension(partial)
            };
        });
    }

    getPages() {
        const cmsExtension = $.oc.editor.store.getExtension('cms');
        const pagesDocController = cmsExtension.getDocumentController('cms-page');
        const pages = pagesDocController.getAllPageFilenames();

        return pages.map((page) => {
            return {
                name: cmsExtension.removeFileExtension(page)
            };
        });
    }

    getAssets() {
        const cmsExtension = $.oc.editor.store.getExtension('cms');
        const assetDocController = cmsExtension.getDocumentController('cms-asset');
        const assets = assetDocController.getAllAssetFilenames();

        return assets.map((fileName) => {
            return {
                name: 'assets/' + fileName
            };
        });
    }

    getContentFiles() {
        const cmsExtension = $.oc.editor.store.getExtension('cms');
        const contentDocController = cmsExtension.getDocumentController('cms-content');
        const content = contentDocController.getAllContentFilenames();

        return content.map((fileName) => {
            return {
                name: fileName
            };
        });
    }

    makeTagDocumentationString(tag) {
        let documentation = tag.documentation;

        if (tag.docUrl) {
            const e = this.intellisense.escapeHtml;
            const learnMore = ' [' + e(this.intellisense.trans('cms::lang.intellisense.learn_more')) + ']';
            documentation += '\n' + learnMore + '(' + e(tag.docUrl) + ')';
        }

        return documentation;
    }

    textUntilPosition(model, position) {
        return model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
        });
    }

    textAfterPosition(model, position) {
        return model.getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: position.column,
            endLineNumber: position.lineNumber,
            endColumn: model.getLineLength(position.lineNumber) + 1
        });
    }
}
