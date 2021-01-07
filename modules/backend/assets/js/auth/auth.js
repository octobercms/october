$(document).ready(function(){
    $(document.body).removeClass('preload')

    $('form input[type=text], form input[type=password]').first().focus()

    /**
     * Show message if user is using Internet Explorer, by detecting if the IE-only "documentMode" attribute is within
     * the document object.
     */
    // if (window.document.documentMode) {
        $('div.ie-warning').show();
    // }
})
