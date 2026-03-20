function makeUploaderInstance() {
    // Create container element for Vue app
    const wrapperEl = document.createElement('div');
    document.body.appendChild(wrapperEl);

    // Create Vue 3 app
    const app = oc.createVueApp({
        data() {
            return {};
        },
        template: '<backend-uploader ref="uploader" />'
    });

    const vm = app.mount(wrapperEl);

    // Store app reference for cleanup and return the uploader component
    const uploaderComponent = vm.$refs.uploader;
    uploaderComponent.__vueApp = app;
    uploaderComponent.__wrapperEl = wrapperEl;

    return uploaderComponent;
}

class UploaderUtils {
    uploaderInstance;

    constructor() {
        this.uploaderInstance = null;
    }

    uploadMediaManagerFile(file) {
        if (!this.uploaderInstance) {
            this.uploaderInstance = makeUploaderInstance();
        }

        return this.uploaderInstance.addMediaManagerFile(file);
    }

    selectAndUploadMediaManagerFiles(callback, multiple, accept) {
        const uploaderUtils = oc.vueComponentHelpers.uploader.utils;
        const $input = $('<input type="file" style="display:none" name="file"/>');

        if (multiple) {
            $input.attr('multiple', 'multiple');
        }

        if (typeof accept === 'string') {
            $input.attr('accept', accept);
        }

        $(document.body).append($input);

        $input.one('change', () => {
            const files = $input.get(0).files;
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                const promise = uploaderUtils.uploadMediaManagerFile(files[i]).then(
                    (response) => {
                        const data = JSON.parse(response);

                        callback(data.link, files.length > 1, i == files.length - 1);
                    },
                    () => {}
                );

                promises.push(promises);
            }

            Promise.all(promises.map((p) => Promise.resolve(p).then(() => {}, () => {}))).then(() => {
                $input.remove();
            });
        });

        $input.click();
    }

    uploadFile(handlerName, file, formFieldName, extraData) {
        if (!this.uploaderInstance) {
            this.uploaderInstance = makeUploaderInstance();
        }

        let fileArr = [];
        if (file instanceof FileList) {
            fileArr = file;
        }
        else if (Array.isArray(file)) {
            fileArr = file;
        }
        else {
            fileArr.push(file);
        }

        const promises = [];
        for (let i = 0; i < fileArr.length; i++) {
            promises.push(this.uploaderInstance.addFile(handlerName, fileArr[i], formFieldName, extraData));
        }

        return Promise.all(
            promises.map((p) =>
                Promise.resolve(p).then(
                    (value) => ({
                        status: 'fulfilled',
                        value
                    }),
                    (reason) => ({
                        status: 'rejected',
                        reason
                    })
                )
            )
        );
    }
}

if (oc.vueComponentHelpers === undefined) {
    oc.vueComponentHelpers = {};
}

if (oc.vueComponentHelpers.uploader === undefined) {
    oc.vueComponentHelpers.uploader = {};
}

oc.vueComponentHelpers.uploader.utils = new UploaderUtils();