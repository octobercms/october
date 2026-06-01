<?php

use Dashboard\Models\ReportDataCache;
use Dashboard\Classes\ReportMetric;
use Dashboard\Classes\ReportDimension;
use Dashboard\Classes\ReportDataOrderRule;
use Dashboard\Classes\ReportDataPaginationParams;
use Dashboard\Classes\ReportFetchData;
use Dashboard\Classes\ReportFetchDataResult;
use Dashboard\Classes\ReportDataSourceBase;
use Carbon\CarbonPeriod;
use Carbon\Carbon;

class ReportDataSourceBaseTest extends TestCase
{
    public function testNonCacheableData()
    {
        $startDate = new Carbon('2023-01-01');
        $endDate = new Carbon('2023-01-03');

        $dsRange = CarbonPeriod::create($startDate, $endDate);
        $values = [
            (object)['oc_dimension' => 'product-1', 'oc_metric_metric_1' => 1],
            (object)['oc_dimension' => 'product-2', 'oc_metric_metric_1' => 2],
            (object)['oc_dimension' => 'product-3', 'oc_metric_metric_1' => 3]
        ];

        $rangesAndValues = [
            ['range' => $dsRange, 'values' => $values]
        ];

        $reportDataCacheMock = $this->mockReportDataCache();

        $reportDataCacheMock->expects($this->never())->method('getRanges');
        $reportDataCacheMock->expects($this->never())->method('putRange');

        $dataSource = $this->getDataSource(
            new ReportDimension('product', 'product', 'Product'),
            $rangesAndValues
        );

        $data = new ReportFetchData;
        $data->dimensionCode = 'product';
        $data->metricCodes = ['metric_1'];
        $data->metricsConfiguration = [];
        $data->dateStart = $startDate;
        $data->dateEnd = $endDate;
        $data->startTimestamp = null;
        $data->dimensionFilters = [];
        $data->groupInterval = null;
        $data->orderRule = new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION);
        $data->limit = null;
        $data->paginationParams = null;
        $data->hideEmptyDimensionValues = false;
        $data->reportDataCache = $reportDataCacheMock;
        $data->totalsOnly = false;

        $result = $dataSource->getData($data);

