<?php namespace Backend\Widgets\Table;

/**
 * Base class for the Table widget data sources.
 */
abstract class DataSourceBase
{
    /**
     * @var string Specifies a name of record's key column
     */
    protected $keyColumn;

    /**
     * @var integer Internal record offset
     */
    protected $offset = 0;

    /**
     * Class constructor.
     * @param string $keyColumn Specifies a name of the key column.
     */
    public function construct($keyColumn = 'id')
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
     * @return array Returns the records.
     * If there are no more records, returns an empty array.
     */
    abstract public function getRecords($offset, $count);

    /**
     * Identical to getRecords except provided with a search query.
     */
    public function searchRecords($query, $offset, $count)
    {
        return $this->getRecords($offset, $count);
    }

    /**
     * Rewinds the the data source to the first record.
     * Use this method with the readRecords() method.
     */
    public function reset()
    {
        $this->offset = 0;
    }

    /**
     * Returns a set of records from the data source.
     * @param integer $count Specifies the number of records to return.
     * @return array Returns the records.
     * If there are no more records, returns an empty array.
     */
    public function readRecords($count = 10)
    {
        $result = $this->getRecords($this->offset, $count);
        $this->offset += count($result);

        return $result;
    }
}
