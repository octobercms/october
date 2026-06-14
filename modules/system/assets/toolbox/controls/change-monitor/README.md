# Change Monitor

Monitors form inputs for unsaved changes and warns the user before leaving the page. Adds the `oc-data-changed` class to the form element when changes are detected.

## Basic Usage

```html
<form data-change-monitor>
    <input type="text" name="title" />

    <button type="button" data-change-monitor-commit>
        Save
    </button>
</form>
```

## JavaScript API

```js
$('#form').changeMonitor()
```

### Static Methods

- `ChangeMonitorControl.disable()` — Globally disable all change monitors
- `ChangeMonitorControl.enable()` — Re-enable all change monitors

### Data Attributes

| Attribute | Description |
|---|---|
| `data-change-monitor` | Enables the plugin on a form |
| `data-change-monitor-commit` | Marks changes as saved when clicked |

### Events (listened)

| Event | Description |
|---|---|
| `change` | Marks form data as changed |
| `unchange.oc.changeMonitor` | Marks form data as unchanged |
| `pause.oc.changeMonitor` | Temporarily pauses monitoring |
| `resume.oc.changeMonitor` | Resumes monitoring |
| `pauseUnloadListener.oc.changeMonitor` | Pauses the beforeunload warning |
| `resumeUnloadListener.oc.changeMonitor` | Resumes the beforeunload warning |

### Events (triggered)

| Event | Description |
|---|---|
| `changed.oc.changeMonitor` | Fired when form data changes |
| `unchanged.oc.changeMonitor` | Fired when form data is uncommitted |
| `ready.oc.changeMonitor` | Fired when initialization completes |
