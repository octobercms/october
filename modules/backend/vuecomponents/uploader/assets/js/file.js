let lastFileId = 0;

function makeUniqueFileKey() {
    return ++lastFileId;
}

class File {
    name;
    status;
    progress;
    key;
    size;
    promise;
    abortController;
    errorMessage;
    participatesInTotal;

    constructor(queue, handlerName, file, formFieldName, extraData) {
        this.name = file.name;
        this.progress = 0;
        this.bytesLoaded = 0;
        this.status = 'uploading';
        this.size = file.size;
        this.key = makeUniqueFileKey();
        this.participatesInTotal = true;
        this.abortController = new AbortController();

        const self = Vue.reactive(this);

        self.promise = queue.add(
            handlerName,
            formFieldName,
            file,
            file.name,
            (progress) => {
                self.progress = progress;
            },
            self.abortController.signal,
            extraData
        );

        self.promise.then(
            () => {
                self.progress = 100;
                self.status = 'completed';
            },
            (err) => {
                self.status = 'error';
                if (typeof err === 'string') {
                    self.errorMessage = err;
                }
            }
        );

        return self;
    }

    abort() {
        this.abortController.abort();
        this.promise = null;
    }
}

export default File;
