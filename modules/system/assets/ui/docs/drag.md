# Drag

Allows the dragging of things.

# Example

    <!---------------------------------------------------------------------->
    <h4>Example: drag.value</h4>

    <input placeholder="Drag a button to me" />

    <button
        data-control="dragvalue"
        data-text-value="Foo">
        Drop "Foo"
    </button>
    <button
        data-control="dragvalue"
        data-text-value="Bar">
        Drop "Bar"
    </button>

    <hr />

    <!---------------------------------------------------------------------->
    <h4>Example: drag.scroll</h4>

    <div id="scrollExample">
        <div class="scroll-stripes-example"></div>
    </div>
    Drag the area above left-to-right

    <style>
    #scrollExample {
        width: 100%; height: 50px; overflow: hidden;
    }
    .scroll-stripes-example {
        height: 50px; width: 5000px;
        background-image: linear-gradient(90deg, gray, white, gray);
        background-size: 500px 50px;
    }
    </style>

    <script>
        $('#scrollExample').dragScroll({
            vertical: false
        });
    </script>