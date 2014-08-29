/*
 * Token Breaker plugin
 * Locates Twig tokens and replaces them with potential content inside.
 * 
 * Data attributes:
 * - data-control="dragcomponents" - enables the plugin on an element
 * - data-option="value" - an option with a value
 *
 * JavaScript API:
 * $('a#someElement').dragComponents({ option: 'value' })
 *
 * Dependences: 
 * - Some other plugin (filename.js)
 */
var $editorArea = $('#cms-master-tabs > div.tab-content > .tab-pane.active [data-control="codeeditor"]')
var $editor = $editorArea.codeEditor('getEditorObject'),
    $selection = $editor.getSelection(),
    $session = $editor.getSession(),
    $document = $session.getDocument()

$selection.on('changeCursor', function (event){

    var cursor = $selection.getCursor(),
        line = $document.getLine(cursor.row),
        wordRange = $session.getWordRange(cursor.row, cursor.column),
        word = $session.getTextRange(wordRange)

    if (word == 'component') {

        var lineRegex = new RegExp(/{%\s*component\s(['"])([^"']+)(?:\1)[^(?:%})]+%}/i),
            result = lineRegex.exec(line),
            start,
            end,
            lastEnd = 0,
            lineLength = line.length

        if (result) {
            while (true) {
                start = line.indexOf(result[0], lastEnd),
                end = start + result[0].length
                if (start == -1) break

                if (isMatchingRegex(start, end, cursor.column)) {
                    console.log(result[2] + "Found result at: " + end)
                }

                lastEnd = end
            }
        }


    }
})

function isMatchingRegex(sampleStart, sampleEnd, target)
{
    return sampleStart < target && sampleEnd > target
}

