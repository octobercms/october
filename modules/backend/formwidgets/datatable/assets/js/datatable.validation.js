/*
 * DataTable column validation, the rules of the column `validation` config:
 *
 *   required                                   the value must not be empty
 *   integer   allowNegative, min, max          whole numbers, positive unless allowNegative
 *   float     allowNegative, min, max          decimal numbers, positive unless allowNegative
 *   length    min, max                         text length
 *   regex     pattern, modifiers               text matching a regular expression
 *
 * Every rule takes `message`, and `requiredWith` to apply only when another column of the row has a value.
 * `min` and `max` are { value, message }. Empty values only fail `required`.
 */

function textOf(value) {
    return value === null || value === undefined ? '' : String(value).trim();
}

function rowHasValue(rowData, column) {
    const value = rowData ? rowData[column] : undefined;

    if (typeof value === 'boolean') {
        return value;
    }

    return textOf(value).length > 0;
}

function checkRange(number, options, unit) {
    if (options.min !== undefined && number < options.min.value) {
        return options.min.message !== undefined ? options.min.message : `The ${unit} should not be less than ${options.min.value}`;
    }

    if (options.max !== undefined && number > options.max.value) {
        return options.max.message !== undefined ? options.max.message : `The ${unit} should not be more than ${options.max.value}`;
    }

    return null;
}

const RULES = {
    required(text, options) {
        return text.length === 0 ? (options.message ?? 'The value should not be empty.') : null;
    },

    integer(text, options) {
        if (!text.length) {
            return null;
        }

        if (!(options.allowNegative ? /^-?[0-9]*$/ : /^[0-9]*$/).test(text)) {
            return options.message ?? (options.allowNegative ? 'The value should be an integer.' : 'The value should be a positive integer');
        }

        return checkRange(parseInt(text, 10), options, 'value');
    },

    float(text, options) {
        if (!text.length) {
            return null;
        }

        if (!(options.allowNegative ? /^-?([0-9]+\.[0-9]+|[0-9]+)$/ : /^([0-9]+\.[0-9]+|[0-9]+)$/).test(text)) {
            return options.message ?? (options.allowNegative ? 'The value should be a floating point number.' : 'The value should be a positive floating point number');
        }

        return checkRange(parseFloat(text), options, 'value');
    },

    length(text, options) {
        if (!text.length) {
            return null;
        }

        if (options.min !== undefined && text.length < options.min.value) {
            return options.min.message ?? `The string should not be shorter than ${options.min.value}`;
        }

        if (options.max !== undefined && text.length > options.max.value) {
            return options.max.message ?? `The string should not be longer than ${options.max.value}`;
        }

        return null;
    },

    regex(text, options) {
        if (!text.length || options.pattern === undefined) {
            return null;
        }

        return new RegExp(options.pattern, options.modifiers).test(text) ? null : (options.message ?? 'Invalid value format.');
    }
};

/**
 * validateValue checks a value against a column's rules in order, returning the first message, or null when valid
 */
export function validateValue(rules, value, rowData) {
    const text = textOf(value);

    for (const [name, options] of Object.entries(rules || {})) {
        const check = RULES[name];
        const settings = options || {};

        if (!check || (settings.requiredWith !== undefined && !rowHasValue(rowData, settings.requiredWith))) {
            continue;
        }

        const message = check(text, settings);
        if (message !== null) {
            return message;
        }
    }

    return null;
}

/**
 * hasRequiredRule tells whether empty values must be validated
 */
export function hasRequiredRule(rules) {
    return !!(rules && rules.required);
}
