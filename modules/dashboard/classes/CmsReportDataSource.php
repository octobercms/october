<?php namespace Dashboard\Classes;

use Db;
use Site;
use Dashboard\Classes\ReportDataSourceBase;
use Dashboard\Classes\ReportDataOrderRule;
use Dashboard\Classes\ReportDataQueryBuilder;
use Dashboard\Classes\ReportDimension;
use Dashboard\Classes\ReportDataPaginationParams;
use Dashboard\Classes\ReportFetchData;
use Dashboard\Classes\ReportFetchDataResult;
use Dashboard\Classes\ReportMetric;
use Illuminate\Database\Query\Builder;
use Carbon\Carbon;

/**
 * CmsReportDataSource providing information about the website traffic.
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsReportDataSource extends ReportDataSourceBase
{
    const DIMENSION_DATE = 'date';
    const DIMENSION_CITY = 'city';
    const DIMENSION_PAGE_PATH = 'page_path';
    const DIMENSION_REFERRAL_DOMAIN = 'referral_domain';
    const METRIC_PAGEVIEWS = 'pageviews';
    const METRIC_UNIQUE_VISITORS = 'unique_visitors';

    /**
     * __construct the data source
     */
    public function __construct()
    {
        $this->registerDimension(new ReportDimension(
            ReportDimension::CODE_DATE,
            'ev_date',
            "Date"
        ))->setDateIntervalGroupingFields(
            'ev_year_week',
            'ev_year_month',
            'ev_year_quarter',
            'ev_year'
        );

        /*
        $this->registerDimension(new ReportDimension(
            CmsReportDataSource::DIMENSION_CITY,
            'city',
            "City"
        ))->addDimensionField(new ReportDimensionField(
            'oc_field_country',
            "Country",
            'country',
            true,
            true
        ));
        */

        $this->registerDimension(new ReportDimension(
            CmsReportDataSource::DIMENSION_PAGE_PATH,
            'page_path',
            "Page Path"
        ));

        $this->registerDimension(new ReportDimension(
            CmsReportDataSource::DIMENSION_REFERRAL_DOMAIN,
            'referral_domain',
            "Referral Domain"
        ));

        $this->registerMetric(new ReportMetric(
            self::METRIC_PAGEVIEWS,
            'id',
            "Pageviews",
            ReportMetric::AGGREGATE_COUNT
        ));

        $this->registerMetric(new ReportMetric(
            self::METRIC_UNIQUE_VISITORS,
            'client_id',
            "Unique Visitors",
            ReportMetric::AGGREGATE_COUNT_DISTINCT
        ));
    }

    /**
     * fetchData
     */
    protected function fetchData(ReportFetchData $data): ReportFetchDataResult
    {
        $reportQueryBuilder = ReportDataQueryBuilder::fromFetchData(
            $data,
            'dashboard_traffic_stats_pageviews',
            'ev_date',
            'ev_timestamp'
        );

        $reportQueryBuilder->onConfigureQuery(
            function(Builder $query, ReportDimension $dimension, array $metrics) {
                if ($dimension->getCode() === CmsReportDataSource::DIMENSION_CITY) {
                    $query->addSelect([
                        Db::raw('max(dashboard_traffic_stats_pageviews.country) as oc_field_country')
                    ]);
                }

                if (Site::hasFeature('dashboard_traffic_statistics')) {
                    $siteId = Site::getEditSite()?->id;
                    if ($siteId) {
                        $query->where('dashboard_traffic_stats_pageviews.site_id', $siteId);
                    }
                }
            }
        );

        return $reportQueryBuilder->getFetchDataResult($data->metricsConfiguration);
    }
}
