# Popover

Renders a rich popover with content, positioning, modal overlay, and animation. This is October's custom popover, not Bootstrap's — it supports modal overlays, center placement, mobile bottom-sheet behavior, and rich content from templates or callbacks.

## Basic Usage

Add `data-control="popover"` to an anchor or button. Use `data-content` for inline content.

```html
<a
    href="javascript:;"
    class="btn btn-primary"
    data-control="popover"
    data-content="I am a standard popover">
    Basic popover
</a>
```

## Template Content

Reference a hidden element with `data-content-from`.

```html
<div style="display:none" id="myPopoverContent">
    <div class="popover-head">
        <h3>Popover</h3>
        <button type="button" class="btn-close" data-dismiss="popover"></button>
    </div>
    <div class="popover-body">
        I am a popover
    </div>
</div>

<a
    href="javascript:;"
    class="btn btn-primary"
    data-control="popover"
    data-width="200"
    data-content-from="#myPopoverContent">
    Template popover
</a>
```

## JavaScript API

```js
$('#element').ocPopover({
    content: '<p>This is a popover</p>',
    placement: 'top'
})
```

### Methods

- `.ocPopover('hide')` — Closes the popover
- `.ocPopover('getContainer')` — Returns the popover DOM element

### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `placement` | string | `'bottom'` | `top`, `bottom`, `left`, `right`, or `center` |
| `fallbackPlacement` | string | `'bottom'` | Fallback when preferred placement doesn't fit |
| `content` | string/function | | HTML content string or callback |
| `contentFrom` | string | `null` | Selector to source content HTML from |
| `width` | number | `false` | Fixed width in pixels |
| `modal` | boolean | `false` | Show backdrop overlay |
| `highlightModalTarget` | boolean | `false` | Highlight the trigger element above the overlay |
| `closeOnPageClick` | boolean | `true` | Close when clicking outside |
| `closeOnEsc` | boolean | `true` | Close on Escape key |
| `container` | string/element | `false` | Parent element (default: document body) |
| `containerClass` | string | `null` | CSS class(es) for the popover container |
| `offset` | number | `15` | Offset in pixels from trigger |
| `offsetX` | number | | X offset, overrides `offset` for top/bottom |
| `offsetY` | number | | Y offset, overrides `offset` for left/right |
| `useAnimation` | boolean | `false` | Fade/scale animation |

### Events

| Event | Description |
|---|---|
| `showing.oc.popover` | Before display. Use `e.preventDefault()` to cancel |
| `show.oc.popover` | After display |
| `hiding.oc.popover` | Before close. Use `e.preventDefault()` to cancel |
| `hide.oc.popover` | After close |

### Closing

Three ways to close a popover:
1. Call `.ocPopover('hide')` on the trigger element
2. Trigger `close.oc.popover` on any element inside the popover
3. Click an element with `data-dismiss="popover"` inside the popover
