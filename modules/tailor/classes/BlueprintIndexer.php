<?php namespace Tailor\Classes;

use App;
use File;
use Config;
use System;
use Cms\Classes\Theme;
use Cms\Models\SourceFile;
use Tailor\Classes\Blueprint;
use Tailor\Classes\Blueprint\EntryBlueprint;
use System\Helpers\Cache as CacheHelper;
use Exception;

/**
 * BlueprintIndexer super class responsible for indexing blueprints
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class BlueprintIndexer
{
    use \System\Traits\NoteMaker;
    use \Tailor\Classes\BlueprintIndexer\MixinIndex;
    use \Tailor\Classes\BlueprintIndexer\GlobalIndex;
    use \Tailor\Classes\BlueprintIndexer\SectionIndex;
    use \Tailor\Classes\BlueprintIndexer\FieldsetIndex;
    use \Tailor\Classes\BlueprintIndexer\PermissionRegistry;
    use \Tailor\Classes\BlueprintIndexer\NavigationRegistry;
    use \Tailor\Classes\BlueprintIndexer\PageManagerRegistry;

    /**
     * @var array cache collection
     */
    public static $memoryCache = [];

    /**
     * @var int migrateCount number of migrations that occurred.
     */
    protected $migrateCount = 0;

    /**
     * @var bool debugChecked for the debug cache buster
     */
    protected $debugChecked = false;

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('tailor.blueprint.indexer');
    }

    /**
     * find
     */
    public function find(string $uuid): ?Blueprint
    {
        if ($section = $this->findSection($uuid)) {
            return $section;
        }

        if ($global = $this->findGlobal($uuid)) {
            return $global;
        }

        return null;
    }

    /**
     * findByHandle
     */
    public function findByHandle(string $handle): ?Blueprint
    {
        if ($section = $this->findSectionByHandle($handle)) {
            return $section;
        }

        if ($global = $this->findGlobalByHandle($handle)) {
            return $global;
        }

        return null;
    }

    /**
     * migrate
     */
    public function migrate()
    {
        static::clearCache();

        $this->migrateCount = 0;

        $this->note('Migrating Content Tables');

        $allBlueprints = Blueprint::listInProject();

        // Clear validation cache before validating all blueprints
        BlueprintVerifier::instance()->clearCache();

        // Validate blueprints
        foreach ($allBlueprints as $blueprint) {
            $blueprint->validate();

            // Saving a blueprint will generate a uuid
            if (!$blueprint->uuid) {
                $blueprint->forceSave();
            }
        }

        // Output any duplicate handle/UUID warnings
        $warnings = BlueprintVerifier::instance()->getWarnings();
        foreach ($warnings as $warning) {
            $this->note('- <comment>Warning</comment>: ' . $warning['message']);
        }

        // Migrate blueprints
        foreach ($allBlueprints as $blueprint) {
            if ($blueprint instanceof EntryBlueprint) {
                $this->migrateContentInternal($blueprint);
            }
        }

        if ($this->migrateCount === 0) {
            $this->note('<info>Nothing to migrate.</info>');
        }
    }

    /**
     * migrateBlueprint
     */
    public function migrateBlueprint(Blueprint $blueprint)
    {
        static::clearCache();

        // Saving a blueprint will generate a uuid
        if (!$blueprint->uuid) {
            $blueprint->forceSave();
        }

        if ($blueprint instanceof EntryBlueprint) {
            $this->migrateContentInternal($blueprint);
        }
    }

    /**
     * migrateContentInternal
     */
    protected function migrateContentInternal(Blueprint $blueprint)
    {
        if ($fieldset = $this->findContentFieldset($blueprint->uuid)) {
            if (SchemaBuilder::migrateBlueprint($blueprint, $fieldset)) {
                $this->note('- <info>'.$blueprint->name.'</info>: '.$blueprint->handle .' ['.$blueprint->getContentTableName().']');
                $this->migrateCount++;
            }
        }
    }

    /**
     * getCache
     */
    protected function getCache($name): array
    {
        if (App::runningUnitTests()) {
            return [];
        }

        if (System::checkDebugMode()) {
            $this->resetCacheInDebugMode();
        }

        if (array_key_exists($name, static::$memoryCache)) {
            return static::$memoryCache[$name];
        }

        $fileName = $this->makeCacheFile($name);

        if (!File::exists($fileName)) {
            return [];
        }

        try {
            $result = File::getRequire($fileName);
            if (!is_array($result)) {
                return [];
            }
        }
        catch (Exception $ex) {
            return [];
        }

        return static::$memoryCache[$name] = $result;
    }

    /**
     * resetCacheInDebugMode
     */
    protected function resetCacheInDebugMode()
    {
        if ($this->debugChecked) {
            return;
        }

        if (!file_exists(app_path('blueprints'))) {
            return;
        }

        // Checking recursive mtime of app directory
        $currentMtime = 0;
        $mtime = File::lastModifiedRecursive(app_path('blueprints'));

        // Checking mtime of theme directory, including the parent theme
        $theme = null;
        if (System::hasModule('Cms')) {
            $theme = Theme::getEditTheme() ?: Theme::getActiveTheme();
            if ($theme && file_exists($themePath = $theme->getPath() . '/blueprints')) {
                $mtime = max($mtime, File::lastModifiedRecursive($themePath));
            }
            if ($theme && ($parentTheme = $theme->getParentTheme()) && file_exists($parentPath = $parentTheme->getPath() . '/blueprints')) {
                $mtime = max($mtime, File::lastModifiedRecursive($parentPath));
            }
        }

        // Checking mtime of database layer rows
        $mtime = max($mtime, $this->lastBlueprintSourceFileMtime($theme));

        // Store and compare mtime to clear cache
        $debugFile = $this->makeCacheFile('debug');
        try {
            if (file_exists($debugFile)) {
                $currentMtime = File::getRequire($debugFile)['mtime'] ?? 0;
            }
        }
        catch (Exception $ex) {
            $currentMtime = 0;
        }

        if ($mtime > $currentMtime) {
            $this->clearCache();
        }

        try {
            File::put(
                $debugFile,
                '<?php return '.var_export(compact('mtime'), true).';'
            );
        }
        catch (Exception $ex) {
        }

        $this->debugChecked = true;
    }

    /**
     * lastBlueprintSourceFileMtime returns the newest blueprint SourceFile
     * change, or 0 when the database layer is inactive or unavailable.
     */
    protected function lastBlueprintSourceFileMtime($theme = null): int
    {
        $enabled = Config::get('cms.database_templates', false)
            || ($theme && $theme->databaseLayerEnabled())
            || ($theme && ($parentTheme = $theme->getParentTheme()) && $parentTheme->databaseLayerEnabled());

        if (!$enabled) {
            return 0;
        }

        if (!App::hasDatabase()) {
            return 0;
        }

        try {
            $row = SourceFile::withTrashed()
                ->where('source', 'like', '%.blueprint')
                ->orderBy('updated_at', 'desc')
                ->first(['updated_at']);

            if (!$row || !$row->updated_at) {
                return 0;
            }

            return $row->updated_at->timestamp;
        }
        catch (Exception $ex) {
            return 0;
        }
    }

    /**
     * putCache
     */
    protected function putCache($name, array $contents): void
    {
        File::put(
            $this->makeCacheFile($name),
            '<?php return '.var_export($contents, true).';'
        );
    }

    /**
     * flushCache clears the memory cache
     */
    public static function flushCache()
    {
        static::$memoryCache = [];
    }

    /**
     * makeCacheFile
     */
    protected function makeCacheFile($name): string
    {
        return cache_path("cms/blueprint-{$name}.php");
    }

    /**
     * clearCache clears the disk cache
     */
    public static function clearCache()
    {
        CacheHelper::instance()->clearBlueprintCache();
    }

    /**
     * getActiveThemeDatasources returns dirnames for the active theme and its parent,
     * used to filter blueprint lookups when multiple themes define the same handle.
     */
    protected function getActiveThemeDatasources(): array
    {
        if (!System::hasModule('Cms')) {
            return [];
        }

        $theme = Theme::getEditTheme() ?: Theme::getActiveTheme();
        if (!$theme) {
            return [];
        }

        $result = [$theme->getDirName()];

        if ($parentTheme = $theme->getParentTheme()) {
            $result[] = $parentTheme->getDirName();
        }

        return $result;
    }

    /**
     * isActiveThemeDatasource returns true when a theme code belongs to the active theme,
     * its parent theme, or a non-theme datasource.
     */
    protected function isActiveThemeDatasource(?string $themeCode): bool
    {
        if ($themeCode === null) {
            return true;
        }

        $datasources = $this->getActiveThemeDatasources();
        if (!$datasources) {
            return true;
        }

        return in_array($themeCode, $datasources);
    }
}
