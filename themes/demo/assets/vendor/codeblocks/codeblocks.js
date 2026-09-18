/*
 * Code Blocks
 */
import CodeMirror  from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/twilight.css';
import 'codemirror/mode/twig/twig';
import 'codemirror/mode/php/php';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/xml/xml';
import 'codemirror/addon/mode/multiplex';

const $ = window.jQuery;

function renderCodeBlocks() {
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

}

$(renderCodeBlocks);
$(document).on('render', renderCodeBlocks);
