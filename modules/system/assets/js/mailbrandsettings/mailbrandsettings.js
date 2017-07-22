
$(document).on('change', '.field-colorpicker', function() {
    $('#brandSettingsForm').request('onRefresh', {
        data: { 'fields': ['_mail_preview'] }
    })
})

function createPreviewContainer(el, content) {
    var newiframe

    // Shadow DOM ignores media queries
    // if (document.body.attachShadow) {
    if (false) {
        var shadow = el.attachShadow({ mode: 'open' })
        shadow.innerHTML = content
    }
    else {
        newiframe = document.createElement('iframe')

        'srcdoc' in newiframe
            ? newiframe.srcdoc = content
            : newiframe.src = 'data:text/html;charset=UTF-8,' + content

        var parent = el.parentNode
        parent.replaceChild(newiframe, el)

        newiframe.style.width = '100%'
        newiframe.setAttribute('frameborder', 0)

        newiframe.onload = adjustIframeHeight
    }

    function adjustIframeHeight() {
        newiframe.style.height = '500px'
        newiframe.style.height = 1 + (newiframe.contentWindow.document.getElementsByTagName('body')[0].scrollHeight) +'px'
    }

    $(document).render(adjustIframeHeight)
    $(window).resize(adjustIframeHeight)
}
