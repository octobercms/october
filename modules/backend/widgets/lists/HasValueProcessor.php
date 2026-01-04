<?php namespace Backend\Widgets\Lists;

use Str;
use Url;
use Html;
use Lang;
use Backend;
use Carbon\Carbon;
use October\Rain\Router\Helper as RouterHelper;
use System\Helpers\DateTime as DateTimeHelper;
use System\Classes\PluginManager;
use ApplicationException;

/**
 * HasValueProcessor concern
 */
trait HasValueProcessor
{

    //
    // Value processing
    //

    /**
     * evalCustomListType processes a custom list types registered by plugins and the app.
     */
    protected function evalCustomListType($type, $record, $column, $value)
    {
        // Load plugin and app column types
        $methodValues = PluginManager::instance()->getRegistrationMethodValues('registerListColumnTypes');
        foreach ($methodValues as $availableTypes) {
            if (!isset($availableTypes[$type])) {
                continue;
            }

            $callback = $availableTypes[$type];

            if (is_callable($callback)) {
                return call_user_func_array($callback, [$value, $column, $record]);
            }
        }

        $customMessage = '';
        if ($type === 'relation') {
            $customMessage = 'Type: relation is not supported, instead use the relation property to specify a relationship to pull the value from and set the type to the type of the value expected.';
        }

        throw new ApplicationException(sprintf('List column type "%s" could not be found. %s', $type, $customMessage));
    }

    /**
     * evalTextTypeValue as text and escape the value
     * @return string
     */
    protected function evalTextTypeValue($record, $column, $value)
    {
        if (is_array($value) && count($value) === count($value, COUNT_RECURSIVE)) {
            $value = implode(', ', $value);
        }

        if (is_string($column->format) && !empty($column->format)) {
            $value = sprintf($column->format, $value);
        }

        return htmlentities((string) $value, ENT_QUOTES, 'UTF-8', false);
    }

    /**
     * evalNumberTypeValue process as number, proxy to text but uses different styling
     * @return string
     */
    protected function evalNumberTypeValue($record, $column, $value)
    {
        return $this->evalTextTypeValue($record, $column, $value);
    }

    /**
     * evalImageTypeValue will process an image value
     * @return string
     */
    protected function evalImageTypeValue($record, $column, $value)
    {
        $config = $column->config;
        $width = isset($config['width']) ? $config['width'] : 68;
        $height = isset($config['height']) ? $config['height'] : 68;
        $limit = isset($config['limit']) ? $config['limit'] : 3;
        $options = isset($config['options']) ? $config['options'] : [];
        $isDefaultSize = !isset($config['width']) && !isset($config['height']);

        $colName = $column->columnName;
        $images = [];

        // File model
        if (isset($record->attachMany[$colName])) {
            $images = $value->count() ? $value->all() : [];
        }
        elseif (isset($record->attachOne[$colName])) {
            $images = $value ? [$value] : [];
        }
        // Media item
        else {
            foreach ((array) $value as $val) {
                if (is_array($val)) {
                    return '';
                }
                if (strpos($val, '://') !== false) {
                    $images[] = $val;
                }
                elseif (strlen($val)) {
                    $images[] = \Media\Classes\MediaLibrary::url($val);
                }
            }
        }

        if (!$images) {
            return '';
        }

        $totalImages = count($images);
        $images = array_slice($images, 0, $limit);

        $imageUrls = [];
        foreach ($images as $image) {
            $imageUrls[] = \System\Classes\ResizeImages::resize($image, $width, $height, $options);
        }

        return $this->makePartial('column_image', [
            'totalImages' => $totalImages,
            'imageUrls' => $imageUrls,
            'isDefaultSize' => $isDefaultSize,
            'width' => $width,
            'height' => $height
        ]);
    }

    /**
     * evalFileTypeValue will process a file attachment value
     * @return string
     */
    protected function evalFileTypeValue($record, $column, $value)
    {
        $config = $column->config;
        $limit = $config['limit'] ?? 3;

        $colName = $column->columnName;
        $files = [];

        // File model
        if (isset($record->attachMany[$colName])) {
            $files = $value->count() ? $value->all() : [];
        }
        elseif (isset($record->attachOne[$colName])) {
            $files = $value ? [$value] : [];
        }

        if (!$files) {
            return '';
        }

        $totalFiles = count($files);
        $files = array_slice($files, 0, $limit);

        $fileItems = [];
        foreach ($files as $file) {
            $fileItems[] = [
                'url' => $file->getPath(),
                'name' => $file->file_name,
                'icon' => $this->getFileTypeIcon($file->getExtension()),
            ];
        }

        return $this->makePartial('column_file', [
            'totalFiles' => $totalFiles,
            'fileItems' => $fileItems,
            'column' => $column,
        ]);
    }

