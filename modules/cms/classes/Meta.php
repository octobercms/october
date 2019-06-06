<?php namespace Cms\Classes;

use Yaml;

/**
 * The CMS meta file class, used for interacting with YAML files within the Halycon datasources
 *
 * @package october\cms
 * @author Luke Towers
 */
class Meta extends CmsObject
{
    /**
     * @var string The container name associated with the model, eg: pages.
     */
    protected $dirName = 'meta';

    /**
     * @var array Cache store used by parseContent method.
     */
    protected $contentDataCache;

    /**
     * @var array Allowable file extensions.
     */
    protected $allowedExtensions = ['yaml'];

    /**
     * @var string Default file extension.
     */
    protected $defaultExtension = 'yaml';

    /**
     * {inheritDoc}
     */
    public function __construct()
    {
        parent::__construct(...func_get_args());

        // Bind data processing to model events
        $this->bindEvent('model.beforeSave', function () {
            $this->content = $this->renderContent();
        });
        $this->bindEvent('model.afterFetch', function () {
            $this->attributes = array_merge($this->attributes, $this->parseContent());
        });
    }

    /**
     * Processes the content attribute to an array of menu data.
     * @return array|null
     */
    protected function parseContent()
    {
        if ($this->contentDataCache !== null) {
            return $this->contentDataCache;
        }

        $parsedData = Yaml::parse($this->content);

        if (!is_array($parsedData)) {
            return null;
        }

        return $this->contentDataCache = $parsedData;
    }

    /**
     * Renders the meta data as a content string in YAML format.
     * @return string
     */
    protected function renderContent()
    {
        return Yaml::render($this->settings);
    }

    /**
     * Compile the content for this CMS object, used by the theme logger.
     * @return string
     */
    public function toCompiled()
    {
        return $this->renderContent();
    }
}
