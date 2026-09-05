<?php

use System\Classes\ErrorHandler;
use October\Rain\Exception\AjaxException;
use October\Rain\Exception\NotFoundException;
use October\Rain\Exception\ForbiddenException;
use October\Rain\Exception\ValidationException;
use October\Rain\Exception\ApplicationException;

class ExceptionHandlerTest extends TestCase
{
    /**
     * @var array beforeReportExceptions captured from the exception.beforeReport event
     */
    protected $beforeReportExceptions = [];

    /**
     * @var array reportedExceptions captured from the exception.report event
     */
    protected $reportedExceptions = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->beforeReportExceptions = [];
        $this->reportedExceptions = [];

        Event::listen('exception.beforeReport', function ($exception) {
            $this->beforeReportExceptions[] = $exception;
        });

        Event::listen('exception.report', function ($exception) {
            $this->reportedExceptions[] = $exception;
        });
    }

    public function testReportsUnintendedException()
    {
        report(new RuntimeException('Something broke'));

        $this->assertCount(1, $this->beforeReportExceptions);
        $this->assertCount(1, $this->reportedExceptions);
        $this->assertInstanceOf(RuntimeException::class, $this->reportedExceptions[0]);
    }

    public function testLogsUnintendedExceptionOnce()
    {
        $logged = [];
        Event::listen(\Illuminate\Log\Events\MessageLogged::class, function ($event) use (&$logged) {
            $logged[] = $event->message;
        });

        report(new RuntimeException('Log this once'));

        $this->assertCount(1, $logged);
        $this->assertStringContainsString('Log this once', $logged[0]);
    }

    public function testSkipsReportEventForIntendedExceptions()
    {
        report(new ApplicationException('Safe error'));
        report(new ForbiddenException);
        report(new NotFoundException);
        report(new AjaxException(['result' => 'value']));
        report(new ValidationException(['field' => 'Invalid value']));

        // The veto hook still fires for every exception
        $this->assertCount(5, $this->beforeReportExceptions);

        // The report event only fires for reported exceptions
        $this->assertCount(0, $this->reportedExceptions);
    }

    public function testSkipsLoggingForIntendedExceptions()
    {
        $logged = [];
        Event::listen(\Illuminate\Log\Events\MessageLogged::class, function ($event) use (&$logged) {
            $logged[] = $event->message;
        });

        report(new ApplicationException('Safe error'));
        report(new ForbiddenException);
        report(new NotFoundException);

        $this->assertCount(0, $logged);
    }

    public function testBeforeReportEventCanVetoReporting()
    {
        Event::listen('exception.beforeReport', function ($exception) {
            if ($exception instanceof RuntimeException) {
                return false;
            }
        });

        report(new RuntimeException('Vetoed'));

        $this->assertCount(0, $this->reportedExceptions);
    }

    public function testHonorsExceptionMapRegisteredInBeforeReport()
    {
        // Mirrors System\Classes\ErrorHandler::beforeReport registering maps lazily
        Event::listen('exception.beforeReport', function ($exception) {
            App::make(\Illuminate\Contracts\Debug\ExceptionHandler::class)->map(
                InvalidArgumentException::class,
                fn($ex) => new ApplicationException($ex->getMessage())
            );
        });

        report(new InvalidArgumentException('Mapped to a safe exception'));

        $this->assertCount(1, $this->beforeReportExceptions);
        $this->assertCount(0, $this->reportedExceptions);
    }

    public function testSafeMessageContract()
    {
        $this->assertEquals('Custom problem', (new ApplicationException('Custom problem'))->getSafeMessage());
        $this->assertEquals('An Error Occurred', (new ApplicationException)->getSafeMessage());
        $this->assertEquals('No entry', (new ForbiddenException('No entry'))->getSafeMessage());
        $this->assertEquals('Access Denied', (new ForbiddenException)->getSafeMessage());
        $this->assertEquals('Missing record', (new NotFoundException('Missing record'))->getSafeMessage());
        $this->assertEquals('Not Found', (new NotFoundException)->getSafeMessage());
    }

    public function testDetailedMessageUsesSafeMessageContract()
    {
        Config::set('app.debug', false);

        $this->assertEquals('Safe error', ErrorHandler::getDetailedMessage(new ApplicationException('Safe error')));
        $this->assertEquals('Access Denied', ErrorHandler::getDetailedMessage(new ForbiddenException));
        $this->assertEquals('Not Found', ErrorHandler::getDetailedMessage(new NotFoundException));
    }

    public function testDetailedMessageMasksUnintendedExceptions()
    {
        Config::set('app.debug', false);

        $this->assertEquals(
            Lang::get('system::lang.page.custom_error.help'),
            ErrorHandler::getDetailedMessage(new RuntimeException('Sensitive internals'))
        );
    }
}
