/*
 * Inspector engine helpers.
 *
 * The helpers are used mostly by the Inspector Surface.
 *
 */
+function ($) { "use strict";

    // NAMESPACES
    // ============================

    if ($.oc === undefined)
        $.oc = {}

    if ($.oc.inspector === undefined)
        $.oc.inspector = {}

    $.oc.inspector.engine = {}

    // CLASS DEFINITION
    // ============================

    function findGroup(group, properties) {
        for (var i = 0, len = properties.length; i < len; i++) {
            var property = properties[i]

            if (property.itemType !== undefined && property.itemType == 'group' && property.title == group) {
                return property
            }
        }

        return null
    }

    $.oc.inspector.engine.processPropertyGroups = function(properties) {
        var fields = [],
            result = {
                hasGroups: false,
                properties: []
            },
            groupIndex = 0

        for (var i = 0, len = properties.length; i < len; i++) {
            var property = properties[i]

            if (property['sortOrder'] === undefined) {
                property['sortOrder'] = (i+1)*20
            }
        }

        properties.sort(function(a, b){
            return a['sortOrder'] - b['sortOrder']
        })

        for (var i = 0, len = properties.length; i < len; i++) {
            var property = properties[i]

            property.itemType = 'property'

            if (property.group === undefined) {
                fields.push(property)
            }
            else {
                var group = findGroup(property.group, fields)

                if (!group) {
                    group = {
                        itemType: 'group',
                        title: property.group,
                        properties: [],
                        groupIndex: groupIndex
                    }

                    groupIndex++
                    fields.push(group)
                }

                property.groupIndex = group.groupIndex
                group.properties.push(property)
            }
        }

        for (var i = 0, len = fields.length; i < len; i++) {
            var property = fields[i]

            result.properties.push(property)

            if (property.itemType == 'group') {
                result.hasGroups = true

                for (var j = 0, propertiesLen = property.properties.length; j < propertiesLen; j++) {
                    result.properties.push(property.properties[j])
                }

                delete property.properties
            }
        }

        return result
    }
}(window.jQuery);
