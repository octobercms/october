$(document).ready(function(){

    var editorEl = $('#editorsettingsCodeeditor'),
        editor = editorEl.codeEditor('getEditorObject'),
        session = editor.getSession(),
        renderer = editor.renderer

    editorEl.height($('#editorSettingsForm').height() - 23)

    $('#Form-field-EditorSettings-theme').on('change', function(){
        editorEl.codeEditor('setTheme', $(this).val())
    })

    $('#Form-field-EditorSettings-font_size').on('change', function(){
        editor.setFontSize(parseInt($(this).val()))
    })

    $('#Form-field-EditorSettings-word_wrap').on('change', function(){
        editorEl.codeEditor('setWordWrap', $(this).val())
    })

    $('#Form-field-EditorSettings-code_folding').on('change', function(){
        session.setFoldStyle($(this).val())
    })

    $('#Form-field-EditorSettings-tab_size').on('change', function(){
        session.setTabSize($(this).val())
    })

    $('#Form-field-EditorSettings-show_invisibles').on('change', function(){
        editor.setShowInvisibles($(this).is(':checked'))
    })

    $('#Form-field-EditorSettings-highlight_active_line').on('change', function(){
        editor.setHighlightActiveLine($(this).is(':checked'))
    })

    $('#Form-field-EditorSettings-use_hard_tabs').on('change', function(){
        session.setUseSoftTabs(!$(this).is(':checked'))
    })

    $('#Form-field-EditorSettings-show_gutter').on('change', function(){
        renderer.setShowGutter($(this).is(':checked'))
    })

})

