/*
 * Application
 */

$(document).tooltip({
    selector: "[data-toggle=tooltip]"
})

jQuery(document).ready(function ($) {

    /*
     * Auto hide navbar
     */

    var $header = $('.navbar-autohide'),
        scrolling = false,
        previousTop = 0,
        currentTop = 0,
        scrollDelta = 10,
        scrollOffset = 150

    $(window).on('scroll', function(){
        if (!scrolling) {
            scrolling = true

            if (!window.requestAnimationFrame) {
                setTimeout(autoHideHeader, 250)
            }
            else {
                requestAnimationFrame(autoHideHeader)
            }
        }
    })

    function autoHideHeader() {
        var currentTop = $(window).scrollTop()

        // Scrolling up
        if (previousTop - currentTop > scrollDelta) {
            $header.removeClass('is-hidden')
        }
        else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            // Scrolling down
            $header.addClass('is-hidden')
        }

        previousTop = currentTop
        scrolling = false
    }

    /*
     * Init code blocks
     */

    $('pre').each(function () {
        var $this = $(this),
            $code = $this.html(),
            originalValue = $this.html(),
            unescaped = originalValue.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    
        $this.empty()
        var cm = new CodeMirror(this, {
            value: $code,
            mode: 'twig',
            htmlMode: true,
            lineNumbers: true,
            readOnly: true
        })

        cm.setValue(unescaped)
    })

    $(document).on('click', '.expand-code', function () {
        $(this).closest('.collapsed-code-block').removeClass('collapsed')
    })
});