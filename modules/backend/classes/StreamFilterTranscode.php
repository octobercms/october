<?php namespace Backend\Classes;

use php_user_filter;

// Register the class for it to be usable by the CSV Lib
stream_filter_register(StreamFilterTranscode::FILTER_NAME . "*", StreamFilterTranscode::class);

/**
 * A universal transcode stream filter.
 * Used by the backend import model to convert source file from one encoding to another.
 * The system must support both source and target encoding encoding.
 *
 * @credits https://github.com/thephpleague/csv/blob/master/examples/lib/FilterTranscode.php
 * @package october\backend
 */
class StreamFilterTranscode extends php_user_filter
{

    const FILTER_NAME = 'convert.transcode.';

    private $encoding_from = 'auto';

    private $encoding_to;


    public function onCreate()
    {
        if (strpos($this->filtername, self::FILTER_NAME) !== 0) {
            return false;
        }

        $params = substr($this->filtername, strlen(self::FILTER_NAME));
        if ( ! preg_match('/^([-\w]+)(:([-\w]+))?$/', $params, $matches)) {
            return false;
        }

        if (isset( $matches[1] )) {
            $this->encoding_from = $matches[1];
        }

        $this->encoding_to = mb_internal_encoding();
        if (isset( $matches[3] )) {
            $this->encoding_to = $matches[3];
        }

        $this->params['locale'] = setlocale(LC_CTYPE, '0');
        if (stripos($this->params['locale'], 'UTF-8') === false) {
            setlocale(LC_CTYPE, 'en_US.UTF-8');
        }

        return true;
    }


    public function onClose()
    {
        setlocale(LC_CTYPE, $this->params['locale']);
    }


    public function filter($in, $out, &$consumed, $closing)
    {
        while ($res = stream_bucket_make_writeable($in)) {
            $res->data = @mb_convert_encoding($res->data, $this->encoding_to, $this->encoding_from);
            $consumed += $res->datalen;
            stream_bucket_append($out, $res);
        }

        return PSFS_PASS_ON;
    }
}