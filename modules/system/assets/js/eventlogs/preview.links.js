/*
 * Previews class
 */

+function ($) {
    "use strict";

    var ExceptionBeautifier = $.fn.exceptionBeautifier.Constructor;

    ExceptionBeautifier.EDITORS = {
        subl: {scheme: 'subl://open?url=file://%file&line=%line', name: 'Sublime (subl://)'},
        txmt: {scheme: 'txmt://open/?url=file://%file&line=%line', name: 'TextMate (txmt://)'},
        mvim: {scheme: 'mvim://open/?url=file://%file&line=%line', name: 'MacVim (mvim://)'},
        phpstorm: {scheme: 'phpstorm://open?file=%file&line=%line', name: 'PhpStorm (phpstorm://)'},
        editor: {scheme: 'editor://open/?file=%file&line=%line', name: 'Custom (editor://)'}
    }

    ExceptionBeautifier.REGEX.editor = /idelink:\/\/([^#]+)&([0-9]+)?/

    ExceptionBeautifier.extensions.push({
        onInit: function (exceptionBeautfier) {
            exceptionBeautfier.initEditorPopup();
        },
        onParse: function (exceptionBeautfier) {
            exceptionBeautfier.$el.on('click', 'a', function () {
                exceptionBeautfier.openWithEditor($(this).data('href'));
            })
        }
    })

    ExceptionBeautifier.prototype.initEditorPopup = function () {
        var self = this,
            title = $.oc.lang.get('eventlog.editor.title'),
            description = $.oc.lang.get('eventlog.editor.description'),
            openWith = $.oc.lang.get('eventlog.editor.openWith'),
            saveRememberClose = $.oc.lang.get('eventlog.editor.openAndRemember'),
            openClose = $.oc.lang.get('eventlog.editor.open')

        self.$el.parent().append('                                                                                      \
            <div class="control-popup modal fade" id="exception-link-editor" tabindex="-1" role="dialog">               \
            <div class="modal-dialog"><div class="modal-content"><div class="modal-header">                             \
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>                \
            <h4 class="modal-title">' + title + '</h4>                                                                   \
            </div>                                                                                                      \
            <div class="modal-body"><p>' + description + '</p>                                                          \
            <div class="form-group">                                                                                    \
            <label class="control-label">' + openWith + ':</label>                                                      \
            <select class="form-control" name="select-exception-link-editor"></select>                                  \
            </div>                                                                                                      \
            </div>                                                                                                      \
            <div class="modal-footer">                                                                                  \
            <button type="button" class="btn btn-default" data-trigger="editor-open-save"                               \
                    data-dismiss="modal">' + saveRememberClose + '</button>                                             \
            <button type="button" class="btn btn-primary" data-trigger="editor-open-close"                              \
                    data-dismiss="modal">' + openClose + '</button>                                                     \
            </div></div></div></div>')
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
            if (window.sessionStorage && window.sessionStorage['oc-exception-editor']) {
                open(window.sessionStorage['oc-exception-editor']);
            } else {
                $('#exception-link-editor')
                    .popup({content: $('#exception-link-editor').html()})
                    .on('shown.oc.popup', function (event, source, popup) {
                        var $select = $('select', popup).empty()

                        if (!window.sessionStorage) {
                            $('[data-trigger="editor-open-save"]', popup).hide();
                        }

                        $('[data-trigger="editor-open-close"]', popup).on('click', function () {
                            open($select.val());
                        })

                        $('[data-trigger="editor-open-save"]', popup).on('click', function () {
                            window.sessionStorage['oc-exception-editor'] = $select.val();

                            open($select.val());
                        })

                        for (var key in ExceptionBeautifier.EDITORS) {
                            $select.append('<option value="' + key + '">' + ExceptionBeautifier.EDITORS[key].name + '</option>')
                        }
                    })
                    .on('hide.oc.popup', function (event, source, popup) {
                        $('[data-trigger]', popup).off('click')
                    })
            }
        }
    }

    ExceptionBeautifier.prototype.formatFilePath = function (path, line) {
        return '<a class="markup_exception_file" href="javascript:" data-href="idelink://' + path + '&' + line + '">' + path + '</a>'
    }

}(window.jQuery)