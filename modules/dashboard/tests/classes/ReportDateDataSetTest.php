<?php

use Dashboard\Classes\ReportDataOrderRule;
use Dashboard\Classes\ReportDateDataSet;
use Dashboard\Classes\ReportDimension;
use Dashboard\Classes\ReportMetric;
use Dashboard\Classes\ReportDataSourceBase;
use Carbon\CarbonPeriod;
use Carbon\Carbon;

class ReportDateDataSetTest extends TestCase
{
    public function testGetNormalizedDataSortAsc()
    {
        $dataSet = $this->makeDataSet(true, null, null, null);
        $result = $dataSet->getNormalizedData();
        $this->assertIsArray($result);
        $this->assertCount(5, $result);

        $this->assertEquals('2023-01-01', $result[0]->oc_dimension);
        $this->assertEquals('2023-01-02', $result[1]->oc_dimension);
        $this->assertEquals('2023-01-03', $result[2]->oc_dimension);
        $this->assertEquals('2023-01-04', $result[3]->oc_dimension);
        $this->assertEquals('2023-01-05', $result[4]->oc_dimension);

        $this->assertEquals(1, $result[0]->oc_metric_total);
        $this->assertEquals(2, $result[3]->oc_metric_total);

        $this->assertNull($result[1]->oc_metric_total);
    }

    public function testAddMissingWeeks()
    {
        $values = $values = $values ?? [
            (object)[
                'oc_dimension' => '2023-01-02',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-01-16',
                'oc_metric_total' => 1
            ]
        ];

        $dataSet = $this->makeDataSet(
            true,
            $values,
            Carbon::create('2023-01-02'),
            Carbon::create('2023-01-16'),
            ReportMetric::AGGREGATE_SUM,
            ReportDataSourceBase::GROUP_INTERVAL_WEEK
        );
        $result = $dataSet->getNormalizedData();
        $this->assertIsArray($result);
        $this->assertCount(3, $result);

        $this->assertEquals('2023-01-02', $result[0]->oc_dimension);
        $this->assertEquals('2023-01-09', $result[1]->oc_dimension);
        $this->assertEquals('2023-01-16', $result[2]->oc_dimension);

        $this->assertEquals(2, $result[0]->oc_metric_total);
        $this->assertEquals(1, $result[2]->oc_metric_total);
        $this->assertNull($result[1]->oc_metric_total);
    }

    public function testAddMissingMonths()
    {
        $values = $values = $values ?? [
            (object)[
                'oc_dimension' => '2023-02-01',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-04-01',
                'oc_metric_total' => 1
            ]
        ];

        $dataSet = $this->makeDataSet(
            true,
            $values,
            Carbon::create('2023-01-01'),
            Carbon::create('2023-04-01'),
            ReportMetric::AGGREGATE_SUM,
            ReportDataSourceBase::GROUP_INTERVAL_MONTH
        );
        $result = $dataSet->getNormalizedData();
        $this->assertIsArray($result);
        $this->assertCount(4, $result);

        $this->assertEquals('2023-01-01', $result[0]->oc_dimension);
        $this->assertEquals('2023-02-01', $result[1]->oc_dimension);
        $this->assertEquals('2023-03-01', $result[2]->oc_dimension);
        $this->assertEquals('2023-04-01', $result[3]->oc_dimension);

        $this->assertEquals(2, $result[1]->oc_metric_total);
        $this->assertEquals(1, $result[3]->oc_metric_total);
        $this->assertNull($result[0]->oc_metric_total);
        $this->assertNull($result[2]->oc_metric_total);
    }

    public function testAddMissingQuarters()
    {
        $values = $values = $values ?? [
            (object)[
                'oc_dimension' => '2023-04-01',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-10-01',
                'oc_metric_total' => 1
            ]
        ];

        $dataSet = $this->makeDataSet(
            true,
            $values,
            Carbon::create('2023-01-01'),
            Carbon::create('2023-12-01'),
            ReportMetric::AGGREGATE_SUM,
            ReportDataSourceBase::GROUP_INTERVAL_QUARTER
        );
        $result = $dataSet->getNormalizedData();
        $this->assertIsArray($result);
        $this->assertCount(4, $result);

        $this->assertEquals('2023-01-01', $result[0]->oc_dimension);
        $this->assertEquals('2023-04-01', $result[1]->oc_dimension);
        $this->assertEquals('2023-07-01', $result[2]->oc_dimension);
        $this->assertEquals('2023-10-01', $result[3]->oc_dimension);

        $this->assertEquals(2, $result[1]->oc_metric_total);
        $this->assertEquals(1, $result[3]->oc_metric_total);
        $this->assertNull($result[0]->oc_metric_total);
        $this->assertNull($result[2]->oc_metric_total);
    }

