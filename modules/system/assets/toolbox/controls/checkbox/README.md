# Checkbox Control

Provides indeterminate (tri-state) checkbox support and shift-click range selection for checkbox lists.

## Indeterminate Checkbox

An indeterminate checkbox cycles through three states: **unchecked → indeterminate → checked → unchecked**.

The control auto-discovers `.form-check.is-indeterminate` elements. Set the initial state using `data-checked` on the input.

- `data-checked="0"` — Unchecked (default)
- `data-checked="1"` — Indeterminate
- `data-checked="2"` — Checked

```html
<div class="form-check is-indeterminate">
    <input type="checkbox" class="form-check-input" data-checked="1" />
    <label class="form-check-label">Indeterminate checkbox</label>
</div>
```

## Range Selection

Shift-click range selection allows users to select multiple checkboxes by holding Shift and clicking. This is a standalone utility, not tied to the control lifecycle.

```js
// In a list widget click handler
onClickCheckbox(ev) {
    oc.checkboxRange.registerClick(ev, 'tr', 'input[type=checkbox]');
}
```

### Parameters

| Parameter | Description |
|---|---|
| `ev` | The click event |
| `containerSelector` | Selector for the row/container wrapping each checkbox |
| `checkboxSelector` | Selector for the checkbox input within each container |
