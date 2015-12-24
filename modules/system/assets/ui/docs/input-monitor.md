# Input Monitoring

This will monitor the user input for unsaved changes and show a confirmation box if the user attempts to leave the page. The script adds the "oc-data-changed" class to the form element when the form data is changed.

```html
<form
    data-change-monitor
    data-window-close-confirm="There is unsaved data"
>
    ...
</form>
```

### Example

Click the "Mark changed" button and "Reload page".

    <form
        data-window-close-confirm="There is unsaved data"
        data-change-monitor>

        <button type="button" onclick="$(this).trigger('change')">
            Mark changed
        </button>

        <button type="button" onclick="$(this).trigger('unchange.oc.changeMonitor')">
            Mark saved
        </button>

        <hr />

        <button type="button" onclick="window.location.reload()">
            Reload page
        </button>

    </form>

## Supported data attributes

- data-change-monitor - enables the plugin form a form
- data-window-close-confirm - confirmation message to show when a browser window is closing and there is unsaved data

## Supported events

- change - marks the form data as "changed". The event can be triggered on any element within a form or on a form itself.
- unchange.oc.changeMonitor - marks the form data as "unchanged". The event can be triggered on any element within a form or on a form itself.
- pause.oc.changeMonitor - temporary pauses the change monitoring. The event can be triggered on any element within a form or on a form itself.
- resume.oc.changeMonitor - resumes the change monitoring. The event can be triggered on any element within a form or on a form itself.

## Triggered events

- changed.oc.changeMonitor - triggered when the form data changes.
- unchanged.oc.changeMonitor - triggered when the form data unchanges.
- ready.oc.changeMonitor triggered when the change monitor instance finishes initialization.

## JavaScript API

```js
$('#form').changeMonitor()
```