    public function testAddMissingYears()
    {
        $values = $values = $values ?? [
            (object)[
                'oc_dimension' => '2023-01-01',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2025-01-01',
                'oc_metric_total' => 1
            ]
        ];

        $dataSet = $this->makeDataSet(
            true,
            $values,
            Carbon::create('2022-01-01'),
            Carbon::create('2026-01-01'),
            ReportMetric::AGGREGATE_SUM,
            ReportDataSourceBase::GROUP_INTERVAL_YEAR
        );
        $result = $dataSet->getNormalizedData();
        $this->assertIsArray($result);
        $this->assertCount(5, $result);

        $this->assertEquals('2022-01-01', $result[0]->oc_dimension);
        $this->assertEquals('2023-01-01', $result[1]->oc_dimension);
        $this->assertEquals('2024-01-01', $result[2]->oc_dimension);
        $this->assertEquals('2025-01-01', $result[3]->oc_dimension);
        $this->assertEquals('2026-01-01', $result[4]->oc_dimension);

        $this->assertEquals(2, $result[1]->oc_metric_total);
        $this->assertEquals(1, $result[3]->oc_metric_total);
        $this->assertNull($result[0]->oc_metric_total);
        $this->assertNull($result[2]->oc_metric_total);
        $this->assertNull($result[4]->oc_metric_total);
    }

    public function testGetNormalizedDataSortDesc()
    {
        $dataSet = $this->makeDataSet(false, null, null, null);
        $result = $dataSet->getNormalizedData();
        $this->assertEquals('2023-01-01', $result[4]->oc_dimension);
        $this->assertEquals('2023-01-02', $result[3]->oc_dimension);
        $this->assertEquals('2023-01-03', $result[2]->oc_dimension);
        $this->assertEquals('2023-01-04', $result[1]->oc_dimension);
        $this->assertEquals('2023-01-05', $result[0]->oc_dimension);
    }

    public function testAggregateByDay()
    {
        $dateStart = Carbon::create('2023-01-01');
        $dateEnd = Carbon::create('2023-01-03');

        $values = [
            (object)[
                'oc_dimension' => '2023-01-02',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-01-01',
                'oc_metric_total' => 1
            ]
        ];

        $ds = $this->makeDataSet(true, $values, $dateStart, $dateEnd);
        $aggregated = $ds->aggregateData(ReportDataSourceBase::GROUP_INTERVAL_DAY);
        $this->assertIsArray($aggregated);
        $this->assertCount(3, $aggregated);
        $this->assertEquals('2023-01-01', $aggregated[0]->oc_dimension);
        $this->assertEquals('2023-01-02', $aggregated[1]->oc_dimension);
        $this->assertEquals('2023-01-03', $aggregated[2]->oc_dimension);

        $this->assertEquals(1, $aggregated[0]->oc_metric_total);
        $this->assertEquals(2, $aggregated[1]->oc_metric_total);
        $this->assertNull($aggregated[2]->oc_metric_total);
    }

    public function testAggregateByWeekSum()
    {
        $dateStart = Carbon::create('2023-01-07'); // Saturday
        $dateEnd = Carbon::create('2023-01-10');   // Tuesday

        $values = $this->makeWeeklyData();

        $ds = $this->makeDataSet(true, $values, $dateStart, $dateEnd);
        $aggregated = $ds->aggregateData(ReportDataSourceBase::GROUP_INTERVAL_WEEK);
        $this->assertIsArray($aggregated);
        $this->assertCount(2, $aggregated);
        $this->assertEquals('2023-01-02', $aggregated[0]->oc_dimension);
        $this->assertEquals('2023-01-09', $aggregated[1]->oc_dimension);

        $this->assertEquals(5, $aggregated[0]->oc_metric_total);
        $this->assertEquals(4, $aggregated[1]->oc_metric_total);
    }

