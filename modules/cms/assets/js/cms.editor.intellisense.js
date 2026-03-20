import { CompleterOctoberTags } from './cms.editor.intellisense.completer.octobertags.js';
import { CompleterTwigFilters } from './cms.editor.intellisense.completer.twigfilters.js';
import { CompleterOctoberPartials } from './cms.editor.intellisense.completer.partials.js';
import { CompleterAssets } from './cms.editor.intellisense.completer.assets.js';
import { CompleterPages } from './cms.editor.intellisense.completer.pages.js';
import { CompleterOctoberContent } from './cms.editor.intellisense.completer.content.js';

import { ClickHandlerTemplate } from './cms.editor.intellisense.clickhandler.template.js';
import { ClickHandlerCssImport } from './cms.editor.intellisense.clickhandler.cssimports.js';
import { HoverProviderOctoberTags } from './cms.editor.intellisense.hoverprovider.octobertags.js';
import { HoverProviderTwigFilters } from './cms.editor.intellisense.hoverprovider.twigfilters.js';
import { IntellisenseUtils } from './cms.editor.intellisense.utils.js';
import { ActionHandlerExpandComponent } from './cms.editor.intellisense.actionhandler.expandcomponent.js';

let instance = null;

class CmsIntellisense {
    customData;
    completers;
    globalInitialized;
    linkProviders;
    hoverProviders;
    listeners;
    utils;
    actionHandlers;

    constructor(cmsCustomData) {
        this.customData = cmsCustomData.intellisense;
        this.globalInitialized = false;
        this.listeners = new Map();
        this.utils = new IntellisenseUtils(this);

        this.completers = {
            octoberTags: new CompleterOctoberTags(this),
            octoberPartials: new CompleterOctoberPartials(this),
            twigFilters: new CompleterTwigFilters(this),
            assets: new CompleterAssets(this),
            pages: new CompleterPages(this),
            content: new CompleterOctoberContent(this)
        };

        this.linkProviders = {
            octoberTemplates: new ClickHandlerTemplate(this, {
                canManagePartials: cmsCustomData.canManagePartials,
                canManageContent: cmsCustomData.canManageContent,
                canManageAssets: cmsCustomData.canManageAssets,
                canManagePages: cmsCustomData.canManagePages,
                editableAssetExtensions: cmsCustomData.editableAssetExtensions
            }),

            lessImports: new ClickHandlerCssImport(this, {
                extension: 'less'
            }),

            scssImports: new ClickHandlerCssImport(this, {
                extension: 'scss'
            })
        };

        this.hoverProviders = {
            octoberTags: new HoverProviderOctoberTags(this),
            twigFilters: new HoverProviderTwigFilters(this)
        };

        this.actionHandlers = new Map();
    }

    getCustomData() {
        return this.customData;
    }

    init(monaco, editor, monacoComponent) {
        if (!this.globalInitialized) {
            this.globalInitialized = true;
            monaco.languages.registerCompletionItemProvider('twig', this.completers.octoberTags);
            monaco.languages.registerCompletionItemProvider('twig', this.completers.octoberPartials);
            monaco.languages.registerCompletionItemProvider('twig', this.completers.twigFilters);
            monaco.languages.registerCompletionItemProvider('twig', this.completers.assets);
            monaco.languages.registerCompletionItemProvider('twig', this.completers.pages);
            monaco.languages.registerCompletionItemProvider('twig', this.completers.content);

            monaco.languages.registerLinkProvider('twig', this.linkProviders.octoberTemplates);
            monaco.languages.registerLinkProvider('less', this.linkProviders.lessImports);
            monaco.languages.registerLinkProvider('scss', this.linkProviders.scssImports);

            monaco.languages.registerHoverProvider('twig', this.hoverProviders.octoberTags);
            monaco.languages.registerHoverProvider('twig', this.hoverProviders.twigFilters);
        }

        this.addActionHandler(editor, new ActionHandlerExpandComponent(this, editor, monacoComponent));
    }

    trans(key) {
        return $.oc.editor.getLangStr(key);
    }

    addActionHandler(editor, handler) {
        if (this.actionHandlers.has(editor)) {
            const handlers = this.actionHandlers.get(editor);
            handlers.push(handler);
            return;
        }

        this.actionHandlers.set(editor, [handler]);
    }

    on(eventType, listener) {
        this.listeners.set(listener, eventType);
    }

    off(listener) {
        this.listeners.delete(listener);
    }

    emit(eventType, payload) {
        this.listeners.forEach((listenerEventType, listener) => {
            if (listenerEventType == eventType) {
                listener(payload);
            }
        });
    }

    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    modelHasTag(model, tag) {
        if (!model.octoberEditorCmsTags) {
            return false;
        }

        return model.octoberEditorCmsTags.indexOf(tag) !== -1;
    }

    getModelCustomAttribute(model, name) {
        if (model.octoberEditorAttributes === undefined) {
            return undefined;
        }

        return model.octoberEditorAttributes[name];
    }

    disposeForEditor(editor) {
        this.actionHandlers.forEach((handlers, currentEditor) => {
            if (currentEditor == editor) {
                handlers.forEach((handler) => handler.dispose());
            }
        });
    }

    onContextMenu(payload) {
        this.actionHandlers.forEach((handlers, editor) => {
            if (editor == payload.editor) {
                handlers.forEach((handler) => {
                    handler.onContextMenu(payload.editor, payload.target);
                });
            }
        });
    }

    onFilterSupportedActions(payload) {
        this.actionHandlers.forEach((handlers, editor) => {
            if (editor == payload.editor) {
                handlers.forEach((handler) => handler.onFilterSupportedActions(payload));
            }
        });
    }
}

export function makeCmsIntellisense(cmsCustomData) {
    if (instance !== null) {
        return instance;
    }

    return (instance = new CmsIntellisense(cmsCustomData));
}

export { CmsIntellisense };
