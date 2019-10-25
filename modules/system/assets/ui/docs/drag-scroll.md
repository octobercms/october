# Drag.Scroll

Allows the elements with `overflow: hidden` to be dragged.

### Example

Drag the area above left-to-right.

    <div id="scrollExample">
        <div class="scroll-stripes-example"></div>
    </div>


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
        $('#scrollExample').dragScroll();
    </script>