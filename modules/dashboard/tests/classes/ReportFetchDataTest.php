<?php

use Carbon\Carbon;
use Dashboard\Classes\ReportFetchData;

class ReportFetchDataTest extends TestCase
{
    public function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function testDashboardIntervalUsesSubmittedDates(): void
    {
        [$dateStart, $dateEnd, $startTimestamp] = $this->getRequestedDateInterval(
            '2026-05-01',
            '2026-05-21'
        );

        $this->assertSame('2026-05-01', $dateStart->toDateString());
        $this->assertSame('2026-05-21', $dateEnd->toDateString());
        $this->assertSame('00:00:00', $dateStart->toTimeString());
        $this->assertSame('00:00:00', $dateEnd->toTimeString());
        $this->assertNull($startTimestamp);
    }

    public function testDashboardIntervalFallsBackWhenDatesAreMissing(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-06-03 12:00:00'));

        [$dateStart, $dateEnd, $startTimestamp] = $this->getRequestedDateInterval(null, null);

        $this->assertSame('2026-06-01', $dateStart->toDateString());
        $this->assertSame('2026-06-03', $dateEnd->toDateString());
        $this->assertNull($startTimestamp);
    }

    public function testDashboardIntervalNormalizesReversedDates(): void
    {
        [$dateStart, $dateEnd] = $this->getRequestedDateInterval(
            '2026-05-21',
            '2026-05-01'
        );

        $this->assertSame('2026-05-01', $dateStart->toDateString());
        $this->assertSame('2026-05-21', $dateEnd->toDateString());
    }

    protected function getRequestedDateInterval(?string $dateStart, ?string $dateEnd): array
    {
        $fetchData = new ReportFetchData;

        return static::callProtectedMethod($fetchData, 'getRequestedDateInterval', [$dateStart, $dateEnd]);
    }
}
