/*
 * Application
 */
$(function() {
    /*
     * Auto hide navbar
     */
    var $header = $('.navbar-autohide'),
        scrolling = false,
        previousTop = 0,
        scrollDelta = 10,
        scrollOffset = 150;

    $(window).on('scroll', function(){
        if (!scrolling) {
            scrolling = true;

            if (!window.requestAnimationFrame) {
                setTimeout(autoHideHeader, 250);
            }
            else {
                requestAnimationFrame(autoHideHeader);
            }
        }
    });

    function autoHideHeader() {
        var currentTop = $(window).scrollTop();

        // Scrolling up
        if (previousTop - currentTop > scrollDelta) {
            $header.removeClass('is-hidden');
        }
        else if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
            // Scrolling down
            $header.addClass('is-hidden');
        }

        previousTop = currentTop;
        scrolling = false;
    }

    /*
     * Popovers
     */
    $('[data-bs-toggle="popover"]').each(function() {
        var $el = $(this);
        if ($el.data('content-target')) {
            $el
                .popover({ html: true, content: $($el.data('content-target')).get(0) })
                .on('shown.bs.popover', function() {
                    $('input:first', $($el.data('content-target'))).focus();
                })
            ;
        }
        else {
            $el.popover();
        }
    });
});
