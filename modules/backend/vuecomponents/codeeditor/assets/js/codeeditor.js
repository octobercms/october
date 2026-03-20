jQuery(function() {
    // Fix EMMET HTML when syntax is Twig
    //
    +(function(exports) {
        if (exports.ace && typeof exports.ace.require == 'function') {
            var emmetExt = exports.ace.require('ace/ext/emmet');

            if (emmetExt && emmetExt.AceEmmetEditor && emmetExt.AceEmmetEditor.prototype.getSyntax) {
                var coreGetSyntax = emmetExt.AceEmmetEditor.prototype.getSyntax;

                emmetExt.AceEmmetEditor.prototype.getSyntax = function() {
                    var $syntax = $.proxy(coreGetSyntax, this)();
                    return $syntax == 'twig' ? 'html' : $syntax;
                };
            }
        }
    })(window);
});

function configureAceEditor(component) {
    var editor = component.editor;

    // Fixes a weird notice about scrolling
    editor.$blockScrolling = Infinity;

    editor.on('change', component.onEditorChange);
    component.lastCachedValue = component.value === null ? '' : component.value;
    editor.getSession().setValue(component.lastCachedValue);

    var options = JSON.parse(component.$el.getAttribute('data-configuration'));

    // Set theme, anticipated languages should be preloaded
    //
    oc.AssetManager.load(
        {
            js: [options.vendorPath + '/theme-' + options.theme + '.js']
        },
        function() {
            editor.setTheme('ace/theme/' + options.theme);
            editor.getSession().setMode({
                path: 'ace/mode/' + component.language,
                inline: component.language === 'php'
            });
        }
    );

    editor.setShowInvisibles(options.showInvisibles);
    editor.setBehavioursEnabled(options.autoCloseTags);
    editor.setHighlightActiveLine(options.highlightActiveLine);
    editor.renderer.setShowGutter(options.showGutter);
    editor.renderer.setShowPrintMargin(options.showPrintMargin);
    editor.setHighlightSelectedWord(options.highlightSelectedWord);
    editor.renderer.setHScrollBarAlwaysVisible(options.hScrollBarAlwaysVisible);
    editor.setDisplayIndentGuides(options.displayIndentGuides);
    editor.getSession().setUseSoftTabs(options.useSoftTabs);
    editor.getSession().setTabSize(parseInt(options.tabSize) || 4);
    editor.setReadOnly(component.readOnly);
    editor.getSession().setFoldStyle(options.codeFolding);
    editor.setFontSize(parseInt(options.fontSize) || 12);

    setWordWrap(options.wordWrap, editor);

    ace.require('ace/config').set('basePath', options.vendorPath);

    var autocompletion = options.autocompletion || 'manual';
    editor.setOptions({
        enableEmmet: component.enableEmmet,
        enableBasicAutocompletion: autocompletion === 'basic',
        enableSnippets: options.enableSnippets,
        enableLiveAutocompletion: autocompletion === 'live'
    });

    editor.renderer.setScrollMargin(options.margin, options.margin, 0, 0);
    editor.renderer.setPadding(options.margin);

    if (component.completers) {
        // The concat operation does not change the original
        // array but instead returns a new array. This is the
        // desired behavior because we want to add the completers
        // only to a specific Ace instance.
        //
        editor.completers = editor.completers.concat(component.completers);
    }

    editor.commands.on('afterExec', function(e) {
        if (e.command.name == 'insertstring') {
            component.$emit('insertstring', e, ace);
        }
    });

    component.$emit('initeditor', editor, ace);
}

function setWordWrap(mode, editor) {
    var session = editor.getSession(),
        renderer = editor.renderer;

    switch (mode + '') {
        default:
        case 'off':
            session.setUseWrapMode(false);
            renderer.setPrintMarginColumn(80);
            break;
        case '40':
            session.setUseWrapMode(true);
            session.setWrapLimitRange(40, 40);
            renderer.setPrintMarginColumn(40);
            break;
        case '80':
            session.setUseWrapMode(true);
            session.setWrapLimitRange(80, 80);
            renderer.setPrintMarginColumn(80);
            break;
        case 'fluid':
            session.setUseWrapMode(true);
            session.setWrapLimitRange(null, null);
            renderer.setPrintMarginColumn(80);
            break;
    }
}

function checkSize(component) {
    if (!component.editor) {
        return;
    }

    if (component.$el.offsetParent === null) {
        return;
    }

    if (component.width === null) {
        component.width = component.$el.offsetWidth;
    }

    if (component.height === null) {
        component.height = component.$el.offsetHeight;
    }

    if (component.width != component.$el.offsetWidth || component.height != component.$el.offsetHeight) {
        component.editor.resize();
    }

    component.width = component.$el.offsetWidth;
    component.height = component.$el.offsetHeight;
}

export default {
    props: {
        fullHeight: {
            type: Boolean,
            default: true
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        enableEmmet: {
            type: Boolean,
            default: true
        },
        containerCssClass: {
            type: String,
            default: ''
        },
        completers: Array,
        value: String,
        language: String
    },
    data: function() {
        return {
            editorId: null,
            editor: null,
            changeTimeoutlId: null,
            width: null,
            height: null,
            sizeIntervalId: null,
            lastCachedValue: ''
        };
    },
    computed: {
        cssClass: function computeCssClass() {
            var result = '';

            if (this.fullHeight) {
                result += ' full-height-strict';
            }

            result += ' ' + this.containerCssClass;

            return result;
        }
    },
    methods: {
        onEditorChange: function onEditorChange() {
            if (this.changeTimeoutlId !== null) {
                clearTimeout(this.changeTimeoutlId);
                this.changeTimeoutlId = null;
            }

            var that = this;
            this.changeTimeoutlId = setTimeout(function() {
                that.lastCachedValue = that.editor.getSession().getValue();
                that.$emit('input', that.lastCachedValue);
                that.changeTimeoutlId = null;
            }, 100);
        }
    },
    mounted: function onMounted() {
        this.editorId = $.oc.domIdManager.generate('codeeditor');

        var that = this;
        Vue.nextTick(function() {
            that.editor = Vue.markRaw(ace.edit(that.editorId));

            configureAceEditor(that);
        });

        this.sizeIntervalId = setInterval(function() {
            checkSize(that);
        }, 500);
    },
    beforeUnmount: function beforeUnmount() {
        this.$emit('destroy', this.editor);

        this.editor.destroy();
        this.editor.off('change', this.onEditorChange);

        var keys = Object.keys(this.editor.renderer);
        for (var i = 0, len = keys.length; i < len; i++) {
            this.editor.renderer[keys[i]] = null;
        }

        keys = Object.keys(this.editor);
        for (var i = 0, len = keys.length; i < len; i++) {
            this.editor[keys[i]] = null;
        }

        clearInterval(this.sizeIntervalId);

        this.editor = null;
    },
    watch: {
        value: function onValueChanged(newValue, oldValue) {
            if (this.editor) {
                if (newValue === null) {
                    newValue = '';
                }

                if (newValue == this.lastCachedValue) {
                    return;
                }

                this.editor.getSession().setValue(newValue);
            }
        }
    }
};
