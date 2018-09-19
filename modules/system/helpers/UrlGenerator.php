<?php namespace System\Helpers;

use Illuminate\Routing\UrlGenerator as BaseUrlGenerator;

class UrlGenerator extends BaseUrlGenerator
{
    public function to($path, $extra = [], $secure = null) 
    {
        $url = parent::to($path, $extra, $secure);
        
        // for systems that don't use / for a directorry seperator
        // and coders that re-use a part of a path that has a windows
        // directory for example(results of glob, etc..)
        if(DIRECTORY_SEPARATOR !== '/') {       
            $url = str_replace(DIRECTORY_SEPARATOR, '/', $path);
        }
        
        $url = preg_replace('/([^:])(\/{2,})/', '$1/', $url);
        
        return $url;
    }
}