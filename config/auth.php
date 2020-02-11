<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Throttle Failed Authentication Attempts
    |--------------------------------------------------------------------------
    |
    | Setting to enable/disable the AuthManager's throttling mechanism.
    |
     */
    'useThrottle' => true,

    /*
    |--------------------------------------------------------------------------
    | Failed Authentication Attempt Limit
    |--------------------------------------------------------------------------
    |
    | Number of failed attemps allowed while trying to authenticate a user.
    |
     */
    'attemptLimit' => 5,

    /*
    |--------------------------------------------------------------------------
    | Suspension Time
    |--------------------------------------------------------------------------
    |
    | Time for which Authentications are rejected after $attemptLimit has been
    | reached.
    |
     */
    'suspensionTime' => 15,

];
