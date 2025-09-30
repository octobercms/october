<?php namespace System\Classes;

use Db;
use Html;
use File;
use Markdown;
use Cms\Classes\ThemeManager;
use System\Models\PluginVersion;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Exception;

/**
 * ProductDetail contains details about a plugin or theme, sourcing information
 * from either the file system or marketplace endpoint.
 */
class ProductDetail
{
    /**
     * @var bool isFound determines if a product was found
     */
    protected $isFound = false;

    /**
     * @var bool isInstalled determines if a product is installed
     */
    protected $isInstalled = false;

    /**
     * @var bool isOrphaned is for plugins found in the database but not filesystem
     */
    protected $isOrphaned = false;

    /**
     * @var bool isTheme product
     */
    public $isTheme = false;

    /**
     * @var bool canInstall product
     */
    public $canInstall = false;

    /**
     * @var bool canResetData is used by orphaned plugins to remove data
     */
    public $canResetData = false;

    /**
     * @var string name for product
     */
    public $name;

    /**
     * @var string code for product
     */
    public $code;

    /**
     * @var string composerCode
     */
    public $composerCode;

    /**
     * @var string composerVersion
     */
    public $composerVersion = '*';

    /**
     * @var string currentVersion
     */
    public $currentVersion;

    /**
     * @var string author of product
     */
    public $author;

    /**
     * @var string Product icon
     */
    public $icon;

    /**
     * @var string Product image
     */
    public $image;

    /**
     * @var string Product website URL
     */
    public $homepage;

    /**
     * @var string Sales / Readme content
     */
    public $contentHtml;

    /**
     * @var string Upgrade guide
     */
    public $upgradeHtml;

    /**
     * @var string License information
     */
    public $licenseHtml;

    /**
     * __construct
     */
    public function __construct(string $productCode, bool $isTheme = false)
    {
        $this->code = $productCode;
        $this->isTheme = $isTheme;

        if ($isTheme) {
            if ($this->initThemeLocal()) {
                $this->isInstalled = true;
                $this->isFound = true;
                return;
            }

            if ($this->initThemeRemote()) {
                $this->isFound = true;
                return;
            }
        }
        else {
            if ($this->initPluginLocal()) {
                $this->isInstalled = true;
                $this->isFound = true;
                return;
            }

            if ($this->initPluginRemote()) {
                $this->isFound = true;
                return;
            }

            if ($this->initPluginDatabase()) {
                $this->isFound = true;
                $this->isOrphaned = true;
                return;
            }
        }
    }

    /**
     * installed
     */
    public function installed(): bool
    {
        return $this->isInstalled;
    }

    /**
     * exists
     */
    public function exists(): bool
    {
        return $this->isFound;
    }

    /**
     * initPluginLocal
     */
    protected function initPluginLocal(): bool
    {
        $manager = PluginManager::instance();
        $plugin = $manager->findByIdentifier($this->code);
        $code = $manager->getIdentifier($plugin);
        $path = $manager->getPluginPath($plugin);
        $this->composerCode = $manager->getComposerCode($plugin);

        if (!$path || !$plugin) {
            return false;
        }

        // Markdown
        $readmeFiles = ['README.md', 'readme.md'];
        $upgradeFiles = ['UPGRADE.md', 'upgrade.md'];
        $licenseFiles = ['LICENCE.md', 'license.md', 'LICENSE.md', 'license.md'];
        $this->contentHtml = $this->getProductMarkdownFile($path, $readmeFiles);
        $this->upgradeHtml = $this->getProductMarkdownFile($path, $upgradeFiles);
        $this->licenseHtml = $this->getProductMarkdownFile($path, $licenseFiles);

        // Registration file
        $details = $plugin->pluginDetails();
        $this->name = $details['name'] ?? 'system::lang.plugin.unnamed';
        $this->code = $code;
        $this->author = $details['author'] ?? null;
        $this->icon = $details['icon'] ?? 'icon-leaf';
        $this->homepage = $details['homepage'] ?? null;
        $this->canInstall = true;

        // Version
        $pluginVersion = PluginVersion::whereCode($code)->first();
        $this->currentVersion = $pluginVersion ? $pluginVersion->version : '???';

        return true;
    }

