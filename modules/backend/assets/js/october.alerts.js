
/*
 * Implement "Sweet Alert" with AJAX framework
 */

$(window).on('ajaxErrorMessage', function(event, message){
    if (!message) return

    swal({
        title: message,
        // type: 'error',
        confirmButtonClass: 'btn-default'
    })

    // Prevent the default alert() message
    event.preventDefault()
})

$(window).on('ajaxConfirmMessage', function(event, message){
    if (!message) return

    swal({
        title: message,
        // type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn-primary'
    },
    function(isConfirm){
        isConfirm
            ? event.promise.resolve()
            : event.promise.reject()
    })

    // Prevent the default confirm() message
    event.preventDefault()
    return true
})

/*
 * Override "Sweet Alert" functions to translate default buttons
 */

$(document).on('ready', function(){
    if (!window.swal) return

    var swal = window.swal

    window.sweetAlert = window.swal = function(message, callback) {
        if (typeof message === 'object') {
            // Do not override if texts are provided
            message.confirmButtonText = message.confirmButtonText || $.oc.lang.get('sweetalert.confirm_button_text')
            message.cancelButtonText = message.cancelButtonText || $.oc.lang.get('sweetalert.cancel_button_text')
        }
        else {
            message = {
                title: message,
                confirmButtonText: $.oc.lang.get('sweetalert.confirm_button_text'),
                cancelButtonText: $.oc.lang.get('sweetalert.cancel_button_text')
            }
        }

        swal(message, callback)
    }
})
