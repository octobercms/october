// Apply the is-invalid class to fields that fail validation
addEventListener('ajax:invalid-field', function(event) {
    event.detail.element.classList.add('is-invalid');
});

// Clear validation styles when the request is resubmitted
addEventListener('ajax:promise', function(event) {
    var form = event.target.closest('form');
    if (form) {
        form.querySelectorAll('.is-invalid').forEach(function(el) {
            el.classList.remove('is-invalid');
        });
    }
});

addEventListener('render', function() {

    // Auto Collapsed List
    $('ul.bullet-list li.active:first').each(function() {
        $(this).parents('ul.collapse').each(function() {
            $(this).addClass('show').prevAll('.collapse-caret:first').removeClass('collapsed');
        });
    });

    // Tooltips
    $('[data-bs-toggle="tooltip"]').each(function() {
        $(this).tooltip();
    });

    // Popovers
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

    // How it is made
    setTimeout(function() {
        $('.how-its-made').removeClass('init');
    }, 1);

    // Close any open offcanvas when a modal is opened from within it
    $('.modal').off('show.bs.modal.offcanvas').on('show.bs.modal.offcanvas', function() {
        $('.offcanvas.show').each(function() {
            bootstrap.Offcanvas.getInstance(this)?.hide();
        });
    });

});
