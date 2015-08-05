# Popover

Popover

# Example

    <div class="layout-column full-height-strict justify-center align-center">
        <div class="outer-form-container layout-item center relative" id="btngroup" style="width: 560px">
            <div class="btn-group">
                <a href="#" id="btn1" class="btn btn-primary oc-icon-angle-left" data-control="popover" data-container="#btngroup" data-content="This is a popover" data-placement="left">
                    Popover on left
                </a>
                <a href="#" id="btn2" class="btn btn-primary oc-icon-angle-down">
                    Popover on bottom
                </a>
                <a href="#" id="btn3" class="btn btn-primary oc-icon-angle-up">
                    Popover on top
                </a>
                <a href="#" id="btn4" class="btn btn-primary oc-icon-angle-right" data-control="popover" data-container="#btngroup" data-content="<p>Default popover content</p>" data-placement="right" data-width="200">
                    Popover on right
                </a>
            </div>
        </div>
    </div>

    <script>
        $('#btn1').on('show.oc.popover', function(e, popover){
            popover.options.content = '<div class="popover-body"><p>Some other content</p></div>'
        })

        $('#btn2').on('click', function(){
            $(this).ocPopover({
                content: $('#popovertemplate').html(),
                modal: true,
                highlightModalTarget: true,
                placement: 'bottom',
                container: '#btngroup'
            })

            return false
        })

        $('#btn3').on('click', function(){
            $(this).ocPopover({
                content: function(element, popover) {
                    return '<p>This is a generated content<button type="button" class="close" data-dismiss="popover" aria-hidden="true">&times;</button></p>'
                },
                placement: 'top',
                container: '#btngroup'
            })

            return false
        })
    </script>

    <script type="text/template" id="popovertemplate">
        <div class="popover-body">
            <p>Modal popover</p>
            <p>Modal popover</p>
            <p>Modal popover</p>
            <p>Modal popover</p>
            <a class="btn btn-danger" href="#" onclick="$(this).trigger('close.oc.popover'); return false">Close</a>
        </div>
    </script>
