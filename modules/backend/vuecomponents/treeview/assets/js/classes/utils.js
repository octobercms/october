/*
 * TreeView utilities class
 */
export class TreeviewUtils {
    fuzzySearch(query, str) {
        var queryArray = query.split(' '),
            wordsFound = 0;

        for (var index = 0; index < queryArray.length; index++) {
            if (str.indexOf(queryArray[index]) !== -1) {
                wordsFound++;
            }
        }

        return wordsFound == queryArray.length;
    }

    compareAnything(value1, value2, invertor) {
        if (value1 > value2) {
            return 1 * invertor;
        }

        if (value1 < value2) {
            return -1 * invertor;
        }

        return 0;
    }

    compareStrings(str1, str2, invertor) {
        if (str1.localeCompare !== undefined) {
            return str1.localeCompare(str2) * invertor;
        }

        return this.compareAnything(str1, str2, invertor);
    }

    ungroupGroupedNodes(nodes) {
        for (var index = 0; index < nodes.length; index++) {
            var node = nodes[index],
                subnodes = this.getSystemData(node, 'groupedNodes');

            if (subnodes && subnodes.length > 0) {
                // Vue 3: Direct assignment is reactive
                node.systemData.groupedNodes = [];
            }

            // Traversing subnodes is not needed. When we group
            // nodes, we keep the original node list intact, so
            // it is enough to clear systemData.groupedNodes for
            // all top-level nodes to ungroup everything.
        }

        return nodes;
    }

    makeFolderNodesForPath(folderNodes, path, folderIcon) {
        var pathParts = path.split('/'),
            keyPath = [],
            lastParent = null,
            keyPrefix = 'treegroupby-folder-';

        for (var index = 0; index < pathParts.length; index++) {
            var currentPart = keyPrefix + pathParts[index];
            keyPath = keyPath.concat(currentPart);

            var existingFolder = $.oc.vueUtils.findObjectByKeyPath(
                folderNodes,
                keyPath,
                'systemData.groupedNodes',
                'uniqueKey'
            );
            if (!existingFolder) {
                var folder = {
                    label: pathParts[index],
                    uniqueKey: currentPart,
                    icon: folderIcon,
                    userData: {},
                    systemData: {
                        treeviewGroupFolder: true,
                        groupedNodes: []
                    },
                    nodes: []
                };

                if (lastParent) {
                    this.getSystemData(lastParent, 'groupedNodes').push(folder);
                }
                else {
                    folderNodes.push(folder);
                }

                lastParent = folder;
            }
            else {
                lastParent = existingFolder;
            }
        }

        return lastParent;
    }

    filterPathParts(pathParts, regex) {
        if (!regex) {
            return pathParts;
        }

        var result = [];
        for (var index = 0; index < pathParts.length; index++) {
            if (regex.test(pathParts[index])) {
                result.push(pathParts[index]);
            }
        }

        return result;
    }

    pathBeginsWith(path1, path2) {
        if (path1.length < path2.length) {
            return -1;
        }

        for (var index = 0; index < path2.length; index++) {
            if (path2[index] != path1[index]) {
                return false;
            }
        }

        return path2.length;
    }

    findParentNodeForPath(nodes, endIndex, path, groupBy, regex) {
        var pathParts = this.filterPathParts(path.split('/'), regex),
            lastParent = null,
            maxDepth = -1;

        for (var index = 0; index < endIndex; index++) {
            var node = nodes[index],
                nodePath = this.getUserData(node, groupBy);

            if (!nodePath) {
                continue;
            }

            var nodePathParts = this.filterPathParts(nodePath.split('/'), regex),
                depth = this.pathBeginsWith(pathParts, nodePathParts);

            if (depth > maxDepth) {
                maxDepth = depth;
                lastParent = node;
            }
        }

        return lastParent;
    }

    groupNodesToFolders(nodes, groupBy, folderIcon) {
        var ungroupedNodes = this.ungroupGroupedNodes(nodes),
            folderNodes = [],
            result = [];

        for (var index = 0; index < ungroupedNodes.length; index++) {
            var node = ungroupedNodes[index],
                path = this.getUserData(node, groupBy);

            if (path && path != '/') {
                var nodeFolder = this.makeFolderNodesForPath(folderNodes, path, folderIcon);

                nodeFolder.systemData = nodeFolder.systemData || {};
                nodeFolder.systemData.groupedNodes = nodeFolder.systemData.groupedNodes || [];
                nodeFolder.systemData.groupedNodes.push(node);
            }
            else {
                result.push(node);
            }
        }

        return folderNodes.concat(result);
    }

