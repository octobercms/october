import validators from './validators/index.js';

export class ValidatorSet {
    #validators = [];
    #propertyName;

    constructor(options, propertyName) {
        this.#propertyName = propertyName;
        this.#makeValidators(options);
    }

    #throwError(errorMessage) {
        throw new Error(errorMessage + ' Property: ' + this.#propertyName);
    }

    #makeValidators(options) {
        // Handle legacy validation syntax properties:
        //
        // - required
        // - validationPattern
        // - validationMessage

        if ((options.required !== undefined ||
            options.validationPattern !== undefined ||
            options.validationMessage !== undefined) &&
            options.validation !== undefined) {
            this.#throwError('Legacy and new validation syntax should not be mixed.');
        }

        if (options.required !== undefined && options.required) {
            var validator = new validators.required(this.#propertyName, {
                    message: options.validationMessage
                });

            this.#validators.push(validator);
        }

        if (options.validationPattern !== undefined) {
            var validator = new validators.regex(this.#propertyName, {
                    message: options.validationMessage,
                    pattern: options.validationPattern
                });

            this.#validators.push(validator);
        }

        //
        // Handle new validation syntax
        //

        if (options.validation === undefined) {
            return;
        }

        for (var validatorName in options.validation) {
            if (validators[validatorName] == undefined) {
                this.#throwError('Inspector validator "' + validatorName + '" is not found.');
            }

            this.#validators.push(
                new validators[validatorName] (
                    this.#propertyName,
                    options.validation[validatorName]
                )
            );
        }
    }

    validate(value) {
        try {
            for (var i=0; i<this.#validators.length; i++) {
                var validator = this.#validators[i],
                    errorMessage = validator.validate(value);

                if (typeof errorMessage === 'string') {
                    return errorMessage;
                }
            }

            return null;
        }
        catch (err) {
            this.#throwError(err);
        }
    }
}

export default ValidatorSet;
