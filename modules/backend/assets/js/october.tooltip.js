/*
 * Implement the tooltip control automatically
 *
 * Usage:
 *
 *   <a
 *       href="javascript:;"
 *       data-toggle="tooltip"
 *       data-placement="left"
 *       title="Tooltip content">
 *       Some link
 *   </a>
 */

(function($){

    $(document).render(function(){
        $('[data-toggle="tooltip"]').tooltip()
    })

})(jQuery);