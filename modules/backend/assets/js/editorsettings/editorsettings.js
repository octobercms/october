$(document).ready(function(){

    var editorEl = $('#editorsettingsCodeeditor'),
        editor = editorEl.codeEditor('getEditorObject')

    editorEl.height($('#editorSettingsForm').height())

    $('#Form-form-field-EditorSettings-theme').on('change', function(){
        $('#editorsettingsCodeeditor').codeEditor('setTheme', $(this).val())
    })
})

