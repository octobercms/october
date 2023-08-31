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

});
