<?php namespace Backend\Behaviors\ImportExportController;

use php_user_filter;

stream_filter_register(TranscodeFilter::FILTER_NAME . "*", TranscodeFilter::class);

/**
 * Transcode stream filter.
 *
 * Convert CSV source files from one encoding to another.
 */
class TranscodeFilter extends php_user_filter
{
    const FILTER_NAME = 'october.csv.transcode.';

    protected $encodingFrom = 'auto';

    protected $encodingTo;

    public function filter($in, $out, &$consumed, $closing)
    {
        while ($resource = stream_bucket_make_writeable($in)) {
            if (in_array($this->encodingFrom, mb_list_encodings())) {
                $resource->data = @mb_convert_encoding(
                    $resource->data,
                    $this->encodingTo,
                    $this->encodingFrom
                );
            } else {
                $resource->data = @iconv(
                    $this->encodingFrom,
                    $this->encodingTo,
                    $resource->data
                );
            }

            $consumed += $resource->datalen;

            stream_bucket_append($out, $resource);
        }

        return PSFS_PASS_ON;
    }

    public function onCreate()
    {
        if (strpos($this->filtername, self::FILTER_NAME) !== 0) {
            return false;
        }

        $params = substr($this->filtername, strlen(self::FILTER_NAME));
        if (!preg_match('/^([-\w]+)(:([-\w]+))?$/', $params, $matches)) {
            return false;
        }

        if (isset($matches[1])) {
            $this->encodingFrom = $matches[1];
        }

        $this->encodingTo = mb_internal_encoding();
        if (isset($matches[3])) {
            $this->encodingTo = $matches[3];
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
}
