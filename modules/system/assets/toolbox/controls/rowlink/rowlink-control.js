/*
 * Row Link control
 *
 * Links an entire table row by finding the first anchor in each row.
 *
 * Data attributes:
 * - data-control="rowlink" - enables the plugin on a table element
 *
 * Config:
 * - target - the anchor selector to use for linking (default: 'a')
 * - excludeClass - disables the link for elements with this class (default: 'nolink')
 * - linkedClass - this class is added to affected table rows (default: 'rowlink')
 */
import { ControlBase } from 'larajax';

const $ = window.jQuery;

export default class RowLinkControl extends ControlBase {
    connect() {
        var opts = $.extend({}, {
            target: 'a',
            excludeClass: 'nolink',
            linkedClass: 'rowlink'
        }, $(this.element).data());

        this.$el = $(this.element);
        this.rows = [];

        var tr = this.$el.prop('tagName') == 'TR'
            ? this.$el
            : this.$el.find('tr:has(td)');

        tr.each((index, rowEl) => {
            var link = $(rowEl)
                .find(opts.target)
                .filter(function() {
                    return !$(this).closest('td').hasClass(opts.excludeClass) &&
                        !$(this).hasClass(opts.excludeClass);
                })
                .first();

            if (!link.length) {
                return;
            }

            var href = link.attr('href'),
                onclick = (typeof link.get(0).onclick == "function") ? link.get(0).onclick : null,
                popup = link.is('[data-control=popup]'),
                request = link.is('[data-request]'),
                skipNextBubble = false;

            function handleClick(e) {
                if (skipNextBubble) {
                    skipNextBubble = false;
                    return;
                }

                if ($(document.body).hasClass('drag')) {
                    return;
                }

                if (onclick) {
                    onclick.apply(link.get(0));
                }
                else if (request) {
                    link.request();
                }
                else if (popup) {
                    link.popup();
                }
                else if (e.ctrlKey || e.metaKey) {
                    window.open(href);
                }
                else {
                    if (oc.useTurbo()) {
                        oc.visit(href);
                    }
                    else {
                        location.assign(href);
                    }
                }
            }

            var $row = $(rowEl).not('.' + opts.excludeClass);

            $row.on('click', 'td:not(.' + opts.excludeClass + ') > .' + opts.excludeClass, function(e) {
                skipNextBubble = true;
            });

            $row.on('click', 'td:not(.' + opts.excludeClass + ')', function(e) {
                handleClick(e);
            });

            $row.on('mousedown', 'td:not(.' + opts.excludeClass + ')', function(e) {
                if (e.which == 2) {
                    window.open(href);
                }
            });

            $row.on('keypress', function(e) {
                if (e.key === '(Space character)' || e.key === 'Spacebar' || e.key === ' ') {
                    handleClick(e);
                    return false;
                }
            });

            $(rowEl).addClass(opts.linkedClass);

            link.hide().after(link.contents());

            this.rows.push($row);
        });

        // Add keyboard navigation to list rows
        $('tr.rowlink').attr('tabindex', 0);
    }

    disconnect() {
        this.rows = null;
        this.$el = null;
    }
}
