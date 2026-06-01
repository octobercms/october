<?php namespace Backend\Models\ImportModel;

use Lang;
use Config;
use League\Csv\Reader as CsvReader;
use League\Csv\Statement as CsvStatement;
use Backend\Behaviors\ImportExportController\TranscodeFilter;

/**
 * DecodesCsv format for import
 */
trait DecodesCsv
{
    /**
     * getFormatEncodingOptions returns all available encodings values from the localization config
     * @return array
     */
    public function getFormatEncodingOptions()
    {
        return (array) Config::get('backend.available_import_encodings', [
            'utf-8' => Lang::get('backend::lang.import_export.encodings.utf_8'),
            'us-ascii' => Lang::get('backend::lang.import_export.encodings.us_ascii'),
            'iso-8859-1' => Lang::get('backend::lang.import_export.encodings.iso_8859_1'),
            'iso-8859-2' => Lang::get('backend::lang.import_export.encodings.iso_8859_2'),
            'iso-8859-3' => Lang::get('backend::lang.import_export.encodings.iso_8859_3'),
            'iso-8859-4' => Lang::get('backend::lang.import_export.encodings.iso_8859_4'),
            'iso-8859-5' => Lang::get('backend::lang.import_export.encodings.iso_8859_5'),
            'iso-8859-6' => Lang::get('backend::lang.import_export.encodings.iso_8859_6'),
            'iso-8859-7' => Lang::get('backend::lang.import_export.encodings.iso_8859_7'),
            'iso-8859-8' => Lang::get('backend::lang.import_export.encodings.iso_8859_8'),
            'iso-8859-0' => Lang::get('backend::lang.import_export.encodings.iso_8859_0'),
            'iso-8859-10' => Lang::get('backend::lang.import_export.encodings.iso_8859_10'),
            'iso-8859-11' => Lang::get('backend::lang.import_export.encodings.iso_8859_11'),
            'iso-8859-13' => Lang::get('backend::lang.import_export.encodings.iso_8859_13'),
            'iso-8859-14' => Lang::get('backend::lang.import_export.encodings.iso_8859_14'),
            'iso-8859-15' => Lang::get('backend::lang.import_export.encodings.iso_8859_15'),
            'Windows-1250' => Lang::get('backend::lang.import_export.encodings.windows_1250'),
            'Windows-1251' => Lang::get('backend::lang.import_export.encodings.windows_1251'),
            'Windows-1252' => Lang::get('backend::lang.import_export.encodings.windows_1252'),
        ]);
    }

    /**
     * decodeArrayValueForCsv
     */
    protected function decodeArrayValueForCsv($value, $delimiter = '|')
    {
        if (str_starts_with($value, 'base64:')) {
            return json_decode(base64_decode(substr($value, strlen('base64:'))), true);
        }

        if (strpos($value, $delimiter) === false) {
            return [$value];
        }

        $data = preg_split('~(?<!\\\)' . preg_quote($delimiter, '~') . '~', $value);
        $newData = [];

        foreach ($data as $_value) {
            $newData[] = str_replace('\\'.$delimiter, $delimiter, $_value);
        }

        return $newData;
    }

    /**
     * processImportDataAsCsv
     */
    protected function processImportDataAsCsv($filePath, $matches, $options)
    {
        // Parse options
        $defaultOptions = [
            'firstRowTitles' => true,
            'delimiter' => null,
            'enclosure' => null,
            'escape' => null,
            'encoding' => null
        ];

        $options = array_merge($defaultOptions, $options);

        // Read CSV
        $reader = CsvReader::createFromPath($filePath);

        if ($options['delimiter'] !== null) {
            $reader->setDelimiter($options['delimiter']);
        }

        if ($options['enclosure'] !== null) {
            $reader->setEnclosure($options['enclosure']);
        }

        if ($options['escape'] !== null) {
            $reader->setEscape($options['escape']);
        }

        if (
            $options['encoding'] !== null &&
            $reader->supportsStreamFilterOnRead()
        ) {
            $reader->addStreamFilter(sprintf(
                '%s%s:%s',
                TranscodeFilter::FILTER_NAME,
                strtolower($options['encoding']),
                'utf-8'
            ));
        }

        // Create reader statement
        $stmt = (new CsvStatement)
            ->where(function (array $row) {
                // Filter out empty rows
                return count($row) > 1 || reset($row) !== null;
            })
        ;

        if ($options['firstRowTitles']) {
            $stmt = $stmt->offset(1);
        }

        $result = [];
        $contents = $stmt->process($reader);

        foreach ($contents as $row) {
            $result[] = $this->processCsvImportRow($row, $matches);
        }

        return $result;
    }

    /**
     * processCsvImportRow converts a single row of CSV data to the column map
     * @return array
     */
    protected function processCsvImportRow($rowData, $matches)
    {
        $newRow = [];

        foreach ($matches as $columnIndex => $dbNames) {
            $value = array_get($rowData, $columnIndex);
            foreach ((array) $dbNames as $dbName) {
                $newRow[$dbName] = $value;
            }
        }

        return $newRow;
    }
}
