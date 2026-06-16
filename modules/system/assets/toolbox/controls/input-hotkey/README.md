# Hotkey

Binds keyboard shortcuts to an element's click event. Supports single keys and key combinations with modifier keys.

## Basic Usage

```html
<button
    class="btn btn-default"
    data-hotkey="b"
    onclick="alert('B is for Banana!')">
    Press "B" on your keyboard
</button>

<button
    class="btn btn-default"
    data-hotkey="shift+r"
    onclick="confirm('Shift gears...?')">
    Press "Shift + R" on your keyboard
</button>
```

## JavaScript API

For non-button/link elements, set `hotkeyVisible: false` to bypass visibility checks.

```js
$('html').hotKey({
    hotkey: 'ctrl+s, cmd+s',
    hotkeyVisible: false,
    callback: doSomething
});
```

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `hotkey` | string | | Key combination(s), comma-separated (e.g. `ctrl+s, cmd+s`) |
| `hotkeyTarget` | string | `'html'` | CSS selector for the element to listen on |
| `hotkeyVisible` | boolean | `true` | Only trigger if the element is visible |
| `callback` | function | click | Custom callback `fn(element, target, event)` |

### Supported Keys

Modifier keys: `shift`, `ctrl`, `cmd`/`command`/`meta`, `alt`/`option`

Special keys: `esc`, `tab`, `space`, `return`/`enter`, `backspace`, `delete`, `insert`, `home`, `end`, `pageup`, `pagedown`, `left`, `up`, `right`, `down`, `f1`-`f12`
