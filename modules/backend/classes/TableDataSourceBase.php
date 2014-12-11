<?php namespace Backend\Classes;

/**
 * Base class for the Table widget data sources.
 */
abstract class TableDataSourceBase
{
    /**
     * @var Specifies a name of record's key column 
     */
    protected $keyColumn;

    /**
     * Class constructor.
     * @param string $keyColumn Specifies a name of the key column.
     */
    public static function construct($keyColumn = 'id')
    {
        $this->keyColumn = $keyColumn;
    }

    /**
     * Initializes records in the data source.
     * The method doesn't replace existing records and
     * could be called multiple times in order to fill
     * the data source.
     * @param array $records Records to initialize in the data source.
     */
    abstract public function initRecords($records);

    /**
     * Returns a total number of records in the data source.
     * @return integer
     */
    abstract public function getCount();

    /**
     * Removes all records from the data source.
     */
    abstract public function purge();

    /**
     * Return records from the data source.
     * @param integer $offset Specifies the offset of the first record to return, zero-based.
     * @param integer $count Specifies the number of records to return.
     * @return array
     */
    abstract public function getRecords($offset, $count);
}