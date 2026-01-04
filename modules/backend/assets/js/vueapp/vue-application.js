/**
 * Structure:
 * <div data-control="vue-app">
 *     <div data-control="vue-container"></div>
 *     <div data-control="vue-container"></div>
 *     <div data-control="vue-container"></div>
 * </div>
 */

class VueApp extends oc.ControlBase
{
    init() {
        this.methods = {};
        this.containers = {};
        this.state = {};

        this.state.processing = false;
        this.state.eventBus = new Vue();

        this.registerMethod('onCommand', this.onCommand);
    }

    connect() {
        this.element.vueAppInstance = this;
        this.loadLangMessagesInternal();
        this.loadInitialStateInternal();
    }

    disconnect() {
        this.element.vueAppInstance = null;
        for (const name in this.methods) {
            this.methods[name] = null;
        }
    }

    registerState(name, value) {
        if (name.constructor === {}.constructor) {
            for (const key in name) {
                this.registerState(key, name[key]);
            }
        }
        else if (this.state[name] === undefined) {
            Vue.set(this.state, name, value);
        }
    }

    getState(name, defaultVal) {
        return this.state[name] || defaultVal;
    }

    getMethod(name) {
        return this.methods[name];
    }

    registerMethod(name, fn) {
        this.methods[name] = fn;
    }

    createContainer(control, element) {
        if (!this.element.isConnected) {
            return;
        }

        const vm = new Vue({
            data: {
                state: this.state,
            },
            methods: this.methods,
            el: element
        });

        const controlName = this.getContainerNameFromControl(control);
        this.containers[controlName] = vm;

        if (element.vueContainerInstance) {
            element.vueContainerInstance.vm = vm;
        }
    }

    destroyContainer(control, vm) {
        if (vm) {
            vm.$destroy();
        }

        const controlName = this.getContainerNameFromControl(control);
        this.containers[controlName] = null;
    }

    getContainerNameFromControl(control) {
        return control.element.dataset.control.replace(/-./g, x => x[1].toUpperCase());
    }

    isFormCommand(command) {
        let parts = command.split(':');
        return parts.length === 2 && parts[0] === 'form';
    }

    /**
     * Handles commands starting with the "form:" prefix.
     * All other commands must be handled in a child class.
     * @param String command
     * @param Boolean isHotkey
     * @param Event ev
     */
    async onCommand(command, isHotkey, ev, targetElement, customData) {
        let parts = command.split(':');
        if (parts.length == 2 && parts[0] !== 'form') {
            throw new Error('Unknown command: ' + command);
        }

        const ajaxHandler = parts[1];
        let requestConfig = {};
        let customDataOptions = customData || {};

        if (customDataOptions.request) {
            requestConfig = customData.request;
        }

        if (customDataOptions.confirm) {
            try {
                await oc.confirmPromise(customDataOptions.confirm);
            }
            catch (error) {
                return Promise.reject();
            }
        }

        this.state.processing = true;

        return oc.request(targetElement, ajaxHandler, {
                ...requestConfig
            })
            .finally(() => {
                this.state.processing = false;
            });
    }

    loadInitialStateInternal() {
        const stateElements = this.element.querySelectorAll('[data-vue-state]');
        stateElements.forEach(stateElement => {
            const stateIndex = stateElement.getAttribute('data-vue-state') || 'initial';
            const stateValue = JSON.parse(stateElement.innerHTML);
            this.state[stateIndex] = {
                ...($.oc.vueUtils.getCleanObject(this.state[stateIndex] || {})),
                ...stateValue
            };
        });
    }

    loadLangMessagesInternal() {
        const langElements = this.element.querySelectorAll('[data-vue-lang]');
        langElements.forEach(langElement => {
            oc.lang.set(JSON.parse(langElement.innerHTML));
        });
    }

    static getFromElement(element) {
        const appEl = element.closest('[data-control="vue-app"]');
        if (appEl && appEl.vueAppInstance) {
            return appEl.vueAppInstance;
        }
    }
}

oc.registerControl('vue-app', VueApp);

oc.VueApp = VueApp;
