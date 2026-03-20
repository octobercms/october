class DomTools {
    form = document;
    modelName = '';

    setForm(form, modelName) {
        this.form = form;
        this.modelName = modelName;
    }

    makeFieldName(fieldName) {
        return this.modelName + "[" + fieldName + "]";
    }

    findFormField(fieldName) {
        let elements = this.form.querySelectorAll('[name="'+fieldName+'"]');
        if (elements.length === 0) {
            return null;
        }

        return elements.item(0);
    }

    findFormGroup(fieldName) {
        let field = this.findFormField(this.makeFieldName(fieldName));
        if (field === null) {
            return null;
        }

        return $(field).closest('.form-group');
    }

    static newDomTools() {
        return new this;
    }
}

export default DomTools;