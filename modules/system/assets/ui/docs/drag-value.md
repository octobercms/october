# Drag.Value

Allows the dragging of elements that result in a custom value when dropped.

    <p>
        <input placeholder="Drag a button below to me" class="form-control" />
    </p>

    <button
        class="btn btn-default"
        data-control="dragvalue"
        data-text-value="October">
        Drop "Foo"
    </button>

    <button
        class="btn btn-default"
        data-control="dragvalue"
        data-text-value="CMS">
        Drop "Bar"
    </button>

### Clickable

You can make elements clickable from another input by defining `data-drag-click="true"`.

    <p>
        <input placeholder="Click on me first, then click a label below" class="form-control" />
    </p>

    <div class="control-balloon-selector">
        <ul>
            <li
                data-control="dragvalue"
                data-text-value="Richie"
                data-drag-click="true">
                Monday
            </li>
            <li
                data-control="dragvalue"
                data-text-value="Potsie"
                data-drag-click="true">
                Tuesday
            </li>
            <li
                data-control="dragvalue"
                data-text-value="The Fonz"
                data-drag-click="true">
                Happy days!
            </li>
        </ul>
    </div>