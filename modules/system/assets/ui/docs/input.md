# Input

Scripts that manage user input events.

# Example

    <h4>Example: input.hotkey</h4>

    <button data-hotkey="b" onclick="alert('B is for Banana!')">
        Press "B" on your keyboard
    </button>

    <button data-hotkey="shift+r" onclick="confirm('Shift gears...?')">
        Press "Shift + R" on your keyboard
    </button>

    <!-----------------------------------------------------------------><hr />

    <h4>Example: input.preset</h4>

        <input type="text" id="presetExample1" placeholder="Type something" />
        <input type="text"
            data-input-preset="#presetExample1"
            placeholder="Watch here"
            disabled />

    <!-----------------------------------------------------------------><hr />

    <h4>Example: input.trigger</h4>

    <input type="checkbox" id="triggerChk1" />
    <button class="btn disabled"
        data-trigger-action="enable"
        data-trigger="#triggerChk1"
        data-trigger-condition="checked">
        Check the checkbox
    </button>

    <!-----------------------------------------------------------------><hr />

    <h4>Example: input.monitor</h4>

