# Inspector

## Dependencies

- Popover

# Example

    <div id="filterExample" class="control-filter" data-control="filterwidget">

        <!-- Group -->
        <a href="javascript:;" class="filter-scope" data-scope-name="categories">
            <span class="filter-label">Categories:</span>
            <span class="filter-setting">all</span>
        </a>

        <!-- Group -->
        <a href="javascript:;" class="filter-scope active" data-scope-name="statuses">
            <span class="filter-label">Statuses:</span>
            <span class="filter-setting">2</span>
        </a>

        <!-- Checkbox -->
        <div class="filter-scope checkbox custom-checkbox" data-scope-name="showActive">
            <input type="checkbox" id="chkActive" />
            <label for="chkActive">Show active</label>
        </div>

    </div>

    <script>
        $('#filterExample').data('filterScopes', {
            categories: {
                available: [
                    { id: 1, name: 'Announcements' },
                    { id: 2, name: 'Architecture' },
                    { id: 3, name: 'Products' },
                    { id: 4, name: 'Services' },
                    { id: 5, name: 'Clients' }
                ]
            },
            statuses: {
                available: [
                    { id: 1, name: 'Deleted' },
                    { id: 2, name: 'Deployed' },
                    { id: 3, name: 'Detailed' }
                ],
                active: [
                    { id: 4, name: 'Published' },
                    { id: 5, name: 'Draft' }
                ]
            }
        })
    </script>