import PQueue from 'p-queue';

function uploadAjaxRequest(handler, requestData, onProgress, abortSignal) {
    if (!handler.match(/^(?:\w+\:{2})?on*/) && handler !== 'mediamanager') {
        throw new Error('Invalid handler name. The correct handler name format is: "onEvent".');
    }

    return new Promise((resolve, reject) => {
        if (abortSignal?.aborted) {
            return resolve();
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', window.location.href);

        const token = getToken();
        if (token) {
            xhr.setRequestHeader('X-CSRF-TOKEN', token);
        }

        if (handler !== 'mediamanager') {
            xhr.setRequestHeader('X-AJAX-HANDLER', handler);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }

        xhr.upload.addEventListener(
            'progress',
            (e) => {
                if (e.lengthComputable) {
                    onProgress(Math.round(e.loaded * 100 / e.total));
                }
            },
            false
        );

        xhr.onload = function() {
            if (xhr.status === 200) {
                onProgress(100);
                resolve(xhr.response);
            }
            else {
                reject(xhr.response);
            }
        };

        xhr.upload.addEventListener(
            'error',
            (e) => {
                reject(e);
            },
            false
        );

        abortSignal?.addEventListener('abort', () => xhr.abort());

        xhr.send(requestData);
    });
}

function getToken() {
    return $('meta[name="csrf-token"]').attr('content');
}

class UploaderQueue {
    queue;

    constructor() {
        this.queue = new PQueue({ concurrency: 5 });
    }

    add(handlerName, formFieldName, fileData, fileName, onProgress, abortSignal, extraData) {
        const data = new FormData();
        data.append(formFieldName, fileData, fileName);

        if (typeof extraData === 'object') {
            Object.keys(extraData).forEach((key) => {
                data.append(key, extraData[key]);
            });
        }

        if (handlerName === 'mediamanager') {
            data.append('X_OCTOBER_MEDIA_MANAGER_QUICK_UPLOAD', 1);

            const token = getToken();
            if (token) {
                data.append('_token', token);
            }
        }

        return this.queue.add(
            () => uploadAjaxRequest(handlerName, data, onProgress, abortSignal),
            { signal: abortSignal }
        );
    }
}

export default UploaderQueue;
