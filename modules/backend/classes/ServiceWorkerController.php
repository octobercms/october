<?php namespace Backend\Classes;

use File;
use Backend;
use Response;
use Illuminate\Routing\Controller as ControllerBase;

/**
 * ServiceWorkerController serves the backend service worker script through PHP
 * so the response can carry the Service-Worker-Allowed header, widening the
 * worker's scope to the entire backend.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ServiceWorkerController extends ControllerBase
{
    /**
     * index serves the worker script
     */
    public function index()
    {
        $contents = File::get(base_path('modules/backend/assets/js/service-worker.js'));

        return Response::make($contents, 200, [
            'Content-Type' => 'application/javascript; charset=utf-8',
            'Service-Worker-Allowed' => Backend::baseUrl() . '/',
        ]);
    }
}
