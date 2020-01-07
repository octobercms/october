<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Decompile backend assets
    |--------------------------------------------------------------------------
    |
    | Enabling this will load all individual backend asset files, instead of
    | loading the compiled asset files generated by `october:util compile
    | assets`. This is useful only for development purposes, and should not be
    | enabled in production. Please note that enabling this will make the
    | Backend load a LOT of individual asset files.
    |
    | true  - allow decompiled backend assets
    |
    | false - use compiled backend assets (default)
    |
    */

    'decompileBackendAssets' => false,
    
    /*
    |--------------------------------------------------------------------------
    | Limit event log summary
    |--------------------------------------------------------------------------
    |
    | Enabling this will limit the event log summary to a length of 100
    | characters.
    |
    | true  - limits the summary to 100 characters
    |
    | false - displays the whole first sentence summary
    |
    */

    'limitEventLogSummary' => false,

];
