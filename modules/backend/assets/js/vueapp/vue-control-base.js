/**
 * Structure:
 * <div data-control="vue-container">
 *     <div data-vue-template>
 *         <template></template>
 *     </div>
 *     <script type="text/template" data-vue-state="initial">
 *         {...json...}
 *     </script>
 * </div>
 */
export class VueControlBase extends oc.ControlBase
{
    registerMethod(name, callback) {
        this.app.registerMethod(name, this.proxy(callback));
    }

    registerState(name, value) {
        this.app.registerState(name, value);
    }

    // Overrides

    initBefore() {
        super.initBefore();
        this.app = oc.VueApp.getFromElement(this.element);
        this.state = this.app.state;
        this.containers = this.app.containers;
    }

    connectAfter() {
        this.vueContainerInstance = this;
        super.connectAfter();
        this.initContainerInternal();
    }

    disconnectAfter() {
        this.destroyContainerInternal();
        super.disconnectAfter();
        this.vueContainerInstance = null;
    }

    // Internals

    initContainerInternal() {
        this.vueElement = this.element.querySelector('[data-vue-template]');
        if (!this.vueElement) {
            throw new Error('Missing an element with data-vue-template');
        }

        oc.pageReady().then(() => {
            this.app.createContainer(this, this.vueElement);
        });
    }

    destroyContainerInternal() {
        this.app.destroyContainer(this);
    }
}

oc.registerControl('vue-container', VueControlBase);

// Global for backward compatibility
oc.VueControlBase = VueControlBase;

export default VueControlBase;
