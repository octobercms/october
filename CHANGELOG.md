* **Build 89** (2014-05-22)
  - Components have a new override method `onRender()` called before a component is rendered.
  - The `{% component %}` tag now supports passing parameters that override the component properties when they are rendered.
  - Calling `addJs()` and `addCss()` in components without a starting slash (/) will now reference the component directory, instead of the theme.

* **Build 87** (2014-05-21)
  - Plugins can now be disabled manually by config (see config cms.disablePlugins).
  - Plugins with missing dependancies are disabled by the system.
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
