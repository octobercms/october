import ModelReference from './modelreference.js';

let modelCounter = 0;

class ModelDefinition {
    uriString;
    language;
    tabTitle;
    valueHolderObj;
    valueHolderProperty;
    iconCssClass;
    autoPrefix;
    autoPrefixRegex;
    customAttributes;

    constructor(language, tabTitle, valueHolderObj, valueHolderProperty, iconCssClass, uriString) {
        if (!uriString) {
            uriString = 'model';
        }

        this.uriString = ++modelCounter + '-' + uriString;
        this.language = language;
        this.tabTitle = tabTitle;
        this.valueHolderObj = valueHolderObj;
        this.valueHolderProperty = valueHolderProperty;
        this.iconCssClass = iconCssClass;
        this.customAttributes = {};
    }

    get value() {
        return this.valueHolderObj[this.valueHolderProperty];
    }

    set value(value) {
        this.valueHolderObj[this.valueHolderProperty] = this.postProcess(value);
    }

    setModelTags(tags) {
        if (!Array.isArray(tags)) {
            throw new Error('The tags argument must be an array');
        }

        this.modelTags = tags;
    }

    hasTag(tag) {
        if (!Array.isArray(this.modelTags)) {
            return false;
        }

        return this.modelTags.indexOf(tag) !== -1;
    }

    setAutoPrefix(prefix, prefixRegex) {
        this.autoPrefix = prefix;
        this.autoPrefixRegex = prefixRegex;
    }

    setHolderObject(valueHolderObj) {
        this.valueHolderObj = valueHolderObj;
    }

    preprocess(value) {
        const val = typeof value === 'string' ? value : '';

        if (typeof this.autoPrefix === 'string') {
            return this.autoPrefix + val;
        }

        return val;
    }

    postProcess(value) {
        const val = typeof value === 'string' ? value : '';

        if (!this.autoPrefixRegex) {
            return val;
        }

        return val.replace(this.autoPrefixRegex, '').trim();
    }

    setModelCustomAttribute(name, value) {
        this.customAttributes[name] = value;
    }

    makeModelReference(options) {
        const uri = new monaco.Uri().with({ path: this.uriString });
        const model = monaco.editor.createModel(this.preprocess(this.value), this.language, uri);

        if (this.modelTags) {
            model.octoberEditorCmsTags = this.modelTags;
        }

        model.updateOptions({ tabSize: options.tabSize });

        model.octoberEditorAttributes = {};
        Object.keys(this.customAttributes).forEach((customAttributeName) => {
            model.octoberEditorAttributes[customAttributeName] = this.customAttributes[customAttributeName];
        });

        return new ModelReference(
            model,
            model.onDidChangeContent(() => {
                this.value = model.getValue();
            }),
            this.uriString
        );
    }
}

export default ModelDefinition;