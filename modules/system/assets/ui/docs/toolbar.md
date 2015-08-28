# Toolbar

A scrollable set of buttons aligned to the left with a fixed right section.

All toolbar items (`toolbar-item`) should have a fixed width, except for the primary item (`toolbar-primary`) which will stretch. In the October backend you can use the `data-calculate-width` attribute to have these widths calculated dynamically for you.

## Basic toolbar

    <div class="control-toolbar">
        <div class="toolbar-item toolbar-primary">
            <div data-control="toolbar">
                <button type="button" class="btn btn-primary oc-icon-plus">Create post</button>

                <button type="button" class="btn btn-default oc-icon-copy">Copy</button>

                <button type="button" class="btn btn-default oc-icon-trash">Delete</button>

                <button type="button" class="btn btn-default oc-icon-magic">Publish</button>

                <button type="button" class="btn btn-default oc-icon-power-off">Unpublish</button>

                <button type="button" class="btn btn-default oc-icon-clock-o">Timer</button>

                <button type="button" class="btn btn-default oc-icon-mail-reply-all">Send by email</button>

                <button type="button" class="btn btn-default oc-icon-hdd-o">Archive</button>
            </div>
        </div>
        <div class="toolbar-item" style="width: 110px">
            <input placeholder="search..." type="text" name="" value="" class="form-control icon search" />
        </div>
    </div>

### Button groups

    <div class="control-toolbar">
        <div class="toolbar-item toolbar-primary">
            <div data-control="toolbar">
                <div class="btn-group">
                    <button type="button" class="btn btn-default oc-icon-mail-reply-all">Send by email</button>
                    <button type="button" class="btn btn-default oc-icon-hdd-o">Archive</button>
                </div>
            </div>
        </div>
        <div class="toolbar-item" style="width: 110px">
            <input placeholder="search..." type="text" name="" value="" class="form-control icon search" />
        </div>
    </div>

### Button with Tooltips

    <div class="control-toolbar">
        <div class="toolbar-item toolbar-primary">
            <div data-control="toolbar">
                <button
                    type="button"
                    class="btn btn-default oc-icon-download"
                    title="Hold down shift for more options"
                    data-control="tooltip"
                    data-placement="bottom"
                    data-container="body">
                    Export
                </button>
            </div>
        </div>
        <div class="toolbar-item" style="width: 110px">
            <input placeholder="search..." type="text" name="" value="" class="form-control icon search" />
        </div>
    </div>

### Dropdown buttons

    <div class="control-toolbar">
        <div class="toolbar-item toolbar-primary">
            <div data-control="toolbar">

                <div class="dropdown dropdown-fixed">
                    <button
                        type="button"
                        class="btn btn-default oc-icon-users"
                        data-toggle="dropdown">
                        Assign selected to...
                    </button>
                    <ul class="dropdown-menu" data-dropdown-title="Assign selected to...">
                        <li><a href="#" tabindex="-1" class="oc-icon-user">Sally</a></li>
                        <li><a href="#" tabindex="-1" class="oc-icon-user">Steve</a></li>
                        <li><a href="#" tabindex="-1" class="oc-icon-user">Justin</a></li>
                    </ul>
                </div>

            </div>
        </div>
        <div class="toolbar-item" style="width: 110px">
            <input placeholder="search..." type="text" name="" value="" class="form-control icon search" />
        </div>
    </div>

## Editor toolbar

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
                        <li><a href="#" tabindex="-1" class="oc-icon-quote-right">Quote</a></li>
                        <li><a href="#" tabindex="-1" class="oc-icon-code">Code</a></li>
                        <li><a href="#" tabindex="-1" class="oc-icon-header">Header 1</a></li>
                        <li><a href="#" tabindex="-1" class="oc-icon-header">Header 2</a></li>
                        <li><a href="#" tabindex="-1" class="oc-icon-header">Header 3</a></li>
                        <li><a href="#" tabindex="-1" class="oc-icon-header">Header 4</a></li>
                        <li><a href="#" tabindex="-1" class="oc-icon-header">Header 5</a></li>
                        <li><a href="#" tabindex="-1" class="oc-icon-header">Header 6</a></li>
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
        <div class="toolbar-item" style="width: 80px">
            <button type="button" class="btn oc-icon-eye"></button>
            <button type="button" class="btn oc-icon-expand"></button>
        </div>
    </div>