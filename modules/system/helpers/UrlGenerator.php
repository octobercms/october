<?php namespace System\Helpers;

use Illuminate\Routing\UrlGenerator as BaseUrlGenerator;

class UrlGenerator extends BaseUrlGenerator
{
    public function to($path, $extra = [], $secure = null) 
    {
        $url = parent::to($path, $extra, $secure);
        
        $url = preg_replace('/([^:])(\/{2,})/', '$1/', $url);

        return $url;
    }
}