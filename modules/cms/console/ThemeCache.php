<?php namespace Cms\Console;

use File;
use Site;
use Cms\Classes\Router as CmsRouter;
use Cms\Classes\Theme as CmsTheme;
use Illuminate\Console\Command;

/**
 * ThemeCache caches the system themes
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeCache extends Command
{
     /**
     * @var string name of console command
     */
    protected $name = 'theme:cache';

    /**
     * @var string description of the console command
     */
    protected $description = 'Create theme cache files for faster registration.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        $this->callSilent('theme:clear');

        foreach (CmsTheme::all() as $theme) {
            $this->handleTheme($theme);
        }

        $this->components->info('Themes cached successfully.');
    }

    /**
     * handleTheme command
     */
    public function handleTheme(CmsTheme $theme)
    {
        File::put(
            $theme->getCachedThemePath(),
            $this->buildThemeCacheFile($theme)
        );
    }

    /**
     * buildThemeCacheFile stores the default route map and a map per translated site locale.
     */
    protected function buildThemeCacheFile(CmsTheme $theme)
    {
        $router = new CmsRouter($theme);

        $manifest = [
            'routes' => $router->build()->toArray()
        ];

        foreach (Site::listEnabled() as $site) {
            $locale = $site->hard_locale;
            if (isset($manifest['siteRoutes'][$locale])) {
                continue;
            }

            $siteRoutes = $router->build($site)->toArray();
            if ($siteRoutes == $manifest['routes']) {
                continue;
            }

            $manifest['siteRoutes'][$locale] = $siteRoutes;
            $manifest['siteAliasRoutes'][$locale] = $router->buildAlias($site)->toArray();
        }

        return '<?php return '.var_export($manifest, true).';';
    }
}
