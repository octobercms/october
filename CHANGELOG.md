* **Build 206** (2015-02-21)
  - The back-end code editor now supports the use of [Emmet](http://emmet.io/).
  - Added the ability to prune Event and Request log records.

* **Build 199** (2015-02-19)
  - The **/uploads** directory has been moved to **/storage/app/uploads** to make way for CDN support. This directory should be moved on the file system and the config (`cms.storage.uploads.path`) updated.

* **Build 192** (2015-02-14)
  - For security reasons a vague error message is shown when a user tries to sign in unsuccessfully and the setting `app.debug` is disabled.
  - Added "Auto close tags and special characters" to Code editor preferences.

* **Build 187** (2015-02-12)
  - **Upgraded framework to Laravel version 5**, see the [end of beta page](http://octobercms.com/beta#advanced-upgrade) for information on how to upgrade.
  - Introduced a linking policy to control the way URLs are generated globally (see config cms.linkPolicy).
  - Popup control now supports several sizes via `data-size` attribute: giant, huge, large, small, tiny.
  - Added new scaffold command for creating form widgets `create:formwidget Acme.Blog PostSelector`.

* **Build 186** (2015-02-03)
  - File Upload form widget can now specify `fileTypes` for restricting which file extensions can be uploaded.

* **Build 184** (2015-01-31)
  - Lists now support exporting to CSV format via the default **export** controller action.
  - Platforms can *opt-in* for bleeding edge updates by enabling a config setting (`cms.edgeUpdates`), this helps perform testing before a stable version is deployed.

* **Build 183** (2015-01-22)
  - Relation Controller now supports *has one* and *belongs to* relations (see Backend > Relations docs).

* **Build 179** (2015-01-18)
  - The Settings page is no longer governed by a global permission, each settings entry should have its own permission definition.

* **Build 178** (2015-01-16)
  - The collapsed back-end side navigation now has a less annoying 200ms delay.

* **Build 175** (2015-01-13)
  - The variable `errors` will be included in a CMS page when redirecting via `Redirect::withErrors($validator)`.
  - Added new utility command for compiling back-end assets `october:util compile [assets|js|less]`.

* **Build 174** (2015-01-05)
  - Improved asset caching (`cms.enableAssetCache`), when enabled the server will send a *304 Not Modified* header.
  - Introduced new *Table* widget and *DataTable* form widget.
  - There is now a simpler way for sending mail via `Mail::sendTo()`.
  - The List Filter query can now be extended with controller override `listFilterExtendQuery()`.

* **Build 171** (2014-12-17)
  - Add new methods `propertyName()` and `paramName()` to Component base class for accessing names of external properties.

* **Build 169** (2014-12-16)
  - Native `alert` and `confirm` functions have been styled in the back-end.
  - Back-end user groups have a new description field, this is shown in the group list and when creating a new administrator.
  - Back-end user groups can now be marked to add new administrators by default. This affects when a group is created (if checked, all administrators are added to the group) and creating a new administrator (the default groups are checked by default).

* **Build 168** (2014-12-14)
  - Config item `cms.customErrorPage` is deprecated, the setting `app.debug` should be used instead.
  - Config item `cms.enableAssetMinify` can now be set to **null**, in which case assets are only minified if debug mode (`app.debug`) is disabled.

* **Build 167** (2014-12-06)
  - Settings pages now have a *Reset to default* button.
  - The field `authorUrl` has been renamed to `homepage` in theme.yaml files.
  - Adds Theme customization feature (see Themes > Development docs).

* **Build 166** (2014-11-27)
  - Plugin details method now support "homepage" property (see Plugins > Registration & Versions docs).
  - Fixes a bug in the Datepicker using `time` mode.

* **Build 162** (2014-11-10)
  - Fixes an issue where the *Pages* tab is shown in the CMS when permission is denied.
  - Updates are no longer shown on the Dashboard if permission is denied.
  - Added Maintenance mode settings to the front-end, available via Settings > CMS.

* **Build 160** (2014-11-01)
  - Various fixes to the Backend Brand settings page.
  - When `cms.disableCoreUpdates` is set to **true** the Backend will no longer display updates for the core.
  - Partials can support using Components (see CMS > Partials docs).

* **Build 158** (2014-10-23)
  - Fixes an issue where new Themes attached to a project were not being installed on update.
  - Fixes issue where XDebug aborts the thread for maximum function count.

* **Build 155** (2014-10-16)
  - Back-end area can now be customized with colors and logo, via System > Customize Back-end.
  - Added twig filters `|trans` for `Lang::get(...)` and `|transchoice` for `Lang::choice(...)`.
  - `SettingsModel` behavior now uses a cached database query.

* **Build 153** (2014-10-09)
  - Plugins are now updated in order of their dependency definitions.
  - Moved `ViewMaker` trait now lives under system, it can be useful for Models too.
  - Mailgun support added to Mail settings.
  - Form fields can now be marked as **hidden** (see Backend > Forms docs).
  - Added Controller behavior extension helpers `extendFormFields` and `extendListColumns`.

* **Build 149** (2014-09-29)
  - Added new `hint` form field type (see Backend > Forms docs).
  - Added new `containerAttributes` property to form fields (see Backend > Forms docs).
  - Field attributes have had an API change `$field->attributes` should now be `$field->getAttributes()`.
  - Added scheduled console commands (see Help > Console docs).

* **Build 145** (2014-09-13)
  - Standard setting pages now have **Save** and **Save and Close** buttons.

* **Build 143** (2014-09-09)
  - Various fixes to the RelationController relating to belongsToMany relations.
  - Tree Lists are now collapsed by default to better handle large data sets.
  - The `{% put %}` tag now appends by default.
  - The closing put tag now supports **overwrite**, eg: `{% endput overwrite %}`.
  - Numerous PostgreSQL support fixes.

* **Build 141** (2014-09-04)
  - Add new `dump()` Twig function (config app.debug must be true).
  - Components can now be expanded in the CMS editor by holding Ctrl/Meta and double clicking the `{% component %}` tag.

* **Build 139** (2014-08-30)
  - Components and variables can now be accessed in the page code section via `$this->foo` in addition to `$this['foo']`.
  - AJAX handlers in the CMS can now invoke the page cycle without rendering the page using `$this->pageCycle()`.
  - Fixes path references in the LESS compiler.
  - Asset combiner now supports aliases and external files (see CMS > Markup docs).

* **Build 138** (2014-08-18)
  - List widget has been refactored to improve efficiency.
  - Added new list column type `nameFrom` (take name from X attribute) as an alternative to `select`.

* **Build 137** (2014-08-14)
  - Lists now support Filters (see Backend > Lists docs).
  - Numerous hard coded phrases converted to localized strings.

* **Build 132** (2014-08-03)
  - New system logging pages: Event log, Request log and Access log.

* **Build 130** (2014-07-27)
  - Complete redesign of Settings area.
  - Added markdown Twig filter `{{ 'I am **markdown**'|md }}`.

* **Build 129** (2014-07-25)
  - Fixes a bug where the active theme is not editable in the back-end.
  - Added a new console command `october:util` for performing utility and maintenance tasks.
  - Added new utility command for deleting thumbs in the uploads directory `october:util purge thumbs`.
  - Improved console command confirmation dialogs.

* **Build 125** (2014-07-24)
  - Added support for Themes.
  - Added new Theme picker to the backend via Settings > Front-end theme
  - New shorthand method for `$this->getClassExtension('Backend.Behaviors.FormController')` becomes `$this->asExtension('FormController')`.
  - Buttons inside a popup support new `data-popup-load-indicator` attribute.
  - Added a new config item to disable core updates completely (see config cms.disableCoreUpdates).
  - Added a unique alternate favicon to the Back-end area.

* **Build 124** (2014-07-17)
  - Improvements to Twig functions and filters.
  - URL, HTML and Form helpers are now available in Twig.
  - The DataGrid form widget has been moved to a standard widget called Grid.

* **Build 122** (2014-07-15)
  - Restyled the CMS tabs

* **Build 117** (2014-07-12)
  - Added new Backend control for creating informative panels (hints).
  - Added new properties to RelationController: readOnly, showSorting, defaultSort.
  - Hashable, Sluggable, Purgeable and Validation traits must now be used in the Model class definition.
  - Plugins can now extend existing Back-end navigation menu items, see Event docs for an example.
  - Required form fields now sport an asterisk (*) character at the end of their label.

* **Build 116** (2014-07-07)
  - Added new layout and page method `onInit()` called after components are initialized and before AJAX requests are processed.

* **Build 115** (2014-07-06)
  - Important! All references to *Email* have been changed to *Mail* and renaming may be required in plugins.
  - Console command october:update now supports --core, --plugins and --force options.

* **Build 114** (2014-07-03)
  - Created a new Record Finder form widget for searching related records.
  - All instances now use the Cron queue driver by default (see config queue.default).
  - Created My Settings backend page. Renamed old My Settings to My Account.
  - Moved Editor Preferences to My Settings area.
  - Created Backend Preferences page, used for setting the Backend langauge.
  - Dropdown field options can now supply an image or icon.
  - CMS Pages now have a hidden flag.

* **Build 113** (2014-07-01)
  - Component properties now support grouping by supplying a `group` value.
  - Form fields now support interdependancies by supplying a `depends` value.
  - Improve styling on RelationController behavior.

* **Build 111** (2014-06-27)
  - Components now support a shared `/partials` directory used as a fallback when a partial is not found.
  - Improved the styling of the Breadcrumb and Email templates page.
  - Assets now correctly load when opening the site via `/index.php`.
  - Added a Preview website link to the Backend template.
  - Composer build now prefers stable packages.
  - Missing or broken components are now handled gracefully by the Backend.

* **Build 110** (2014-06-24)
  - Created a new Grid form widget for managing tabular data.
  - Widget identifiers have changed to remove the alias if it matches the default alias.
  - Add new form field type called `number`.
  - You can now override partials for Relation controller by creating partials with `relation_` prefix in the controller view directory.

* **Build 108** (2014-06-16)
  - Checkbox List form fields now use scrollbars for 10+ checkboxes.
  - Added new form behavior override: formCreateModelObject.
  - Fixes a bug where models using NestedTree trait would not save.
  - Opening back-end My Account page now has no permission check.

* **Build 106** (2014-06-10)
  - Upgrade to Laravel 4.2.
  - Form fields can now pass context via their name definnition using syntax `field@context`.
  - Added a code editor preferences page.
  - Fixes a bug where morphToMany relations show all records in list rows.

* **Build 101** (2014-06-06)
  - Added a global traceLog() helper for help with debugging.
  - New settings area added to manage Email templates and layouts.

* **Build 99** (2014-06-05)
  - Plugins can now be removed, refreshed and disabled via the back-end.

* **Build 96** (2014-05-29)
  - Plugin CLI commands are now case insensitive.
  - Fixes a bug where belongsTo form field relations were not being set.
  - Form field `richeditor` (WYSIWYG) no longer adds full page HTML tags.

* **Build 92** (2014-05-24)
  - Components can now be dragged from the side navigation directly on to the page.
  - Asset maker methods (addJs, addCss, addRss) now use an optional build code, either *core* or a plugin code. This is converted to a version number to ensure updates are not affected by cached assets.
  - Added new method `addComponent()` to Cms Controller. Components can now act as a proxy for other components.
  - Added new override method `init()` to Components, called before AJAX requests are processed.

* **Build 90** (2014-05-23)
  - Class `CmsPropertyHelper` has been deprecated, will be removed year > 2014.
  - Cms Objects now support basic queries that return a collection. Eg: `Page::sortBy('title')->lists('title', 'baseFileName')`

* **Build 89** (2014-05-22)
  - Components have a new override method `onRender()` called before a component is rendered.
  - The `{% component %}` tag now supports passing parameters that override the component properties when they are rendered.
  - Calling `addJs()` and `addCss()` in components without a starting slash (/) will now reference the component directory, instead of the theme.

* **Build 87** (2014-05-21)
  - Plugins can now be disabled manually by config (see config cms.disablePlugins).
  - Plugins with missing dependencies are disabled by the system.
  - Fixes an issue where paid plugins could not be downloaded.

* **Build 84** (2014-05-20)
  - A temporary directory can now be specified in config (see config cms.tempDir).
  - Default AJAX error message can now be overridden (see `ajaxErrorMessage` jQuery event).
  - SQLite support has been improved using new `October\Rain\Database\Dongle` class.
  - Included `doctrine/dbal` for supporting SQLite.

* **Build 82** (2014-05-19)
  - Line endings can be automatically converted when saving a CMS template (see config cms.convertLineEndings).
  - Updated Font-Autumn library to include 71 new icons.

* **Build 80** (2014-05-18)
  - Dashboard now displays warnings about system configuration item that need attention.
  - Newly created files will now have a default permission mask set (see config cms.defaultMask).

* **Build 64** (2014-05-15)
  - OctoberCMS released to the wild in Beta status.
