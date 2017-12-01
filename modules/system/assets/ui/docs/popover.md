# Popover

Renders a richer version of a tooltip, called a popover.

## Examples

### Basic usage

You may add `data-control="popover"` to an anchor or button to activate a popover. Use the `data-content` attribute to specify the contents.

    <a
        href="javascript:;"
        class="btn btn-primary"
        data-control="popover"
        data-content="I am a standard popover">
        Basic popover
    </a>

### Template content

Define the popover content as a template and reference it with `data-content-from="#myPopoverContent"`.

```html
<script type="text/template" id="myPopoverContent">
    <div class="popover-head">
        <h3>Popover</h3>
        <button type="button" class="close" data-dismiss="popover">&times;</button>
    </div>
    <div class="popover-body">
        I am a popover
    </div>
</script>
```

<div style="display:none" id="myPopoverContent">
    <div class="popover-head">
        <h3>Popover</h3>
        <button type="button" class="close" data-dismiss="popover">&times;</button>
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

### Event specified content

```js
$('#btn1').on('showing.oc.popover', function(e, popover) {
    popover.options.content = '<div class="popover-body">Some other content</div>'
})
```

    <a
        href="javascript:;"
        class="btn btn-primary"
        data-control="popover"
        data-placement="right"
        id="btn1">
        Event content popover
    </a>

<script>
$(document).ready(function() {
    $('#btn1').on('showing.oc.popover', function(e, popover) {
        popover.options.content = '<div class="popover-body">Some other content</div>'
    })
})
</script>

## JavaScript API

```js
$('#element').ocPopover({
    content: '<p>This is a popover</p>'
    placement: 'top'
})
```

### Supported methods

`.ocPopover('hide')`
Closes the popover. There are 3 ways to close the popover: call it's `hide()` method, trigger the `close.oc.popover` on any element inside the popover or click an element with attribute `data-dismiss="popover"` inside the popover.

### Supported options

- `placement`: top | bottom | left | right | center. The placement could automatically be changed if the popover doesn't fit into the desired position.

- `fallbackPlacement`: top | bottom | left | right. The placement to use if the default placement and all other possible placements do not work. The default value is "bottom".

- `content`: content HTML string or callback

- `contentFrom`: selector to source the content HTML

- `width`: content width, optional. If not specified, the content width will be used.

- `modal`: make the popover modal

- `highlightModalTarget`: "pop" the popover target above the overlay, making it highlighted. The feature assigns the target position relative.

- `closeOnPageClick`: close the popover if the page was clicked outside the popover area.

- `container`: the popover container selector or element. The default container is the document body. The container must be relative positioned.

- `containerClass` - a CSS class to apply to the popover container element

- `offset` - offset in pixels to add to the calculated position, to make the position more "random"

- `offsetX` - X offset in pixels to add to the calculated position, to make the position more "random". If specified, overrides the offset property for the bottom and top popover placement.

- `offsetY` - Y offset in pixels to add to the calculated position, to make the position more "random". If specified, overrides the offset property for the left and right popover placement.

- `useAnimation`: adds animation to the open and close sequence, the equivalent of adding the CSS class 'fade' to the containerClass.

### Supported events

- `showing.oc.popover` - triggered before the popover is displayed. Allows to override the popover options (for example the content) or cancel the action with e.preventDefault()

- `show.oc.popover` - triggered after the popover is displayed.

- `hiding.oc.popover` - triggered before the popover is closed. Allows to cancel the action with e.preventDefault()

- `hide.oc.popover` - triggered after the popover is hidden.