        $this->assertInstanceOf(ReportFetchDataResult::class, $result);
        $rows = $result->getRows();
        $this->assertIsArray($rows);
        $this->assertCount(3, $rows);
        $this->assertEquals($values, $rows);
    }

    public function testPreAggregatedMonthlyData()
    {
        $startDate = new Carbon('2023-01-01');
        $endDate = new Carbon('2023-03-31');

        // Simulate data already aggregated by month at the SQL level
        $values = [
            (object)['oc_dimension' => '2023-01-01', 'oc_metric_metric_1' => 10],
            (object)['oc_dimension' => '2023-03-01', 'oc_metric_metric_1' => 30]
        ];

        $dsRange = CarbonPeriod::create($startDate, $endDate);
        $rangesAndValues = [
            ['range' => $dsRange, 'values' => $values, 'preAggregated' => true]
        ];

        $reportDataCacheMock = $this->mockReportDataCache();
        $reportDataCacheMock->expects($this->never())->method('getRanges');
        $reportDataCacheMock->expects($this->never())->method('putRange');

        $dataSource = $this->getDataSource(
            new ReportDimension(ReportDimension::CODE_DATE, 'date', 'Date'),
            $rangesAndValues
        );

        $data = new ReportFetchData;
        $data->dimensionCode = 'date';
        $data->metricCodes = ['metric_1'];
        $data->metricsConfiguration = [];
        $data->dateStart = $startDate;
        $data->dateEnd = $endDate;
        $data->startTimestamp = null;
        $data->dimensionFilters = [];
        $data->groupInterval = ReportDataSourceBase::GROUP_INTERVAL_MONTH;
        $data->orderRule = new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION);
        $data->limit = null;
        $data->paginationParams = null;
        $data->hideEmptyDimensionValues = false;
        $data->reportDataCache = $reportDataCacheMock;
        $data->totalsOnly = false;

        $result = $dataSource->getData($data);
        $rows = $result->getRows();

        // Should have 3 months with gap-fill for February
        $this->assertCount(3, $rows);
        $this->assertEquals('2023-01-01', $rows[0]->oc_dimension);
        $this->assertEquals('2023-02-01', $rows[1]->oc_dimension);
        $this->assertEquals('2023-03-01', $rows[2]->oc_dimension);

        // Values should NOT be re-aggregated, just preserved
        $this->assertEquals(10, $rows[0]->oc_metric_metric_1);
        $this->assertNull($rows[1]->oc_metric_metric_1); // Gap-filled
        $this->assertEquals(30, $rows[2]->oc_metric_metric_1);
    }

    public function testPreAggregatedCountNotReAggregated()
    {
        $startDate = new Carbon('2023-01-01');
        $endDate = new Carbon('2023-02-28');

        // Simulate COUNT data already aggregated by month at the SQL level.
        // If re-aggregated, COUNT would incorrectly count each row as 1.
        $values = [
            (object)['oc_dimension' => '2023-01-01', 'oc_metric_metric_1' => 150],
            (object)['oc_dimension' => '2023-02-01', 'oc_metric_metric_1' => 200]
        ];

        $dsRange = CarbonPeriod::create($startDate, $endDate);
        $rangesAndValues = [
            ['range' => $dsRange, 'values' => $values, 'preAggregated' => true]
        ];

        $reportDataCacheMock = $this->mockReportDataCache();

        $dataSource = $this->getDataSource(
            new ReportDimension(ReportDimension::CODE_DATE, 'date', 'Date'),
            $rangesAndValues,
            ReportMetric::AGGREGATE_COUNT
        );

        $data = new ReportFetchData;
        $data->dimensionCode = 'date';
        $data->metricCodes = ['metric_1'];
        $data->metricsConfiguration = [];
        $data->dateStart = $startDate;
        $data->dateEnd = $endDate;
        $data->startTimestamp = null;
        $data->dimensionFilters = [];
        $data->groupInterval = ReportDataSourceBase::GROUP_INTERVAL_MONTH;
        $data->orderRule = new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION);
        $data->limit = null;
        $data->paginationParams = null;
        $data->hideEmptyDimensionValues = false;
        $data->reportDataCache = $reportDataCacheMock;
        $data->totalsOnly = false;

        $result = $dataSource->getData($data);
        $rows = $result->getRows();

        $this->assertCount(2, $rows);

        // COUNT values should be preserved as-is, not re-counted as 1
        $this->assertEquals(150, $rows[0]->oc_metric_metric_1);
        $this->assertEquals(200, $rows[1]->oc_metric_metric_1);
    }

    public function testNonPreAggregatedDailyDataStillAggregates()
    {
        $startDate = new Carbon('2023-01-01');
        $endDate = new Carbon('2023-01-14');

        // Raw daily rows that need PHP-side aggregation into weeks
        $values = [
            (object)['oc_dimension' => '2023-01-02', 'oc_metric_metric_1' => 5],
            (object)['oc_dimension' => '2023-01-03', 'oc_metric_metric_1' => 3],
            (object)['oc_dimension' => '2023-01-09', 'oc_metric_metric_1' => 7],
            (object)['oc_dimension' => '2023-01-10', 'oc_metric_metric_1' => 2]
        ];

        $dsRange = CarbonPeriod::create($startDate, $endDate);
        $rangesAndValues = [
            ['range' => $dsRange, 'values' => $values, 'preAggregated' => false]
        ];

        $reportDataCacheMock = $this->mockReportDataCache();

        $dataSource = $this->getDataSource(
            new ReportDimension(ReportDimension::CODE_DATE, 'date', 'Date'),
            $rangesAndValues
        );

        $data = new ReportFetchData;
        $data->dimensionCode = 'date';
        $data->metricCodes = ['metric_1'];
        $data->metricsConfiguration = [];
        $data->dateStart = $startDate;
        $data->dateEnd = $endDate;
        $data->startTimestamp = null;
        $data->dimensionFilters = [];
        $data->groupInterval = ReportDataSourceBase::GROUP_INTERVAL_WEEK;
        $data->orderRule = new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION);
        $data->limit = null;
        $data->paginationParams = null;
        $data->hideEmptyDimensionValues = false;
        $data->reportDataCache = $reportDataCacheMock;
        $data->totalsOnly = false;

        $result = $dataSource->getData($data);
        $rows = $result->getRows();

        // Daily data should be aggregated into weeks via PHP
        $this->assertCount(2, $rows);
        $this->assertEquals('2023-01-02', $rows[0]->oc_dimension);
        $this->assertEquals('2023-01-09', $rows[1]->oc_dimension);

        // Week 1: 5 + 3 = 8, Week 2: 7 + 2 = 9
        $this->assertEquals(8, $rows[0]->oc_metric_metric_1);
        $this->assertEquals(9, $rows[1]->oc_metric_metric_1);
    }

    private function getDataSource(
        ReportDimension $dimension,
        array $rangesAndValues,
        string $aggregateFunction = ReportMetric::AGGREGATE_SUM
    ): ReportDataSourceBase {
        return new class ($rangesAndValues, $dimension, $aggregateFunction) extends ReportDataSourceBase
        {
            private $rangesAndValues;

            public function __construct($rangesAndValues, $dimension, $aggregateFunction)
            {
                $this->registerDimension($dimension);
                $this->registerMetric(
                    new ReportMetric('metric_1', 'metric_1', 'Metric 1', $aggregateFunction)
                );
                $this->rangesAndValues = $rangesAndValues;
            }

            protected function fetchData(ReportFetchData $data): ReportFetchDataResult
            {
                foreach ($this->rangesAndValues as $rangeAndValues) {
                    $range = $rangeAndValues['range'];
                    $values = $rangeAndValues['values'];
                    $preAggregated = $rangeAndValues['preAggregated'] ?? false;

                    if ($range->getStartDate()->eq($data->dateStart)) {
                        $result = new ReportFetchDataResult($values);
                        if ($preAggregated) {
                            $result->setPreAggregated();
                        }
                        return $result;
                    }
                }

                return new ReportFetchDataResult;
            }
        };
    }

    private function mockReportDataCache(): ReportDataCache
    {
        return $this->getMockBuilder(ReportDataCache::class)
            ->disableOriginalConstructor()
            ->getMock();
    }
}