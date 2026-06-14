# Input Trigger

Shows, hides, enables, or disables elements based on the state of other form elements. Supports checkbox/radio checked states and input value matching with wildcards.

## Basic Usage

### Checked Condition

```html
<input type="checkbox" id="myCheckbox" />
<button class="btn disabled"
    data-trigger-action="enable"
    data-trigger="#myCheckbox"
    data-trigger-condition="checked">
    Check the checkbox to enable
</button>
```

### Value Condition

```html
<input type="text" id="myInput" onkeyup="$(this).trigger('change')" />

<div
    data-trigger-action="show"
    data-trigger="#myInput"
    data-trigger-condition="value[foo][bar]">
    Visible when input is "foo" or "bar"
</div>
```

## JavaScript API

```js
$('#mybutton').triggerOn({
    triggerCondition: 'checked',
    trigger: '#cblist input[type=checkbox]',
    triggerAction: 'enable'
})
```

### Data Attributes

| Attribute | Description |
|---|---|
| `data-trigger` | CSS selector for the trigger element(s) |
| `data-trigger-action` | Action(s): `show`, `hide`, `enable`, `disable`, `empty`, `fill[value]`. Pipe-delimited for multiple: `hide\|empty` |
| `data-trigger-condition` | Condition: `checked`, `unchecked`, or `value[val1][val2]` with wildcard support |
| `data-trigger-closest-parent` | CSS selector for a common parent scope |

### Events

| Event | Description |
|---|---|
| `oc.triggerOn.update` | Trigger on the element to force a condition re-check |
| `oc.triggerOn.afterUpdate` | Fired after the element is updated |
| `hide.oc.triggerapi` | Fired when visibility changes |
| `disable.oc.triggerapi` | Fired when enabled/disabled state changes |
| `fill.oc.triggerapi` | Fired when fill action executes |
| `empty.oc.triggerapi` | Fired when empty action executes |