    groupNodesByNesting(nodes, groupBy, groupByRegex) {
        var ungroupedNodes = this.ungroupGroupedNodes(nodes),
            result = [],
            regex = groupByRegex ? new RegExp(groupByRegex, 'i') : null;

        for (var index = 0; index < ungroupedNodes.length; index++) {
            var node = ungroupedNodes[index],
                path = this.getUserData(node, groupBy);

            if (path && path != '/') {
                var parentNode = this.findParentNodeForPath(ungroupedNodes, index, path, groupBy, regex);

                if (parentNode) {
                    parentNode.systemData = parentNode.systemData || {};
                    parentNode.systemData.groupedNodes = parentNode.systemData.groupedNodes || [];
                    parentNode.systemData.groupedNodes.push(node);
                }
                else {
                    result.push(node);
                }
            }
            else {
                // We change keys for root nodes to enforce the reactive update. Missing this
                // results in root nodes not being redrawn when switching between folders/nesting
                // grouping modes.
                //
                this.setSystemData(node, 'updateKey', $.oc.domIdManager.generate('node-update-key'));
                result.push(node);
            }
        }

        return result;
    }

    getSystemData(node, systemDataProperty) {
        if (!node.systemData) {
            return undefined;
        }

        return node.systemData[systemDataProperty];
    }

    setSystemData(node, systemDataProperty, value) {
        // Vue 3: Direct assignment is reactive
        if (node.systemData === undefined) {
            node.systemData = {};
        }

        node.systemData[systemDataProperty] = value;
    }

    getUserData(node, userDataProperty) {
        if (!node.userData) {
            return undefined;
        }

        return node.userData[userDataProperty];
    }

    getAllUserDataValues(node) {
        if (!node.userData) {
            return [];
        }

        var result = [];
        for (var prop in node.userData) {
            if (node.userData.hasOwnProperty(prop)) {
                var value = node.userData[prop];
                if (typeof value === 'string') {
                    result.push(node.userData[prop]);
                }
            }
        }

        return result;
    }

    applyNodeSearch(nodes, searchQuery) {
        if (!searchQuery.length) {
            return nodes;
        }

        const self = this;

        function traverse(nodes, searchQuery, isGrouped) {
            var result = false;

            for (var index = 0; index < nodes.length; index++) {
                var currentNode = nodes[index],
                    nodeHasQuery = false,
                    childNodes = [];

                if (!self.getSystemData(currentNode, 'treeviewGroupFolder')) {
                    var searchData = currentNode.label,
                        allValues = self.getAllUserDataValues(currentNode);

                    if (currentNode.userData && currentNode.userData.nodeSearchData) {
                        searchData = currentNode.userData.nodeSearchData;
                    }

                    searchData += allValues.join(' ');

                    nodeHasQuery = self.fuzzySearch(searchQuery, searchData.toLowerCase());
                }

                if (currentNode.groupBy || isGrouped) {
                    childNodes = self.getSystemData(currentNode, 'groupedNodes') || [];
                }
                else {
                    childNodes = currentNode.nodes ? currentNode.nodes : [];
                }

                var childrenHasQuery = traverse(childNodes, searchQuery, isGrouped || currentNode.groupBy);

                // Vue 3: Direct assignment is reactive
                if (currentNode.systemData === undefined) {
                    currentNode.systemData = {};
                }

                if (childrenHasQuery || nodeHasQuery) {
                    currentNode.systemData.visibleInSearch = true;
                    result = true;
                }
                else {
                    currentNode.systemData.visibleInSearch = false;
                }
            }

            return result;
        }

        traverse(nodes, searchQuery);
    }

