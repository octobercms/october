$(document).ready(function(){

    var editorEl = $('#editorsettingsCodeeditor'),
        editor = editorEl.codeEditor('getEditorObject'),
        session = editor.getSession(),
        renderer = editor.renderer

    editorEl.height($('#editorSettingsForm').height() - 23)

    $('#Form-form-field-EditorSettings-theme').on('change', function(){
        editorEl.codeEditor('setTheme', $(this).val())
    })

    $('#Form-form-field-EditorSettings-font_size').on('change', function(){
        editor.setFontSize(parseInt($(this).val()))
    })

    $('#Form-form-field-EditorSettings-word_wrap').on('change', function(){
        switch ($(this).val()) {
            case "off":
                session.setUseWrapMode(false)
                renderer.setPrintMarginColumn(80)
            break
            case "40":
                session.setUseWrapMode(true)
                session.setWrapLimitRange(40, 40)
                renderer.setPrintMarginColumn(40)
            break
            case "80":
                session.setUseWrapMode(true)
                session.setWrapLimitRange(80, 80)
                renderer.setPrintMarginColumn(80)
            break
            case "fluid":
                session.setUseWrapMode(true)
                session.setWrapLimitRange(null, null)
                renderer.setPrintMarginColumn(80)
            break
        }
    })

    $('#Form-form-field-EditorSettings-code_folding').on('change', function(){
        session.setFoldStyle($(this).val())
    })

    $('#Form-form-field-EditorSettings-tab_size').on('change', function(){
        session.setTabSize($(this).val())
    })

    $('#Form-form-field-EditorSettings-show_invisibles').on('change', function(){
        editor.setShowInvisibles($(this).is(':checked'))
    })

    $('#Form-form-field-EditorSettings-highlight_active_line').on('change', function(){
        editor.setHighlightActiveLine($(this).is(':checked'))
    })

    $('#Form-form-field-EditorSettings-use_hard_tabs').on('change', function(){
        session.setUseSoftTabs(!$(this).is(':checked'))
    })

    $('#Form-form-field-EditorSettings-show_gutter').on('change', function(){
        renderer.setShowGutter($(this).is(':checked'))
    })

})

