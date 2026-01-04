<?php

use Dashboard\Classes\ReportMetric;
use Dashboard\Classes\ReportDimension;
use Dashboard\Classes\ReportDataOrderRule;
use Dashboard\Classes\ReportDimensionField;
use Dashboard\Classes\ReportQueryBuilder;
use Dashboard\Classes\ReportDimensionFilter;
use Dashboard\Classes\ReportDataSourceBase;
use Illuminate\Database\Query\Builder;
use Carbon\Carbon;

class ReportQueryBuilderTest extends TestCase
{
    // Daily data
    private $dailyData = [
        ['date_dimension' => '2023-01-01', 'int_metric' => 1, 'float_metric' => 1.1], // day 1
        ['date_dimension' => '2023-01-01', 'int_metric' => 2, 'float_metric' => 2.1], // day 1
        ['date_dimension' => '2023-01-02', 'int_metric' => 4, 'float_metric' => 3.3], // day 2
        ['date_dimension' => '2023-01-02', 'int_metric' => 3, 'float_metric' => 1.1], // day 2
    ];

    // Weekly data (Week 1 and Week 2 of January)
    private $weeklyData = [
        ['date_dimension' => '2023-01-03', 'int_metric' => 5, 'float_metric' => 4.5], // week 1
        ['date_dimension' => '2023-01-04', 'int_metric' => 6, 'float_metric' => 5.5], // week 1
        ['date_dimension' => '2023-01-08', 'int_metric' => 7, 'float_metric' => 6.5], // week 1
        ['date_dimension' => '2023-01-09', 'int_metric' => 8, 'float_metric' => 7.5], // week 2
    ];

    // Monthly data (January and February)
    private $monthlyData = [
        ['date_dimension' => '2023-01-10', 'int_metric' => 10, 'float_metric' => 8.5], // january
        ['date_dimension' => '2023-02-15', 'int_metric' => 12, 'float_metric' => 9.5], // feburary
        ['date_dimension' => '2023-02-28', 'int_metric' => 14, 'float_metric' => 10.5], // february
    ];

    // Quarterly data (Q1 and Q2)
    private $quarterlyData = [
        ['date_dimension' => '2023-03-01', 'int_metric' => 16, 'float_metric' => 11.5], // Q1
        ['date_dimension' => '2023-03-15', 'int_metric' => 18, 'float_metric' => 12.5], // Q1
        ['date_dimension' => '2023-04-01', 'int_metric' => 20, 'float_metric' => 13.5], // Q2
        ['date_dimension' => '2023-06-30', 'int_metric' => 22, 'float_metric' => 14.5], // Q2
    ];

    // Yearly data (2023 and 2024)
    private $yearlyData = [
        ['date_dimension' => '2023-02-01', 'int_metric' => 24, 'float_metric' => 15.5], // year 1
        ['date_dimension' => '2023-05-31', 'int_metric' => 26, 'float_metric' => 16.5], // year 1
        ['date_dimension' => '2024-07-01', 'int_metric' => 28, 'float_metric' => 17.5], // year 2
        ['date_dimension' => '2024-12-31', 'int_metric' => 30, 'float_metric' => 18.5], // year 2
    ];

    public function setUp(): void
    {
        parent::setUp();

        $this->createApplication();

        Schema::dropIfExists('test_report_data');
        Schema::create('test_report_data', function($table)
        {
            $table->increments('id');
            $table->date('date_dimension');
            $table->integer('int_metric');
            $table->decimal('float_metric',  10, 2);
        });
    }

