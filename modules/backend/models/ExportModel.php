<?php namespace Backend\Models;

use Arr;
use File;
use Lang;
use Model;
use Response;
use ApplicationException;

/**
 * ExportModel used for exporting data
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class ExportModel extends Model
{
    use \Backend\Models\ExportModel\EncodesCsv;
    use \Backend\Models\ExportModel\EncodesJson;

    /**
     * @var array guarded attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * exportData is called when data is being exported.
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
     * export data based on column names and labels.
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

        $columns = $this->processColumnKeys($columns);

        $data = $this->exportData(array_keys($columns), $sessionKey);

        return $this->processExportData($columns, $data, $options);
    }

    /**
     * exportDownload returns a download response
     * @return \Illuminate\Http\Response
     */
    public function exportDownload($outputName, $options = [])
    {
        $columns = $options['columns'] ?? [];

        return $this->download($this->export($columns, $options), $outputName);
    }

    /**
     * download a previously compiled export file.
     * @return \Illuminate\Http\Response
     */
    public function download($name, $outputName = null)
    {
        if (!preg_match('/^oc[0-9a-z]*$/i', $name)) {
            throw new ApplicationException(__("File not found"));
        }

        $csvPath = $this->getTemporaryExportPath($name);
        if (!file_exists($csvPath)) {
            throw new ApplicationException(__("File not found"));
        }

        $contentType = str_ends_with($name, 'xjson')
            ? 'application/json'
            : 'text/csv';

        return Response::download($csvPath, $outputName, [
            'Content-Type' => $contentType,
        ])->deleteFileAfterSend(true);
    }

    /**
     * processColumnKeys will detect a numerical array or an associative array to determine column keys,
     * the expected output format is [column_name => Column Label]
     */
    protected function processColumnKeys(array $columns): array
    {
        if (Arr::isList($columns)) {
            $columns = array_combine($columns, $columns);
        }

        return $columns;
    }

    /**
     * processExportData converts a data collection to a CSV file.
     */
    protected function processExportData($columns, $results, $options)
    {
        // Validate
        if (!$results) {
            throw new ApplicationException(__("There was no data supplied to export"));
        }

        // Extend columns
        $columns = $this->exportExtendColumns($columns);

        // Save for download
        $fileName = uniqid('oc');

        // Prepare export
        if ($this->file_format === 'json') {
            $fileName .= 'xjson';
            $options['savePath'] = $this->getTemporaryExportPath($fileName);
            $this->processExportDataAsJson($columns, $results, $options);
        }
        else {
            $fileName .= 'xcsv';
            $options['savePath'] = $this->getTemporaryExportPath($fileName);
            $this->processExportDataAsCsv($columns, $results, $options);
        }

        return $fileName;
    }

    /**
     * getTemporaryExportPath
     */
    protected function getTemporaryExportPath($fileName)
    {
        $path = temp_path('export');

        if (!File::isDirectory($path)) {
            File::makeDirectory($path, 0755, true, true);
        }

        return $path.'/'.$fileName;
    }

    /**
     * exportExtendColumns used to override column definitions at export time.
     */
    protected function exportExtendColumns($columns)
    {
        return $columns;
    }

    /**
     * getColumnHeaders extracts the headers from the column definitions.
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
     * matchDataToColumns ensures the correct order of the column data.
     */
    protected function matchDataToColumns($data, $columns)
    {
        $results = [];

        foreach ($columns as $column => $label) {
            $results[] = data_get($data, $column);
        }

        return $results;
    }

    /**
     * encodeArrayValue prepares an array object for the file type.
     * @return mixed
     */
    protected function encodeArrayValue($data, $delimiter = '|')
    {
        if (!is_array($data)) {
            return '';
        }

        if ($this->file_format === 'json') {
            return $this->encodeArrayValueForJson($data);
        }
        else {
            return $this->encodeArrayValueForCsv($data, $delimiter);
        }
    }
}
