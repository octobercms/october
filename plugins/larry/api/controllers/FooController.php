<?php namespace Larry\Api\Controllers;

use Request;
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
        $authorization = Request::header('Authorization');

        $tokenParts = explode(' ', $authorization);

        if ($tokenParts[0] != 'Basic') {
            return 'Invalid token';
        }

        $emailPassword = explode(':', base64_decode($tokenParts[1]));

        $email = $emailPassword[0];
        $password = $emailPassword[1];

        return 'Hello ' . $email . '! Your password is ' . $password;
    }

    public function store()
    {
        return 'bar (store)';
    }

    public function auth()
    {
        return 'bar (auth)';
    }
}
