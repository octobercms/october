# Popups

Displays a modal popup

# Example

    <!-- Basic Popup -->
    <a data-toggle="modal" href="#content-basic" class="btn btn-primary btn-lg">Launch basic content</a>

    <div class="control-popup modal fade" id="content-basic" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <p>This is a very basic example of a popup...</p>
                </div>
            </div>
        </div>
    </div>


    <!-- Confirmation Popup -->
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

    <!-- Ajax Popup -->
    <a data-control="popup" data-ajax="popup-content.htm" href="javascript:;" class="btn btn-primary btn-lg">Launch Ajax Form</a>
