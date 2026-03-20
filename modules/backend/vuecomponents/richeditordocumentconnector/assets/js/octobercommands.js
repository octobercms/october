import { host as inspectorHost } from '../../../inspector/assets/js/classes/index.js';
import { modalUtils } from '../../../modal/assets/js/classes/index.js';

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

function getEmbeddingPopupConfig(component) {
    return [
        {
            property: 'code',
            title: component.trans('embedding_code'),
            type: 'text',
            size: 'medium',
            defaultFocus: true,
            placeholder: '<iframe...',
            validation: {
                required: {
                    message: component.trans('embedding_code_required')
                }
            }
        }
    ];
}

class OctoberCommands {
    invoke(command, $textarea, component) {
        switch (command) {
            case 'oc-upload-image':
                return this.uploadImage($textarea);

            case 'oc-browse-image':
                return this.browseImage($textarea);

            case 'oc-enter-image-url':
                this.saveEditorSelection($textarea);
                return this.addImageByUrl($textarea, component);

            case 'oc-browse-video':
                return this.browseVideo($textarea);

            case 'oc-enter-video-url':
                this.saveEditorSelection($textarea);
                return this.addVideoByUrl($textarea, component);

            case 'oc-embed-video':
                this.saveEditorSelection($textarea);
                return this.addVideoByEmbedding($textarea, component);

            case 'oc-embed-audio':
                this.saveEditorSelection($textarea);
                return this.addAudioByEmbedding($textarea, component);

            case 'oc-browse-audio':
                return this.browseAudio($textarea);

            case 'oc-enter-audio-url':
                this.saveEditorSelection($textarea);
                return this.addAudioByUrl($textarea, component);

            case 'oc-browse-file':
                return this.browseFile($textarea);

            case 'oc-upload-file':
                return this.uploadFile($textarea);

            case 'oc-enter-file-url':
                this.saveEditorSelection($textarea);
                return this.addFileByUrl($textarea, component);

            case 'oc-toggle-code-editor':
                return this.toggleCodeEditor(component);
        }
    }

    uploadMedia(callback, $textarea, accept) {
        const uploaderUtils = oc.vueComponentHelpers.uploader.utils;
        uploaderUtils.selectAndUploadMediaManagerFiles(
            function(link, isMultipleFiles) {
                callback(link);

                if (isMultipleFiles) {
                    $textarea.froalaEditor('selection.clear');
                }
            },
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

    insertFileLink(link, $textarea) {
        let selectionText = $textarea.froalaEditor('selection.text');
        if (typeof selectionText !== 'string' || !selectionText.length) {
            selectionText = this.titleFromUrl(link);
        }

        $textarea.froalaEditor('link.insert', link, selectionText, { class: 'fr-file' });
    }

    uploadImage($textarea) {
        this.uploadMedia(
            (link) => {
                $textarea.froalaEditor('image.insert', link, true);
            },
            $textarea,
            '.png, .jpg, .jpeg, .gif, .svg'
        );
    }

    browseImage($textarea) {
        $textarea.froalaEditor('mediaManager.insertImage');
    }

    addImageByUrl($textarea, component) {
        const config = getUrlPopupConfig(component);
        const data = {
            url: ''
        };

        inspectorHost
            .showModal(component.trans('add_image_title'), data, config, 'file-url', {
                beforeApplyCallback: (updatedData) => {
                    $textarea.froalaEditor('image.insert', updatedData.url, true);
                    return Promise.resolve();
                }
            })
            .then($.noop, $.noop);
    }

    browseVideo($textarea) {
        $textarea.froalaEditor('mediaManager.insertVideo', (url, title) => {
            $textarea.froalaEditor('figures.insertVideo', url, title);
        });
    }

    addVideoByUrl($textarea, component) {
        const config = getUrlPopupConfig(component);
        const data = {
            url: ''
        };

        inspectorHost
            .showModal(component.trans('add_video_title'), data, config, 'file-url', {
                beforeApplyCallback: (updatedData) => {
                    const url = updatedData.url;
                    const title = this.titleFromUrl(url);

                    $textarea.froalaEditor('figures.insertVideo', url, title);
                    return Promise.resolve();
                }
            })
            .then($.noop, $.noop);
    }

    embedMedia(component, title, callback) {
        const config = getEmbeddingPopupConfig(component);
        const data = {
            code: ''
        };

        inspectorHost
            .showModal(title, data, config, 'embed-media', {
                beforeApplyCallback: (updatedData) => {
                    let valid = false;
                    try {
                        valid = $(updatedData.code).length > 0;
                    } catch (error) {}

                    if (!valid) {
                        modalUtils.showAlert(
                            component.trans('invalid_embedding_code_title'),
                            component.trans('invalid_embedding_code_message')
                        );

                        return Promise.reject();
                    }

                    callback(updatedData.code);
                    return Promise.resolve();
                }
            })
            .then($.noop, $.noop);
    }

    addVideoByEmbedding($textarea, component) {
        this.embedMedia(component, component.trans('add_video_title'), (code) => {
            $textarea.froalaEditor('video.insert', code);
        });
    }

    addAudioByEmbedding($textarea, component) {
        this.embedMedia(component, component.trans('add_audio_title'), (code) => {
            // Audio embedding code can be inserted with video.insert
            $textarea.froalaEditor('video.insert', code);
        });
    }

    browseAudio($textarea) {
        $textarea.froalaEditor('mediaManager.insertAudio', (url, title) => {
            $textarea.froalaEditor('figures.insertAudio', url, title);
        });
    }

    addAudioByUrl($textarea, component) {
        const config = getUrlPopupConfig(component);
        const data = {
            url: ''
        };

        inspectorHost
            .showModal(component.trans('add_audio_title'), data, config, 'file-url', {
                beforeApplyCallback: (updatedData) => {
                    const url = updatedData.url;
                    const title = this.titleFromUrl(url);

                    $textarea.froalaEditor('figures.insertAudio', url, title);
                    return Promise.resolve();
                }
            })
            .then($.noop, $.noop);
    }

    browseFile($textarea) {
        $textarea.froalaEditor('mediaManager.insertFile');
    }

    uploadFile($textarea) {
        this.uploadMedia((link) => {
            this.insertFileLink(link, $textarea);
        }, $textarea);
    }

    addFileByUrl($textarea, component) {
        const config = getUrlPopupConfig(component);
        const data = {
            url: ''
        };

        inspectorHost
            .showModal(component.trans('add_file_title'), data, config, 'file-url', {
                beforeApplyCallback: (updatedData) => {
                    this.insertFileLink(updatedData.url, $textarea);
                    return Promise.resolve();
                }
            })
            .then($.noop, $.noop);
    }

    toggleCodeEditor(component) {
        component.toggleCodeEditing();
    }

    saveEditorSelection($textarea) {
        $textarea.froalaEditor('selection.save');
    }
}

export default new OctoberCommands();