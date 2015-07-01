# Drag.Sort

Allows the dragging of things.

# Example

    <ol id="sortExample">
        <li>First</li>
        <li>Second</li>
        <li>Third</li>
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