    groupNodes(nodes, rootNode, defaultFolderIcon) {
        // This method implements the automatic node grouping, which
        // corresponds to the groupBy=folders and groupBy=nesting options.
        //
        var result = nodes.slice();

        // TODO: groupByRegex is only supported for the nesting mode.
        //

        result = this.sortNodes(result, rootNode.groupBy);

        if (rootNode.groupByMode == 'folders') {
            result = this.groupNodesToFolders(result, rootNode.groupBy, rootNode.groupByFolderIcon || defaultFolderIcon);
        }

        if (rootNode.groupByMode == 'nesting') {
            result = this.groupNodesByNesting(result, rootNode.groupBy, rootNode.groupByRegex);
        }

        return result;
    }

    groupSectionNodes(sectionNodes, defaultFolderIcon) {
        for (var index = 0; index < sectionNodes.length; index++) {
            var node = sectionNodes[index];

            // Vue 3: Direct assignment is reactive
            if (!node.systemData) {
                node.systemData = {};
            }

            if (!node.groupBy) {
                node.systemData.groupedNodes = [];
                continue;
            }

            var nodes = this.groupNodes(node.nodes || [], node, defaultFolderIcon);

            node.systemData.groupedNodes = nodes;
        }

        return sectionNodes;
    }

    sortNodes(nodes, sortQuery) {
        var sortProperties = sortQuery.split(',');
        const self = this;

        sortProperties.forEach(function(element, index, array) {
            var property = element.trim(),
                propertyParts = property.split(':');

            array[index] = {
                property: propertyParts[0],
                invertor: propertyParts[1] === 'desc' ? -1 : 1
            };
        });

        return nodes.sort(function(node1, node2) {
            if (node1.userData === undefined) {
                throw new Error('Unable to sort treeview nodes. userData is not defined for node ' + node1.label);
            }

            if (node2.userData === undefined) {
                throw new Error('Unable to sort treeview nodes. userData is not defined for node ' + node2.label);
            }

            // Always put automatically created folders to the top
            //
            if (self.getSystemData(node1, 'treeviewGroupFolder') && !self.getSystemData(node2, 'treeviewGroupFolder')) {
                return -1;
            }

            if (!self.getSystemData(node1, 'treeviewGroupFolder') && self.getSystemData(node2, 'treeviewGroupFolder')) {
                return 1;
            }

            if (self.getSystemData(node1, 'treeviewGroupFolder') && self.getSystemData(node2, 'treeviewGroupFolder')) {
                return self.compareStrings(
                    node1.systemData.treeviewGroupFolder,
                    node2.systemData.treeviewGroupFolder,
                    1
                );
            }

            for (var index = 0; index < sortProperties.length; index++) {
                var propertyParts = sortProperties[index],
                    node1Prop = node1.userData[propertyParts.property],
                    node2Prop = node2.userData[propertyParts.property],
                    cmpResult = 0;

                if (node1Prop === undefined) {
                    throw new Error(
                        'Unable to sort treeview nodes. Property ' +
                            propertyParts.property +
                            ' is not defined in userData of ' +
                            node1.label
                    );
                }

                if (node2Prop === undefined) {
                    throw new Error(
                        'Property ' + propertyParts.property + ' is not defined in userData of ' + node2.label
                    );
                }

                if (typeof node1Prop === 'string') {
                    cmpResult = self.compareStrings(node1Prop, node2Prop, propertyParts.invertor);
                }
                else {
                    cmpResult = self.compareAnything(node1Prop, node2Prop, propertyParts.invertor);
                }

                if (cmpResult !== 0) {
                    return cmpResult;
                }
            }
        });
    }

    findNodeObjectByKeyPath(nodes, keyPathArray) {
        return $.oc.vueUtils.findObjectByKeyPath(nodes, keyPathArray, 'nodes', 'uniqueKey');
    }

    findNodeObjectByKeyPathInSections(sections, keyPathArray) {
        var result = null;

        for (var index = 0; index < sections.length; index++) {
            result = this.findNodeObjectByKeyPath(sections[index].nodes, keyPathArray);
            if (result) {
                return result;
            }
        }

        return result;
    }

    makeKeyPath(parentNodes, node) {
        var result = [];
        for (var index = 0; index < parentNodes.length; index++) {
            result.push(parentNodes[index].uniqueKey);
        }

        result.push(node.uniqueKey);
    }