    public function testGetSingleMetricData()
    {
        Db::table('test_report_data')->insert($this->dailyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');
        $metric = new ReportMetric('max_int', 'int_metric', 'Metric 1', ReportMetric::AGGREGATE_MAX);

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([$metric])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_max_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_dimension'));

        $this->assertEquals(2, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals('2023-01-01', $dataArray[0]->oc_dimension);
        $this->assertEquals(4, $dataArray[1]->oc_metric_max_int);
        $this->assertEquals('2023-01-02', $dataArray[1]->oc_dimension);
        $this->assertEquals(2, $builder->getTotalRecords());
    }

    public function testFullDateGrouping()
    {
        Db::table('test_report_data')->insert($this->dailyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([
                new ReportMetric('max_int', 'int_metric', 'Metric 1', ReportMetric::AGGREGATE_MAX),
                new ReportMetric('total_int', 'int_metric', 'Total integer', ReportMetric::AGGREGATE_SUM)
            ])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->withoutGrouping()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(1, $dataArray);

        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_max_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_total_int'));
        $this->assertFalse(property_exists($dataArray[0], 'oc_dimension'));

        $this->assertEquals(4, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals(10, $dataArray[0]->oc_metric_total_int);
        $this->assertEquals(1, $builder->getTotalRecords());
    }

    public function testWeeklyGrouping()
    {
        if (env('DB_CONNECTION') === "sqlite") {
            $this->markTestSkipped('Date aggregation functions are not supported in SQLite');
        }

        Db::table('test_report_data')->insert($this->weeklyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([
                new ReportMetric('max_int', 'int_metric', 'Max integer', ReportMetric::AGGREGATE_MAX),
                new ReportMetric('total_int', 'int_metric', 'Total integer', ReportMetric::AGGREGATE_SUM)
            ])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByWeek()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_max_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_total_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_dimension'));

        $this->assertEquals(7, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals(18, $dataArray[0]->oc_metric_total_int);
        $this->assertEquals('2023-01-02', $dataArray[0]->oc_dimension);

        $this->assertEquals(8, $dataArray[1]->oc_metric_max_int);
        $this->assertEquals(8, $dataArray[1]->oc_metric_total_int);
        $this->assertEquals('2023-01-09', $dataArray[1]->oc_dimension);
    }

    public function testMonthlyGrouping()
    {
        if (env('DB_CONNECTION') === "sqlite") {
            $this->markTestSkipped('Date aggregation functions are not supported in SQLite');
        }

        Db::table('test_report_data')->insert($this->monthlyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([
                new ReportMetric('max_int', 'int_metric', 'Max integer', ReportMetric::AGGREGATE_MAX),
                new ReportMetric('total_int', 'int_metric', 'Total integer', ReportMetric::AGGREGATE_SUM)
            ])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByMonth()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-02-28'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_max_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_total_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_dimension'));

        $this->assertEquals(10, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals(10, $dataArray[0]->oc_metric_total_int);
        $this->assertEquals('2023-01-01', $dataArray[0]->oc_dimension);

        $this->assertEquals(14, $dataArray[1]->oc_metric_max_int);
        $this->assertEquals(26, $dataArray[1]->oc_metric_total_int);
        $this->assertEquals('2023-02-01', $dataArray[1]->oc_dimension);
    }

    public function testQuarterlyGrouping()
    {
        if (env('DB_CONNECTION') === "sqlite") {
            $this->markTestSkipped('Date aggregation functions are not supported in SQLite');
        }

        Db::table('test_report_data')->insert($this->quarterlyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([
                new ReportMetric('max_int', 'int_metric', 'Max integer', ReportMetric::AGGREGATE_MAX),
                new ReportMetric('total_int', 'int_metric', 'Total integer', ReportMetric::AGGREGATE_SUM)
            ])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByQuarter()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-06-30'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_max_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_total_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_dimension'));

        $this->assertEquals(18, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals(34, $dataArray[0]->oc_metric_total_int);
        $this->assertEquals('2023-01-01', $dataArray[0]->oc_dimension);

        $this->assertEquals(22, $dataArray[1]->oc_metric_max_int);
        $this->assertEquals(42, $dataArray[1]->oc_metric_total_int);
        $this->assertEquals('2023-04-01', $dataArray[1]->oc_dimension);
    }

    public function testYearlyGrouping()
    {
        if (env('DB_CONNECTION') === "sqlite") {
            $this->markTestSkipped('Date aggregation functions are not supported in SQLite');
        }

        Db::table('test_report_data')->insert($this->yearlyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([
                new ReportMetric('max_int', 'int_metric', 'Max integer', ReportMetric::AGGREGATE_MAX),
                new ReportMetric('total_int', 'int_metric', 'Total integer', ReportMetric::AGGREGATE_SUM)
            ])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByYear()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2024-12-31'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_max_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_total_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_dimension'));

        $this->assertEquals(26, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals(50, $dataArray[0]->oc_metric_total_int);
        $this->assertEquals('2023-01-01', $dataArray[0]->oc_dimension);

        $this->assertEquals(30, $dataArray[1]->oc_metric_max_int);
        $this->assertEquals(58, $dataArray[1]->oc_metric_total_int);
        $this->assertEquals('2024-01-01', $dataArray[1]->oc_dimension);
    }

    public function testGetMultipleMetricData()
    {
        Db::table('test_report_data')->insert($this->dailyData);
        Db::table('test_report_data')->insert(
            ['date_dimension' => '2023-01-02', 'int_metric' => 5, 'float_metric' => 1.1]
        );

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([
                new ReportMetric('max_int', 'int_metric', 'Max integer', ReportMetric::AGGREGATE_MAX),
                new ReportMetric('min_int', 'int_metric', 'Min integer', ReportMetric::AGGREGATE_MIN),
                new ReportMetric('total_int', 'int_metric', 'Total integer', ReportMetric::AGGREGATE_SUM),
                new ReportMetric('max_float', 'float_metric', 'Max float', ReportMetric::AGGREGATE_MAX),
                new ReportMetric('record_count', 'id', 'Record count', ReportMetric::AGGREGATE_COUNT),
                new ReportMetric('distinct_floats', 'float_metric', 'Distinct floats', ReportMetric::AGGREGATE_COUNT_DISTINCT),
            ])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertTrue(property_exists($dataArray[0], 'oc_dimension'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_max_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_min_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_total_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_max_float'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_record_count'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_distinct_floats'));

        $this->assertEquals(2, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals(1, $dataArray[0]->oc_metric_min_int);
        $this->assertEquals(3, $dataArray[0]->oc_metric_total_int);
        $this->assertEquals(2.1, $dataArray[0]->oc_metric_max_float);
        $this->assertEquals(2, $dataArray[0]->oc_metric_record_count);
        $this->assertEquals(2, $dataArray[0]->oc_metric_distinct_floats);
        $this->assertEquals('2023-01-01', $dataArray[0]->oc_dimension);

        $this->assertEquals(5, $dataArray[1]->oc_metric_max_int);
        $this->assertEquals(3, $dataArray[1]->oc_metric_min_int);
        $this->assertEquals(12, $dataArray[1]->oc_metric_total_int);
        $this->assertEquals(3.3, $dataArray[1]->oc_metric_max_float);
        $this->assertEquals(3, $dataArray[1]->oc_metric_record_count);
        $this->assertEquals(2, $dataArray[1]->oc_metric_distinct_floats);
        $this->assertEquals('2023-01-02', $dataArray[1]->oc_dimension);
        $this->assertEquals(2, $builder->getTotalRecords());
    }

    public function testDescendingSortByDimension()
    {
        Db::table('test_report_data')->insert($this->dailyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');
        $metric = new ReportMetric('max_int', 'int_metric', 'Metric 1', ReportMetric::AGGREGATE_MAX);

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([$metric])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION, null, false))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertEquals(2, $dataArray[1]->oc_metric_max_int);
        $this->assertEquals('2023-01-01', $dataArray[1]->oc_dimension);
        $this->assertEquals(4, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals('2023-01-02', $dataArray[0]->oc_dimension);
        $this->assertEquals(2, $builder->getTotalRecords());
    }

    public function testSortByMetric()
    {
        Db::table('test_report_data')->insert($this->dailyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');
        $metric = new ReportMetric('max_int', 'int_metric', 'Metric 1', ReportMetric::AGGREGATE_MAX);

        // Ascending
        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([$metric])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_METRIC, 'max_int', true))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertEquals(2, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals('2023-01-01', $dataArray[0]->oc_dimension);
        $this->assertEquals(4, $dataArray[1]->oc_metric_max_int);
        $this->assertEquals('2023-01-02', $dataArray[1]->oc_dimension);
        $this->assertEquals(2, $builder->getTotalRecords());

        // Descending
        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([$metric])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_METRIC, 'max_int', false))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertEquals(2, $dataArray[1]->oc_metric_max_int);
        $this->assertEquals('2023-01-01', $dataArray[1]->oc_dimension);
        $this->assertEquals(4, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals('2023-01-02', $dataArray[0]->oc_dimension);
        $this->assertEquals(2, $builder->getTotalRecords());
    }

    public function testDimensionFields()
    {
        $builder = $this->makeBuilderWithDimensionFields([]);
        $query = $builder->toQuery();

        $dataArray = $query->get()->toArray();

        $this->assertCount(3, $dataArray); // We have 3 products and 4 sales
        $this->assertTrue(property_exists($dataArray[0], 'oc_dimension'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_field_product_name'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_field_product_code'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_sales_total'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_sales_count'));

        // The rows must be sorted by product name, descending
        $this->assertEquals(3, $dataArray[0]->oc_dimension);
        $this->assertEquals(2, $dataArray[1]->oc_dimension);
        $this->assertEquals(1, $dataArray[2]->oc_dimension);

        $this->assertEquals('Product 3 - pants', $dataArray[0]->oc_field_product_name);
        $this->assertEquals('Product 2 - t-shirt', $dataArray[1]->oc_field_product_name);
        $this->assertEquals('Product 1 - hoodie', $dataArray[2]->oc_field_product_name);

        $this->assertEquals('P3', $dataArray[0]->oc_field_product_code);
        $this->assertEquals('P2', $dataArray[1]->oc_field_product_code);
        $this->assertEquals('P1', $dataArray[2]->oc_field_product_code);

        $this->assertEquals(33, $dataArray[0]->oc_metric_sales_total);
        $this->assertEquals(44, $dataArray[1]->oc_metric_sales_total);
        $this->assertEquals(11, $dataArray[2]->oc_metric_sales_total);

        $this->assertEquals(1, $dataArray[0]->oc_metric_sales_count);
        $this->assertEquals(2, $dataArray[1]->oc_metric_sales_count);
        $this->assertEquals(1, $dataArray[2]->oc_metric_sales_count);

        $this->assertEquals(3, $builder->getTotalRecords());
    }

    public function testMetricsFromAnotherTable()
    {
        $this->makeSalesData();

        $builder = ReportQueryBuilder::table('test_sales_products_data')
            ->dimension(new ReportDimension('product', 'test_sales_products_data.id', 'Product ID'))
            ->metrics([
                new ReportMetric('sales_total', 'total', 'Sales total', ReportMetric::AGGREGATE_SUM),
            ])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION, null, true))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'))
            ->onConfigureMetrics(function(Builder $query, ReportDimension $dimension, array $metrics) {
                if (ReportMetric::findMetricByCode($metrics, 'sales_total')) {
                    $query->leftJoin('test_sales_report_data', function($join) {
                        $join->on('product_id', '=', 'test_sales_products_data.id')
                            ->where('test_sales_report_data.completed', '=', 1);
                    });
                }
            });

        $query = $builder->toQuery();
        $dataArray = $query->get()->toArray();

        $this->assertCount(3, $dataArray);
        $this->assertTrue(property_exists($dataArray[0], 'oc_dimension'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_sales_total'));

        $this->assertEquals(1, $dataArray[0]->oc_dimension);
        $this->assertEquals(2, $dataArray[1]->oc_dimension);
        $this->assertEquals(3, $dataArray[2]->oc_dimension);

        $this->assertEquals(11, $dataArray[0]->oc_metric_sales_total);
        $this->assertEquals(44, $dataArray[1]->oc_metric_sales_total);
        $this->assertEquals(33, $dataArray[2]->oc_metric_sales_total);
    }

    public function testManualMetrics()
    {
        $this->makeSalesData();

        $salesDataJoinAdded = new SplObjectStorage();

        $builder = ReportQueryBuilder::table('test_sales_products_data')
            ->dimension(new ReportDimension('product', 'test_sales_products_data.id', 'Product ID'))
            ->metrics([
                new ReportMetric('completed_sales_total', 'total_completed', 'Completed sales total', ReportMetric::AGGREGATE_SUM),
                new ReportMetric('abandoned_sales_total', 'total_abandoned', 'Abandoned sales total', ReportMetric::AGGREGATE_SUM),
            ])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION, null, true))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'))
            ->onConfigureMetric(function(Builder $query, ReportMetric $metric, ReportDimension $dimension, array $metrics)
                use (&$salesDataJoinAdded)
            {
                $isCompletedSales = $metric->getCode() === 'completed_sales_total';
                $isAbandonedSales = $metric->getCode() === 'abandoned_sales_total';

                $joinAdded = $salesDataJoinAdded->contains($query);
                if (($isCompletedSales || $isAbandonedSales) && !$joinAdded) {
                    $query->join('test_sales_report_data as tsrd', 'tsrd.product_id', '=', 'test_sales_products_data.id');
                    $salesDataJoinAdded[$query] = true;
                }

                if ($isCompletedSales) {
                    $query->addSelect(
                        Db::raw('SUM(CASE WHEN tsrd.completed = 1 THEN tsrd.total ELSE 0 END) as oc_metric_completed_sales_total')
                    );
                    return true;
                }

                if ($isAbandonedSales) {
                    $query->addSelect(
                        Db::raw('SUM(CASE WHEN tsrd.completed = 0 THEN tsrd.total ELSE 0 END) as oc_metric_abandoned_sales_total')
                    );
                    return true;
                }
            });

        $query = $builder->toQuery();
        $dataArray = $query->get()->toArray();

        $this->assertCount(3, $dataArray);
        $this->assertTrue(property_exists($dataArray[0], 'oc_dimension'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_completed_sales_total'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_abandoned_sales_total'));

        $this->assertEquals(1, $dataArray[0]->oc_dimension);
        $this->assertEquals(2, $dataArray[1]->oc_dimension);
        $this->assertEquals(3, $dataArray[2]->oc_dimension);

        $this->assertEquals(11, $dataArray[0]->oc_metric_completed_sales_total);
        $this->assertEquals(44, $dataArray[1]->oc_metric_completed_sales_total);
        $this->assertEquals(33, $dataArray[2]->oc_metric_completed_sales_total);

        $this->assertEquals(11, $dataArray[0]->oc_metric_abandoned_sales_total);
        $this->assertEquals(22, $dataArray[1]->oc_metric_abandoned_sales_total);
        $this->assertEquals(0, $dataArray[2]->oc_metric_abandoned_sales_total);
        $this->assertEquals(3, $builder->getTotalRecords());
    }

    public function testDimensionFilterEquals()
    {
        $builder = $this->makeBuilderWithDimensionFields(
            [$this->makeDimensionFilter(ReportDimensionFilter::OPERATION_EQUALS, 1)]
        );
        $query = $builder->toQuery();
        $dataArray = $query->get()->toArray();

        $this->assertCount(1, $dataArray);
        $this->assertEquals(1, $dataArray[0]->oc_dimension);
        $this->assertEquals(1, $builder->getTotalRecords());
    }

    public function testDimensionFilterMoreOrEquals()
    {
        $builder = $this->makeBuilderWithDimensionFields(
            [$this->makeDimensionFilter(ReportDimensionFilter::OPERATION_MORE_OR_EQUALS, 2)]
        );
        $query = $builder->toQuery();
        $dataArray = $query->get()->toArray();

        $this->assertCount(2, $dataArray);
        $this->assertEquals(3, $dataArray[0]->oc_dimension);
        $this->assertEquals(2, $dataArray[1]->oc_dimension);
        $this->assertEquals(2, $builder->getTotalRecords());
    }

    public function testDimensionFilterLessOrEquals()
    {
        $builder = $this->makeBuilderWithDimensionFields(
            [$this->makeDimensionFilter(ReportDimensionFilter::OPERATION_LESS_OR_EQUALS, 2)]
        );
        $query = $builder->toQuery();
        $dataArray = $query->get()->toArray();

        $this->assertCount(2, $dataArray);
        $this->assertEquals(2, $dataArray[0]->oc_dimension);
        $this->assertEquals(1, $dataArray[1]->oc_dimension);
        $this->assertEquals(2, $builder->getTotalRecords());
    }

    public function testDimensionFilterMore()
    {
        $builder = $this->makeBuilderWithDimensionFields(
            [$this->makeDimensionFilter(ReportDimensionFilter::OPERATION_MORE, 2)]
        );
        $query = $builder->toQuery();
        $dataArray = $query->get()->toArray();

        $this->assertCount(1, $dataArray);
        $this->assertEquals(3, $dataArray[0]->oc_dimension);
        $this->assertEquals(1, $builder->getTotalRecords());
    }

    public function testDimensionFilterLess()
    {
        $builder = $this->makeBuilderWithDimensionFields(
            [$this->makeDimensionFilter(ReportDimensionFilter::OPERATION_LESS, 2)]
        );
        $query = $builder->toQuery();
        $dataArray = $query->get()->toArray();

        $this->assertCount(1, $dataArray);
        $this->assertEquals(1, $dataArray[0]->oc_dimension);
        $this->assertEquals(1, $builder->getTotalRecords());
    }

    public function testDimensionFilterOneOf()
    {
        $builder = $this->makeBuilderWithDimensionFields(
            [$this->makeDimensionFilter(ReportDimensionFilter::OPERATION_ONE_OF, [1, 3])]
        );
        $query = $builder->toQuery();

        $dataArray = $query->get()->toArray();

        $this->assertCount(2, $dataArray);
        $this->assertEquals(3, $dataArray[0]->oc_dimension);
        $this->assertEquals(1, $dataArray[1]->oc_dimension);
        $this->assertEquals(2, $builder->getTotalRecords());
    }

    public function testDimensionFieldFilterStringStartsWith()
    {
        $builder = $this->makeBuilderWithDimensionFields(
            [$this->makeDimensionFieldFilter(ReportDimensionFilter::OPERATION_STARTS_WITH, 'Product 1 - hood')]
        );
        $query = $builder->toQuery();

        $dataArray = $query->get()->toArray();

        $this->assertCount(1, $dataArray);
        $this->assertEquals(1, $dataArray[0]->oc_dimension);
        $this->assertEquals(1, $builder->getTotalRecords());
    }

    public function testDimensionFieldFilterStringIncludes()
    {
        $builder = $this->makeBuilderWithDimensionFields(
            [$this->makeDimensionFieldFilter(ReportDimensionFilter::OPERATION_STRING_INCLUDES, 't-shirt')]
        );
        $query = $builder->toQuery();

        $dataArray = $query->get()->toArray();

        $this->assertCount(1, $dataArray);
        $this->assertEquals(2, $dataArray[0]->oc_dimension);
        $this->assertEquals(1, $builder->getTotalRecords());
    }

    public function testWhenConditional()
    {
        Db::table('test_report_data')->insert($this->dailyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');
        $metric = new ReportMetric('max_int', 'int_metric', 'Metric 1', ReportMetric::AGGREGATE_MAX);

        // Test when condition is true
        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([$metric])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'))
            ->when(true, fn($b) => $b->limit(1));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(1, $dataArray);

        // Test when condition is false
        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([$metric])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'))
            ->when(false, fn($b) => $b->limit(1));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);
    }

    public function testAddMetric()
    {
        Db::table('test_report_data')->insert($this->dailyData);

        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->addMetric(new ReportMetric('max_int', 'int_metric', 'Max integer', ReportMetric::AGGREGATE_MAX))
            ->addMetric(new ReportMetric('min_int', 'int_metric', 'Min integer', ReportMetric::AGGREGATE_MIN))
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'));

        $dataArray = $builder->toQuery()->get()->toArray();
        $this->assertCount(2, $dataArray);

        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_max_int'));
        $this->assertTrue(property_exists($dataArray[0], 'oc_metric_min_int'));

        $this->assertEquals(2, $dataArray[0]->oc_metric_max_int);
        $this->assertEquals(1, $dataArray[0]->oc_metric_min_int);
    }

    public function testToSql()
    {
        $dimension = new ReportDimension(ReportDimension::CODE_DATE, 'date_dimension', 'Date');
        $metric = new ReportMetric('max_int', 'int_metric', 'Metric 1', ReportMetric::AGGREGATE_MAX);

        $builder = ReportQueryBuilder::table('test_report_data')
            ->dimension($dimension)
            ->metrics([$metric])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION))
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'));

        $sql = $builder->toSql();

        $this->assertIsString($sql);
        $this->assertStringContainsString('test_report_data', $sql);
        $this->assertStringContainsString('max', $sql);
    }

    private function makeSalesData()
    {
        Schema::dropIfExists('test_sales_report_data');
        Schema::create('test_sales_report_data', function($table)
        {
            $table->increments('id');
            $table->integer('product_id');
            $table->date('date_dimension');
            $table->boolean('completed');
            $table->decimal('total',  10, 2);
        });

        Schema::dropIfExists('test_sales_products_data');
        Schema::create('test_sales_products_data', function($table)
        {
            $table->increments('id');
            $table->string('name');
            $table->string('sku');
            $table->decimal('price',  10, 2);
        });

        Db::table('test_sales_products_data')->insert([
            ['name' => 'Product 1 - hoodie', 'sku' => 'P1', 'price' => 10, 'id' => 1],
            ['name' => 'Product 2 - t-shirt', 'sku' => 'P2', 'price' => 20, 'id' => 2],
            ['name' => 'Product 3 - pants', 'sku' => 'P3', 'price' => 30, 'id' => 3]
        ]);

        Db::table('test_sales_report_data')->insert([
            ['product_id' => 1, 'date_dimension' => '2020-01-01', 'total' => 11, 'completed' => 1],
            ['product_id' => 2, 'date_dimension' => '2020-01-02', 'total' => 22, 'completed' => 1],
            ['product_id' => 2, 'date_dimension' => '2020-01-02', 'total' => 22, 'completed' => 1],
            ['product_id' => 3, 'date_dimension' => '2020-01-03', 'total' => 33, 'completed' => 1],
            ['product_id' => 1, 'date_dimension' => '2020-01-04', 'total' => 11, 'completed' => 0],
            ['product_id' => 2, 'date_dimension' => '2020-01-04', 'total' => 22, 'completed' => 0]
        ]);
    }

    private function makeBuilderWithDimensionFields(array $filters)
    {
        $this->makeSalesData();

        $dimension = new ReportDimension('product', 'product_id', 'Product');
        $dimension->addDimensionField(
            new ReportDimensionField('oc_field_product_name', 'Product name', null, true, false),
            new ReportDimensionField('oc_field_product_sku', 'Product SKU', null, true, false),
        );

        return ReportQueryBuilder::table('test_sales_report_data')
            ->dimension($dimension)
            ->metrics([
                new ReportMetric('sales_total', 'total', 'Sales total', ReportMetric::AGGREGATE_SUM),
                new ReportMetric('sales_count', 'product_id', 'Quantity', ReportMetric::AGGREGATE_COUNT)
            ])
            ->orderBy(new ReportDataOrderRule(ReportDataOrderRule::ATTR_TYPE_DIMENSION_FIELD, 'oc_field_product_name', false))
            ->filters($filters)
            ->groupByDay()
            ->dateRange(new Carbon('2023-01-01'), new Carbon('2023-01-31'))
            ->onConfigureQuery(function(Builder $query, ReportDimension $dimension, array $metrics) {
                // The report query builder doesn't load dimension fields
                // automatically, so we need to manually add them.
                $query->join(
                    'test_sales_products_data',
                    'test_sales_products_data.id',
                    '=',
                    'test_sales_report_data.product_id');

                $query->addSelect([
                    'test_sales_products_data.name as oc_field_product_name',
                    'test_sales_products_data.sku as oc_field_product_code'
                ]);

                $query->where('test_sales_report_data.completed', true);
            });
    }

    private function makeDimensionFilter(string $operation, string|array|int|float|bool $value)
    {
        return new ReportDimensionFilter(
            ReportDimensionFilter::ATTR_TYPE_DIMENSION,
            null,
            $operation,
            $value
        );
    }

    private function makeDimensionFieldFilter(string $operation, string|array|int|float|bool $value)
    {
        return new ReportDimensionFilter(
            ReportDimensionFilter::ATTR_TYPE_DIMENSION_FIELD,
            'oc_field_product_name',
            $operation,
            $value
        );
    }
}
