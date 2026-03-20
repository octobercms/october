import dataSchema from './dataschema.js';

export class InspectorUtils {
    #validator = null;

    #getValidator() {
        if (this.#validator) {
            return this.#validator;
        }

        var ajv = new Ajv({
            jsonPointers: true
        });
        this.#validator = ajv.compile(dataSchema);

        return this.#validator;
    }

    #shouldSkipValidation(component) {
        var parent = component.$parent;
        while (parent) {
            if (parent.shouldSkipInspectorValidation) {
                if (parent.shouldSkipInspectorValidation() === true) {
                    return true;
                }
            }

            parent = parent.$parent;
        }

        return false;
    }

    validateDataSchema(obj) {
        var validator = this.#getValidator(),
            result = validator(obj);

        if (result === true) {
            return result;
        }

        var error = validator.errors[0];

        return 'Inspector data schema error. ' + error.dataPath + ' ' + error.message;
    }

    groupControls(controls) {
        var result = {
            ungrouped: []
        };

        for (var index = 0; index < controls.length; index++) {
            var control = controls[index];

            if (!control.group) {
                result.ungrouped.push(control);
            }
            else {
                if (result[control.group] === undefined) {
                    result[control.group] = [];
                }

                result[control.group].push(control);
            }
        }

        return result;
    }

    clearPanelValidationErrors(registeredControls) {
        for (var index = 0; index < registeredControls.length; index++) {
            var control = registeredControls[index];

            if (control.markValid) {
                control.markValid();
            }
        }

        return null;
    }

    validatePanelControls(registeredControls) {
        for (var index = 0; index < registeredControls.length; index++) {
            var control = registeredControls[index];

            if (control.validatePropertyValue) {
                if (!this.#shouldSkipValidation(control)) {
                    var result = control.validatePropertyValue();
                    if (result !== null) {
                        return {
                            message: result,
                            component: control
                        };
                    }
                }
                else {
                    control.markValid();
                }
            }
        }

        return null;
    }

    findErrorComponentTab(component) {
        var parent = component;
        while (parent) {
            if (parent.inspectorGetTab) {
                var result = parent.inspectorGetTab();
                if (result) {
                    return result;
                }
            }

            parent = parent.$parent;
        }
    }

    expandControlParents(component) {
        return new Promise(function (resolve, reject) {
            var parent = component.$parent;
            while (parent) {
                if (parent.expandInspectorControl) {
                    parent.expandInspectorControl();
                }

                parent = parent.$parent;
            }

            resolve();
        });
    }

    getProperty(obj, dotNotationPath) {
        if (dotNotationPath === undefined) {
            return undefined;
        }

        function reducer(obj, i) {
            if (!obj) {
                return undefined;
            }

            return obj[i];
        }

        return dotNotationPath.split('.').reduce(reducer, obj);
    }

    setProperty(obj, dotNotationPath, value) {
        var parts = dotNotationPath.split('.');

        function setPropertyAtPath(currentObj, pathParts) {
            var property = pathParts.shift();

            if (!pathParts.length) {
                // Vue 3: Direct assignment is reactive
                currentObj[property] = value;
                return;
            }

            if (currentObj[property] === undefined) {
                // Vue 3: Direct assignment is reactive
                currentObj[property] = {};
            }

            setPropertyAtPath(currentObj[property], pathParts);
        }

        setPropertyAtPath(obj, parts);
    }

    deleteProperty(obj, dotNotationPath) {
        var parts = dotNotationPath.split('.');

        function deletePropertyAtPath(currentObj, pathParts) {
            var property = pathParts.shift();

            if (!pathParts.length && currentObj[property] !== undefined) {
                // Vue 3: Use delete operator
                delete currentObj[property];
                return;
            }

            if (currentObj[property] === undefined) {
                return;
            }

            deletePropertyAtPath(currentObj[property], pathParts);
        }

        deletePropertyAtPath(obj, parts);
    }

    isValueEmpty(value) {
        return value === undefined
            || value === null
            || (typeof value == 'object' && $.isEmptyObject(value))
            || (typeof value == 'string' && $.trim(value).length === 0)
            || (Object.prototype.toString.call(value) === '[object Array]' && value.length === 0);
    }

    getLocalStorageKey(component, key) {
        return 'inspector-' + component.inspectorUniqueId + '-' + key;
    }

    deepCloneObject(src, dst) {
        function deepCloneProperty(value) {
            if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                return value;
            }

            var result = {};
            for (var key in value) {
                result[key] = deepCloneProperty(value[key]);
            }

            return result;
        }

        for (var key in src) {
            var value = src[key];
            // Vue 3: Direct assignment is reactive
            dst[key] = deepCloneProperty(value);
        }

        for (var key in dst) {
            if (src[key] === undefined) {
                // Vue 3: Use delete operator
                delete dst[key];
            }
        }
    }
}

export const utils = new InspectorUtils();

export default utils;
