(function($) {
/**
 * Runs functions given in arguments in series, each functions passing their results to the next one.
 * Return jQuery Deferred object.
 *
 * @example
 * $.waterfall(
 *    function() { return $.ajax({url : first_url}) },
 *    function() { return $.ajax({url : second_url}) },
 *    function() { return $.ajax({url : another_url}) }
 *).fail(function() {
 *    console.log(arguments)
 *).done(function() {
 *    console.log(arguments)
 *})
 *
 * @example2
 * event_chain = [];
 * event_chain.push(function() { var deferred = $.Deferred(); deferred.resolve(); return deferred; });
 * $.waterfall.apply(this, event_chain).fail(function(){}).done(function(){});
 * 
 * @author Dmitry (dio) Levashov, dio@std42.ru
 * @return jQuery.Deferred
 */
$.waterfall = function() {
    var steps   = [],
        dfrd    = $.Deferred(),
        pointer = 0;

    $.each(arguments, function(i, a) {
        steps.push(function() {
            var args = [].slice.apply(arguments), d;

            if (typeof(a) == 'function') {
                if (!((d = a.apply(null, args)) && d.promise)) {
                    d = $.Deferred()[d === false ? 'reject' : 'resolve'](d);
                }
            } else if (a && a.promise) {
                d = a;
            } else {
                d = $.Deferred()[a === false ? 'reject' : 'resolve'](a);
            }

            d.fail(function() {
                dfrd.reject.apply(dfrd, [].slice.apply(arguments));
            })
            .done(function(data) {
                pointer++;
                args.push(data);

                pointer == steps.length
                    ? dfrd.resolve.apply(dfrd, args)
                    : steps[pointer].apply(null, args);
            });
        });
    });

    steps.length ? steps[0]() : dfrd.resolve();

    return dfrd;
}

})(jQuery);