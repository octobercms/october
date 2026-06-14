<div
    class="component-backend-splitter" :class="cssClass"
>
    <div class="flex-shrink-0 splitter-first-panel" :style="firstPanelStyle" ref="firstPanel">
        <slot name="first">
            Left panel
        </slot>
    </div>

    <div
        class="flex-shrink-0 splitter-handle"
        :class="{dragging: dragging}"
        ref="handle"
        @mousedown.stop="onHandleMouseDown"
    ></div>

    <div class="flex-fill position-relative">
        <slot name="second">
            Right panel
        </slot>
    </div>
</div>