<?php namespace Backend\Models;

use File;
use Lang;
use Model;
use Response;
use League\Csv\Writer as CsvWriter;
use ApplicationException;
use SplTempFileObject;
use Cache;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Model used for exporting data
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class ExportModel extends Model
{
    /**
     * Called when data is being exported.
     * The return value should be an array in the format of:
     *
     *   [
     *       'db_name1' => 'Some attribute value',
     *       'db_name2' => 'Another attribute value'
     *   ],
     *   [...]
     *
     */
    abstract public function exportData($columns, $sessionKey = null);

    /**
     * Export data based on column names and labels.
     * The $columns array should be in the format of:
     *
     *   [
     *       'db_name1' => 'Column label',
     *       'db_name2' => 'Another label',
     *       ...
     *   ]
     *
     */
    public function export($columns, $options)
    {
        $sessionKey = array_get($options, 'sessionKey');
        $data = $this->exportData(array_keys($columns), $sessionKey);
        return $this->processExportData($columns, $data, $options);
    }

    /**
     * Download a previously cached export file.
     * @return void
     */
    public function download($name, $outputName = null)
    {
        if (!preg_match('/^oc[0-9a-z]*$/i', $name)) {
            throw new ApplicationException(Lang::get('backend::lang.import_export.file_not_found_error'));
        }
        
        return new StreamedResponse(
            function () use ($name) {
                echo Cache::get('export::' . $name);
            },
            200,
            [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="' . $outputName . '"',
            ]
        );
    }

    /**
     * Converts a data collection to a CSV file.
     */
    protected function processExportData($columns, $results, $options)
    {
        /*
         * Validate
         */
        if (!$results) {
            throw new ApplicationException(Lang::get('backend::lang.import_export.empty_error'));
        }

        /*
         * Parse options
         */
        $defaultOptions = [
            'firstRowTitles' => true,
            'useOutput' => false,
            'fileName' => 'export.csv',
            'delimiter' => null,
            'enclosure' => null,
            'escape' => null
        ];

        $options = array_merge($defaultOptions, $options);
        $columns = $this->exportExtendColumns($columns);

        /*
         * Prepare CSV
         */
        $csv = CsvWriter::createFromFileObject(new SplTempFileObject);
        
        $csv->setOutputBOM(CsvWriter::BOM_UTF8);

        if ($options['delimiter'] !== null) {
            $csv->setDelimiter($options['delimiter']);
        }

        if ($options['enclosure'] !== null) {
            $csv->setEnclosure($options['enclosure']);
        }

        if ($options['escape'] !== null) {
            $csv->setEscape($options['escape']);
        }

        /*
         * Add headers
         */
        if ($options['firstRowTitles']) {
            $headers = $this->getColumnHeaders($columns);
            $csv->insertOne($headers);
        }

        /*
         * Add records
         */
        $flushThreshold = 1000;
        foreach (collect($results)->chunk(50) as $offset => $chunk) {
            foreach ($chunk as $result) {
                $data = $this->matchDataToColumns($result, $columns);
                $csv->insertOne($data);
            }

            // flush cache
            if ($offset % $flushThreshold === 0) {
                flush();
            }
        }

        /*
         * Output
         */
        if ($options['useOutput']) {
            $csv->output($options['fileName']);
        }

        /*
         * Save in cache for download
         */
        $csvName = uniqid('oc');
        Cache::put('export::' . $csvName, $csv->__toString(), now()->addMinutes(10));

        return $csvName;
    }

    /**
     * Used to override column definitions at export time.
     */
    protected function exportExtendColumns($columns)
    {
        return $columns;
    }

    /**
     * Extracts the headers from the column definitions.
     */
    protected function getColumnHeaders($columns)
    {
        $headers = [];

        foreach ($columns as $column => $label) {
            $headers[] = Lang::get($label);
        }

        return $headers;
    }

    /**
     * Ensures the correct order of the column data.
     */
    protected function matchDataToColumns($data, $columns)
    {
        $results = [];

        foreach ($columns as $column => $label) {
            $results[] = array_get($data, $column);
        }

        return $results;
    }

    /**
     * Implodes a single dimension array using pipes (|)
     * Multi dimensional arrays are not allowed.
     * @return string
     */
    protected function encodeArrayValue($data, $delimeter = '|')
    {
        $newData = [];
        foreach ($data as $value) {
            if (is_array($value)) {
                $newData[] = 'Array';
            }
            else {
                $newData[] = str_replace($delimeter, '\\'.$delimeter, $value);
            }
        }

        return implode($delimeter, $newData);
    }
}
