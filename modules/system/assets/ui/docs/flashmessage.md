## Flash message

Displays a floating flash message on the screen.

### Display onload

<p data-control="flash-message" data-interval="5" class="success">
    This message is created from a static element. It will go away in 5 seconds.
</p>

### Trigger

    <p>
        <a href="#" class="btn btn-primary" onclick="$.oc.flashMsg({text: 'The record has been successfujavascript:;ly saved. This message will go away in 1 second.', 'class': 'success', 'interval': 1}); return false;">
            Create Success message
        </a>
    </p>

    <p>
        <a href="javascript:;" class="btn btn-danger" onclick="$.oc.flashMsg({text: 'Babam!', 'class': 'error'}); return false;">
            Create Error message
        </a>
    </p>

    <p>
        <a href="javascript:;" class="btn btn-warning" onclick="$.oc.flashMsg({text: 'Warning! October is too good for this world!', 'class': 'warning'}); return false;">
            Create Warning message
        </a>
    </p>

### Data attributes:

- data-control="flash-message" - enables the flash message plugin
- data-interval="2" - the interval to display the message in seconds, optional. Default: 2

### JavaScript API:

```js
$.oc.flashMsg({
    'text': 'The record has been successfully saved.',
    'class': 'success',
    'interval': 3
})
```
