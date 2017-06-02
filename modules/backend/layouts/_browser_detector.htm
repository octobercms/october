<?php

/**
 * PHP CSS Browser Selector v0.0.1
 * Bastian Allgeier (http://bastian-allgeier.de)
 * http://bastian-allgeier.de/css_browser_selector
 * License: http://creativecommons.org/licenses/by/2.5/
 * Credits: This is a php port from Rafael Lima's original Javascript CSS Browser Selector: http://rafael.adm.br/css_browser_selector
 */

$ua = isset($_SERVER['HTTP_USER_AGENT']) ? strtolower($_SERVER['HTTP_USER_AGENT']) : null;
if (!$ua)
    return;

$g = 'gecko';
$w = 'webkit';
$s = 'safari';
$m = 'mobile';
$b = array();

// browser
if(!preg_match('/opera|webtv/i', $ua) && preg_match('/msie\s(\d)/', $ua, $array)) {
    $b[] = 'ie ie' . $array[1];
} else if(strstr($ua, 'firefox/2')) {
    $b[] = $g . ' ff2';
} else if(strstr($ua, 'firefox/3.5')) {
    $b[] = $g . ' ff3 ff3_5';
} else if(strstr($ua, 'firefox/3')) {
    $b[] = $g . ' ff3';
} else if(strstr($ua, 'gecko/')) {
    $b[] = $g;
} else if(preg_match('/opera(\s|\/)(\d+)/', $ua, $array)) {
    $b[] = 'opera opera' . $array[2];
} else if(strstr($ua, 'konqueror')) {
    $b[] = 'konqueror';
} else if(strstr($ua, 'chrome')) {
    $b[] = $w . ' ' . $s . ' chrome';
} else if(strstr($ua, 'iron')) {
    $b[] = $w . ' ' . $s . ' iron';
} else if(strstr($ua, 'applewebkit/')) {
    $b[] = (preg_match('/version\/(\d+)/i', $ua, $array)) ? $w . ' ' . $s . ' ' . $s . $array[1] : $w . ' ' . $s;
} else if(strstr($ua, 'mozilla/')) {
    $b[] = $g;
}

// platform
if(strstr($ua, 'j2me')) {
    $b[] = $m . ' j2me';
} else if(strstr($ua, 'iphone')) {
    $b[] = $m . ' iphone';
} else if(strstr($ua, 'ipod')) {
    $b[] = $m . ' ipod';
} else if(strstr($ua, 'ipad')) {
    $b[] = $m . ' ipad';
} else if(strstr($ua, 'android')) {
    $b[] = $m . ' android';
} else if(strstr($ua, 'blackberry')) {
    $b[] = $m . ' blackberry';
} else if(strstr($ua, 'mac')) {
    $b[] = 'mac';
} else if(strstr($ua, 'darwin')) {
    $b[] = 'mac';
} else if(strstr($ua, 'webtv')) {
    $b[] = 'webtv';
} else if(strstr($ua, 'win')) {
    $b[] = 'win';
} else if(strstr($ua, 'freebsd')) {
    $b[] = 'freebsd';
} else if(strstr($ua, 'x11') || strstr($ua, 'linux')) {
    $b[] = 'linux';
}

echo join(' ', $b);
