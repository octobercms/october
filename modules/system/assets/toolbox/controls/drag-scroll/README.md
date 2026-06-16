# Drag Scroll

Allows elements with `overflow: hidden` to be scrolled by dragging, mouse wheel, or touch.

## Files

- `drag-scroll.js` — Standalone `DragScroll` class with all logic
- `drag-scroll-control.js` — `ControlBase` wrapper for `data-control="drag-scroll"`
- `drag-scroll-plugin.js` — jQuery `$.fn.dragScroll()` backward compatibility shim

## Usage with data-control

```html
<div data-control="drag-scroll" data-vertical="true">
    <div class="long-content"></div>
</div>
```

### Config attributes

- `data-no-drag-support` — disables drag support, leaving only mouse wheel support
- `data-use-native-drag` — enables native CSS scroll via "mobile" on the HTML tag
- `data-vertical` — enables vertical scrolling mode

## Usage with jQuery API

```js
// Initialize
$('#scrollExample').dragScroll({
    vertical: false,
    useDrag: true,
    useScroll: true,
    useNative: false,
    useComboScroll: true,
    scrollClassContainer: '#parent',
    noOverScroll: false
});

// Methods
$('#scrollExample').dragScroll('goToElement', $targetElement);
$('#scrollExample').dragScroll('goToStart');
$('#scrollExample').dragScroll('pause');
$('#scrollExample').dragScroll('resume');
$('#scrollExample').dragScroll('dispose');
```

### Options

- `vertical` — scroll direction is vertical (default: `false`)
- `useDrag` — allow dragging (default: `true`)
- `useScroll` — allow mouse wheel scrolling (default: `true`)
- `useNative` — use native CSS scroll when HTML tag has "mobile" class (default: `false`)
- `useComboScroll` — horizontal scroll acts as vertical and vice versa (default: `true`)
- `scrollClassContainer` — element or selector to apply `scroll-before` / `scroll-after` CSS classes
- `scrollMarkerContainer` — element or selector to inject scroll marker spans
- `dragSelector` — restrict drag events to this selector
- `scrollSelector` — restrict scroll events to this selector
- `noOverScroll` — prevent scroll events from bubbling when at boundary (default: `false`)
- `noScrollClasses` — disable scroll class management (default: `false`)
- `dragClass` — class added to body during drag (default: `'drag'`)
- `start` — callback when drag starts
- `drag` — callback when dragging
- `stop` — callback when drag ends

### Events

- `start.oc.dragScroll` — fired on the element when dragging begins
- `drag.oc.dragScroll` — fired on the element during drag or scroll
- `stop.oc.dragScroll` — fired on the element when dragging ends

## Example

```html
<div id="scrollExample" style="width: 100%; height: 50px; overflow: hidden;">
    <div style="height: 50px; width: 5000px;
        background-image: linear-gradient(90deg, gray, white, gray);
        background-size: 500px 50px;">
    </div>
</div>

<script>
    $('#scrollExample').dragScroll();
</script>
```
