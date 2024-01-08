<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Time to Live for Assets
    |--------------------------------------------------------------------------
    |
    | Specifies the cache time-to-live, in minutes. The default value is 10.
    | The cache invalidates automatically when Library items are added,
    | updated or deleted.
    |
    */

    'item_cache_ttl' => 10,

   /*
    |--------------------------------------------------------------------------
    | Automatically Rename Filenames
    |--------------------------------------------------------------------------
    |
    | When a media file is uploaded, automatically transform its filename to
    | something consistent. The "slug" mode will slug the file name for all
    | uploads.
    |
    | Supported: "null", "slug"
    |
    */

    'auto_rename' => null,

   /*
    |--------------------------------------------------------------------------
    | Clean Vector Files
    |--------------------------------------------------------------------------
    |
    | When a vector file (SVG) file is uploaded, automatically process its
    | contents to remove scripts and other potentially dangerous content.
    |
    */

    'clean_vectors' => true,

    /*
    |--------------------------------------------------------------------------
    | Ignored Files and Patterns
    |--------------------------------------------------------------------------
    |
    | The media manager wil ignore file names and patterns specified here
    |
    */

    'ignore_files' => ['.svn', '.git', '.DS_Store', '.AppleDouble'],

    'ignore_patterns' => ['^\..*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Extensions
    |--------------------------------------------------------------------------
    |
    | Only allow the following extensions to be uploaded and stored.
    |
    */

    'default_extensions' => ['jpg', 'jpeg', 'bmp', 'png', 'webp', 'gif', 'svg', 'js', 'map', 'ico', 'css', 'less', 'scss', 'ics', 'odt', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'swf', 'txt', 'ods', 'xls', 'xlsx', 'eot', 'woff', 'woff2', 'ttf', 'flv', 'wmv', 'mp3', 'ogg', 'wav', 'avi', 'mov', 'mp4', 'mpeg', 'webm', 'mkv', 'rar', 'zip'],

    /*
    |--------------------------------------------------------------------------
    | Image Extensions
    |--------------------------------------------------------------------------
    |
    | File extensions corresponding to the Image document type
    |
    */

    'image_extensions' => ['jpg', 'jpeg', 'bmp', 'png', 'webp', 'gif', 'svg'],

    /*
    |--------------------------------------------------------------------------
    | Video Extensions
    |--------------------------------------------------------------------------
    |
    | File extensions corresponding to the Video document type
    |
    */

    'video_extensions' => ['mp4', 'avi', 'mov', 'mpg', 'mpeg', 'mkv', 'webm'],

    /*
    |--------------------------------------------------------------------------
    | Audio Extensions
    |--------------------------------------------------------------------------
    |
    | File extensions corresponding to the Audio document type
    |
    */

    'audio_extensions' => ['mp3', 'wav', 'wma', 'm4a', 'ogg'],

];