    public function testAggregateByWeekCount()
    {
        $dateStart = Carbon::create('2023-01-07'); // Saturday
        $dateEnd = Carbon::create('2023-01-10');   // Tuesday

        $values = $this->makeWeeklyData();

        $ds = $this->makeDataSet(true, $values, $dateStart, $dateEnd, ReportMetric::AGGREGATE_COUNT);
        $aggregated = $ds->aggregateData(ReportDataSourceBase::GROUP_INTERVAL_WEEK);
        $this->assertIsArray($aggregated);
        $this->assertCount(2, $aggregated);
        $this->assertEquals('2023-01-02', $aggregated[0]->oc_dimension);
        $this->assertEquals('2023-01-09', $aggregated[1]->oc_dimension);

        $this->assertEquals(2, $aggregated[0]->oc_metric_total);
        $this->assertEquals(1, $aggregated[1]->oc_metric_total);
    }

    public function testAggregateByWeekMin()
    {
        $dateStart = Carbon::create('2023-01-07'); // Saturday
        $dateEnd = Carbon::create('2023-01-10');   // Tuesday

        $values = $this->makeWeeklyData();

        $ds = $this->makeDataSet(true, $values, $dateStart, $dateEnd, ReportMetric::AGGREGATE_MIN);
        $aggregated = $ds->aggregateData(ReportDataSourceBase::GROUP_INTERVAL_WEEK);
        $this->assertIsArray($aggregated);
        $this->assertCount(2, $aggregated);
        $this->assertEquals('2023-01-02', $aggregated[0]->oc_dimension);
        $this->assertEquals('2023-01-09', $aggregated[1]->oc_dimension);

        $this->assertEquals(2, $aggregated[0]->oc_metric_total);
        $this->assertEquals(4, $aggregated[1]->oc_metric_total);
    }

    public function testAggregateByWeekMax()
    {
        $dateStart = Carbon::create('2023-01-07'); // Saturday
        $dateEnd = Carbon::create('2023-01-10');   // Tuesday

        $values = $this->makeWeeklyData();

        $ds = $this->makeDataSet(true, $values, $dateStart, $dateEnd, ReportMetric::AGGREGATE_MAX);
        $aggregated = $ds->aggregateData(ReportDataSourceBase::GROUP_INTERVAL_WEEK);
        $this->assertIsArray($aggregated);
        $this->assertCount(2, $aggregated);
        $this->assertEquals('2023-01-02', $aggregated[0]->oc_dimension);
        $this->assertEquals('2023-01-09', $aggregated[1]->oc_dimension);

        $this->assertEquals(3, $aggregated[0]->oc_metric_total);
        $this->assertEquals(4, $aggregated[1]->oc_metric_total);
    }

    public function testAggregateByMonthSum()
    {
        $dateStart = Carbon::create('2023-01-30');
        $dateEnd = Carbon::create('2023-02-10');

        $values = [
            (object)[
                'oc_dimension' => '2023-01-31',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-02-02',
                'oc_metric_total' => 3
            ],
            (object)[
                'oc_dimension' => '2023-02-04',
                'oc_metric_total' => 4
            ]
        ];

        $ds = $this->makeDataSet(true, $values, $dateStart, $dateEnd);
        $aggregated = $ds->aggregateData(ReportDataSourceBase::GROUP_INTERVAL_MONTH);
        $this->assertIsArray($aggregated);
        $this->assertCount(2, $aggregated);
        $this->assertEquals('2023-01-01', $aggregated[0]->oc_dimension);
        $this->assertEquals('2023-02-01', $aggregated[1]->oc_dimension);

        $this->assertEquals(2, $aggregated[0]->oc_metric_total);
        $this->assertEquals(7, $aggregated[1]->oc_metric_total);
    }

    public function testAggregateByQuarterSum()
    {
        $dateStart = Carbon::create('2023-03-30');
        $dateEnd = Carbon::create('2023-04-10');

        $values = [
            (object)[
                'oc_dimension' => '2023-03-31',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-04-02',
                'oc_metric_total' => 3
            ],
            (object)[
                'oc_dimension' => '2023-04-04',
                'oc_metric_total' => 4
            ]
        ];

        $ds = $this->makeDataSet(true, $values, $dateStart, $dateEnd);
        $aggregated = $ds->aggregateData(ReportDataSourceBase::GROUP_INTERVAL_QUARTER);
        $this->assertIsArray($aggregated);
        $this->assertCount(2, $aggregated);
        $this->assertEquals('2023-01-01', $aggregated[0]->oc_dimension);
        $this->assertEquals('2023-04-01', $aggregated[1]->oc_dimension);

        $this->assertEquals(2, $aggregated[0]->oc_metric_total);
        $this->assertEquals(7, $aggregated[1]->oc_metric_total);
    }

