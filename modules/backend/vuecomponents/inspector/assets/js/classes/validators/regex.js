import BaseValidator from './base.js';

export class RegexValidator extends BaseValidator {
    validate(value) {
        if (this.options.pattern === undefined) {
            this.throwError('The pattern parameter is not defined in the Regex Inspector validator configuration.');
        }

        if (!this.isScalar(value)) {
            this.throwError('The Regex Inspector validator can only be used with string values.');
        }

        if (value === undefined || value === null) {
            return null;
        }

        var string = String(value).trim();
        if (string.length === 0) {
            return null;
        }

        var regexObj = new RegExp(this.options.pattern, this.options.modifiers);
        return regexObj.test(string) ? null : this.getMessage();
    }
}

export default RegexValidator;
