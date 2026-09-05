<?php

use Dashboard\Classes\TrafficLogger;

class TrafficLoggerTest extends TestCase
{
    protected function loggerWithRetention($value): TrafficLogger
    {
        $logger = new TrafficLogger;
        self::getProtectedProperty($logger, 'settingModel')->traffic_stats_retention = $value;

        return $logger;
    }

    public function testRetentionMonthsFromSettingsForm()
    {
        // The settings form stores the number field as a string
        $this->assertSame(12, $this->loggerWithRetention('12')->getRetentionMonths());
        $this->assertSame(12, $this->loggerWithRetention(12)->getRetentionMonths());
    }

    public function testRetentionMonthsIndefinite()
    {
        $this->assertNull($this->loggerWithRetention('')->getRetentionMonths());
        $this->assertNull($this->loggerWithRetention('0')->getRetentionMonths());
        $this->assertNull($this->loggerWithRetention(0)->getRetentionMonths());
        $this->assertNull($this->loggerWithRetention(null)->getRetentionMonths());
        $this->assertNull($this->loggerWithRetention('abc')->getRetentionMonths());
    }
}
