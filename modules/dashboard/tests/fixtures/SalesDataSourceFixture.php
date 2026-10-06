<?php

use Dashboard\Classes\ReportMetric;
use Dashboard\Classes\ReportDimension;
use Dashboard\Classes\ReportFetchData;
use Dashboard\Classes\ReportDataSourceBase;
use Dashboard\Classes\ReportFetchDataResult;

/**
 * SalesDataSourceFixture returns a fixed sales row without touching the database.
 */
class SalesDataSourceFixture extends ReportDataSourceBase
{
    /**
     * __construct registers a product dimension and an amount metric.
     */
    public function __construct()
    {
        $this->registerDimension(new ReportDimension('product', 'product', 'Product'));

        $this->registerMetric(new ReportMetric('amount', 'amount', 'Amount', ReportMetric::AGGREGATE_SUM));
    }

    /**
     * fetchData returns a single product row.
     */
    protected function fetchData(ReportFetchData $data): ReportFetchDataResult
    {
        return new ReportFetchDataResult([
            ['oc_dimension' => 'Widget', 'oc_metric_amount' => 42]
        ]);
    }
}
