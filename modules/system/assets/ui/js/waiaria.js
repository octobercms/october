/*
 * WAI-ARIA plugin
 *
 * - Adds keyboard navigation controls to radio button form fields
 * - Adds keyboard navigation controls to slider switch button form fields
 * - Adds keyboard navigation controls to tabs 
 */
$(function() {
    "use strict";

    /*
     * Tab - Move forwards
     * Shift and Tab - Move backwards
     * Enter - Select that tab (PC)
     * Space bar - Select that tab (MAC)
     * Home - First tab
     * End - Last tab
     * Arrow Keys - Scroll through the tabs
     */
    function whiteList() {
        var whitelist = [
            'ArrowLeft',
            'ArrowUp',
            'ArrowDown',
            'ArrowRight',
            'Home',
            'End',
            'Tab',
            'Shift',
            'Enter',
            '(Space character)',
            'Spacebar',
            ' '
        ];

        if ((event.shiftKey && event.key === 'Tab') || (event.type === 'keydown' && !whitelist.includes(event.key))) {
            return;
        }
    }

   /*
    * Set various WAI-ARIA options on web page load 
    */
    function waiariaStartup() {
        // Add WAI-ARIA role group for radio buttons
        $('.radio-field').attr({'role': 'radiogroup', 'aria-label': 'Radio button group'});    

        // Set all sidebar menu buttons to not allow tab control
        $('#layout-sidenav a[role="button"]').attr('tabindex', '-1');

        // Set the first sidebar menu button to allow tab only
        $('#layout-sidenav a[role="button"]').first().attr('tabindex', '0');
    }

    /*
     * Sidebar menu for cms and plugin pages - Toolbar (setup for vertical orientation)
     * Important - 'keydown' must be used to prevent webpage scrolling issues. 
     */
    $('body').on('click keydown', '#layout-sidenav a[role="button"]', function(event) {
        // Run whitelist checker
        whiteList();

        var $target = $(event.currentTarget);

        // Set all social share buttons to false
        $('#layout-sidenav a[role="button"]').attr('tabindex', '-1');

        // Add wai-aria selected on the active tab
        $target.attr('tabindex', '0');

        if (event.key === 'ArrowUp') {
            event.preventDefault();

            var position = event.key === 'ArrowUp' ? 'first-child' : 'last-child',
                $activated = $target.parent();

            $activated.prev().children('#layout-sidenav a[role="button"]').click().focus();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();

            var position = event.key === 'ArrowDown' ? 'first-child' : 'last-child',
                $activated = $target.parent();

            $activated.next().children('#layout-sidenav a[role="button"]').click().focus();
        } else if (event.key === 'Home') {
            event.preventDefault();

            $('#layout-sidenav a[role="button"]').first().click().focus();
        } else if (event.key === 'End') {
            event.preventDefault();

            $('#layout-sidenav a[role="button"]').last().click().focus();
        }

        // Important set to true to allow tab to enter and exit
        return true;
    });

    /*
     * Adds WAI-ARIA to breadcrumbs
     */
    if ($('.control-breadcrumb nav').not().length == 0) {
        $('.control-breadcrumb ul').wrap('<nav>');
        $('.control-breadcrumb nav').attr({'role': 'navigation', 'aria-label': 'breadcrumb'});
        $('.control-breadcrumb li').last().attr('aria-current', 'page');
        $('.control-breadcrumb li[aria-current="page"] a').attr('href', 'javascript:;');
    }
    if ($('.control-breadcrumb li[aria-current="page"] a').not().length == 0) {
        $('.control-breadcrumb nav ul li').last().wrapInner('<a>');
        $('.control-breadcrumb nav ul li a').last().attr('href', 'javascript:;');
    }

    /*
     * Radio buttons
     */
    $('body').on('click keydown', '.custom-radio input[role="radio"]', function(event) {
        // Run whitelist checker
        whiteList();

        var $target = $(event.currentTarget),
            parentContainer = $target.closest('.radio-field');

        // Remove WAI-ARIA checked and HTML checked attributes
        $(parentContainer).find('input[role="radio"]').attr({
            'aria-checked': 'false',
            'tabindex': '-1',
            'checked': false
        });

        // Add WAI-ARIA checked and HTML checked attributes to focus element
        $(parentContainer).find('input[role="radio"]:checked').attr({
            'aria-checked': 'true',
            'tabindex': '0',
            'checked': true
        });
    });

    /*
     * Slider switch buttons
     */
    $('body').on('change', '.switch-field input[role="checkbox"]', function () {
        // Run whitelist checker
        whiteList();

        // Get current switch
        var self = $(this);

        if (self.is(":checked")) {
            self.attr({
                'aria-checked': true,
                'checked': true
            });
        } else {
            self.attr({
                'aria-checked': false,
                'checked': false
            });
        }
    });
    
    /*
     * Turn off custom tab focus ring
     * Important - 'keydown' selects the form and 'keyup' selects the form field.
     * 'keydown' must be used.       
     */
    $('body').on('click keydown', '.form-widget', function() {
        // Run whitelist checker
        whiteList();

        // Remove all custom tab focus rings
        $('.master-tabs li, .primary-tabs li, .secondary-tabs li, .content-tabs li').removeClass('focus-visible-tabs');
    });

    /*
     * Tabs
     * Important - 'keydown' using previous tab selection and 'keyup' uses current tab selection.
     * 'keyup' must be used.     
     */
    $('body').on('click keyup', '.master-tabs a[role="tab"],.primary-tabs a[role="tab"],.secondary-tabs a[role="tab"],.content-tabs a[role="tab"]', function(event) {
        // Run whitelist checker
        whiteList();

        var $target = $(event.currentTarget),
            tabName = '',
            tabPanel = $target.attr('data-target');

        if ($target.closest('.master-tabs').length) {
            tabName = '.master-tabs';
        } else if ($target.closest('.primary-tabs').length) {
            tabName = '.primary-tabs';
        } else if ($target.closest('.secondary-tabs').length) {
            tabName = '.secondary-tabs';
        } else if ($target.closest('.content-tabs').length) {
            tabName = '.content-tabs';
        }

        // Remove all custom tab focus rings
        $('.master-tabs li, .primary-tabs li, .secondary-tabs li, .content-tabs li').removeClass('focus-visible-tabs');

        // Add custom focus ring to current tab
        if ($(tabName + ' a[role="tab"]').hasClass('focus-visible')) {
            $target.closest(tabName + ' li').addClass('focus-visible-tabs');
        }

        // Set all tabs to false
        $(tabName + ' a').attr('aria-selected', 'false');
        // Set all tab panels to hidden
        $(tabName + ' div.tab-pane').attr('hidden', 'hidden');

        // Add wai-aria selected on the active tab
        $target.attr('aria-selected', 'true');
        // Remove hidden attribute on active tab panel
        $(tabPanel).attr('hidden', false);

        if (event.key === 'ArrowLeft') {
            event.preventDefault();

            var position = event.key === 'ArrowLeft' ? 'first-child' : 'last-child',
                $activated = $(tabName + ' a[aria-selected="true"]').parent();

            $activated.prev().children(tabName + ' a').click().focus();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();

            var position = event.key === 'ArrowRight' ? 'first-child' : 'last-child',
                $activated = $(tabName + ' a[aria-selected="true"]').parent();

            $activated.next().children(tabName + ' a').click().focus();
        } else if (event.key === 'Home') {
            event.preventDefault();

            $(tabName + ' li ' + ' a').first().click().focus();
        } else if (event.key === 'End') {
            event.preventDefault();

            $(tabName + ' li ' + ' a').last().click().focus();
        }

        // Important - Must be set to true for October to set class="active" in the <li>
        return true;
    });

    // Run WAI-ARIA options on startup
    waiariaStartup();

});