    /**
     * evalSwitchTypeValue as boolean switch
     */
    protected function evalSwitchTypeValue($record, $column, $value)
    {
        $config = $column->config;

        return $this->makePartial('column_switch', [
            'column' => $column,
            'value' => $value,
            'trueValue' => Lang::get($config['options'][1] ?? 'backend::lang.list.column_switch_true'),
            'falseValue' => Lang::get($config['options'][0] ?? 'backend::lang.list.column_switch_false'),
        ]);
    }

    /**
     * evalSummaryTypeValue will limit a value by words
     */
    protected function evalSummaryTypeValue($record, $column, $value)
    {
        $config = $column->config;
        $endChars = isset($config['endChars']) ? $config['endChars'] : '...';
        $limitChars = isset($config['limitChars']) ? $config['limitChars'] : 40;
        $limitWords = isset($config['limitWords']) ? $config['limitWords'] : null;

        // Handle null values
        if ($value === null) {
            return null;
        }

        // Collapse spacing for inline nodes that will get stripped
        // "Welcome <img />, User" should read "Welcome, User"
        $result = $value;
        $result = str_replace(' <', '<', $result);

        // Add natural spacing between HTML nodes
        $result = str_replace("><", '> <', $result);

        // Strip HTML
        $result = $original = trim(Html::strip($result));

        // Nothing left
        if (!strlen($result)) {
            return $result;
        }

        // Limit by chars and estimate word count
        if (!$limitWords) {
            $result = Str::limit($result, $limitChars, '');
            $limitWords = substr_count($result, ' ') + 1;
        }

        // Strip HTML, limit to words
        $result = Str::words($result, $limitWords, '');

        // Add end suffix where original differs
        if (mb_strlen($result) !== mb_strlen($original)) {
            $result .= $endChars;
        }

        return $result;
    }

    /**
     * evalDatetimeTypeValue as a datetime value
     */
    protected function evalDatetimeTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        if ($column->format !== null) {
            $value = $dateTime->format($column->format);
        }
        else {
            $value = $dateTime->toDayDateTimeString();
        }

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'format' => $column->format,
            'formatAlias' => 'dateTimeLongMin',
            'useTimezone' => $this->getColumnTimezonePreference($column),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalTimeTypeValue as a time value
     */
    protected function evalTimeTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        $format = $column->format ?? 'g:i A';

        $value = $dateTime->format($format);

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'format' => $column->format,
            'formatAlias' => 'time',
            'useTimezone' => $this->getColumnTimezonePreference($column, false),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalDateTypeValue as a date value
     */
    protected function evalDateTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        if ($column->format !== null) {
            $value = $dateTime->format($column->format);
        }
        else {
            $value = $dateTime->toFormattedDateString();
        }

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'format' => $column->format,
            'formatAlias' => 'dateLongMin',
            'useTimezone' => $this->getColumnTimezonePreference($column, false),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalTimesinceTypeValue as diff for humans (1 min ago)
     */
    protected function evalTimesinceTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        $value = DateTimeHelper::timeSince($dateTime);

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'timeSince' => true,
            'useTimezone' => $this->getColumnTimezonePreference($column),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalTimetenseTypeValue as time as current tense (Today at 0:00)
     */
    protected function evalTimetenseTypeValue($record, $column, $value)
    {
        if ($value === null) {
            return null;
        }

        $dateTime = $this->validateDateTimeValue($value, $column);

        $value = DateTimeHelper::timeTense($dateTime);

        $options = [
            'column' => $column,
            'defaultValue' => $value,
            'timeTense' => true,
            'useTimezone' => $this->getColumnTimezonePreference($column),
        ];

        return Backend::dateTime($dateTime, $options);
    }

    /**
     * evalSelectableTypeValue processes as selectable value types for 'dropdown',
     * 'radio', 'balloon-selector' and similar form field types
     */
    protected function evalSelectableTypeValue($record, $column, $value)
    {
        $formField = new \Backend\Classes\FormField([
            'fieldName' => $column->columnName,
            'label' => $column->label
        ]);

        $fieldOptions = $column->optionsPreset
            ? 'preset:' . $column->optionsPreset
            : ($column->optionsMethod ?: $column->options);

        if (!is_array($fieldOptions)) {
            $model = $this->isColumnRelated($column)
                ? $this->model->makeRelation($column->relation)
                : $this->model;

            $fieldOptions = $formField->getOptionsFromModel(
                $model,
                $fieldOptions,
                $record->toArray()
            );
        }

        return $this->makePartial('column_selectable', [
            'fieldOptions' => $fieldOptions,
            'column' => $column,
            'value' => $value
        ]);
    }

