$(".toggle-password").click(function () {
    $(this).find('i').toggleClass("icon-eye icon-eye-slash");
    var input = $('#' + $(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});