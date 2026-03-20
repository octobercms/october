<?php namespace Backend\Models\ImportModel;

use File;

/**
 * DecodesJson format for export
 */
trait DecodesJson
{
    /**
     * decodeArrayValueForJson
     */
    protected function decodeArrayValueForJson($value, $delimiter = '|')
    {
        if (is_array($value)) {
            return $value;
        }

        return $this->decodeArrayValueForCsv($value, $delimiter);
    }

    /**
     * processImportDataAsJson
     */
    protected function processImportDataAsJson($filePath, $matches, $options)
    {
        // Parse options
        $options = array_merge([
            'customJson' => false,
        ], $options);

        $jsonFile = File::get($filePath);
        $contents = json_decode($jsonFile, true);

        $result = [];

        // Raw output
        if ($options['customJson']) {
            $result = $contents;
        }
        // Compiled output
        else {
            foreach ($contents as $row) {
                $result[] = $this->processJsonImportRow($row, $matches);
            }
        }

        return $result;
    }

    /**
     * processJsonImportRow converts a single row of JSON data to the column map
     * @return array
     */
    protected function processJsonImportRow($rowData, $matches)
    {
        // Only JSON can do this
        if ($matches === null) {
            return $rowData;
        }

        $newRow = [];
        $rowIndexes = array_keys($rowData);

        foreach ($matches as $columnIndex => $dbNames) {
            $columnName = array_get($rowIndexes, $columnIndex);
            $value = array_get($rowData, $columnName);
            foreach ((array) $dbNames as $dbName) {
                $newRow[$dbName] = $value;
            }
        }

        return $newRow;
    }
}
