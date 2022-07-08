/*
 * Code Blocks
 */
import $ from 'jquery';
import CodeMirror  from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/twilight.css';
import 'codemirror/mode/twig/twig';
import 'codemirror/mode/php/php';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/xml/xml';
import 'codemirror/addon/mode/multiplex';

$(document).on('render', function() {
    $('.code-block > pre').each(function () {
        if (this.dataset.disposable) {
            return;
        }
        this.dataset.disposable = true;

        var $pre = $(this),
            codeValue = $pre.text(),
            language = $pre.data('language'),
            modeValue;

        if (language === 'php') {
            modeValue = 'text/x-php';
        }
        else {
            modeValue = {
                name: 'twig',
                base: 'text/html'
            };
        }

        $pre.empty();

        new CodeMirror(this, {
            value: codeValue,
            mode: modeValue,
            lineNumbers: true,
            readOnly: true
        });
    });

});

$(document).on('click', '.expand-code', function () {
    $(this).closest('.collapsed-code-block').removeClass('collapsed');
});
