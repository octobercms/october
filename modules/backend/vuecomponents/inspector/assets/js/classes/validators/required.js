import BaseValidator from './base.js';

export class RequiredValidator extends BaseValidator {
    validate(value) {
        if (value === undefined || value === null) {
            return this.getMessage();
        }

        if (typeof value === 'boolean') {
            return value ? null : this.getMessage();
        }

        if (typeof value === 'object') {
            return Object.keys(value).length > 0 ? null : this.getMessage();
        }

        return String(value).trim().length > 0 ? null : this.getMessage();
    }
}

export default RequiredValidator;
