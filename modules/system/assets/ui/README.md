# October Storm

Welcome to the client-side framework designed for the OctoberCMS back-end area, referred to as *October Storm*.

## Design consideration

In this library, each component behaves a bit like PHP. If a component depends on another component, it will include the file using `@import` in LESS or `=require` in JavaScript. Think of it like a namespace `use` reference in PHP.

Both compilers will exclude duplicates references (a la `require_once`), so the usage is designed to be compiled as one fell swoop. Meaning one build file per page. Using multiple builds may result in duplication of dependencies.

> **Note**: Compiling JavaScript depends on October's asset combiner as the `=require` directive was invented here to emulate the LESS `@import` functionality.

# UI Components

Components are a mixture of CSS and JavaScript (Controls), or can be solely style-based (Styles) or solely script-based (Scripts).

Each component has a *strong name*, for example the loading indicator has the name `loader`. For complex components, they can be broken in to child components, for example `loader.stripe`. Not all child components can be used independently of their parents, but this is certainly possible and a nice idea.

These Scripts are available:

- Foundation (`foundation`)
- Drag (`drag`)
- Input (`input`)

These Styles are available:

- Site (`site`)
- Flag (`flag`)
- Icon (`icon`)
- Breadcrumb (`breadcrumb`)
- Pagination (`pagination`)
- Progress Bar (`progressbar`)

These Controls are available:

- Form (`form`)
- List (`list`)
- Button (`button`)
- Chart (`chart`)
- Callout (`callout`)
- Scoreboard (`scoreboard`)
- Dropdown (`dropdown`)
- Inspector (`inspector`)
- Flash (`flashmessage`)
- Filter (`filter`)
- Loader (`loader`)
- Tooltip (`tooltip`)
- Toolbar (`toolbar`)
- Popover (`popover`)
- Popup (`popup`)
- Tab (`tab`)

> *Note*: Documentation for each component can be found in the **docs/** directory.

## Building a collection

You can either build the entire collection by including the `storm.js` and `storm.less` files found in the root directory. This will result in quite a large file. It includes everything, you know.

It might be more appropriate to cherry pick the components you need. Just reference them by component name and they should take care of their own dependencies.

Here is an example, if you just want the loader, add to a file called `build.js`:

    =require path/to/ui/js/loader.js

Loader is a control, so a StyleSheet file is also needed, also `build.less`:

    @import "path/to/ui/less/loader.less";

That's it, you're done! Rinse and repeat for any other components.

> *Remember*: Only one build should be used on a page to prevent duplication.