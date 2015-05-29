/*
=require ../vendor/bootstrap/js/transition.js
=require ../vendor/bootstrap/js/tooltip.js
*/

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