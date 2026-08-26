# Editor Module

The Editor module provides a browser-based IDE for editing CMS templates, Tailor blueprints, and other document types directly in the browser. Unlike traditional CMS platforms that force developers into basic textarea fields or require external IDEs, October CMS includes a full-featured editor environment with tabbed documents, sidebar navigation, Inspector property panels, and a command system -- all running client-side with Vue and ES6 modules.

The Editor is fully extensible. Plugins can register custom document types, editors, and navigator sections using a clean extension architecture. This means any plugin can add first-class editing support for its own file types, giving developers a unified editing experience across the entire CMS without leaving the browser.

## Creating Editor Extensions

Extensions are registered using the `editor.extension.register` event in PHP:

```php
Event::listen('editor.extension.register', function () {
    return YourEditorExtension::class;
});
```

The event handler must return an extension class name. Extension classes must extend `Editor\Classes\ExtensionBase` and implement all its abstract methods. The two important extension features are the **namespace** and **document types**. The namespace is a string that must uniquely identify the extension, for example `cms`. Document types are strings describing document types the extension can handle. For example, the CMS Editor extension provides management for the `cms-page`, `cms-partial`, and other document types.

## Server-side extension class

Extension classes extend `Editor\Classes\ExtensionBase` and must implement `getNamespace()`. The following methods can be overridden to provide extension functionality:

| Method | Description |
|--------|-------------|
| `getNamespace(): string` | Returns the unique namespace (e.g. `cms`). **Required.** |
| `listVueComponents()` | Returns an array of Vue component class names required by the extension. |
| `listJsFiles()` | Returns an associative array of JavaScript file paths and attributes. |
| `listNavigatorSections(SectionList $sectionList, $documentType)` | Populates the sidebar Navigator sections for the extension. |
| `listInspectorConfigurations()` | Returns Inspector form configurations available on the client side. |
| `getNewDocumentsData()` | Returns an array of `NewDocumentDescription` objects for creating new documents. |
| `getSettingsForms()` | Returns settings form configurations for supported document types. |
| `getClientSideLangStrings()` | Returns language string keys needed by the client-side controller. |
| `getCustomData()` | Returns custom state data passed to the client-side extension. |
| `runCommand($command, $controller)` | Handles commands dispatched from the client side. |
| `getExtensionSortOrder()` | Controls extension position in the Navigator (default: `10`). |

Helper methods available in the base class:

- `loadSettingsFields(string $fieldsClass)` - loads Inspector form configurations from a settings field definition class.
- `loadAndLocalizeJsonFile(string $path)` - loads a JSON file and translates all string values.

## Client-side editor extensions

On the client side, every extension is represented by a class that extends `ExtensionBase` (imported from `editor.extension.base.js`). Extensions register themselves by assigning their class to the global `oc.editorExtensions` object:

```js
import { ExtensionBase } from '../../../../editor/assets/js/editor.extension.base.js';

class CmsEditorExtension extends ExtensionBase {
    listDocumentControllerClasses() {
        return [DocumentControllerPage, DocumentControllerLayout];
    }
}

oc.editorExtensions = oc.editorExtensions || {};
oc.editorExtensions['cms'] = CmsEditorExtension;
```

For every document type, a client-side extension must provide at least two classes:

- **Document controller** - handles client-side features for a single document type.
- **Document editor Vue component** - provides the editing UI for the document type.

The client-side extension class must return the list of supported document controllers using the `listDocumentControllerClasses()` method.

Useful properties and methods on the base extension class:

- `editorNamespace` - the extension's namespace string.
- `editorStore` - a reference to the Editor Store object.
- `editorApplication` - a reference to the Editor Application component.
- `customData` - custom state data provided by the server-side extension.
- `trans(key)` - returns a translated string. Translatable strings must be registered in the server-side extension class.
- `getInspectorConfiguration(name)` - returns an Inspector form configuration by name.
- `getDocumentController(documentType)` - returns the document controller for a given document type.

### Document controllers

Document controller classes extend `DocumentControllerBase` (imported from `editor.extension.documentcontroller.base.js`). Each controller handles a single document type and must define two getter properties:

```js
import { DocumentControllerBase } from '../../../../editor/assets/js/editor.extension.documentcontroller.base.js';

class DocumentControllerPage extends DocumentControllerBase {
    get documentType() {
        return 'cms-page';
    }

    get vueEditorComponentName() {
        return 'cms-editor-component-page-editor';
    }
}
```

Useful properties and methods defined in the base document controller class:

- `parentExtension` - a reference to the parent extension object.
- `editorNamespace` - the extension's namespace string.
- `editorStore` - a reference to the Editor Store object.
- `trans(key)` - returns a translated string.
- `on(commands, callback)` - registers command listeners (see Command system below).
- `emit(commandString, payload)` - emits a command to all registered listeners.
- `initListeners()` - override to register custom command listeners during construction.
- `preprocessNewDocumentData(newDocumentData, commandObj)` - override to modify new document data before it is passed to the editor component.
- `preprocessSettingsFields(settingsFields)` - override to modify settings form fields.
- `beforeDocumentOpen(commandObj, nodeData)` - override to intercept document opening. Return `false` to cancel.

### File system functions

The `FileSystemFunctions` class (imported from `editor.extension.filesystemfunctions.js`) provides common file operations for document controllers that manage file-based documents. Create an instance in your document controller:

```js
import { FileSystemFunctions } from '../../../../editor/assets/js/editor.extension.filesystemfunctions.js';

class DocumentControllerAsset extends DocumentControllerBase {
    constructor(parentExtension) {
        super(parentExtension);
        this.fs = new FileSystemFunctions(this);
    }
}
```

Available methods:

