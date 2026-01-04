/*
 * October AJAX Enhancements
 */


// Persist site selection across requests
//
addEventListener('ajax:setup', function(event) {
    var siteId = $('meta[name="backend-site"]').attr('content');
    if (siteId) {
        var options = event.detail.context.options;
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['X-SITE-ID'] = siteId;
    }
});

// Adds the option to merge in a parent data with the current request
// this is used by modals that need the state of a parent form
//
addEventListener('ajax:setup', function(event) {
    const context = event.detail.context,
        $el = context.el;

    if (!$el || !$el.closest) {
        return;
    }

    const $form = $el.closest('form');
    if (!$form || !$form.dataset || !$form.dataset.requestParentForm) {
        return;
    }

    var paramToObj = function(name, value) {
        if (value === undefined) {
            value = '';
        }

        if (typeof value == 'object') {
            return value;
        }

        try {
            return oc.parseJSON("{" + value + "}");
        }
        catch (e) {
            throw new Error('Error parsing the '+name+' attribute value. '+e);
        }
    }

    var elementParents = function(element, selector) {
        const parents = [];
        if (!element.parentNode) {
            return parents;
        }

        let ancestor = element.parentNode.closest(selector);
        while (ancestor) {
            parents.push(ancestor);
            ancestor = ancestor.parentNode.closest(selector);
        }

        return parents;
    }

    var extractDataFromForms = function(parentFormId) {
        if (!parentFormId) {
            return;
        }

        const $parent = document.querySelector(parentFormId);
        if (!$parent) {
            return;
        }

        let $parentForm = $parent.closest('form');
        if (!$parentForm) {
            $parentForm = $parent;
        }

        let data = oc.serializeJSON($parentForm) || {};

        elementParents($parent, '[data-request-data]').reverse().forEach(function(el) {
            Object.assign(data, paramToObj(
                'data-request-data',
                el.getAttribute('data-request-data')
            ));
        });

        if (!$parentForm.dataset || !$parentForm.dataset.requestParentForm) {
            return data;
        }

        return {
            ...extractDataFromForms($parentForm.dataset.requestParentForm) || {},
            ...data
        };
    }

    context.options.data = {
        ...extractDataFromForms($form.dataset.requestParentForm) || {},
        ...context.options.data || {}
    };
});
