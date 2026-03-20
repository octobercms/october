/*
 * Exception Beautifier plugin - Links extension
 */
+function ($) {
    "use strict";

    var ExceptionBeautifier = $.fn.exceptionBeautifier.Constructor

    ExceptionBeautifier.EDITORS = {
        vscode: {scheme: 'vscode://file/%file&line=%line', name: 'VSCode (vscode://)'},
        subl: {scheme: 'subl://open?url=file://%file&line=%line', name: 'Sublime (subl://)'},
        txmt: {scheme: 'txmt://open/?url=file://%file&line=%line', name: 'TextMate (txmt://)'},
        mvim: {scheme: 'mvim://open/?url=file://%file&line=%line', name: 'MacVim (mvim://)'},
        phpstorm: {scheme: 'phpstorm://open?file=%file&line=%line', name: 'PhpStorm (phpstorm://)'},
        editor: {scheme: 'editor://open/?file=%file&line=%line', name: 'Custom (editor://)'}
    }

    ExceptionBeautifier.REGEX.editor = /idelink:\/\/([^#]+)&([0-9]+)?/
    ExceptionBeautifier.LINKER_POPUP_CONTENT = null

    ExceptionBeautifier.extensions.push({
        onInit: function (exceptionBeautfier) {
            exceptionBeautfier.initEditorPopup()
        },
        onParse: function (exceptionBeautfier) {
            exceptionBeautfier.$el.on('click', 'a[data-href]', function () {
                exceptionBeautfier.openWithEditor($(this).data('href'))
            })
        }
    })

    ExceptionBeautifier.prototype.initEditorPopup = function () {
        if (!ExceptionBeautifier.LINKER_POPUP_CONTENT) {
            var title = $.oc.lang.get('eventlog.editor.title'),
                description = $.oc.lang.get('eventlog.editor.description'),
                openWith = $.oc.lang.get('eventlog.editor.openWith'),
                rememberChoice = $.oc.lang.get('eventlog.editor.remember_choice'),
                open = $.oc.lang.get('eventlog.editor.open'),
                cancel = $.oc.lang.get('eventlog.editor.cancel'),
                popup = $('                                                                                                \
<div>                                                                                                                      \
    <div class="modal-header">                                                                                             \
        <h4 class="modal-title">' + title + '</h4>                                                                         \
        <button type="button" class="btn-close" data-dismiss="modal" aria-hidden="true"></button>                          \
    </div>                                                                                                                 \
    <div class="modal-body">                                                                                               \
        <p>' + description + '</p>                                                                                         \
        <div class="form-group">                                                                                           \
            <label class="form-label">' + openWith + '</label>                                                         \
            <select class="form-control" name="select-exception-link-editor"></select>                                     \
        </div>                                                                                                             \
        <div class="form-group">                                                                                           \
            <div class="form-check">                                                                                       \
                <input class="form-check-input" name="checkbox" value="1" type="checkbox" id="editor-remember-choice" />   \
                <label class="form-check-label" for="editor-remember-choice">' + rememberChoice + '</label>                \
            </div>                                                                                                         \
        </div>                                                                                                             \
    </div>                                                                                                                 \
    <div class="modal-footer">                                                                                             \
        <button type="button" class="btn btn-primary" data-action="submit" data-dismiss="modal">' + open + '</button>      \
        <button type="button" class="btn btn-default" data-dismiss="popup">' + cancel + '</button>                         \
    </div>                                                                                                                 \
</div>'
                ),
                select = $('select', popup)

            for (var key in ExceptionBeautifier.EDITORS) {
                if (ExceptionBeautifier.EDITORS.hasOwnProperty(key)) {
                    select.append('<option value="' + key + '">' + $.oc.escapeHtmlString(ExceptionBeautifier.EDITORS[key].name) + '</option>')
                }
            }

            ExceptionBeautifier.LINKER_POPUP_CONTENT = popup.html()
        }
    }

    ExceptionBeautifier.prototype.openWithEditor = function (link) {
        var self = this,
            matches,
            open = function (value) {
                window.open(link.replace(
                    ExceptionBeautifier.REGEX.editor,
                    ExceptionBeautifier.EDITORS[value].scheme
                        .replace(/%file/, matches[1])
                        .replace(/%line/, matches[2])
                ), '_self')
            }

        if (matches = link.match(ExceptionBeautifier.REGEX.editor)) {
            if (window.sessionStorage && window.sessionStorage['oc-exception-beautifier-editor']) {
                open(window.sessionStorage['oc-exception-beautifier-editor'])
            } else {
                $.popup({content: ExceptionBeautifier.LINKER_POPUP_CONTENT})
                    .on('shown.oc.popup', function (event, source, popup) {
                        var select = $('select', popup)

                        self.initCustomSelect(select)

                        $('[data-action="submit"]', popup).on('click', function () {
                            if ($('#editor-remember-choice').prop('checked') && window.sessionStorage) {
                                window.sessionStorage['oc-exception-beautifier-editor'] = select.val()
                            }

                            open(select.val())
                        })
                    })
                    .on('hide.oc.popup', function (event, source, popup) {
                        $('[data-action]', popup).off('click')
                    })
            }
        }
    }

    ExceptionBeautifier.prototype.formatFilePath = function (path, line) {
        var self = this

        return '{exception-beautifier-file#a href="javascript:" data-href="idelink://' + encodeURIComponent(self.rewritePath(path)) + '&' + line + '"}' + path + '{/exception-beautifier-file#a}'
    }

    ExceptionBeautifier.prototype.rewritePath = function (path) {
        return path.replace(/\\/g, '/')
    }

    ExceptionBeautifier.prototype.initCustomSelect = function (select) {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return
        }

        var options = {
            minimumResultsForSearch: Infinity,
            escapeMarkup: function (m) {
                return m
            }
        }

        select.select2(options)
    }

}(window.jQuery)