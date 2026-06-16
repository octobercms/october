# Dropdown

Customizes Bootstrap dropdown menus with consistent styling, body-container repositioning, and fixed positioning for overflow containers. Also provides a mobile-responsive sheet layout on small screens.

## Basic Usage

Standard Bootstrap dropdown markup — the control hooks in automatically.

```html
<div class="dropdown">
    <a href="#" data-bs-toggle="dropdown" class="btn btn-primary">Menu</a>
    <ul class="dropdown-menu" role="menu">
        <li><a role="menuitem" href="#">Option 1</a></li>
        <li><a role="menuitem" href="#">Option 2</a></li>
    </ul>
</div>
```

### Fixed Positioning

For dropdowns inside overflow-hidden containers, add `dropdown-fixed` to reposition with `position: fixed`.

```html
<div class="dropdown dropdown-fixed">
    <a href="#" data-bs-toggle="dropdown" class="btn btn-primary">Menu</a>
    <ul class="dropdown-menu" role="menu">
        <li><a role="menuitem" href="#">Option 1</a></li>
    </ul>
</div>
```

### Body Container

Move the dropdown menu to `<body>` for absolute positioning outside of parent constraints.

```html
<div class="dropdown" data-dropdown-container="body">
    ...
</div>
```

## Behaviors

| Feature | Description |
|---|---|
| Auto-styling | Adds `control-dropdown`, `dropdown-item`, `first-item`, `last-item` classes |
| Body container | Moves menu to `<body>` when `data-dropdown-container="body"` is set |
| Fixed positioning | Uses `position: fixed` with scroll/resize tracking when `.dropdown-fixed` |
| Overlay | Inserts a `.dropdown-overlay` div and adds `.dropdown-open` to body |
| Mobile sheet | On small screens, dropdown becomes a full-width fixed sheet with backdrop |