    findNodeByKey(nodes, key) {
        var result = $.oc.vueUtils.findObjectsByProperty(nodes, 'nodes', 'uniqueKey', key);

        if (!result.length) {
            return null;
        }

        return result[0];
    }

    findNodeAndPathByKey(nodes, key) {
        function traverse(nodeList, path) {
            for (var index = 0; index < nodeList.length; index++) {
                var node = nodeList[index];

                if (node.uniqueKey === key) {
                    return {
                        node: node,
                        path: path
                    };
                }

                var childData = traverse(node.nodes || [], path.concat([node]));
                if (childData) {
                    return childData;
                }
            }
        }

        return traverse(nodes, []);
    }

    findNodeAndPathByKeyInSections(sections, key) {
        var result = null;

        for (var index = 0; index < sections.length; index++) {
            result = this.findNodeAndPathByKey(sections[index].nodes, key);
            if (result) {
                return result;
            }
        }

        return result;
    }

    findNodeByKeyInSections(sections, key) {
        var result = null;

        for (var index = 0; index < sections.length; index++) {
            result = this.findNodeByKey(sections[index].nodes, key);
            if (result) {
                return result;
            }
        }

        return result;
    }

    findNodePathByKey(nodes, key) {
        const self = this;

        function traverse(objects, path, isBranchGrouped) {
            for (var index = 0; index < objects.length; index++) {
                var object = objects[index],
                    currentPropertyValue = object.uniqueKey,
                    isGrouped = isBranchGrouped || object.groupBy;

                if (currentPropertyValue === key) {
                    return path.concat(currentPropertyValue);
                }

                var childNodes = isGrouped ? self.getSystemData(object, 'groupedNodes') : object.nodes,
                    childPath = traverse(childNodes || [], path.concat(currentPropertyValue), isGrouped);

                if (childPath) {
                    return childPath;
                }
            }
        }

        return traverse(nodes, []);
    }

    findNodePathByKeyInSections(sections, key) {
        var path = null;

        for (var index = 0; index < sections.length; index++) {
            path = this.findNodePathByKey(sections[index].nodes, key);
            if (path) {
                return path;
            }
        }

        return path;
    }

    findNodeComponentByKey(nodes, key) {
        for (var index = 0; index < nodes.length; index++) {
            if (nodes[index].nodeData.uniqueKey == key) {
                return nodes[index];
            }
        }
    }

    findNodeComponentByKeyRecursive(node, key) {
        // Vue 3: Use childNodeRefs instead of $children
        var childRefs = node.childNodeRefs || [];
        for (var index = 0; index < childRefs.length; index++) {
            var childrenComponent = childRefs[index];
            if (!childrenComponent) continue;

            if (childrenComponent.nodeData.uniqueKey == key) {
                return childrenComponent;
            }

            var childNode = this.findNodeComponentByKeyRecursive(childrenComponent, key);
            if (childNode) {
                return childNode;
            }
        }
    }

    findRootNodeByKey(nodes, key) {
        for (var index = 0; index < nodes.length; index++) {
            var node = nodes[index];

            if (node.uniqueKey === key) {
                return node;
            }
        }
    }

    deleteNodeByKey(nodes, key) {
        var parentInfo = $.oc.vueUtils.findObjectParentInfoByProperty(nodes, 'nodes', 'uniqueKey', key);

        if (parentInfo) {
            parentInfo.parentArray.splice(parentInfo.index, 1);
            return true;
        }

        return false;
    }

    deleteNodeByKeyInSections(sections, key) {
        for (var index = 0; index < sections.length; index++) {
            if (this.deleteNodeByKey(sections[index].nodes, key)) {
                return true;
            }
        }

        return false;
    }

    updateRootNodes(nodes) {
        for (var index = 0; index < nodes.length; index++) {
            var node = nodes[index];
            this.setSystemData(node, 'updateKey', $.oc.domIdManager.generate('node-update-key'));
        }
    }

    updateRootNodesInSections(sections) {
        for (var index = 0; index < sections.length; index++) {
            this.updateRootNodes(sections[index].nodes);
        }
    }

    getFlattenNodes(nodes) {
        return $.oc.vueUtils.getFlattenNodes(nodes, 'nodes');
    }

