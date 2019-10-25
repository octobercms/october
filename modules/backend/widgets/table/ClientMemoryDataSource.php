<?php namespace Backend\Widgets\Table;

/**
 * The client-memory data source for the Table widget.
 */
class ClientMemoryDataSource extends DataSourceBase
{
    /**
     * @var array Keeps the data source data.
     */
    protected $data = [];

    /**
     * Initializes records in the data source.
     * The method doesn't replace existing records and
     * could be called multiple times in order to fill
     * the data source.
     * @param array $records Records to initialize in the data source.
     */
    public function initRecords($records)
    {
        $this->data = array_merge($this->data, $records);
    }

    /**
     * Returns a total number of records in the data source.
     * @return integer
     */
    public function getCount()
    {
        return count($this->data);
    }

    /**
     * Removes all records from the data source.
     */
    public function purge()
    {
        $this->data = [];
    }

    /**
     * Return records from the data source.
     * @param integer $offset Specifies the offset of the first record to return, zero-based.
     * @param integer $count Specifies the number of records to return.
     * @return array Returns the records.
     * If there are no more records, returns an empty array.
     */
    public function getRecords($offset, $count)
    {
        return array_slice($this->data, $offset, $count);
    }

    /**
     * Returns all records in the data source.
     * This method is specific only for the client memory data sources.
     */
    public function getAllRecords()
    {
        return $this->data;
    }
}
