<?php namespace System\Models;

use Url;
use Site;
use Model;
use Cms\Classes\Theme;
use Backend\Models\User;
use Backend\Models\UserRole;
use System\Helpers\Preset as PresetHelper;
use System\Classes\SiteCollection;
use ValidationException;

/**
 * SiteDefinition
 *
 * @property int $id
 * @property string $name
 * @property string $code
 * @property int $sort_order
 * @property bool $is_custom_url
 * @property string $app_url
 * @property string $theme
 * @property string $locale
 * @property string $fallback_locale
 * @property string $timezone
 * @property bool $is_host_restricted
 * @property array $allow_hosts
 * @property bool $is_prefixed
 * @property string $route_prefix
 * @property bool $is_styled
 * @property string $color_foreground
 * @property string $color_background
 * @property bool $is_role_restricted
 * @property array $allow_roles
 * @property bool $is_primary
 * @property bool $is_enabled
 * @property bool $is_enabled_edit
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SiteDefinition extends Model
{
    use \System\Models\SiteDefinition\HasModelAttributes;
    use \October\Rain\Database\Traits\Validation;
    use \October\Rain\Database\Traits\Sortable;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'system_site_definitions';

    /**
     * @var array jsonable are json encoded attributes
     */
    protected $jsonable = ['allow_hosts', 'allow_roles'];

    /**
     * @var array Validation rules
     */
    public $rules = [
        'code' => 'required',
        'name' => 'required',
    ];

    /**
     * @var array belongsTo
     */
    public $belongsTo = [
        'group' => SiteGroup::class
    ];

    /**
     * @var bool isFallbackMatch is used when a site is matched by its hostname
     * but not by its prefix and becomes the basis for a redirect
     */
    public $isFallbackMatch = false;

    /**
     * @var string urlOverride
     */
    protected $urlOverride;

    /**
     * syncPrimarySite
     */
    public static function syncPrimarySite()
    {
        if (static::count() > 0) {
            return;
        }

        $site = new static;
        $site->name = 'Primary Site';
        $site->code = 'primary';
        $site->is_primary = true;
        $site->is_enabled = true;
        $site->is_enabled_edit = true;
        $site->save();
    }

    /**
     * makeFallbackInstance returns a non-existent record for instance where
     * the database is unavailable.
     */
    public static function makeFallbackInstance()
    {
        $site = new SiteDefinition;
        $site->attributes = [
            'id' => 1,
            'name' => 'Primary Site',
            'code' => 'english',
            'is_primary' => true,
            'is_enabled' => true,
            'is_enabled_edit' => true,
            'group_id' => null,
            'group' => null,
        ];
        $site->syncOriginal();
        return $site;
    }

    /**
     * beforeValidate
     */
    public function beforeValidate()
    {
        if ($this->is_custom_url && !Url::isValidUrl($this->app_url)) {
            throw new ValidationException(['app_url' => __("Please specify a valid URL")]);
        }

        if ($this->is_prefixed && (substr($this->route_prefix, 0, 1) !== '/' || $this->route_prefix === '/')) {
            throw new ValidationException(['route_prefix' => __("Route prefix must start with a forward slash (/)")]);
        }

        if ($this->is_host_restricted && !$this->isAllowHostsValid()) {
            throw new ValidationException(['allow_hosts' => __("Please specify a valid hostname")]);
        }

        $this->fallback_locale = $this->getFallbackLocale($this->locale);
    }

    /**
     * getFallbackLocale attempts to extract the fallback language from the locale.
     * @return string
     */
    protected function getFallbackLocale($locale)
    {
        if ($position = strpos($locale, '-')) {
            $target = substr($locale, 0, $position);
            $available = $this->getLocaleOptions();
            if (isset($available[$target])) {
                return $target;
            }
        }

        return '';
    }

    /**
     * beforeSave
     */
    public function beforeSave()
    {
        if (!$this->group_id) {
            $this->group_id = SiteGroup::first()?->id;
        }
    }

    /**
     * afterDelete
     */
    public function afterDelete()
    {
        PluginSiteGroup::where('site_id', $this->id)->delete();

        Site::resetCache();
    }

    /**
     * afterSave
     */
    public function afterSave()
    {
        Site::resetCache();
    }

    /**
     * getStatusNameOptions
     */
    public function getStatusCodeOptions()
    {
        return [
            'enabled' => ['Enabled', '#85CB43'],
            'disabled' => ['Disabled', '#bdc3c7'],
            'editable' => ['Editable', '#e67e21'],
        ];
    }

    /**
     * setUrlOverride
     */
    public function setUrlOverride(string $url)
    {
        $this->urlOverride = $url;
    }

    /**
     * getAllowHostsAsArray
     */
    public function getAllowHostsAsArray(): array
    {
        $hosts = [];

        foreach ($this->allow_hosts as $info) {
            if (isset($info['hostname'])) {
                $hosts[] = $info['hostname'];
            }
        }

        return $hosts;
    }

    /**
     * isAllowHostsValid returns true if the allowable host names are valid
     */
    protected function isAllowHostsValid(): bool
    {
        foreach ($this->getAllowHostsAsArray() as $domain) {
            if (!preg_match(
                '/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/',
                str_replace('*', 'x', $domain)
            )) {
                return false;
            }
        }

        return true;
    }

    /**
     * matchesBaseUrl matches a URL with the custom app URL, if specified
     */
    public function matchesBaseUrl(string $url): bool
    {
        if (!$this->is_custom_url) {
            return true;
        }

        // @deprecated
        if (!str_contains($url, '://')) {
            return $url === parse_url($this->app_url, PHP_URL_HOST);
        }

        return str_starts_with($url, rtrim($this->app_url, '/'));
    }

    /**
     * matchesHostname
     */
    public function matchesHostname(string $hostname): bool
    {
        if (!$this->is_host_restricted) {
            return true;
        }

        $allowHosts = array_map(function($hostPattern) {
            return $this->applyRegexHelpersToHostname($hostPattern);
        }, (array) $this->getAllowHostsAsArray());

        foreach ($allowHosts as $pattern) {
            if (preg_match($pattern, $hostname)) {
                return true;
            }
        }

        return false;
    }

    /**
     * matchesLocale
     */
    public function matchesLocale(string $locale): bool
    {
        // Micro optimization
        if ($this->locale) {
            return $this->locale === $locale;
        }

        return $this->hard_locale === $locale;
    }

    /**
     * applyRegexHelpersToHostname
     */
    protected function applyRegexHelpersToHostname($hostPattern)
    {
        // Convert *.host.tld to regex equivalent
        if (substr($hostPattern, 0, 2) === '*.') {
            $hostPattern = '^(.+\.)?'.preg_quote(substr($hostPattern, 2)).'$';
        }
        else {
            $hostPattern = '^'.$hostPattern.'$';
        }

        return sprintf('{%s}i', $hostPattern);
    }

    /**
     * matchesRoutePrefix
     */
    public function matchesRoutePrefix(string $uri): bool
    {
        if (!$this->is_prefixed) {
            return true;
        }

        $uri = ltrim($uri, '/');
        $prefix = ltrim($this->route_prefix, '/');

        // Exact match
        if ($uri === $prefix) {
            return true;
        }

        // Starts with segment (prefix/)
        if (str_starts_with($uri, $prefix.'/')) {
            return true;
        }

        return false;
    }

    /**
     * removeRoutePrefix removes the route prefix from a uri,
     * for example en/blog → blog
     */
    public function removeRoutePrefix(string $url): string
    {
        if (!$this->is_prefixed) {
            return $url;
        }

        $url = ltrim($url, '/');
        $prefix = ltrim($this->route_prefix, '/');

        if (substr($url, 0, strlen($prefix)) === $prefix) {
            $url = substr($url, strlen($prefix));
        }

        return $url;
    }

    /**
     * attachRoutePrefix
     */
    public function attachRoutePrefix(string $url): string
    {
        if (!$this->is_prefixed) {
            return $url;
        }

        $url = ltrim($url, '/');

        return trim($this->route_prefix.'/'.$url, '/');
    }

    /**
     * getThemeOptions returns dropdown options for the active theme
     */
    public function getThemeOptions(): array
    {
        $result = [
            '' => '- '.__('Use Default').' -',
        ];

        foreach (Theme::all() as $theme) {
            if ($theme->isLocked()) {
                $label = $theme->getConfigValue('name').' ('.$theme->getDirName().'*)';
            }
            else {
                $label = $theme->getConfigValue('name').' ('.$theme->getDirName().')';
            }

            $result[$theme->getDirName()] = $label;
        }

        return $result;
    }

    /**
     * getLocaleOptions returns available options for the "locale" attribute.
     * @return array
     */
    public function getLocaleOptions()
    {
        return [
            '' => '- '.__('Use Default').' -',
        ] + PresetHelper::flags() + [
            'custom' => '- '.__('Use Custom').' -'
        ];
    }

    /**
     * getShortLocaleOptions returns shortened options for the "locale" attribute.
     * @return array
     */
    public function getShortLocaleOptions()
    {
        return [
            '' => '- '.__('Use Default').' -',
        ] + PresetHelper::flags('short') + [
            'custom' => '- '.__('Use Custom').' -'
        ];
    }

    /**
     * isCustomLocale
     */
    public function isCustomLocale($locale)
    {
        if (!$locale) {
            return false;
        }

        return !isset(PresetHelper::flags()[$locale]);
    }

    /**
     * getTimezoneOptions returns all available timezone options.
     * @return array
     */
    public function getTimezoneOptions()
    {
        return [
            '' => '- '.__('Use Default').' -',
        ] + PresetHelper::timezones();
    }

    /**
     * getAllowRolesOptions returns available role options
     */
    public function getAllowRolesOptions()
    {
        $result = [];

        foreach (UserRole::all() as $role) {
            $result[$role->id] = $role->name;
        }

        return $result;
    }

    /**
     * matchesRole
     */
    public function matchesRole(?User $user): bool
    {
        if (!$this->is_role_restricted) {
            return true;
        }

        if ($user && $user->is_superuser) {
            return true;
        }

        if (!$user || !$user->role_id) {
            return false;
        }

        foreach ((array) $this->allow_roles as $roleId) {
            if ((int) $user->role_id === (int) $roleId) {
                return true;
            }
        }

        return false;
    }

    /**
     * newCollection instance.
     * @return \System\Classes\SiteCollection
     */
    public function newCollection(array $models = [])
    {
        return new SiteCollection($models);
    }
}
