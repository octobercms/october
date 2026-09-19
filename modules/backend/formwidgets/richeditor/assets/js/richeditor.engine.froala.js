/*
 * Froala engine adapter for the rich editor button registry (oc.richEditor)
 *
 * Translates engine-agnostic button definitions into Froala commands and provides
 * the editor facade passed to button callbacks. Importing this module boots the
 * registry, sealing it against further registration.
 */

/*
 * RichEditorFacade is the engine-agnostic editor surface passed to button callbacks
 */
class RichEditorFacade {
    constructor(editor) {
        this.native = editor;
        this.engine = 'froala';
    }

    insertHtml(html) {
        this.native.html.insert(html);
        this.native.selection.restore();
    }

    insertElement(element) {
        this.insertHtml($('<div />').append($(element).clone()).remove().html());
    }

    insertUiBlock(node) {
        this.native.figures.insert($(node));
    }

    getContent() {
        return this.native.html.get();
    }

    setContent(html) {
        this.native.html.set(html);
    }

    saveSelection() {
        this.native.selection.save();
    }

    restoreSelection() {
        this.native.selection.restore();
    }

    focus() {
        this.native.events.focus(true);
    }

    saveUndoStep() {
        this.native.undo.saveStep();
    }
}

/*
 * makeFacade wraps a native Froala editor instance in the facade
 */
export function makeFacade(editor) {
    return new RichEditorFacade(editor);
}

/*
 * defineIcon registers the abstract icon value with Froala
 */
function defineIcon(name, icon) {
    if (typeof icon === 'string') {
        $.FE.DefineIcon(name, { NAME: icon.replace(/^icon-/, '') });
    }
    else if (icon && icon.html) {
        $.FE.DefineIconTemplate('oc-button-' + name, icon.html);
        $.FE.DefineIcon(name, { template: 'oc-button-' + name });
    }
}

/*
 * registerCommand translates a registry definition into a Froala command, any
 * engineOptions.froala keys are applied first and overridden by abstract ones
 */
function registerCommand(name, definition) {
    const config = Object.assign({}, definition.engineOptions ? definition.engineOptions.froala : null);

    config.title = definition.label || config.title || name;

    if (definition.undo !== undefined) {
        config.undo = definition.undo;
    }

    if (definition.focus !== undefined) {
        config.focus = definition.focus;
    }

    if (definition.onClick) {
        config.callback = function(...args) {
            return definition.onClick(makeFacade(this), ...args);
        };
    }

    $.FE.RegisterCommand(name, config);
}

/*
 * bootEngine drains the registry into Froala and seals it, called by the editor
 * surfaces at first initialization so all page scripts can register first, idempotent
 */
export function bootEngine() {
    if (oc.richEditor.booted) {
        return;
    }

    Object.keys(oc.richEditor.buttons).forEach((name) => {
        const definition = oc.richEditor.buttons[name];
        defineIcon(name, definition.icon);
        registerCommand(name, definition);
    });

    oc.richEditor.boot({ name: 'froala', makeFacade });
}
