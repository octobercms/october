import BaseValidator from './base.js';
import RequiredValidator from './required.js';
import RegexValidator from './regex.js';
import NumberBaseValidator from './number-base.js';
import IntegerValidator from './integer.js';
import FloatValidator from './float.js';
import LengthValidator from './length.js';

export const validators = {
    base: BaseValidator,
    required: RequiredValidator,
    regex: RegexValidator,
    numberbase: NumberBaseValidator,
    integer: IntegerValidator,
    float: FloatValidator,
    length: LengthValidator
};

export {
    BaseValidator,
    RequiredValidator,
    RegexValidator,
    NumberBaseValidator,
    IntegerValidator,
    FloatValidator,
    LengthValidator
};

export default validators;