    /**
     * initPluginRemote
     */
    protected function initPluginRemote(): bool
    {
        try {
            $details = UpdateManager::instance()->requestPluginContent($this->code);
        }
        catch (Exception $ex) {
            return false;
        }

        $this->contentHtml = $details['content_html'] ?? '';
        $this->upgradeHtml = $details['upgrade_guide_html'] ?? '';

        $this->name = $details['name'] ?? null;
        $this->code = $details['code'] ?? null;
        $this->author = $details['author'] ?? null;
        $this->image = $details['image'] ?? null;
        $this->homepage = $this->normalizeProductEndpoint($details['product_url'] ?? null);
        $this->composerCode = $details['composer_code'] ?? null;
        $this->composerVersion = $details['composer_version'] ?? null;
        $this->canInstall = !($details['price'] ?? 0) || ($details['in_project'] ?? false);

        return true;
    }

    /**
     * initPluginDatabase
     */
    protected function initPluginDatabase(): bool
    {
        $plugin = PluginVersion::where(Db::raw('LOWER(code)'), strtolower($this->code))->first();
        if (!$plugin) {
            return false;
        }

        $this->name = $plugin->code;
        $this->currentVersion = $plugin->version;
        $this->author = 'Unknown';
        $this->canResetData = true;
        $this->contentHtml = __("Plugin has been removed from the file system.");

        return true;
    }

    /**
     * initThemeLocal
     */
    protected function initThemeLocal(): bool
    {
        $manager = ThemeManager::instance();
        $dirName = $manager->findDirectoryName($this->code);

        if (!$dirName) {
            return false;
        }

        $theme = $manager->findByIdentifier($dirName);
        $path = $manager->getThemePath($dirName);

        if (!$path || !$theme) {
            return false;
        }

        $this->composerCode = $manager->getComposerCode($dirName);

        // Markdown
        $readmeFiles = ['README.md', 'readme.md'];
        $upgradeFiles = ['UPGRADE.md', 'upgrade.md'];
        $licenseFiles = ['LICENCE.md', 'licence.md', 'LICENSE.md', 'license.md'];
        $this->contentHtml = $this->getProductMarkdownFile($path, $readmeFiles);
        $this->upgradeHtml = $this->getProductMarkdownFile($path, $upgradeFiles);
        $this->licenseHtml = $this->getProductMarkdownFile($path, $licenseFiles);

        // Registration file
        $details = $theme->getConfig();
        $this->name = $details['name'] ?? 'system::lang.plugin.unnamed';
        $this->author = $details['author'] ?? null;
        $this->icon = $details['icon'] ?? 'icon-leaf';
        $this->homepage = $details['homepage'] ?? null;
        $this->canInstall = true;

        return true;
    }

    /**
     * initThemeRemote
     */
    protected function initThemeRemote(): bool
    {
        try {
            $details = UpdateManager::instance()->requestThemeContent($this->code);
        }
        catch (Exception $ex) {
            return false;
        }

        $this->contentHtml = $details['content_html'] ?? '';
        $this->upgradeHtml = $details['upgrade_guide_html'] ?? '';

        $this->name = $details['name'] ?? null;
        $this->code = $details['code'] ?? null;
        $this->author = $details['author'] ?? null;
        $this->image = $details['image'] ?? null;
        $this->homepage = $this->normalizeProductEndpoint($details['product_url'] ?? null);
        $this->composerCode = $details['composer_code'] ?? null;
        $this->composerVersion = $details['composer_version'] ?? null;
        $this->canInstall = !($details['price'] ?? 0) || ($details['in_project'] ?? false);

        return true;
    }

    /**
     * getProductMarkdownFile checks a path for supplied filesnames
     * to parse as Markdown
     */
    protected function getProductMarkdownFile(string $path, array $filenames): string
    {
        $contents = '';

        foreach ($filenames as $file) {
            if (!File::exists($path . '/'.$file)) {
                continue;
            }

            $contents = File::get($path . '/'.$file);

            /*
             * Parse markdown, clean HTML, remove first H1 tag
             */
            $contents = Markdown::parse($contents);
            $contents = Html::clean($contents);
            $contents = preg_replace('@<h1[^>]*?>.*?<\/h1>@si', '', $contents, 1);
        }

        return $contents;
    }

    /**
     * normalizeProductEndpoint only allows trusted hostnames for security reasons
     */
    protected function normalizeProductEndpoint($url)
    {
        $hostname = parse_url($url, PHP_URL_HOST);
        return str_replace($hostname, 'octobercms.com', $url);
    }
}
