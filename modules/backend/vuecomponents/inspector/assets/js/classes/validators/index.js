import BaseValidator from './base.js';
import RequiredValidator from './required.js';
import RegexValidator from './regex.js';
import NumberBaseValidator from './number-base.js';
import IntegerValidator from './integer.js';

export const validators = {
    base: BaseValidator,
    required: RequiredValidator,
    regex: RegexValidator,
    numberbase: NumberBaseValidator,
    integer: IntegerValidator
};

export {
    BaseValidator,
    RequiredValidator,
    RegexValidator,
    NumberBaseValidator,
    IntegerValidator
};

export default validators;
