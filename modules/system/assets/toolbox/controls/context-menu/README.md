# Context Menu

Displays a context menu at a specified position.

## Usage

```js
document.addEventListener('contextmenu', '.some-container', function(ev) {
    ev.preventDefault();

    oc.ContextMenu.show({
        pageX: ev.pageX,
        pageY: ev.pageY,
        items: [
            {
                name: 'Section Title'
            },
            {
                name: 'Edit Content',
                icon: 'pencil',
                action: () => openIframe('/some/iframe/edit')
            },
            {
                name: 'Edit Settings',
                label: 'Ctrl+S',
                icon: 'cog',
                action: () => openIframe('/some/iframe/settings')
            }
        ]
    });
});

// Close the menu programmatically
oc.ContextMenu.hide();
```

## Item Options

| Option | Type | Description |
|--------|------|-------------|
| `name` | string | Display text for the menu item |
| `action` | function | Click handler (if omitted, item is rendered as a title) |
| `icon` | string | Icon name (without `icon-` prefix) |
| `label` | string | Secondary label (e.g., keyboard shortcut) |

## Features

- Auto-positions to stay within viewport bounds
- Closes on click outside, Escape key, scroll, or right-click elsewhere
- Singleton pattern (only one menu can be open at a time)
