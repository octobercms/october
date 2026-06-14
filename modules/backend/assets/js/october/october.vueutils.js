+(function($) {
    'use strict';
    var VueUtils = function() {
        function findTraverseObjects(objectArray, currentKey, keyProperty) {
            for (var index = 0; index < objectArray.length; index++) {
                if (objectArray[index][keyProperty] === currentKey) {
                    return objectArray[index];
                }
            }

            return null;
        }

        this.getObjectProperty = function(obj, propertyPath) {
            var pathParts = propertyPath.split('.'),
                currentObject = obj;

            for (var index = 0; index < pathParts.length; index++) {
                var currentProperty = pathParts[index];

                if (currentObject[currentProperty] === undefined) {
                    return undefined;
                }

                currentObject = currentObject[currentProperty];
            }

            return currentObject;
        };

        this.getCleanObject = function(obj) {
            return JSON.parse(JSON.stringify(obj));
        };

        this.findObjectByKeyPath = function(objectArray, keyPathArray, childrenListProperty, keyProperty) {
            var keyPathCopy = keyPathArray.slice(),
                currentKey = keyPathCopy.shift(),
                obj = null;

            while (currentKey !== undefined) {
                if (!objectArray) {
                    return null;
                }

                obj = findTraverseObjects(objectArray, currentKey, keyProperty);
                if (obj === null) {
                    return obj;
                }

                objectArray = this.getObjectProperty(obj, childrenListProperty);
                if (objectArray === undefined) {
                    objectArray = [];
                }

                currentKey = keyPathCopy.shift();
            }

            return obj;
        };

        this.findObjectsByProperty = function(objectArray, childrenListProperty, propertyName, propertyValue, path) {
            var result = [];

            function traverse(objects) {
                for (var index = 0; index < objects.length; index++) {
                    var object = objects[index];

                    if (object[propertyName] === propertyValue) {
                        result.push(object);
                    }

                    traverse(object[childrenListProperty] || []);
                }
            }

            traverse(objectArray);

            return result;
        };

        this.getObjectPathByProperty = function(objectArray, childrenListProperty, propertyName, propertyValue) {
            function traverse(objects, path) {
                for (var index = 0; index < objects.length; index++) {
                    var object = objects[index],
                        currentPropertyValue = object[propertyName];

                    if (currentPropertyValue === propertyValue) {
                        return path.concat(currentPropertyValue);
                    }

                    var childPath = traverse(object[childrenListProperty] || [], path.concat(currentPropertyValue));
                    if (childPath) {
                        return childPath;
                    }
                }
            }

            return traverse(objectArray, []);
        };

        this.findObjectParentInfoByProperty = function(objectArray, childrenListProperty, propertyName, propertyValue) {
            function traverse(objects) {
                for (var index = 0; index < objects.length; index++) {
                    var object = objects[index];

                    if (object[propertyName] === propertyValue) {
                        return {
                            parentArray: objects,
                            index: index,
                            object: object
                        };
                    }

                    var subtreeResult = traverse(object[childrenListProperty] || []);
                    if (subtreeResult) {
                        return subtreeResult;
                    }
                }
            }

            return traverse(objectArray);
        };

        this.getFlattenNodes = function(objectArray, childrenListProperty) {
            var result = [];

            function traverse(objects) {
                for (var index = 0; index < objects.length; index++) {
                    var object = objects[index];

                    traverse(object[childrenListProperty] || []);
                    result.push(object);
                }
            }

            traverse(objectArray);

            return result;
        };

        this.stringHashCode = function(value) {
            var hash = 0,
                i,
                chr;

            for (i = 0; i < value.length; i++) {
                chr = value.charCodeAt(i);
                hash = (hash << 5) - hash + chr;
                hash |= 0;
            }

            return hash;
        };

        this.syncObjectProperties = function(srcObj, destObj) {
            for (var srcProp in srcObj) {
                if (!srcObj.hasOwnProperty(srcProp)) {
                    continue;
                }

                destObj[srcProp] = srcObj[srcProp];
            }

            for (var destProp in destObj) {
                if (!destObj.hasOwnProperty(destProp)) {
                    continue;
                }

                if (!srcObj.hasOwnProperty(destProp)) {
                    delete destObj[destProp];
                }
            }
        };

        this.stringFuzzySearch = function (query, str) {
            var queryArray = query.split(' '),
                wordsFound = 0;

            for (var index = 0; index < queryArray.length; index++) {
                if (str.indexOf(queryArray[index]) !== -1) {
                    wordsFound++;
                }
            }

            return wordsFound == queryArray.length;
        };

        this.getRelativeOffset = function (element1, element2) {
            var offset1 = $(element1).offset(),
                offset2 = $(element2).offset();

            return {
                left: offset1.left - offset2.left,
                top: offset1.top - offset2.top
            }
        };

        this.getToolbarExtensionPoint = function (source, element) {
            // Expected source value: 'document'
            // Maps to Vue app state keys: eventBus + toolbarExtensionPoint
            let parts;
            if (source === 'document') {
                parts = ['eventBus', 'toolbarExtensionPoint'];
            }
            else if (source.indexOf('::') !== -1) {
                parts = source.split('::');
            }
            else {
                parts = ['eventBus', source];
            }

            const vueApp = oc.VueApp.getFromElement(element);
            if (vueApp) {
                return {
                    bus: vueApp.getState(parts[0]),
                    state: vueApp.getState(parts[1])
                };
            }
        };
    };

    $.oc.vueUtils = new VueUtils();
})(window.jQuery);
