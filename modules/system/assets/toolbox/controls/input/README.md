# Input Hotkey API

Allows keyboard shortcuts (hotkeys) to be bound to an element's click event.

## Example

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

## Javascript API

If you use a selector other than a button or a link, you will need to add the `hotkeyVisible` property to the hotkey config.

```js
$('html').hotKey({
    hotkey: 'ctrl+s, cmd+s',
    hotkeyVisible: false,
    callback: doSomething
});
```

# Input Monitoring

This will monitor the user input for unsaved changes and show a confirmation box if the user attempts to leave the page. The script adds the "oc-data-changed" class to the form element when the form data is changed.

```html
<form data-change-monitor>
    ...
</form>
```

### Example

Click the "Mark changed" button and "Reload page".


```html
<form data-change-monitor>

    <button type="button" onclick="$(this).trigger('change')">
        Mark Changed
    </button>

    <button type="button" data-change-monitor-commit>
        Mark Saved
    </button>

    <hr />

    <button type="button" onclick="window.location.reload()">
        Reload Page
    </button>

</form>
```

## Supported data attributes

- data-change-monitor - enables the plugin form a form
- data-change-monitor-commit - commits changes to monitor (unchange) when clicked

## Supported events

- change - marks the form data as "changed". The event can be triggered on any element within a form or on a form itself.
- unchange.oc.changeMonitor - marks the form data as "unchanged". The event can be triggered on any element within a form or on a form itself.
- pause.oc.changeMonitor - temporary pauses the change monitoring. The event can be triggered on any element within a form or on a form itself.
- resume.oc.changeMonitor - resumes the change monitoring. The event can be triggered on any element within a form or on a form itself.

## Triggered events

- changed.oc.changeMonitor - triggered when the form data changes.
- unchanged.oc.changeMonitor - triggered when the form data unchanges.
- ready.oc.changeMonitor triggered when the change monitor instance finishes initialization.

## JavaScript API

```js
$('#form').changeMonitor()
```

# Input Preset API

Scripts that manage user input events.

## Example

```html
<input type="text" id="presetExample1" placeholder="Type something" />
<input type="text"
    data-input-preset="#presetExample1"
    placeholder="Watch here"
    disabled />
```

# Input Trigger API

The API allows to change elements' visibility or status (enabled/disabled) basing on other elements' statuses. Example: enable a button if any checkbox inside another element is checked.

## Example

### Checked condition

```html
<input type="checkbox" id="triggerChk1" />
<button class="btn disabled"
    data-trigger-action="enable"
    data-trigger="#triggerChk1"
    data-trigger-condition="checked">
    Check the checkbox
</button>
```

### Value condition

```html
<p>
    <input
        type="text"
        id="triggerTxt1"
        value=""
        onkeyup="$(this).trigger('change')"
        placeholder="Enter 'foo' or 'bar' here"
        class="form-control" />
</p>

<div
    class="callout callout-success"
    data-trigger-action="show"
    data-trigger="#triggerTxt1"
    data-trigger-condition="value[foo][bar]">

    <div class="content">
        Passphrase is valid!
    </div>
</div>
```

## Supported data attributes

- data-trigger-action, values: show, hide, enable, disable, empty
- data-trigger: a CSS selector for elements that trigger the action (checkboxes)
- data-trigger-condition, values:
    - checked: determines the condition the elements specified in the data-trigger should satisfy in order the condition to be considered as "true".
    - unchecked: inverse condition of "checked".
    - value[somevalue]: determines if the value of data-trigger equals the specified value (somevalue) the condition is considered "true".
- data-trigger-closest-parent: optional, specifies a CSS selector for a closest common parent for the source and destination input elements.

Example code:

```html
<input type="button" class="btn disabled"
    data-trigger-action="enable"
    data-trigger="#cblist input[type=checkbox]"
    data-trigger-condition="checked" ... >
```

Multiple actions are supported:

```html
data-trigger-action="hide|empty"
```
Multiple value conditions are supported:

```html
data-trigger-condition="value[foo][bar]"
```

### Supported events

- oc.triggerOn.update - triggers the update. Trigger this event on the element the plugin is bound to to force it to check the condition and update itself. This is useful when the page content is updated with AJAX.
- oc.triggerOn.afterUpdate - triggered after the element is updated

### jQuery API

```js
$('#mybutton').triggerOn({
    triggerCondition: 'checked',
    trigger: '#cblist input[type=checkbox]',
    triggerAction: 'enable'
})
```
