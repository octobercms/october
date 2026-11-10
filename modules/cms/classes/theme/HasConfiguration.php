<?php namespace Cms\Classes\Theme;

use Url;
use File;
use Yaml;
use Event;
use stdClass;
use Exception;
use ApplicationException;

/**
 * HasConfiguration for themes
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasConfiguration
{
    /**
     * @var mixed configCache keeps the cached configuration file values
     */
    protected $configCache;

    /**
     * getConfig reads the theme.yaml file and returns the theme configuration values
     */
    public function getConfig(): array
    {
        if ($this->configCache !== null) {
            return $this->configCache;
        }

        $path = $this->getPath().'/theme.yaml';
        if (!File::exists($path)) {
            $config = [];
        }
        else {
            $config = (array) Yaml::parseFileCached($path);
        }

        /**
         * @event cms.theme.extendConfig
         * Extend basic theme configuration supplied by the theme by returning an array.
         *
         * Note if planning on extending form fields, use the `cms.theme.extendFormConfig`
         * event instead.
         *
         * Example usage:
         *
         *     Event::listen('cms.theme.extendConfig', function ($themeCode, &$config) {
         *          $config['name'] = 'October Theme';
         *          $config['description'] = 'Another great theme from October CMS';
         *     });
         *
         */
        Event::fire('cms.theme.extendConfig', [$this->getDirName(), &$config]);

        return $this->configCache = $config;
    }

    /**
     * getFormConfig returns the dedicated `form` option that provide form fields
     * for customization, this is an immutable accessor for that and also an
     * solid anchor point for extension
     */
    public function getFormConfig(): array
    {
        if ($this->hasParentTheme()) {
            $parentTheme = $this->getParentTheme();

            try {
                $config = $this->getConfigArray('form') ?: $parentTheme->getFormConfig();
            }
            catch (Exception $ex) {
                $config = $parentTheme->getFormConfig();
            }
        }
        else {
            $config = $this->getConfigArray('form');
        }

        /**
         * @event cms.theme.extendFormConfig
         * Extend form field configuration supplied by the theme by returning an array.
         *
         * Example usage:
         *
         *     Event::listen('cms.theme.extendFormConfig', function ($themeCode, &$config) {
         *          array_set($config, 'tabs.fields.header_color', [
         *              'label' => 'Header Colour',
         *              'type' => 'colorpicker',
         *              'availableColors' => [#34495e, #708598, #3498db],
         *              'assetVar' => 'header-bg',
         *              'tab' => 'Global'
         *          ]);
         *     });
         *
         */
        Event::fire('cms.theme.extendFormConfig', [$this->getDirName(), &$config]);

        return $config;
    }

    /**
     * getConfigValue returns a value from the theme configuration file by its name
     */
    public function getConfigValue(string $name, $default = null)
    {
        return array_get($this->getConfig(), $name, $default);
    }

    /**
     * getConfigArray returns an array value from the theme configuration file by its name
     *
     * If the value is a string, it is treated as a YAML file and loaded.
     */
    public function getConfigArray(string $name): array
    {
        $result = array_get($this->getConfig(), $name, []);

        if (is_string($result)) {
            $fileName = File::symbolizePath($result);

            if (File::isLocalPath($fileName)) {
                $path = $fileName;
            }
            else {
                $path = $this->getPath().'/'.$result;
            }

            if (!File::exists($path)) {
                throw new ApplicationException('Path does not exist: '.$path);
            }

            $result = Yaml::parseFileCached($path);
        }

        return (array) $result;
    }

    /**
     * getPreviewImageUrl returns the theme preview image URL
     *
     * If the image file doesn't exist returns the placeholder image URL.
     */
    public function getPreviewImageUrl(): string
    {
        $previewPath = $this->getConfigValue('previewImage', 'assets/images/theme-preview.png');

        if (File::exists($this->getPath().'/'.$previewPath)) {
            return Url::asset('themes/'.$this->getDirName().'/'.$previewPath);
        }

        if ($this->hasParentTheme()) {
            return $this->getParentTheme()->getPreviewImageUrl();
        }

        return Url::asset('modules/cms/assets/images/default-theme-preview.png');
    }

    /**
     * writeConfig to the theme.yaml file with the supplied array values
     */
    public function writeConfig(array $values = [], bool $overwrite = false)
    {
        if (!$overwrite) {
            $values = $values + (array) $this->getConfig();
        }

        $path = $this->getPath().'/theme.yaml';

        if (!File::exists($path)) {
            throw new ApplicationException('Path does not exist: '.$path);
        }

        $contents = Yaml::render($values);

        File::put($path, $contents);

        $this->writeComposerFile($values);

        $this->configCache = $values;
    }

    /**
     * writeComposerFile writes the theme's name and description to its composer file,
     * keeping the rest of an existing file, eg: requirements the developer added
     */
    protected function writeComposerFile(array $data)
    {
        $author = strtolower(trim($data['authorCode'] ?? ''));
        $code = strtolower(trim($data['code'] ?? ''));
        $description = $data['description'] ?? null;
        $path = $this->getPath();

        if (!$description) {
            $description = $data['name'] ?? '';
        }

        // Abort
        if (!$path || !$author || !$code) {
            return;
        }

        $composerPath = $path.'/composer.json';
        $isNew = !File::exists($composerPath);

        // Decoded as objects, so empty objects stay {} when written back
        if ($isNew) {
            $composer = new stdClass;
        }
        else {
            $composer = json_decode(File::get($composerPath));

            // Leave a file that is not valid JSON alone
            if (!$composer instanceof stdClass) {
                return;
            }
        }

        $composer->name = $author.'/'.$code.'-theme';
        $composer->type = 'october-theme';
        $composer->description = $description;

        if ($isNew) {
            $composer->require = (object) ['php' => '>=8.2'];
        }

        File::put(
            $composerPath,
            json_encode($composer, JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT)
        );
    }
}
