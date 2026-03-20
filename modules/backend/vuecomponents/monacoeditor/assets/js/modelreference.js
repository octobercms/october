class ModelReference {
    model;
    subscription;
    uriString;
    viewState;

    constructor(model, subscription, uriString) {
        this.model = model;
        this.subscription = subscription;
        this.uriString = uriString;
    }

    setViewState(viewState) {
        this.viewState = viewState;
    }

    dispose() {
        this.subscription.dispose();
        this.model.dispose();
    }
}

export default ModelReference;