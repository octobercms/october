<?php namespace System\Classes;

use Url;
use Lang;
use Http;
use Config;
use ApplicationException;
use Exception;

class UpdateManager
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * Requests details about a project based on its identifier.
     * @param  string $projectId
     * @return array
     */
    public function requestProjectDetails($projectId)
    {
        return $this->requestServerData('project/detail', ['id' => $projectId]);
    }

    /**
     * getComposerUrl returns the endpoint for composer
     */
    public function getComposerUrl(bool $withProtocol = true): string
    {
        $gateway = env('APP_COMPOSER_GATEWAY', Config::get('system.composer_gateway', 'gateway.octobercms.com'));

        return $withProtocol ? 'https://'.$gateway : $gateway;
    }

    /**
     * Contacts the update server for a response.
     * @param  string $uri      Gateway API URI
     * @param  array  $postData Extra post data
     * @return array
     */
    public function requestServerData($uri, $postData = [])
    {
        $result = Http::post($this->createServerUrl($uri), function ($http) use ($postData) {
            $this->applyHttpAttributes($http, $postData);
        });

        if ($result->code == 404) {
            throw new ApplicationException(Lang::get('system::lang.server.response_not_found'));
        }

        if ($result->code != 200) {
            throw new ApplicationException(
                strlen($result->body)
                ? $result->body
                : Lang::get('system::lang.server.response_empty')
            );
        }

        $resultData = false;

        try {
            $resultData = @json_decode($result->body, true);
        }
        catch (Exception $ex) {
            throw new ApplicationException(Lang::get('system::lang.server.response_invalid'));
        }

        if ($resultData === false || (is_string($resultData) && !strlen($resultData))) {
            throw new ApplicationException(Lang::get('system::lang.server.response_invalid'));
        }

        return $resultData;
    }

    /**
     * Create a complete gateway server URL from supplied URI
     * @param  string $uri URI
     * @return string      URL
     */
    protected function createServerUrl($uri)
    {
        $gateway = env('APP_UPDATE_GATEWAY', Config::get('system.update_gateway', 'https://gateway.octobercms.com/api'));
        if (substr($gateway, -1) != '/') {
            $gateway .= '/';
        }

        return $gateway . $uri;
    }

    /**
     * Modifies the Network HTTP object with common attributes.
     * @param  Http $http      Network object
     * @param  array $postData Post data
     * @return void
     */
    protected function applyHttpAttributes($http, $postData)
    {
        $postData['protocol_version'] = '2.0';
        $postData['client'] = 'october';

        $postData['server'] = base64_encode(json_encode([
            'php'   => PHP_VERSION,
            'url'   => Url::to('/'),
            'since' => date('c')
        ]));

        if ($credentials = Config::get('system.update_gateway_auth')) {
            $http->auth($credentials);
        }

        $http->noRedirect();
        $http->data($postData);
    }
}
