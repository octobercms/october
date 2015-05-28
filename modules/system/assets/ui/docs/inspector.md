# Inspector

## Dependencies

- Form
- Popover

# Example

    <div class="layout-column full-height-strict justify-center align-center">
        <div class="outer-form-container layout-item center relative" id="cmplist" style="width: 690px">

            <div class="control-componentlist">
                <ul data-control="toolbar">
                    <li class="oc-icon-bullhorn">
                        <span class="name">Blog archive</span>
                        <span class="description">blogArchive</span>
                    </li>
                    <li class="oc-icon-shopping-cart">
                        <span class="name">Shopping cart</span>
                        <span class="description">cart</span>
                    </li>
                    <li class="oc-icon-plane">
                        <span class="name">Flight schedule</span>
                        <span class="description">flights</span>
                    </li>
                    <li class="oc-icon-download-alt">
                        <span class="name">Download list</span>
                        <span class="description">downloads</span>
                    </li>

                </ul>
            </div>

        </div>
    </div>

    <script type="text/template" id="inspectortpl">
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
        $('#btn1').on('show.oc.popover', function(e, popover){
            popover.options.content = '<div class="popover-body"><p>Some other content</p></div>'
        })

        $('.control-componentlist ul li').on('click', function(){
            $(this).ocPopover({
                content: $('#inspectortpl').html(),
               // highlightModalTarget: true,
               // modal: true,
                width: 220,
                placement: 'bottom',
                container: '#cmplist',
                containerClass: 'control-inspector'
            })

            return false
        })
    </script>
