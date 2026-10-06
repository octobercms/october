<?php

use Dashboard\Classes\ReportFetchData;
use Dashboard\Classes\VueReportWidgetBase;

/**
 * SalesVueWidgetFixture is a Vue report widget used by the dashboard tests.
 */
class SalesVueWidgetFixture extends VueReportWidgetBase
{
    /**
     * getData returns no data for this fixture.
     */
    public function getData(ReportFetchData $data): mixed
    {
        return null;
    }
}
