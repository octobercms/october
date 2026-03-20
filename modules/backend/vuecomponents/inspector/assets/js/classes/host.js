export class InspectorHost {
    showModal(title, obj, dataSchema, uniqueId, options, parentObj) {
        if (typeof title !== 'string' || !title.length) {
            throw new Error('Inspector title is a required string');
        }

        if (typeof obj !== 'object') {
            throw new Error('Inspector Object must be an object');
        }

        if (parentObj !== undefined && typeof parentObj !== 'object') {
            throw new Error('Inspector Parent Object must be an object');
        }

        if (!Array.isArray(dataSchema)) {
            throw new Error('Inspector data schema must be an array');
        }

        if (typeof uniqueId !== 'string' || !uniqueId.length) {
            throw new Error('Inspector unique key is a required string');
        }

        if (options) {
            if (typeof options !== 'object') {
                throw new Error('options must be an object');
            }

            if (options.buttonText && typeof options.buttonText !== 'string') {
                throw new Error('options.buttonText must be a string');
            }

            if (options.size && typeof options.size !== 'string') {
                throw new Error('options.size must be a string');
            }

            if (options.description && typeof options.description !== 'string') {
                throw new Error('options.description must be a string');
            }

            if (options.resizableWidth && typeof options.resizableWidth !== 'boolean') {
                throw new Error('options.resizableWidth must be boolean');
            }

            if (options.beforeApplyCallback && typeof options.beforeApplyCallback !== 'function') {
                throw new Error('options.beforeApplyCallback must be a function');
            }

            if (options.liveMode && typeof options.liveMode !== 'boolean') {
                throw new Error('options.liveMode must be boolean');
            }
        }

        options = options || {};

        return new Promise(function (resolve, reject) {
            var applyClicked = false;

            // Create container element for Vue app
            var wrapperEl = document.createElement('div');
            document.body.appendChild(wrapperEl);

            // Create Vue 3 app with event handlers
            var app = oc.createVueApp({
                data() {
                    return {
                        title: title,
                        description: options.description || '',
                        dataSchema: dataSchema,
                        inspectorData: {
                            obj: obj,
                            parentObj: parentObj
                        },
                        buttonText: options.buttonText,
                        size: options.size || 'normal',
                        uniqueId: uniqueId,
                        handlerAlias: options.handlerAlias,
                        resizableWidth: options.resizableWidth,
                        liveMode: options.liveMode
                    };
                },
                template: '<backend-inspector-host-modal :title="title" :description="description" :data-schema="dataSchema" :data="inspectorData" :button-text="buttonText" :size="size" :unique-id="uniqueId" :handler-alias="handlerAlias" :resizable-width="resizableWidth" :live-mode="liveMode" @beforeapply="onBeforeApply" @applyclick="onApplyClick" @close="onClose" />',
                methods: {
                    onBeforeApply(callbackHolder) {
                        if (options.beforeApplyCallback) {
                            callbackHolder.callback = options.beforeApplyCallback;
                        }
                    },
                    onApplyClick() {
                        applyClicked = true;
                        resolve();
                    },
                    onClose() {
                        app.unmount();
                        document.body.removeChild(wrapperEl);

                        if (!applyClicked) {
                            reject();
                        }
                    }
                }
            });

            app.mount(wrapperEl);
        });
    }
}

export const host = new InspectorHost();

export default host;
