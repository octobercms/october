Displays a floating flash message on the screen.

# Example

    <p data-control="flash-message" data-interval="5" class="success">This message is created from a static element. It will go away in 5 seconds.</p>

    <p><a href="#" class="btn btn-primary" onclick="$.oc.flashMsg({text: 'The record has been successfully saved. This message will go away in 1 second.', 'class': 'success', 'interval': 1}); return false;">Create Success message</a></p>
    <p><a href="#" class="btn btn-danger" onclick="$.oc.flashMsg({text: 'Babam!', 'class': 'error'}); return false;">Create Error message</a></p>
    <p><a href="#" class="btn btn-warning" onclick="$.oc.flashMsg({text: 'Warning! October is too good for this world!', 'class': 'warning'}); return false;">Create Warning message</a></p>
