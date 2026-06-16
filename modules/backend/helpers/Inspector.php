<?php namespace Backend\Helpers;

use Arr;

/**
 * Inspector Helper
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Inspector
{
    /**
     * getPropertyConfig converts PHP inspector to JS inspector configuration,
     * including translations.
     */
    public static function getPropertyConfig(array $properties): array
    {
        $result = [];

        foreach ($properties as $name => $params) {
            if (array_get($params, 'hidden', false)) {
                continue;
            }

            $property = [
                'property' => $name,
                'title' => array_get($params, 'title', $name),
                'type' => array_get($params, 'type', 'string'),
                'showExternalParam' => array_get($params, 'showExternalParam', true)
            ] + $params;

            // Convert nested properties
            $toNestProperty = ['itemProperties', 'properties', 'columns'];
            foreach ($property as $name => &$value) {
                if (!in_array($name, $toNestProperty) || !is_array($value)) {
                    continue;
                }

                if (Arr::isList($value)) {
                    continue;
                }

                $newValue = [];
                $propName = $name === 'columns' ? 'column' : 'property';
                foreach ($value as $_name => $_props) {
                    $newValue[] = [
                        $propName => $_name
                    ] + $_props;
                }
                $value = $newValue;
            }

            $result[] = $property;
        }

        return self::localizePropertyConfig($result);
    }

    /**
     * localizePropertyConfig translates human values
     */
    protected static function localizePropertyConfig(array $properties): array
    {
        // Translate these arrays
        $toTranslateArr = [
            'options'
        ];

        // Translate these scalars
        $toTranslateStr = [
            'title',
            'description',
            'placeholder',
            'options',
            'group',
            'tab',
            'message',
            'validationMessage'
        ];

        // This is effectively array_walk_recursive except we can check if the value is an array
        // and apply special logic, whereas the recursive function ignores array values
        array_walk($properties, function(&$value, $key) use ($toTranslateStr, $toTranslateArr) {
            if (is_array($value) && in_array($key, $toTranslateArr)) {
                foreach ($value as &$_value) {
                    if (is_string($_value) && strlen($_value) > 1) {
                        $_value = __($_value);
                    }
                }
            }
            elseif (is_array($value)) {
                $value = self::localizePropertyConfig($value);
            }
            elseif (is_string($value) && strlen($value) > 1 && in_array($key, $toTranslateStr)) {
                $value = __($value);
            }
        });

        return $properties;
    }
}
