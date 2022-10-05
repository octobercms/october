<?php namespace System\Handlers;

use View;
use Illuminate\Routing\Controller as ControllerBase;

class Installer extends ControllerBase
{
    /**
     * Route: /
     */
    public function placeholder()
    {
        return View::make('system::placeholder');
    }
}
