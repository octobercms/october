<?php namespace Larry\Api\Controllers;

use Backend\Classes\Controller;
use BackendMenu;

class FooController extends Controller
{
    public $implement = [    ];

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        return 'bar (index)';
    }

    public function store()
    {
        return 'bar (store)';
    }
}
