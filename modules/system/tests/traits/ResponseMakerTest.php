<?php

use Larajax\Classes\AjaxResponse;

class ResponseMakerStub
{
    use System\Traits\ResponseMaker;
}

class ResponseMakerTest extends TestCase
{
    public function testDispatchBrowserEventDoesNotWaitForBrowser()
    {
        $stub = new ResponseMakerStub;
        $stub->dispatchBrowserEvent('app:password-confirmed');

        $response = $stub->makeResponse(new AjaxResponse);
        $content = $response->toResponse(request())->getOriginalContent();

        $this->assertSame([
            [
                'op' => 'dispatch',
                'event' => 'app:password-confirmed',
                'detail' => null,
                'async' => false
            ]
        ], $content['__ajax']['ops']);
    }

    public function testDispatchBrowserEventAsyncWaitsForBrowser()
    {
        $stub = new ResponseMakerStub;
        $stub->dispatchBrowserEventAsync('app:confirm', ['message' => 'Continue?']);

        $response = $stub->makeResponse(new AjaxResponse);
        $content = $response->toResponse(request())->getOriginalContent();

        $this->assertSame([
            [
                'op' => 'dispatch',
                'event' => 'app:confirm',
                'detail' => ['message' => 'Continue?'],
                'async' => true
            ]
        ], $content['__ajax']['ops']);
    }
}
