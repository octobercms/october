<?php namespace Dashboard\Classes;

use ApplicationException;

/**
 * ReportDataPaginationParams defines pagination parameters for a data source query
 */
class ReportDataPaginationParams
{
    private $recordsPerPage;
    private $currentPage;

    /**
     * Creates a pagination parameters object.
     * @param int $recordsPerPage Specifies the number of records per page.
     * @param int $currentPage Specifies the current page index.
     */
    public function __construct(int $recordsPerPage, int $currentPage)
    {
        if ($recordsPerPage <= 0) {
            throw new ApplicationException('Records per page must be a positive integer');
        }

        if ($currentPage < 0) {
            throw new ApplicationException('Current page must be zero or a positive integer');
        }

        $this->recordsPerPage = $recordsPerPage;
        $this->currentPage = $currentPage;
    }

    /**
     * Returns the records per page value
     * @return int
     */
    public function getRecordsPerPage(): int
    {
        return $this->recordsPerPage;
    }

    /**
     * Returns the current page value
     * @return int
     */
    public function getCurrentPage(): int
    {
        return $this->currentPage;
    }

    /**
     * Returns the first record offset for building an SQL query.
     * @return int
     */
    public function getOffset(): int
    {
        return $this->currentPage * $this->recordsPerPage;
    }
}
