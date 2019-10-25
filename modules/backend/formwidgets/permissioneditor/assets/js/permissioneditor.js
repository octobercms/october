+function ($) { "use strict";

    var Base = $.oc.foundation.base,
        BaseProto = Base.prototype

    var PermissionEditor = function() {
        Base.call(this)

        this.init()
    }

    PermissionEditor.prototype = Object.create(BaseProto)
    PermissionEditor.prototype.constructor = PermissionEditor

    PermissionEditor.prototype.init = function() {
        $(document).on('click', '.permissioneditor table td.permission-name', this.proxy(this.onPermissionNameClick))
        $(document).on('click', '.permissioneditor table tr.mode-checkbox input[type=checkbox]', this.proxy(this.onPermissionCheckboxClick))
        $(document).on('click', '.permissioneditor table tr.mode-radio input[type=radio]', this.proxy(this.onPermissionRadioClick))
    }

    // EVENT HANDLERS
    // ============================

    PermissionEditor.prototype.onPermissionNameClick = function(ev) {
        var $row = $(ev.target).closest('tr'),
            $checkbox = $row.find('input[type=checkbox]')

        if ($checkbox.length) {
            $checkbox.trigger('click')
        }
        else {
            var $radios = $row.find('input[type=radio]')

            if ($radios.length != 3) {
                return
            }

            var nextIndex = 0
            for (var i=2; i>=0; i--) {
                if ($radios.get(i).checked) {
                    nextIndex = i+1;
                    break
                }
            }

            if (nextIndex > 2) {
                nextIndex = 0
            }

            $($radios.get(nextIndex)).trigger('click')
        }
    }

    PermissionEditor.prototype.onPermissionCheckboxClick = function(ev) {
        var $row = $(ev.target).closest('tr')

        $row.toggleClass('disabled', !ev.target.checked)
    }

    PermissionEditor.prototype.onPermissionRadioClick = function(ev) {
        var $row = $(ev.target).closest('tr')

        $row.toggleClass('disabled', ev.target.value == -1)
    }

    // INITIALIZATION
    // ============================

    $(document).ready(function(){
        new PermissionEditor()
    })

}(window.jQuery);