- `createDirectoryFromNavigatorMenu(handlerName, cmd, payload, metadataExtraData)` - shows a dialog to create a new directory.
- `renameFileOrDirectoryFromNavigatorMenu(handlerName, cmd, payload, metadataExtraData)` - shows a dialog to rename a file or directory.
- `deleteFileOrDirectoryFromNavigatorMenu(handlerName, cmd, payload, metadataExtraData)` - confirms and deletes files or directories.
- `handleNavigatorNodeMove(handlerName, cmd, metadataExtraData)` - handles drag-and-drop moves in the Navigator.
- `uploadDocument(allowedExtensions, handlerName, cmd, requestExtraData)` - opens a file picker to upload files.
- `handleNavigatorExternalDrop(handlerName, cmd, requestExtraData)` - handles files dropped from outside the browser.

The corresponding server-side trait `Editor\Traits\FileSystemFunctions` (used by `ExtensionBase`) provides PHP methods for handling these operations: `editorCreateDirectory`, `editorRenameFileOrDirectory`, `editorDeleteFileOrDirectory`, `editorMoveFilesOrDirectories`, and `editorUploadFiles`.

### Command system

Editor-wide commands can be dispatched using the `store.dispatchCommand` method:

```js
$.oc.editor.store.dispatchCommand('cms:navigator-context-menu-display', payload);
```

Commands are dispatched to all document controllers registered by the extension specified in the command namespace (`cms` in the example above). Use the `global` namespace to dispatch to all extensions:

```js
$.oc.editor.store.dispatchCommand('global:some-command', payload);
```

Command syntax is `"namespace:command@parameter"`. The namespace and parameter parts are optional. Commands can be parsed using the `EditorCommand` class (imported from `editor.command.js`):

- `namespace` - the extension namespace (e.g. `cms`).
- `command` - the command name.
- `parameter` - an optional parameter (e.g. a document type).
- `fullCommand` - the full command string.
- `basePart` - the command without the parameter.
- `hasParameter` - whether the command has a parameter.

Document controllers register command listeners in the `initListeners` method:

```js
initListeners() {
    this.on(this.editorNamespace + ':navigator-context-menu-display', this.onNavigatorContextMenuDisplay);
}
```

If a listener is registered without a parameter (e.g. `cms:create-document`), it will also be triggered for parameterized commands (e.g. `cms:create-document@cms-page`).

### Document URIs

Document URIs are fully qualified document identifiers with the syntax `"namespace:document-type:unique-key"`, for example `"cms:cms-page:index.htm"`. The `DocumentUri` class (imported from `editor.documenturi.js`) provides:

- `DocumentUri.parse(uriString, silent)` - parses a URI string into a `DocumentUri` instance. If `silent` is `true`, returns `false` instead of throwing on invalid input.
- `uri` - the full URI string.
- `namespace` - the extension namespace.
- `documentType` - the document type.
- `uniqueKey` - the unique document key.
- `namespaceAndDocType` - the namespace and document type combined (e.g. `"cms:cms-page"`).

### Document editor Vue components

Document editor Vue components use the `DocumentComponentBase` mixin (imported from `editor.extension.documentcomponent.base.js`) to get standard document editing behavior.

Computed properties provided by the mixin:

- `namespace` - namespace of the Editor extension the component belongs to.
- `extension` - a reference to the Editor extension object.
- `documentType` - the document type this component handles.
- `documentUri` - the full document URI string.
- `documentUriObj` - an instance of the `DocumentUri` class.
- `store` - a reference to the Editor Store object.
- `application` - a reference to the Editor Application component.
- `isDocumentChanged` - whether the document has unsaved changes.
- `isNewDocument` - whether the document is new (not yet saved).
- `hasSettingsForm` - whether the document type has a settings form.

Data properties:

- `documentData` - the document content being edited.
- `documentMetadata` - metadata about the document.
- `processing` - loading/saving state flag.
- `initializing` - initial load state flag.
- `documentHeaderCollapsed` - whether the document header toolbar is collapsed.
- `documentFullScreen` - whether full-screen mode is active.

Methods provided by the mixin:

- `ajaxRequest(handler, requestData)` - executes an AJAX request. Requests are queued so only one runs at a time. If the document tab closes, pending requests are aborted.
- `trans(key)` - returns a translated string.
- `saveDocument(force, inspectorDocumentData, extraData, noSavedMessage)` - saves the document. Handles conflict resolution automatically when the server detects a modification time mismatch.
- `deleteDocument(extension)` - confirms and deletes the document.
- `requestDocumentFromServer(extraData, suppressGlobalDocumentError)` - loads the document from the server.
- `openSettingsForm()` - opens the document settings Inspector popup.
- `updateTabLabel(label)` - updates the tab label.
- `closeDocumentTab(force)` - closes the document's tab.
- `handleBasicDocumentCommands(command, isHotkey)` - handles standard commands: `save`, `delete`, `settings`, `document:toggleToolbar`, `document:toggleFullscreen`.

Lifecycle hooks that can be overridden:

- `documentLoaded(data)` - called after a document is loaded from the server.
- `documentCreated()` - called after a new document is created.
- `documentCreatedOrLoaded()` - called after either creation or loading.
- `documentSaved(data, prevData)` - called after a document is saved.
- `getSaveDocumentData(inspectorDocumentData)` - **must be implemented**. Returns the data to send when saving.
- `getMainUiDocumentProperties()` - **must be implemented**. Returns a list of property names editable without opening the Settings popup.

### Accessing global Editor objects

- `$.oc.editor.application` - Editor Application component.
- `$.oc.editor.store` - Editor Store object.
- `$.oc.editor.page` - Editor Page object.
- `$.oc.editor.getLangStr(key)` - returns a translated string by key.