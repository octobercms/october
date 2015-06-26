# Toolbar

Toolbar

# Example

    <div class="layout-row control-toolbar" >
        <div class="layout-item stretch toolbar-item">
            <div data-control="toolbar">
                <div class="btn-group">
                    <button type="button" class="btn btn-primary oc-icon-plus">Create post</button>
                    <button type="button" disabled class="btn btn-primary oc-icon-copy">Copy</button>
                    <button type="button" disabled class="btn btn-primary oc-icon-trash">Delete</button>
                </div>

                <div class="btn-group">
                    <button type="button" disabled class="btn btn-primary oc-icon-magic">Publish</button>
                    <button type="button" disabled class="btn btn-primary oc-icon-off">Unpublish</button>
                </div>

                <button type="button" class="btn btn-primary oc-icon-time">Timer</button>

                <div class="btn-group">
                    <button type="button" class="btn btn-primary oc-icon-mail-reply-all">Send by email</button>
                    <button type="button" class="btn btn-primary oc-icon-hdd">Archive</button>
                </div>
            </div>
        </div>
        <div class="layout-item fix relative toolbar-item">
            <input placeholder="search..." type="text" name="" value="" class="form-control icon search growable" autocomplete="off"/>
        </div>
    </div>