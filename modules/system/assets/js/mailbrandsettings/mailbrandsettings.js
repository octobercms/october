var previewIframe

$(document).on('change', '.field-colorpicker', function() {
    $('#brandSettingsForm').request('onUpdateSampleMessage').done(function(data) {
        updatePreviewContent(data.previewHtml)
    })
})

function updatePreviewContent(content) {
    'srcdoc' in previewIframe
        ? previewIframe.srcdoc = content
        : previewIframe.src = 'data:text/html;charset=UTF-8,' + content
}

function adjustPreviewHeight() {
    previewIframe.style.height = (previewIframe.contentWindow.document.getElementsByTagName('body')[0].scrollHeight) +'px'
}

function createPreviewContainer(el, content) {
    previewIframe = document.createElement('iframe')

    updatePreviewContent(content)

    previewIframe.style.width = '100%'
    previewIframe.setAttribute('frameborder', 0)
    previewIframe.setAttribute('id', el.id)
    previewIframe.onload = adjustPreviewHeight

    var parent = el.parentNode
    parent.replaceChild(previewIframe, el)

    /*
     * Auto adjust height
     */
    $(document).render(adjustPreviewHeight)
    $(window).resize(adjustPreviewHeight)
}
