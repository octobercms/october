* **Build x** (2014-06-10)
  - Form fields can now pass context via their name definnition using syntax `field@context`.
  - Added a code editor preferences page.

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
  - Added new override method `onInit()` to Components, called before AJAX requests are processed.

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
