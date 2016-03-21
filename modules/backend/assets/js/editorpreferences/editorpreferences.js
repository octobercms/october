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

    $('#Form-field-EditorPreferences-enable_basic_autocompletion').on('change', function(){
		editor.setOption('enableBasicAutocompletion', $(this).is(':checked'))
    })

    $('#Form-field-EditorPreferences-enable_snippets').on('change', function(){
		editor.setOption('enableSnippets', $(this).is(':checked'))
    })

    $('#Form-field-EditorPreferences-enable_live_autocompletion').on('change', function(){
		editor.setOption('enableLiveAutocompletion', $(this).is(':checked'))
    })

    $('#Form-field-EditorPreferences-display_indent_guides').on('change', function(){
        editor.setDisplayIndentGuides($(this).is(':checked'))
    })

    $('#Form-field-EditorPreferences-show_print_margin').on('change', function(){
        editor.setShowPrintMargin($(this).is(':checked'))
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

