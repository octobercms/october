import NumberBaseValidator from './number-base.js';

export class IntegerValidator extends NumberBaseValidator {
    validate(value) {
        if (!this.isScalar(value) || typeof value == 'boolean') {
            this.throwError('The Integer Inspector validator can only be used with string values.');
        }

        if (value === undefined || value === null) {
            return null;
        }

        var string = String(value).trim();

        if (string.length === 0) {
            return null;
        }

        var testResult = this.options.allowNegative ?
            /^\-?[0-9]*$/.test(string) :
            /^[0-9]*$/.test(string);

        if (!testResult) {
            var defaultMessage = this.options.allowNegative ?
                'The value should be an integer.' :
                'The value should be a positive integer.';

            return this.getMessage(defaultMessage);
        }

        return this.doCommonChecks(parseInt(string));
    }
}

export default IntegerValidator;
