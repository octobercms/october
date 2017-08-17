# Input Hotkey API

Allows keyboard shortcuts (hotkeys) to be bound to an element's click event.

# Example

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

## Javascript API

If you use a selector other than a button or a link, you will need to add the `hotkeyVisible` property to the hotkey config.

    $('html').hotKey({
        hotkey: 'ctrl+s, cmd+s',
        hotkeyVisible: false,
        callback: doSomething
    });
