<?php

use Dashboard\Classes\TrafficLogger;
use Dashboard\Models\TrafficStatisticsPageview;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Defer\DeferredCallbackCollection;
use October\Rain\Database\Schema\Blueprint;

class TrafficLoggerPersistenceTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Schema::create('dashboard_traffic_stats_pageviews', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->dateTime('ev_datetime')->nullable();
            $table->date('ev_date')->nullable();
            $table->string('ev_year_month_day', 10)->nullable();
            $table->string('ev_year_month', 10)->nullable();
            $table->string('ev_year_quarter', 10)->nullable();
            $table->string('ev_year_week', 10)->nullable();
            $table->string('ev_year', 10)->nullable();
            $table->timestamp('ev_timestamp')->useCurrent();
            $table->boolean('user_authenticated')->nullable();
            $table->string('client_id', 64)->nullable();
            $table->boolean('first_time_visit')->default(false);
            $table->string('user_agent')->nullable();
            $table->string('page_path')->nullable();
            $table->string('ip')->nullable();
            $table->string('city', 64)->nullable();
            $table->string('country', 64)->nullable();
            $table->string('referral_domain')->nullable();
            $table->integer('site_id')->nullable();
        });

        $this->app['request']->headers->set('User-Agent', 'Mozilla/5.0 (test)');
    }

    public function tearDown(): void
    {
        Schema::dropIfExists('dashboard_traffic_stats_pageviews');

        parent::tearDown();
    }

    public function testPageviewIsWrittenAfterTheResponse()
    {
        $logger = new TrafficLogger;
        self::getProtectedProperty($logger, 'settingModel')->traffic_stats_enabled = true;

        $logger->logPageview();

        // Nothing has been written while the request is still being handled
        $this->assertSame(0, TrafficStatisticsPageview::count());

        // The client cookie is already on this response
        $queued = array_filter(Cookie::getQueuedCookies(), fn ($cookie) => $cookie->getName() === 'oc_clid');
        $this->assertCount(1, $queued);

        // Deferred callbacks run once the response has been sent
        $this->assertCount(1, $this->app->make(DeferredCallbackCollection::class));
        $this->app->make(DeferredCallbackCollection::class)->invoke();

        $this->assertSame(1, TrafficStatisticsPageview::count());
        $this->assertSame('/', TrafficStatisticsPageview::first()->page_path);
    }

    public function testFilteredRequestIsNotWritten()
    {
        $this->app['request']->setMethod('POST');

        $logger = new TrafficLogger;
        self::getProtectedProperty($logger, 'settingModel')->traffic_stats_enabled = true;

        $logger->logPageview();

        $this->assertCount(0, $this->app->make(DeferredCallbackCollection::class));
        $this->app->make(DeferredCallbackCollection::class)->invoke();

        $this->assertSame(0, TrafficStatisticsPageview::count());
    }
}