    public function testAggregateByYearSum()
    {
        $dateStart = Carbon::create('2022-12-30');
        $dateEnd = Carbon::create('2023-01-10');

        $values = [
            (object)[
                'oc_dimension' => '2022-12-31',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-01-02',
                'oc_metric_total' => 3
            ],
            (object)[
                'oc_dimension' => '2023-01-04',
                'oc_metric_total' => 4
            ]
        ];

        $ds = $this->makeDataSet(true, $values, $dateStart, $dateEnd);
        $aggregated = $ds->aggregateData(ReportDataSourceBase::GROUP_INTERVAL_YEAR);
        $this->assertIsArray($aggregated);
        $this->assertCount(2, $aggregated);
        $this->assertEquals('2022-01-01', $aggregated[0]->oc_dimension);
        $this->assertEquals('2023-01-01', $aggregated[1]->oc_dimension);

        $this->assertEquals(2, $aggregated[0]->oc_metric_total);
        $this->assertEquals(7, $aggregated[1]->oc_metric_total);
    }

    public function testAggregateFullSum()
    {
        $dateStart = Carbon::create('2022-12-30');
        $dateEnd = Carbon::create('2023-01-10');

        $values = [
            (object)[
                'oc_dimension' => '2022-12-31',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-01-02',
                'oc_metric_total' => 3
            ],
            (object)[
                'oc_dimension' => '2023-01-04',
                'oc_metric_total' => 4
            ]
        ];

        $ds = $this->makeDataSet(true, $values, $dateStart, $dateEnd);
        $aggregated = $ds->aggregateData(ReportDataSourceBase::GROUP_INTERVAL_FULL);
        $this->assertIsArray($aggregated);
        $this->assertCount(1, $aggregated);
        $this->assertEquals(9, $aggregated[0]->oc_metric_total);
    }

    public function testKeepsPartialFirstGroupOfPreAggregatedData()
    {
        // The range starts mid-month, so the January row is keyed before the range start
        $values = [
            (object)[
                'oc_dimension' => '2023-01-01',
                'oc_metric_total' => 10
            ],
            (object)[
                'oc_dimension' => '2023-03-01',
                'oc_metric_total' => 30
            ]
        ];

        $dataSet = $this->makeDataSet(
            true,
            $values,
            Carbon::create('2023-01-15'),
            Carbon::create('2023-03-31'),
            ReportMetric::AGGREGATE_SUM,
            ReportDataSourceBase::GROUP_INTERVAL_MONTH
        );
        $result = $dataSet->getNormalizedData();
        $this->assertCount(3, $result);

        $this->assertEquals('2023-01-01', $result[0]->oc_dimension);
        $this->assertEquals('2023-02-01', $result[1]->oc_dimension);
        $this->assertEquals('2023-03-01', $result[2]->oc_dimension);

        $this->assertEquals(10, $result[0]->oc_metric_total);
        $this->assertNull($result[1]->oc_metric_total);
        $this->assertEquals(30, $result[2]->oc_metric_total);
    }

    private function makeDataSet(
        bool $ascending,
        ?array $values,
        ?Carbon $dateStart,
        ?Carbon $dateEnd,
        string $aggregateFunction = ReportMetric::AGGREGATE_SUM,
        string $groupInterval = ReportDataSourceBase::GROUP_INTERVAL_DAY
    ): ReportDateDataSet {
        $dateStart = $dateStart ?? Carbon::create('2023-01-01');
        $dateEnd = $dateEnd ?? Carbon::create('2023-01-05');

        $values = $values ?? [
            (object)[
                'oc_dimension' => '2023-01-04',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-01-01',
                'oc_metric_total' => 1
            ]
        ];

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date', 'Date');

        return new ReportDateDataSet(
            $dimension,
            [
                new ReportMetric('total', 'total', 'Total', $aggregateFunction)
            ],
            new CarbonPeriod($dateStart, $dateEnd),
            new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION, null, $ascending),
            $groupInterval,
            $values
        );
    }

    private function makeWeeklyData()
    {
        return [
            (object)[
                'oc_dimension' => '2023-01-07',
                'oc_metric_total' => 2
            ],
            (object)[
                'oc_dimension' => '2023-01-08',
                'oc_metric_total' => 3
            ],
            (object)[
                'oc_dimension' => '2023-01-10',
                'oc_metric_total' => 4
            ]
        ];
    }
}