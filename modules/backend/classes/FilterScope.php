<?php namespace Backend\Classes;

use October\Rain\Html\Helper as HtmlHelper;

/**
 * Filter scope definition
 * A translation of the filter scope configuration
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class FilterScope
{
    /**
     * @var string Scope name.
     */
    public $scopeName;

    /**
     * @var string A prefix to the field identifier so it can be totally unique.
     */
    public $idPrefix;

    /**
     * @var string Column to display for the display name
     */
    public $nameFrom = 'name';

    /**
     * @var string Column to display for the description (optional)
     */
    public $descriptionFrom;

    /**
     * @var string Filter scope label.
     */
    public $label;

    /**
     * @var string Filter scope value.
     */
    public $value;

    /**
     * @var string Filter mode.
     */
    public $type = 'group';

    /**
     * @var string Filter options.
     */
    public $options;

    /**
     * @var array Other scope names this scope depends on, when the other scopes are modified, this scope will update.
     */
    public $dependsOn;

    /**
     * @var string Specifies contextual visibility of this form scope.
     */
    public $context;

    /**
     * @var bool Specify if the scope is disabled or not.
     */
    public $disabled = false;

    /**
     * @var string Specifies a default value for supported scopes.
     */
    public $defaults;

    /**
     * @var string Raw SQL conditions to use when applying this scope.
     */
    public $conditions;

    /**
     * @var string Model scope method to use when applying this filter scope.
     */
    public $scope;

    /**
     * @var string Specifies a CSS class to attach to the scope container.
     */
    public $cssClass;

    /**
     * @var array Raw scope configuration.
     */
    public $config;

    public function __construct($scopeName, $label)
    {
        $this->scopeName = $scopeName;
        $this->label = $label;
    }

    /**
     * Specifies a scope control rendering mode. Supported modes are:
     * - group - filter by a group of IDs. Default.
     * - checkbox - filter by a simple toggle switch.
     * @param string $type Specifies a render mode as described above
     * @param array $config A list of render mode specific config.
     */
    public function displayAs($type, $config = [])
    {
        $this->type = strtolower($type) ?: $this->type;
        $this->config = $this->evalConfig($config);
        return $this;
    }

    /**
     * Process options and apply them to this object.
     * @param array $config
     * @return array
     */
    protected function evalConfig($config)
    {
        if ($config === null) {
            $config = [];
        }

        /*
         * Standard config:property values
         */
        $applyConfigValues = [
            'options',
            'dependsOn',
            'context',
            'default',
            'conditions',
            'scope',
            'cssClass',
            'nameFrom',
            'descriptionFrom',
            'disabled',
        ];

        foreach ($applyConfigValues as $value) {
            if (array_key_exists($value, $config)) {
                $this->{$value} = $config[$value];
            }
        }

        return $config;
    }

    /**
     * Returns a value suitable for the scope id property.
     */
    public function getId($suffix = null)
    {
        $id = 'scope';
        $id .= '-'.$this->scopeName;

        if ($suffix) {
            $id .= '-'.$suffix;
        }

        if ($this->idPrefix) {
            $id = $this->idPrefix . '-' . $id;
        }

        return HtmlHelper::nameToId($id);
    }
}
