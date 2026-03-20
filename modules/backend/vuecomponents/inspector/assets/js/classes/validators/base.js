export class BaseValidator {
    constructor(propertyName, options) {
        this.options = options;
        this.propertyName = propertyName;
        this.defaultMessage = 'Invalid property value.';
    }

    getMessage(defaultMessage) {
        if (this.options.message !== undefined) {
            return this.options.message;
        }

        if (defaultMessage !== undefined) {
            return defaultMessage;
        }

        return this.defaultMessage;
    }

    isScalar(value) {
        if (value === undefined || value === null) {
            return true;
        }

        return !!(typeof value === 'string' || typeof value == 'number' || typeof value == 'boolean');
    }

    throwError(errorMessage) {
        throw new Error(errorMessage + ' Property: ' + this.propertyName);
    }

    validate(value) {
        return null;
    }
}

export default BaseValidator;
