$(document).ready(function(){

    var editorEl = $('#editorpreferencesCodeeditor'),
        editor = editorEl.codeEditor('getEditorObject'),
        session = editor.getSession(),
        renderer = editor.renderer

    editorEl.height($('#editorSettingsForm').height() - 23)

    $('#Form-field-EditorPreferences-theme').on('change', function(){
        editorEl.codeEditor('setTheme', $(this).val())
    })

    $('#Form-field-EditorPreferences-font_size').on('change', function(){
        editor.setFontSize(parseInt($(this).val()))
    })

    $('#Form-field-EditorPreferences-word_wrap').on('change', function(){
        editorEl.codeEditor('setWordWrap', $(this).val())
    })

    $('#Form-field-EditorPreferences-code_folding').on('change', function(){
        session.setFoldStyle($(this).val())
    })

    $('#Form-field-EditorPreferences-tab_size').on('change', function(){
        session.setTabSize($(this).val())
    })

    $('#Form-field-EditorPreferences-show_invisibles').on('change', function(){
        editor.setShowInvisibles($(this).is(':checked'))
    })

    $('#Form-field-EditorPreferences-highlight_active_line').on('change', function(){
        editor.setHighlightActiveLine($(this).is(':checked'))
    })

    $('#Form-field-EditorPreferences-use_hard_tabs').on('change', function(){
        session.setUseSoftTabs(!$(this).is(':checked'))
    })

    $('#Form-field-EditorPreferences-show_gutter').on('change', function(){
        renderer.setShowGutter($(this).is(':checked'))
    })

})

