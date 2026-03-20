import { utils } from './classes/index.js';
import { modalUtils } from '../../../modal/assets/js/classes/index.js';

/*
 * Vue Inspector panel implementation
 */
export default {
    provide: function() {
        return {
            inspectorControlRegistry: {
                controls: this.registeredControls,
                register: this.registerControl,
                unregister: this.unregisterControl
            }
        };
    },
    props: {
        controls: {
            type: Array,
            required: true
        },
        obj: {
            type: Object,
            required: true
        },
        parentObj: {
            type: Object,
            required: false
        },
        inspectorUniqueId: {
            type: String,
            required: true
        },
        layoutUpdateData: {
            type: Object
        },
        inspectorPreferences: {
            type: Object
        }
    },
    data: function () {
        var storageKey = utils.getLocalStorageKey(this, 'splitter'),
            splitterPosition = parseInt(localStorage.getItem(storageKey));

        return {
            splitterData: {
                position: !splitterPosition ? 200 : splitterPosition,
                minSize: 100
            },
            panelUpdateData: {
                tabChanged: 0
            },
            registeredControls: []
        };
    },
    computed: {
        untabbedControls: function computeUntabbedControls() {
            return this.controls.filter(function (propDefinition) {
                if (!propDefinition.tab) {
                    return true;
                }
            });
        },

        tabbedControls: function computeTabbedControls() {
            var result = {};

            this.controls.forEach(function (propDefinition) {
                if (propDefinition.tab) {
                    if (result[propDefinition.tab] === undefined) {
                        result[propDefinition.tab] = [];
                    }

                    result[propDefinition.tab].push(propDefinition);
                }
            });

            return result;
        },

        tabs: function computeTabs() {
            var result = [];

            Object.keys(this.tabbedControls).forEach(function (tabName) {
                result.push({
                    label: tabName,
                    key: tabName
                });
            });

            return result;
        }
    },
    methods: {
        registerControl: function(control) {
            if (this.registeredControls.indexOf(control) === -1) {
                this.registeredControls.push(control);
            }
        },

        unregisterControl: function(control) {
            var index = this.registeredControls.indexOf(control);
            if (index !== -1) {
                this.registeredControls.splice(index, 1);
            }
        },

        validate: function () {
            var that = this;

            utils.clearPanelValidationErrors(that.registeredControls);

            return new Promise(function (resolve, reject) {
                var result = utils.validatePanelControls(that.registeredControls);
                if (result === null) {
                    resolve();
                }
                else {
                    return utils.expandControlParents(result.component)
                        .then(function () {
                            var controlTab = utils.findErrorComponentTab(result.component);
                            if (controlTab && that.tabbedControls[controlTab]) {
                                that.$refs.tabs.selectTab(controlTab);
                            }

                            return modalUtils
                                .showAlert(that.$el.getAttribute('data-validation-alert-title'), result.message)
                                .then(function () {
                                    result.component.focusControl();
                                    reject(result.message);
                                });
                        });
                }
            });
        },

        onTabSelected: function () {
            this.panelUpdateData.tabChanged++;
        }
    }
};
