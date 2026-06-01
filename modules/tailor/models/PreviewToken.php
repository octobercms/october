<?php namespace Tailor\Models;

use Str;
use Url;
use Date;
use Model;
use BackendAuth;

/**
 * PreviewToken is used to provide temporary access to a page
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class PreviewToken extends Model
{
    use \October\Rain\Database\Traits\SoftDelete;

    /**
     * @var string table associated with the model
     */
    protected $table = 'tailor_preview_tokens';

    /**
     * @var array jsonable fields
     */
    protected $jsonable = ['route'];

    /**
     * @var array dates of datetime attributes to convert to an instance of Carbon/DateTime objects.
     */
    protected $dates = ['expired_at'];

    /**
     * @var PreviewToken enabledToken
     */
    protected static $enabledToken;

    /**
     * createToken for a route, limited by a number of uses and expiry date
     * as a datetime object.
     */
    public static function createToken($route, $limit = null, $expiry = null)
    {
        $token = new static;
        $token->route = $route;
        $token->token = Str::random(32);
        $token->expired_at = $expiry ?: Date::now()->addHours(48);

        if ($user = BackendAuth::getUser()) {
            $token->created_user_id = $user->id;
        }

        if ($limit) {
            $token->count_use = 0;
            $token->count_limit = $limit;
        }

        $token->save();

        return $token;
    }

    /**
     * createTokenForUrl
     */
    public static function createTokenForUrl($url, $params = [])
    {
        return static::createToken([
            'uri' => Url::makeRelative($url)
        ] + $params);
    }

    /**
     * getRouteParam
     */
    public function getRouteParam($key, $default = null)
    {
        return array_get($this->route, $key, $default);
    }

    /**
     * checkTokenForUrl
     */
    public static function checkTokenForCurrentUrl($token)
    {
        $token = static::checkToken($token);
        if (!$token) {
            return;
        }

        $route = $token->route;
        $expectedUri = $route['uri'] ?? '';

        $uri = Url::makeRelative(Url::current());
        if ($uri !== $expectedUri) {
            return;
        }

        static::$enabledToken = $token;
    }

    /**
     * findToken
     */
    public static function checkToken($token): ?PreviewToken
    {
        static::cleanUpExpired();

        $token = static::where('token', $token)->first();

        if (!$token) {
            return null;
        }

        if (!$token->isValid()) {
            $token->delete();
            return null;
        }

        $token->increment('count_use');

        return $token;
    }

    /**
     * getEnabledToken
     */
    public static function getEnabledToken(): ?PreviewToken
    {
        return static::$enabledToken;
    }

    /**
     * isTokenEnabled
     */
    public static function isTokenEnabled()
    {
        return static::$enabledToken !== null;
    }

    /**
     * isValid
     */
    protected function isValid(): bool
    {
        if ($this->count_limit && $this->count_use >= $this->count_limit) {
            return false;
        }

        if ($this->expired_at->isFuture()) {
            return true;
        }

        return false;
    }

    /**
     * cleanUpExpired expired tokens bindings
     */
    protected static function cleanUpExpired()
    {
        $timestamp = Date::now()->toDateTimeString();

        $tokens = self::where('expired_at', '<', $timestamp)->get();

        foreach ($tokens as $token) {
            $token->delete();
        }
    }
}
