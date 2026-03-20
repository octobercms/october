class Utils {
    isLastElementSeparator(component) {
        const elements = component.toolbarContainer;
        const element = elements[elements.length - 1];

        if (!element) {
            return false;
        }

        return element.type === 'separator';
    }

    mapIconName(component, editorIconName) {
        if (component.iconMap[editorIconName] === undefined) {
            return editorIconName;
        }

        return component.iconMap[editorIconName];
    }

    addSeparator(component) {
        if (!this.isLastElementSeparator(component)) {
            component.toolbarContainer.push({ type: 'separator' });
        }
    }

    getButtonCommand($button) {
        const classes = $button.attr('class').split(' ');

        for (let index = 0; index < classes.length; index++) {
            const className = classes[index];
            if (['active'].indexOf(className) === -1) {
                return className;
            }
        }

        return null;
    }

    dropdownFromButton(component, $button) {
        const cmd = this.getButtonCommand($button);
        const basicConfig = this.basicButtonConfig(component, $button);
        basicConfig.type = 'dropdown';
        basicConfig.menuitems = [];

        const knownButtonConfig = component.buttonConfig[cmd];

        knownButtonConfig.dropdown.forEach((dropdownItem) => {
            basicConfig.menuitems.push({
                type: 'text',
                command: 'markdowneditor-toolbar-' + dropdownItem.command,
                label: component.trans(dropdownItem.label)
            });
        });

        component.toolbarContainer.push(basicConfig);
    }

    basicButtonConfig(component, $button) {
        const cmd = this.getButtonCommand($button);

        if (cmd === null) {
            console.log('Markdown button command not found', $button);
            return;
        }

        let buttonCmd = cmd;
        const knownButtonConfig = component.buttonConfig[cmd];
        if (knownButtonConfig && knownButtonConfig.cmd) {
            buttonCmd = knownButtonConfig.cmd;
        }

        let ignorePressState = false;
        if (knownButtonConfig) {
            ignorePressState = knownButtonConfig.ignorePressState;
        }

        return {
            type: 'button',
            icon: 'icon-' + this.mapIconName(component, cmd),
            command: 'markdowneditor-toolbar-' + buttonCmd,
            tooltip: component.trans($button.attr('title')),
            pressed: !ignorePressState && $button.hasClass('active')
        };
    }

    buttonFromButton(component, $button) {
        component.toolbarContainer.push(this.basicButtonConfig(component, $button));
    }

    parseCommandString(command) {
        if (!/^markdowneditor\-toolbar-/.test(command) || !/^[0-9a-z\-\@:\|;,\s]+$/i.test(command)) {
            return null;
        }

        const editorCommand = command.substring(23);
        const isOctoberCommand = editorCommand.substring(0, 3) === 'oc-';

        return {
            editorCommand,
            isOctoberCommand
        };
    }
}

export default new Utils();