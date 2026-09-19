import { ControlBase, registerControl } from 'larajax';

/*
 * Toolbar builder form field control
 *
 * Visual editor for a rich editor toolbar definition. Renders a sortable row of
 * button tiles with a palette of available buttons, powered by the oc.richEditor
 * registry, serializing back to a comma separated string.
 *
 * Data attributes:
 * - data-control="toolbarbuilder" - enables the toolbar builder plugin
 * - data-buttons - the current button list
 * - data-seeded - the registered button list, enables the reset feature
 * - data-injectable - displays registered button injection with the toolbar
 */
registerControl('toolbarbuilder', class extends ControlBase {
    connect() {
        this.row = this.element.querySelector('[data-toolbar-row]');
        this.palette = this.element.querySelector('[data-toolbar-palette]');
        this.input = this.element.querySelector('[data-builder-input]');
        this.injectable = 'injectable' in this.element.dataset;
        this.seeded = 'seeded' in this.element.dataset ? this.normalize(this.element.dataset.seeded) : null;
        this.inherited = 'inherited' in this.element.dataset
            ? this.normalize(this.element.dataset.inherited)
            : oc.richEditor.resolveButtons({}).join(',');
        this.resetButton = this.makeResetButton();

        // Empty toolbars display the inherited default toolbar
        const initial = this.normalize(this.element.dataset.buttons);
        this.buildRow(initial.length ? this.displayValue(initial) : this.inherited);
        this.restockPalette();

        this.rowSortable = new Sortable(this.row, {
            group: { name: 'toolbarbuilder' },
            animation: 150,
            onAdd: (ev) => this.onRowAdd(ev),
            onSort: () => this.commit()
        });

        this.paletteSortable = new Sortable(this.palette, {
            group: { name: 'toolbarbuilder', pull: 'clone', put: true },
            sort: false,
            animation: 150,
            onAdd: (ev) => {
                // Dropping a row tile on the palette removes it
                ev.item.remove();
                this.commit();
            }
        });

        this.updateStatus();
    }

    disconnect() {
        this.rowSortable.destroy();
        this.paletteSortable.destroy();

        if (this.resetButton) {
            this.resetButton.remove();
        }

        this.row = this.palette = this.input = this.resetButton = null;
    }

    onReset = () => {
        this.row.innerHTML = '';
        this.buildRow(this.displayValue(this.seeded));
        this.commit();
    }

    // The untouched default toolbar displays registered button injection,
    // matching the toolbar an editor renders at runtime
    displayValue(value) {
        value = this.normalize(value);

        if (this.injectable && value === this.seeded) {
            return oc.richEditor.injectRegisteredButtons(value.split(',').filter(Boolean)).join(',');
        }

        return value;
    }

    makeResetButton() {
        // The reset feature requires a seeded definition and a popup footer
        const footer = this.element.closest('form')?.querySelector('.modal-footer');
        if (this.seeded === null || !footer) {
            return null;
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-secondary ms-auto';
        button.style.display = 'none';
        button.textContent = this.element.dataset.resetLabel;
        button.addEventListener('click', this.onReset);

        footer.appendChild(button);

        return button;
    }

    buildRow(buttons) {
        this.normalize(buttons).split(',').filter(Boolean).forEach((name) => {
            this.row.appendChild(this.makeTile(name));
        });
    }

    listAvailableButtons() {
        const names = Object.keys(oc.richEditor.knownButtons);

        Object.keys(oc.richEditor.buttons).forEach((name) => {
            if (names.indexOf(name) === -1) {
                names.push(name);
            }
        });

        return names;
    }

    listRowButtons() {
        return Array.from(this.row.children).map((tile) => tile.dataset.button);
    }

    makeTile(name) {
        const tile = document.createElement('li');
        tile.dataset.button = name;

        if (name === '|') {
            tile.className = 'builder-tile is-separator';
            tile.title = 'Separator';
            return tile;
        }

        const meta = oc.richEditor.getButtonMeta(name);
        tile.className = 'builder-tile' + (meta ? '' : ' is-unknown');
        tile.title = name;

        const icon = document.createElement('i');
        icon.className = meta && meta.icon ? meta.icon : 'icon-question';
        tile.appendChild(icon);

        const label = document.createElement('span');
        label.textContent = meta ? meta.label : name;
        tile.appendChild(label);

        return tile;
    }

    onRowAdd(ev) {
        const name = ev.item.dataset.button;

        // Reject duplicates, separators excluded
        if (name !== '|') {
            const count = this.listRowButtons().filter((button) => button === name).length;
            if (count > 1) {
                ev.item.remove();
                return;
            }
        }

        this.commit();
    }

    commit() {
        let value = this.listRowButtons().join(',');

        // A default toolbar left as displayed keeps the seeded definition,
        // any change stores the visible buttons exactly
        if (this.injectable) {
            if (!this.normalize(value).length) {
                value = this.seeded;
                this.buildRow(this.displayValue(value));
            }
            else if (this.normalize(value) === this.displayValue(this.seeded)) {
                value = this.seeded;
            }
        }
        // Empty and unchanged toolbars inherit the default toolbar
        else if (!this.normalize(value).length) {
            value = '';
            this.buildRow(this.inherited);
        }
        else if (this.normalize(value) === this.inherited) {
            value = '';
        }

        this.input.value = value;

        this.restockPalette();
        this.updateStatus();

        this.input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    restockPalette() {
        const used = this.listRowButtons();

        this.palette.innerHTML = '';
        this.palette.appendChild(this.makeTile('|'));

        this.listAvailableButtons().forEach((name) => {
            if (used.indexOf(name) === -1) {
                this.palette.appendChild(this.makeTile(name));
            }
        });
    }

    updateStatus() {
        if (!this.resetButton) {
            return;
        }

        const modified = this.normalize(this.input.value) !== this.seeded;
        this.resetButton.style.display = modified ? '' : 'none';
    }

    normalize(value) {
        return (value || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
            .join(',');
    }
});
