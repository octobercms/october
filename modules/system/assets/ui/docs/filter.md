# Inspector

## Dependencies

- Popover

# Example

    <div class="control-filter" data-control="filterwidget">

        <a class="filter-scope" href="javascript:;">
            <span class="filter-label">Categories:</span>
            <span class="filter-setting">all</span>
        </a>

        <a class="filter-scope active" href="javascript:;">
            <span class="filter-label">Statuses:</span>
            <span class="filter-setting">2</span>
        </a>

    </div>

    <script>
        $('.control-filter').on('click', 'a.filter-scope', function(){
            $(this).ocPopover({
                content: $('#popovertemplate').html(),
                modal: false,
                highlightModalTarget: true,
                closeOnPageClick: true,
                placement: 'bottom'
            })

            return false
        })
    </script>

    <script type="text/template" id="popovertemplate">
        <div class="control-filter-popover">
            <div class="filter-search">
                <input type="text" class="form-control" />
            </div>
            <div class="filter-items">
                <ul>
                    <li><a href="#">Deleted</a></li>
                    <li><a href="#">Deployed</a></li>
                    <li><a href="#">Detailed</a></li>
                </ul>
            </div>
            <div class="filter-active-items">
                <ul>
                    <li><a href="#">Published</a></li>
                    <li><a href="#">Draft</a></li>
                </ul>
            </div>
        </div>
    </script>

