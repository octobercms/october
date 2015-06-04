# Inspector

## Dependencies

- Form
- Popover

# Example

    <div id="inspectorContainer">
        <button class="btn btn-primary" id="btn1">
            Open inspector
        </button>
    </div>

    <script type="text/template" id="inspectorTemplate">
        <div class="popover-head">
            <h3>Blog archive</h3>
            <p>Provides access to old blog posts by category name or month.</p>
            <button type="button" class="close" data-dismiss="popover" aria-hidden="true">&times;</button>
        </div>
        <table class="inspector-fields">
            <tr>
                <th>Alias</th>
                <td class="text"><input type="text" value="blogArchive"/></td>
            </tr>
            <tr>
                <th>Page param</th>
                <td class="active text"><input type="text" value="page"/></td>
            </tr>
            <tr>
                <th>Paginate</th>
                <td>
                    <div tabindex="0" class="checkbox custom-checkbox nolabel">
                        <input id="check3" type="checkbox" name="check"/>
                        <label for="check3">Paginate</label>
                    </div>
                </td>
            </tr>
            <tr>
                <th>Posts / page</th>
                <td class="text"><input type="text" value="20"/></td>
            </tr>
        </table>
    </script>

    <script>
        $('#btn1').on('click', function(){
            $(this).ocPopover({
                content: $('#inspectorTemplate').html(),
               // highlightModalTarget: true,
                modal: true,
                width: 220,
                placement: 'bottom',
                container: '#inspectorContainer',
                containerClass: 'control-inspector'
            })

            return false
        })
    </script>
