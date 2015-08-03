# Drag.Sort

Allows the dragging and sorting of lists.

### Example

Sort the buttons

    <ol id="sortExample">
        <li><a class="btn btn-sm btn-default">First</a></li>
        <li><a class="btn btn-sm btn-primary">Second</a></li>
        <li><a class="btn btn-sm btn-success">Third</a></li>
    </ol>

    <script>
        $('#sortExample').sortable()
    </script>

    <style>
        body.dragging, body.dragging * {
            cursor: move !important
        }
        .dragged {
            position: absolute; opacity: 0.5; z-index: 2000;
        }
        #sortExample li.placeholder {
            position: relative;
        }
    </style>

## JavaScript API:

The `sortable()` method must be invoked on valid containers, meaning they must match the containerSelector option.

`.sortable('enable')`
Enable all instantiated sortables in the set of matched elements

`.sortable('disable')`
Disable all instantiated sortables in the set of matched elements

`.sortable('refresh')`
Reset all cached element dimensions

`.sortable('destroy')`
Remove the sortable plugin from the set of matched elements

`.sortable('serialize')`
Serialize all selected containers. Returns a jQuery object . Use .get() to retrieve the array, if needed.

### Supported options:

- `useAnimation`: Use animation when an item is removed or inserted into the tree.

- `usePlaceholderClone`: Placeholder should be a clone of the item being dragged.

- `afterMove`: This is executed after the placeholder has been moved. $closestItemOrContainer contains the closest item, the placeholder has been put at or the closest empty Container, the placeholder has been appended to.

- `containerPath`: The exact css path between the container and its items, e.g. "> tbody"

- `containerSelector`: The css selector of the containers

- `distance`: Distance the mouse has to travel to start dragging

- `delay`: Time in milliseconds after mousedown until dragging should start. This option can be used to prevent unwanted drags when clicking on an element.

- `handle`: The css selector of the drag handle

- `itemPath`: The exact css path between the item and its subcontainers. It should only match the immediate items of a container. No item of a subcontainer should be matched. E.g. for ol>div>li the itemPath is "> div"

- `itemSelector`: The css selector of the items

- `bodyClass`: The class given to "body" while an item is being dragged

- `draggedClass`: The class giving to an item while being dragged

- `isValidTarget`: Check if the dragged item may be inside the container. Use with care, since the search for a valid container entails a depth first search and may be quite expensive.

- `onCancel`: Executed before onDrop if placeholder is detached. This happens if pullPlaceholder is set to false and the drop occurs outside a container.

- `onDrag`: Executed at the beginning of a mouse move event. The Placeholder has not been moved yet.

- `onDragStart`: Called after the drag has been started, that is the mouse button is being held down and the mouse is moving. The container is the closest initialized container. Therefore it might not be the container, that actually contains the item.

- `onDrop`: Called when the mouse button is being released

- `onMousedown`: Called on mousedown. If falsy value is returned, the dragging will not start. Ignore if element clicked is input, select or textarea

- `placeholderClass`: The class of the placeholder (must match placeholder option markup)

- `placeholder`: Template for the placeholder. Can be any valid jQuery input e.g. a string, a DOM element. The placeholder must have the class "placeholder"

- `pullPlaceholder`: If true, the position of the placeholder is calculated on every mousemove. If false, it is only calculated when the mouse is above a container.

- `serialize`: Specifies serialization of the container group. The pair $parent/$children is either container/items or item/subcontainers.

- `tolerance`: Set tolerance while dragging. Positive values decrease sensitivity, negative values increase it.

### Supported options (container specific):

- `drag`: If true, items can be dragged from this container

- `drop`: If true, items can be droped onto this container

- `exclude`: Exclude items from being draggable, if the selector matches the item

- `nested`: If true, search for nested containers within an item.If you nest containers, either the original selector with which you call the plugin must only match the top containers, or you need to specify a group (see the bootstrap nav example)

- `vertical`: If true, the items are assumed to be arranged vertically
