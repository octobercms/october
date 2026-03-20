class Utils {
    isLastElementSeparator(component) {
        const elements = component.toolbarContainer;
        const element = elements[elements.length - 1];

        if (!element) {
            return false;
        }

        return element.type === 'separator';
    }

    mapIconName(component, editorIconName, defaultIconName) {
        if (component.iconMap[editorIconName] === undefined) {
            return defaultIconName || editorIconName;
        }

        return 'icon-' + component.iconMap[editorIconName];
    }

    addSeparator(component) {
        if (!this.isLastElementSeparator(component)) {
            component.toolbarContainer.push({ type: 'separator' });
        }
    }

    buttonFromButton(component, $button) {
        const cmd = $button.attr('data-cmd');
        const buttonIconName = $button.find('i').attr('class');

        const $wrapper = $button.closest('.fr-btn-wrap');
        if ($wrapper.length && $button.next('.fr-btn.fr-dropdown')) {
            // Dropdowns have two buttons,
            // ignore the first one.
            return;
        }

        let buttonCmd = cmd;
        const knownButtonConfig = component.buttonConfig[cmd];
        if (knownButtonConfig && knownButtonConfig.cmd) {
            buttonCmd = knownButtonConfig.cmd;
        }

        const codeEditing = component.loadingCodeEditingMode || component.codeEditingMode;

        component.toolbarContainer.push({
            type: 'button',
            icon: this.mapIconName(component, cmd, buttonIconName),
            command: 'richeditor-toolbar-' + buttonCmd,
            tooltip: $button.attr('title'),
            pressed: $button.hasClass('fr-active') || (codeEditing && cmd === 'html'),
            disabled: $button.hasClass('fr-disabled') || (codeEditing && cmd !== 'html')
        });
    }

    dropdownFromButton(component, $button, updateDropdownId) {
        let cmd = $button.attr('data-cmd');
        const knownButtonConfig = component.buttonConfig[cmd];

        if (knownButtonConfig && knownButtonConfig.convertToButtonGroup) {
            return this.buttonGroupFromButton(component, $button);
        }

        let buttonId = $button.attr('data-oc-button-id');
        if (!buttonId) {
            buttonId = $.oc.domIdManager.generate('oc-richedit-button');
            $button.attr('data-oc-button-id', buttonId);
        }

        if (updateDropdownId && buttonId !== updateDropdownId) {
            return;
        }

        const $wrapper = $button.closest('.fr-btn-wrap');
        const isWrapped = $wrapper.length > 0;

        let $items = null;
        if (!knownButtonConfig || !knownButtonConfig.dropdown) {
            $items = $wrapper.find('.fr-dropdown-menu li > a');
            if ($items.length === 0) {
                $items = $button.next('.fr-dropdown-menu').find('li a');
            }
        }

        let buttonIconName = '';
        let buttonTitle = '';
        let pressed = false;
        const noPressedState = knownButtonConfig && knownButtonConfig.noPressedState;

        if (isWrapped) {
            const $prevButton = $button.prev('.fr-btn');
            buttonIconName = $wrapper.find('.fr-btn i').attr('class');
            buttonTitle = $prevButton.find('.fr-sr-only').text();
            cmd = $prevButton.attr('data-cmd');
            pressed = !noPressedState && $prevButton.hasClass('fr-active');
        }
        else {
            buttonIconName = $button.find('i').attr('class');
            buttonTitle = $button.find('.fr-sr-only').text();
            pressed = !noPressedState && $button.hasClass('fr-active');
        }

        let type = 'button';
        let dropdownItemType = 'text';

        if (knownButtonConfig && knownButtonConfig.checkboxDropdown) {
            dropdownItemType = 'checkbox';
        }

        if ((knownButtonConfig && knownButtonConfig.dropdownOnly) || !isWrapped) {
            type = 'dropdown';
        }

        let buttonConfig = {};
        let emitCommandBeforeMenu = null;

        if (dropdownItemType == 'checkbox') {
            emitCommandBeforeMenu = 'richeditor-toolbar-' + cmd + '@oc-dropdown|' + buttonId;
        }

        if (!updateDropdownId && knownButtonConfig && knownButtonConfig.separatorBefore) {
            this.addSeparator(component);
        }

        if (!updateDropdownId) {
            const labelFromSelectedItem = knownButtonConfig && knownButtonConfig.checkedToLabel;
            const mappedIcon = this.mapIconName(component, buttonIconName);

            const codeEditing = component.loadingCodeEditingMode || component.codeEditingMode;

            buttonConfig = {
                type: type,
                icon: mappedIcon,
                command: 'richeditor-toolbar-' + cmd,
                emitCommandBeforeMenu: emitCommandBeforeMenu,
                tooltip: buttonTitle,
                pressed: pressed,
                menuitems: [],
                richeditorButtonId: buttonId,
                labelFromSelectedItem: labelFromSelectedItem,
                disabled: $button.hasClass('fr-disabled') || codeEditing
            };
        }
        else {
            buttonConfig = component.toolbarContainer.find((buttonElement) => {
                return buttonElement.richeditorButtonId === updateDropdownId;
            });
            buttonConfig.menuitems = [];
        }

        let firstItem = null;
        let checkedFound = false;

        if ($items !== null) {
            $items.each(function() {
                const $item = $(this);
                const cmd = $item.attr('data-cmd');
                const param = $item.attr('data-param1');
                const menuItem = {
                    type: dropdownItemType,
                    command: 'richeditor-toolbar-' + cmd + '@' + param,
                    label: $item.text(),
                    checked: $item.attr('aria-selected') === 'true'
                };

                if (knownButtonConfig && knownButtonConfig.applyItemStyle) {
                    menuItem.style = $item.attr('style');
                }

                checkedFound = checkedFound || menuItem.checked;

                if (!firstItem) {
                    firstItem = menuItem;
                }

                buttonConfig.menuitems.push(menuItem);
            });
        }

        if (knownButtonConfig && knownButtonConfig.dropdown) {
            knownButtonConfig.dropdown.forEach((customDropdownItem) => {
                buttonConfig.menuitems.push({
                    type: dropdownItemType,
                    command: 'richeditor-toolbar-' + customDropdownItem.command,
                    label: component.trans(customDropdownItem.label)
                });
            });
        }

        if (!checkedFound && firstItem) {
            firstItem.checked = true;
        }

        if (!updateDropdownId) {
            component.toolbarContainer.push(buttonConfig);
            if (knownButtonConfig && knownButtonConfig.separatorAfter) {
                this.addSeparator(component);
            }
        }
    }

    buttonGroupFromButton(component, $button) {
        this.addSeparator(component);
        const $dropdownItems = $button.next('.fr-dropdown-menu').find('li > a');
        const buttonIconName = $button.find('i').attr('class');
        const that = this;

        $dropdownItems.each(function() {
            const $dropdownButton = $(this);
            const cmd = $dropdownButton.attr('data-cmd');
            const param = $dropdownButton.attr('data-param1');

            const codeEditing = component.loadingCodeEditingMode || component.codeEditingMode;

            const buttonConfig = {
                type: 'button',
                icon: that.mapIconName(component, cmd + '-' + param, buttonIconName),
                command: 'richeditor-toolbar-' + cmd + '@' + param,
                tooltip: $dropdownButton.attr('title'),
                buttonGroup: true,
                disabled: $button.hasClass('fr-disabled') || codeEditing
            };

            if ($dropdownButton.find('i').attr('class') == buttonIconName) {
                buttonConfig.pressed = true;
            }

            component.toolbarContainer.push(buttonConfig);
        });

        this.addSeparator(component);
    }

    parseCommandString(command) {
        if (!/^richeditor\-toolbar-/.test(command) || !/^[0-9a-z\-\@:\|;,\s]+$/i.test(command)) {
            return null;
        }

        let froalaCommand = command.substring(19);
        let parameter = '';
        const cmdParts = froalaCommand.split('@');
        if (cmdParts.length > 1) {
            froalaCommand = cmdParts[0];
            parameter = cmdParts[1];
        }

        const parameterParts = parameter.split('|');
        let ocParameter = null;
        if (parameterParts.length > 1) {
            parameter = parameterParts[0];
            ocParameter = parameterParts[1];
        }

        const isOctoberCommand = froalaCommand.substring(0, 3) === 'oc-';

        return {
            froalaCommand,
            isOctoberCommand,
            parameter,
            ocParameter
        };
    }

    hasActiveFroalaPopup() {
        return $(document.body).find('.fr-popup.fr-active').length > 0;
    }

    makeTicks(component, interval) {
        const tickCount = Math.ceil(component.size / interval);
        const result = [];
        for (var index = 0; index < tickCount; index++) {
            result.push({
                style: {
                    left: index * interval + 'px'
                }
            });
        }

        return result;
    }

    updateEditorHtml(component, html) {
        component.editorTextarea.froalaEditor('html.set', html);
        component.editorTextarea.trigger('froalaEditor.contentChanged.richeditor');
    }
}

export default new Utils();