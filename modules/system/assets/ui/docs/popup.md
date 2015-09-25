# Popups

Displays a modal popup, based on the Bootstrap modal implementation.

- [Examples](#examples)
- [Inline popups](#inline-popups)
- [Remote popups](#remote-popups)

<a name="examples"></a>
## Examples

    <a data-toggle="modal" href="#contentBasic" class="btn btn-primary btn-lg">Launch basic content</a>

    <div class="control-popup modal fade" id="contentBasic" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <p>This is a very basic example of a popup...</p>
                </div>
            </div>
        </div>
    </div>

    <a data-toggle="modal" href="#content-confirmation" class="btn btn-primary btn-lg">Launch Confirmation dialog</a>

    <div class="control-popup modal fade" id="content-confirmation" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title">Are you sure you wanna do that?</h4>
                </div>
                <div class="modal-body">
                    <p>This is your last chance. After this, there is no turning back.</p>
                    <p>You take the blue pill - the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill - you stay in Wonderland, and I show you how deep the rabbit hole goes.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Blue Pill</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Red Pill</button>
                </div>
            </div>
        </div>
    </div>

<a name="inline-popups"></a>
## Inline popups

An inline popup places the popup content inside the current page, hidden from the view. For example, this container will not be visible on the page.

```html
<div class="control-popup modal fade" id="contentBasic">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <p>This is a very basic example of a popup...</p>
            </div>
        </div>
    </div>
</div>
```

Use the `data-toggle="modal"` HTML attribute to launch this container as a popup.

```html
<a data-toggle="modal" href="#contentBasic" class="btn btn-primary btn-lg">
    Launch basic content
</a>
```

<a name="remote-popups"></a>
## Remote popups

Content for the popup can be loaded remotely using an AJAX request. Use the `data-handler` attribute to populate a popup with the contents of an AJAX handler.

```html
<a
    data-control="popup"
    data-handler="onLoadContent"
    href="javascript:;"
    class="btn btn-primary btn-lg">
    Launch Ajax Form
</a>
```

Using the `data-ajax` attribute you can refer to an external file or URL directly.

```html
<a
    data-control="popup"
    data-ajax="popup-content.htm"
    href="javascript:;"
    class="btn btn-primary btn-lg">
    Launch Ajax Form
</a>
```

