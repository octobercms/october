export class ClickHandlerBase {
    intellisense;
    options;

    constructor(intellisense, options) {
        this.intellisense = intellisense;
        this.options = options;
    }

    get utils() {
        return this.intellisense.utils;
    }

    getFileExtension(fileName) {
        const parts = fileName.split('/').pop().split('.');
        if (parts.length < 2) {
            return null;
        }

        return parts.pop();
    }

    addExtensionIfMissing(fileName, extension) {
        if (this.getFileExtension(fileName) !== null) {
            return fileName;
        }

        return fileName + '.' + extension;
    }

    resolveRelativeFilePath(base, relative) {
        const parts = relative.split('/');
        let stack = base.split('/');

        stack.pop();
        parts.forEach((part) => {
            if (part === '.') {
                return;
            }

            if (part === '..') {
                stack.pop();
            }
            else {
                stack.push(part);
            }
        });

        return stack.join('/');
    }

    provideLinks(model, token) {}

    resolveLink(link, token) {}
}