    /**
     * evalLinkageTypeValue
     */
    protected function evalLinkageTypeValue($record, $column, $value)
    {
        // Handle array value from custom link function: [$url, $text]
        if (is_array($value) && count($value) === 2) {
            $linkUrl = $value[0];
            $linkText = $value[1];
        }
        else {
            // Build link URL - always process linkUrl config with parameter replacement
            if ($column->linkUrl) {
                $linkUrl = RouterHelper::replaceParameters($record, $column->linkUrl);
                if (!starts_with($linkUrl, ['//', 'http://', 'https://'])) {
                    $linkUrl = Backend::url($linkUrl);
                }
            }
            else {
                $linkUrl = $value;
            }

            // Determine link text - prefer config, fall back to value
            $linkText = $column->linkText ?: $value;

            // When no value exists, use URL for both value and text
            if (!$value && $column->linkUrl) {
                $value = $linkUrl;
                if (!$column->linkText) {
                    $linkText = $linkUrl;
                }
            }
        }

        if (str_starts_with($linkUrl, 'october://')) {
            $isDefault = $linkUrl === $linkText;
            $linkUrl = \Cms\Classes\PageManager::url($linkUrl);
            if (!$linkUrl) {
                $value = null;
            }
            elseif ($isDefault) {
                $linkText = Url::makeRelative($linkUrl);
            }
        }

        return $this->makePartial('column_linkage', [
            'attributes' => (array) $column->attributes,
            'linkText' => $linkText,
            'linkUrl' => $linkUrl,
            'column' => $column,
            'value' => $value
        ]);
    }

    /**
     * evalPartialTypeValue as partial reference
     */
    protected function evalPartialTypeValue($record, $column, $value)
    {
        return $this->makePartial('column_partial', [
            'record' => $record,
            'column' => $column,
            'value' => $value
        ]);
    }

    /**
     * evalColorPickerTypeValue as background color, to be seen at list
     */
    protected function evalColorPickerTypeValue($record, $column, $value)
    {
        return $this->makePartial('column_colorpicker', [
            'value' => $value
        ]);
    }

    /**
     * validateDateTimeValue column type
     */
    protected function validateDateTimeValue($value, $column)
    {
        $value = DateTimeHelper::makeCarbon($value, false);

        if (!$value instanceof Carbon) {
            throw new ApplicationException(Lang::get(
                'backend::lang.list.invalid_column_datetime',
                ['column' => $column->columnName]
            ));
        }

        return $value;
    }

    /**
     * getFileTypeIcon returns the appropriate Phosphor icon for a file extension
     */
    protected function getFileTypeIcon(string $extension): string
    {
        $extension = strtolower($extension);

        $iconMap = [
            // Archives
            'zip' => 'file-zip',
            'rar' => 'file-archive',
            'tar' => 'file-archive',
            'gz' => 'file-archive',
            '7z' => 'file-archive',

            // Documents
            'pdf' => 'file-pdf',
            'doc' => 'file-doc',
            'docx' => 'file-doc',
            'txt' => 'file-text',
            'rtf' => 'file-text',

            // Spreadsheets
            'xls' => 'file-xls',
            'xlsx' => 'file-xls',
            'csv' => 'file-csv',

            // Presentations
            'ppt' => 'file-ppt',
            'pptx' => 'file-ppt',

            // Images
            'jpg' => 'file-jpg',
            'jpeg' => 'file-jpg',
            'png' => 'file-png',
            'gif' => 'file-image',
            'bmp' => 'file-image',
            'webp' => 'file-image',
            'svg' => 'file-svg',

            // Audio
            'mp3' => 'file-audio',
            'wav' => 'file-audio',
            'ogg' => 'file-audio',
            'flac' => 'file-audio',
            'aac' => 'file-audio',

            // Video
            'mp4' => 'file-video',
            'avi' => 'file-video',
            'mov' => 'file-video',
            'wmv' => 'file-video',
            'mkv' => 'file-video',
            'webm' => 'file-video',

            // Code
            'html' => 'file-html',
            'htm' => 'file-html',
            'css' => 'file-css',
            'js' => 'file-js',
            'jsx' => 'file-jsx',
            'ts' => 'file-ts',
            'tsx' => 'file-tsx',
            'vue' => 'file-vue',
            'sql' => 'file-sql',
            'rs' => 'file-rs',
            'php' => 'file-code',
            'py' => 'file-code',
            'rb' => 'file-code',
            'java' => 'file-code',
            'c' => 'file-code',
            'cpp' => 'file-code',
            'h' => 'file-code',
            'json' => 'file-code',
            'xml' => 'file-code',
            'yaml' => 'file-code',
            'yml' => 'file-code',
        ];

        return $iconMap[$extension] ?? 'file';
    }
}
