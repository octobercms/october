import BaseValidator from './base.js';

export class LengthValidator extends BaseValidator {
    validate(value) {
        if (value === undefined || value === null) {
            return null;
        }

        var length;

        if (typeof value === 'string') {
            length = value.length;
        }
        else if (Array.isArray(value)) {
            length = value.length;
        }
        else if (typeof value === 'object') {
            length = Object.keys(value).length;
        }
        else {
            return null;
        }

        if (this.options.min !== undefined) {
            if (this.options.min.value === undefined) {
                throw new Error('The min.value parameter is not defined in the Inspector length validator configuration');
            }

            if (length < this.options.min.value) {
                return this.options.min.message !== undefined
                    ? this.options.min.message
                    : 'The value should not be shorter than ' + this.options.min.value;
            }
        }

        if (this.options.max !== undefined) {
            if (this.options.max.value === undefined) {
                throw new Error('The max.value parameter is not defined in the Inspector length validator configuration');
            }

            if (length > this.options.max.value) {
                return this.options.max.message !== undefined
                    ? this.options.max.message
                    : 'The value should not be longer than ' + this.options.max.value;
            }
        }

        return null;
    }
}

export default LengthValidator;
