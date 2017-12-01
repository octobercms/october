# Input Trigger API

The API allows to change elements' visibility or status (enabled/disabled) basing on other elements' statuses. Example: enable a button if any checkbox inside another element is checked.

## Example

### Checked condition

    <input type="checkbox" id="triggerChk1" />
    <button class="btn disabled"
        data-trigger-action="enable"
        data-trigger="#triggerChk1"
        data-trigger-condition="checked">
        Check the checkbox
    </button>

### Value condition

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

Multie value conditions are supported:

```html
data-trigger-condition="value[foo][bar]"
```

### Supported events

- oc.triggerOn.update - triggers the update. Trigger this event on the element the plugin is bound to to force it to check the condition and update itself. This is useful when the page content is updated with AJAX.
- oc.triggerOn.afterUpdate - triggered after the element is updated

### JavaScript API

```html
$('#mybutton').triggerOn({
    triggerCondition: 'checked',
    trigger: '#cblist input[type=checkbox]',
    triggerAction: 'enable' 
})
```