# Toolbar

Toolbar

# Example

    <h4>Basic toolbar</h4>

    <div class="layout control-toolbar">
        <div class="layout-cell toolbar-item">
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
        <div class="layout-cell toolbar-item width-fix">
            <input placeholder="search..." type="text" name="" value="" class="form-control icon search growable" autocomplete="off"/>
        </div>
    </div>

    <h4>Editor toolbar</h4>

    <div class="layout control-toolbar editor-toolbar">
        <div class="layout-cell toolbar-item">
            <div data-control="toolbar">

                <!-- Dropdown item -->
                <div class="dropdown dropdown-fixed">
                    <button
                        type="button"
                        class="btn tb-icon tb-formatting"
                        title="Formatting"
                        data-toggle="dropdown"
                        data-control="tooltip"
                        data-placement="bottom"
                        data-container="body"></button>
                    <ul class="dropdown-menu" data-dropdown-title="Formatting">
                        <li><a href="#" rel="quote" tabindex="-1" class="oc-icon-quote-right">Quote</a></li>
                        <li><a href="#" rel="code" tabindex="-1" class="oc-icon-code">Code</a></li>
                        <li><a href="#" rel="header1" tabindex="-1" class="oc-icon-header">Header 1</a></li>
                        <li><a href="#" rel="header2" tabindex="-1" class="oc-icon-header">Header 2</a></li>
                        <li><a href="#" rel="header3" tabindex="-1" class="oc-icon-header">Header 3</a></li>
                        <li><a href="#" rel="header4" tabindex="-1" class="oc-icon-header">Header 4</a></li>
                        <li><a href="#" rel="header5" tabindex="-1" class="oc-icon-header">Header 5</a></li>
                        <li><a href="#" rel="header6" tabindex="-1" class="oc-icon-header">Header 6</a></li>
                    </ul>
                </div>

                <!-- Item with tooltip -->
                <button
                    type="button"
                    class="btn tb-icon tb-bold"
                    title="Bold"
                    data-control="tooltip"
                    data-placement="bottom"
                    data-container="body"></button>

                <!-- Disabled item -->
                <button type="button" disabled class="btn tb-icon tb-italic"></button>

                <button type="button" class="btn tb-icon tb-unorderedlist"></button>
                <button type="button" class="btn tb-icon tb-orderedlist"></button>
                <button type="button" class="btn tb-icon tb-link"></button>
                <button type="button" class="btn tb-icon tb-horizontalrule"></button>
            </div>
        </div>
        <div class="layout-cell toolbar-item width-fix">
            <button type="button" class="btn oc-icon-eye"></button>
            <button type="button" class="btn oc-icon-expand"></button>
        </div>
    </div>