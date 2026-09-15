<?php namespace Tailor\Classes\ContentDecoder;

use Tailor\Models\RecordImport;

/**
 * ImportDecoder applies import data using the permissive trust rules
 * of backend imports, where the operator is trusted with the data.
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class ImportDecoder extends Decoder
{
    /**
     * __construct with the import model hosting events and file resolution.
     */
    public function __construct(protected RecordImport $import)
    {
    }

    /**
     * beforeDecodeAttribute fires the import transformation event on the host model.
     */
    protected function beforeDecodeAttribute($model, $attr, &$value): bool
    {
        /**
         * @event model.beforeImportAttribute
         * Called when the model is importing an attribute
         *
         * Example usage:
         *
         *     $model->bindEvent('model.beforeImportAttribute', function (string $attr, mixed &$value) use (\October\Rain\Database\Model $model) {
         *         // Apply data transformations
         *         if ($attr === 'price') {
         *             $value = (int) $value;
         *         }
         *     });
         *
         */
        if ($this->import->fireEvent('model.beforeImportAttribute', [$attr, &$value], true) === false) {
            return false;
        }

        return true;
    }

    /**
     * decodeFileRelation resolves file path references through the import model.
     */
    protected function decodeFileRelation($model, $attr, $value, $sessionKey): void
    {
        $this->import->decodeFileRelation($model, $attr, $value, $sessionKey);
    }
}
