# October Storm

Welcome to the client-side framework designed exclusively for the OctoberCMS back-end area, referred to as *October Storm*. The library is quite large as it has many features and it is not really itended to be used outside of October.

## Design consideration

Each LESS library should always include the `global.less` to ensure all mixins and variables are available.

Compiling JavaScript depends on October's asset combiner as the `=require` directive was invented here to emulate the LESS `@import` functionality.

## UI Components

Components are a mixture of CSS and JavaScript (Controls), or can be solely style-based (Styles) or solely script-based (Scripts).

Each component has a *strong name*, for example the loading indicator has the name `loader`. For complex components, they can be broken in to child components, for example `loader.stripe`. Not all child components can be used independently of their parents, but this is certainly possible and a nice idea.

> *Note*: Documentation for each component can be found in the **docs/** directory.

## Naming conventions

In most cases a control will be styled in CSS with the prefix `control-something` and the JavaScript is applied using `data-control="something"`. This allows a rendering as a styled control only, without the JavaScript and vice versa.

    <div class="control-list" data-control="list">...</div>

The appearance of a control can be modified using additional CSS classes. These modifiers should be prefixed with the control name or the word `is` if the modification is binary (a boolean). For example:

    <div class="control-list list-purple is-sortable"></div>

The above uses two modifiers; one to make it purple and one to declare that it is sortable. In the above example, the class `is-purple` is not recommended because it is a variable attribute as opposed to a binary one. Here are some common words used for attributes and their meanings:

- **flush**: The control will use no margin, padding and/or border to the controls or containers surrounding it. Eg: `list-flush`
- **inset**: The control will use a negative margin on the left or right side to negate a padded container. Eg: `list-inset`
- **offset**: The control will use a positive margin or padding on the left or right to assist a container with padding. Eg: `list-offset`
- **padded**: The control will use padding all around. Eg: `list-padded`