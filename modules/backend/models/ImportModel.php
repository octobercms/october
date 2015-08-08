<?php namespace Backend\Models;

use Model;
use League\Csv\Reader as CsvReader;

/**
 * Model used for importing data
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class ImportModel extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * The attributes that aren't mass assignable.
     * @var array
     */
    protected $guarded = [];

    /**
     * Relations
     */
    public $attachOne = [
        'import_file' => ['System\Models\File']
    ];

    /**
     * @var array Import statistics store.
     */
    protected $resultStats = [
        'updated' => 0,
        'created' => 0,
        'errors' => [],
        'warnings' => [],
        'skipped' => []
    ];

    /**
     * Called when data is being imported.
     * The $results array should be in the format of:
     *
     *    [
     *        'db_name1' => 'Some value',
     *        'db_name2' => 'Another value'
     *    ],
     *    [...]
     *
     */
    abstract public function importData($results, $sessionKey = null);

    /**
     * Import data based on column names matching header indexes in the CSV.
     * The $matches array should be in the format of:
     *
     *    [
     *        0 => [db_name1, db_name2],
     *        1 => [db_name3],
     *        ...
     *    ]
     *
     * The key (0, 1) is the column index in the CSV and the value
     * is another array of target database column names.
     */
    public function import($matches, $options = [])
    {
        $sessionKey = array_get($options, 'sessionKey');
        $path = $this->getImportFilePath($sessionKey);
        $data = $this->processImportData($path, $matches, $options);
        return $this->importData($data, $sessionKey);
    }

    /**
     * Converts column index to database column map to an array containing
     * database column names and values pulled from the CSV file. Eg:
     *
     *   [0 => [first_name], 1 => [last_name]]
     *
     * Will return:
     *
     *   [first_name => Joe, last_name => Blogs],
     *   [first_name => Harry, last_name => Potter],
     *   [...]
     *
     * @return array
     */
    protected function processImportData($filePath, $matches, $options)
    {
        extract(array_merge([
            'firstRowTitles' => true
        ], $options));

        $reader = CsvReader::createFromPath($filePath, 'r');

        // Filter out empty rows
        $reader->addFilter(function(array $row) {
            return count($row) > 1 || reset($row) !== null;
        });

        if ($firstRowTitles) {
            $reader->setOffset(1);
        }

        $result = [];
        $contents = $reader->fetchAll();
        foreach ($contents as $row) {
            $result[] = $this->processImportRow($row, $matches);
        }

        return $result;
    }

    /**
     * Converts a single row of CSV data to the column map.
     * @return array
     */
    protected function processImportRow($rowData, $matches)
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

    /**
     * Explodes a string using pipes (|) to a single dimension array
     * @return array
     */
    protected function decodeArrayValue($value, $delimeter = '|')
    {
        if (strpos($value, $delimeter) === false) return [$value];

        $data = preg_split('~(?<!\\\)' . preg_quote($delimeter, '~') . '~', $value);
        $newData = [];

        foreach ($data as $_value) {
            $newData[] = str_replace('\\'.$delimeter, $delimeter, $_value);
        }

        return $newData;
    }

    /**
     * Returns an attached imported file local path, if available.
     * @return string
     */
    public function getImportFilePath($sessionKey = null)
    {
        $file = $this
            ->import_file()
            ->withDeferred($sessionKey)
            ->first();

        if (!$file) {
            return null;
        }

        return $file->getLocalPath();
    }

    //
    // Result logging
    //

    public function getResultStats()
    {
        $this->resultStats['errorCount'] = count($this->resultStats['errors']);
        $this->resultStats['warningCount'] = count($this->resultStats['warnings']);
        $this->resultStats['skippedCount'] = count($this->resultStats['skipped']);

        $this->resultStats['hasMessages'] = (
            $this->resultStats['errorCount'] > 0 ||
            $this->resultStats['warningCount'] > 0 ||
            $this->resultStats['skippedCount'] > 0
        );

        return (object) $this->resultStats;
    }

    protected function logUpdated()
    {
        $this->resultStats['updated']++;
    }

    protected function logCreated()
    {
        $this->resultStats['created']++;
    }

    protected function logError($rowIndex, $message)
    {
        $this->resultStats['errors'][$rowIndex] = $message;
    }

    protected function logWarning($rowIndex, $message)
    {
        $this->resultStats['warnings'][$rowIndex] = $message;
    }

    protected function logSkipped($rowIndex, $message)
    {
        $this->resultStats['skipped'][$rowIndex] = $message;
    }
}