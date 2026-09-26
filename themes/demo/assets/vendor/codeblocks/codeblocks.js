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

export default class extends oc.ControlBase {
    init() {
        const pre = this.element.querySelector('pre');
        const codeValue = pre.textContent;
        let modeValue;

        if (pre.dataset.language === 'php') {
            modeValue = 'text/x-php';
        }
        else {
            modeValue = {
                name: 'twig',
                base: 'text/html'
            };
        }

        pre.textContent = '';

        new CodeMirror(pre, {
            value: codeValue,
            mode: modeValue,
            lineNumbers: true,
            readOnly: true
        });
    }
}