    getLastGroupedPathSegment(label, node, isFolder, displayProperty) {
        if (isFolder || node.branchGroupByMode !== 'folders' || node.isRoot) {
            return label;
        }

        if (displayProperty && node.branchGroupBy !== displayProperty) {
            if (
                !node.branchGroupFolderDisplayPathProps ||
                node.branchGroupFolderDisplayPathProps.indexOf(displayProperty) === -1
            ) {
                return label;
            }
        }

        var parts = label.split('/');
        return parts[parts.length - 1];
    }

    findNodeInfoByKey(nodes, key) {
        var parentInfo = $.oc.vueUtils.findObjectParentInfoByProperty(nodes, 'nodes', 'uniqueKey', key);

        if (parentInfo) {
            return {
                parentArray: parentInfo.parentArray,
                index: parentInfo.index,
                nodeData: parentInfo.object
            };
        }

        return null;
    }

    findNodeInfoByKeyInSections(sections, key) {
        var result = null;

        for (var index = 0; index < sections.length; index++) {
            result = this.findNodeInfoByKey(sections[index].nodes, key);
            if (result) {
                return result;
            }
        }

        return result;
    }

    getQuickAccessLeafNonFolderItems(parentNodes, path) {
        var result = [];
        const self = this;

        function traverse(nodes, path, isBranchGrouped) {
            for (var index = 0; index < nodes.length; index++) {
                var node = nodes[index],
                    isGrouped = isBranchGrouped || node.groupBy;

                var childNodes = isGrouped ? self.getSystemData(node, 'groupedNodes') : node.nodes,
                    isFolder = self.getSystemData(node, 'treeviewGroupFolder'),
                    isLeaf =
                        (!Array.isArray(childNodes) || !childNodes.length) && node.icon !== 'folder' && !isFolder;

                if (isLeaf) {
                    // Ignore invisible nodes and root nodes
                    //
                    if (!self.getSystemData(node, 'visibleInSearch') || path.length == 1 || !node.selectable) {
                        continue;
                    }

                    if (node.hideInQuickAccess) {
                        continue;
                    }

                    result.push({
                        node: node,
                        path: path
                    });
                }
                else {
                    traverse(childNodes, path.concat([node]), isGrouped);
                }
            }
        }

        traverse(parentNodes, path);

        return result;
    }

    findQuickAccessNodes(sections, maxItems, searchQuery, defaultFolderIcon) {
        var result = [];

        for (var index = 0; index < sections.length; index++) {
            var section = sections[index],
                groupedNodes = this.groupSectionNodes(section.nodes, defaultFolderIcon);

            this.applyNodeSearch(groupedNodes, searchQuery);

            // We are working with a copy of the tree,
            // modifying objects is fine.
            //
            section.isSection = true;

            // In-place version of .concat
            result.push.apply(result, this.getQuickAccessLeafNonFolderItems(section.nodes, [section], section.label));
        }

        return result.slice(0, maxItems);
    }

    getQuickAccessLeafCommands(menuItems, path, labelAccumulator) {
        var result = [];

        function traverse(items, itemPath, label) {
            for (var index = 0; index < items.length; index++) {
                var item = items[index];

                if (item.type === 'separator') {
                    continue;
                }

                if (!Array.isArray(item.items) || !item.items.length) {
                    result.push({
                        item: item,
                        path: itemPath,
                        pathLabel: label + item.label
                    });
                }
                else {
                    traverse(item.items, itemPath.concat([item]), label + item.label);
                }
            }
        }

        traverse(menuItems, path, labelAccumulator);

        return result;
    }

    findQuickAccessCommands(sections, searchQuery) {
        var commands = [];

        for (var index = 0; index < sections.length; index++) {
            var section = sections[index];

            if (!Array.isArray(section.menuItems) || !section.menuItems.length) {
                continue;
            }

            commands.push.apply(commands, this.getQuickAccessLeafCommands(section.menuItems, [section], section.label));
        }

        if (!searchQuery.length) {
            return commands;
        }

        var result = [];
        for (var index = 0; index < commands.length; index++) {
            var command = commands[index];

            if (this.fuzzySearch(searchQuery, command.pathLabel.toLowerCase())) {
                result.push(command);
            }
        }

        return result;
    }
}

export const utils = new TreeviewUtils();
export default utils;
