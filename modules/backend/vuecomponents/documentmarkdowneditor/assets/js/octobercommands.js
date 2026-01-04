oc.Modules.register('backend.vuecomponents.documentmarkdowneditor.octobercommands', function() {
    'use strict';

    function getUrlPopupConfig(component) {
        return [
            {
                property: 'url',
                title: 'URL',
                type: 'string',
                defaultFocus: true,
                placeholder: 'https://...',
                validation: {
                    required: {
                        message: component.trans('url_required')
                    },
                    regex: {
                        message: component.trans('url_validation'),
                        pattern: '^https?:\\/\\/'
                    }
                }
            }
        ];
    }

    class OctoberCommands {
        invoke(command, editor, component) {
            switch (command) {
                case 'oc-snippet':
                    return this.insertSnippet(editor);

                case 'oc-link':
                    return this.browseLink(editor);

                case 'oc-upload-image':
                    return this.uploadImage(editor);

                case 'oc-browse-image':
                    return this.browseImage(editor);

                case 'oc-enter-image-url':
                    return this.addImageByUrl(editor, component);

                case 'oc-browse-file':
                    return this.browseFile(editor);

                case 'oc-upload-file':
                    return this.uploadFile(editor);

                case 'oc-enter-file-url':
                    return this.addFileByUrl(editor, component);
            }
        }

        uploadMedia(callback, accept) {
            const uploaderUtils = oc.Modules.import('backend.vuecomponents.uploader.utils');
            uploaderUtils.selectAndUploadMediaManagerFiles(
                callback,
                true,
                accept
            );
        }

        titleFromUrl(url) {
            const parts = url.split('/');
            for (let index = parts.length - 1; index >= 0; index--) {
                const part = parts[index];
                if (part.length === 0) {
                    continue;
                }

                return decodeURIComponent(part);
            }

            return decodeURIComponent(url);
        }

        insertFileLink(link, editor, addNewline) {
            let str = '[' + this.titleFromUrl(link) + '](' + link + ')';
            if (addNewline) {
                str += '\n';
            }

            editor.codemirror.replaceSelection(str);
        }

        uploadImage(editor) {
            this.uploadMedia((link, isMultiple, isLast) => {
                let str = '![' + this.titleFromUrl(link) + '](' + link + ')';
                if (isMultiple && !isLast) {
                    str += '\n';
                }
                editor.codemirror.replaceSelection(str);
            }, '.png, .jpg, .jpeg, .gif, .svg');
        }

        browseImage(editor) {
            const that = this;

            new oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: true,
                onInsert: function(items) {
                    if (!items.length) {
                        oc.alert($.oc.lang.get('mediamanager.invalid_image_empty_insert'));
                        return;
                    }

                    let imagesInserted = 0;

                    for (let i = 0, len = items.length; i < len; i++) {
                        if (items[i].documentType !== 'image') {
                            oc.alert(
                                $.oc.lang.get(
                                    'mediamanager.invalid_image_invalid_insert',
                                    'The file "' + items[i].title + '" is not an image.'
                                )
                            );
                            continue;
                        }

                        let str = '![' + that.titleFromUrl(items[i].publicUrl) + '](' + items[i].publicUrl + ')';
                        if (i < items.length - 1) {
                            str += '\n';
                        }

                        editor.codemirror.replaceSelection(str);

                        imagesInserted++;
                    }

                    if (imagesInserted !== 0) {
                        this.hide();
                    }
                }
            });
        }

        addImageByUrl(editor, component) {
            const config = getUrlPopupConfig(component);
            const data = {
                url: ''
            };

            oc.vueComponentHelpers.inspector.host
                .showModal(component.trans('add_image_title'), data, config, 'file-url', {
                    beforeApplyCallback: (updatedData) => {
                        editor.codemirror.replaceSelection(
                            '![' + this.titleFromUrl(updatedData.url) + '](' + updatedData.url + ')'
                        );
                        return Promise.resolve();
                    }
                })
                .then($.noop, $.noop);
        }

        insertSnippet(editor) {
            oc.snippetLookup.popup({
                alias: 'ocsnippetlookup',
                onInsert: function(snippet) {
                    var str = oc.snippetLookup.generateSnippetHtml(snippet);
                    editor.codemirror.replaceSelection(str);
                    this.hide();
                }
            });
        }

        browseLink(editor) {
            oc.pageLookup.popup({
                alias: 'ocpagelookup',
                onInsert: function(item) {
                    if (!item) {
                        oc.alert($.oc.lang.get('mediamanager.invalid_file_empty_insert'));
                        return;
                    }

                    let str = '[' + (item.params.title || '') + '](' + item.link + ')';
                    editor.codemirror.replaceSelection(str);
                    this.hide();
                },
                singleMode: true
            });
        }

        browseFile(editor) {
            const that = this;

            new oc.mediaManager.popup({
                alias: 'ocmediamanager',
                cropAndInsertButton: false,
                onInsert: function(items) {
                    if (!items.length) {
                        oc.alert($.oc.lang.get('mediamanager.invalid_file_empty_insert'));
                        return;
                    }

                    for (let i = 0, len = items.length; i < len; i++) {
                        let str = '[' + that.titleFromUrl(items[i].publicUrl) + '](' + items[i].publicUrl + ')';

                        if (i < items.length - 1) {
                            str += '\n';
                        }

                        editor.codemirror.replaceSelection(str);
                    }

                    this.hide();
                }
            });
        }

        uploadFile(editor) {
            this.uploadMedia((link, isMultiple, isLast) => {
                this.insertFileLink(link, editor, isMultiple && !isLast);
            });
        }

        addFileByUrl(editor, component) {
            const config = getUrlPopupConfig(component);
            const data = {
                url: ''
            };

            oc.vueComponentHelpers.inspector.host
                .showModal(component.trans('add_file_title'), data, config, 'file-url', {
                    beforeApplyCallback: (updatedData) => {
                        this.insertFileLink(updatedData.url, editor);
                        return Promise.resolve();
                    }
                })
                .then($.noop, $.noop);
        }
    }

    return new OctoberCommands();
});
