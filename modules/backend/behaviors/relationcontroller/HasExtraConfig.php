<?php namespace Backend\Behaviors\RelationController;

/**
 * HasExtraConfig implements state for the relation controller
 */
trait HasExtraConfig
{
    /**
     * @var array extraConfig as a final state
     */
    protected $extraConfig = [];

    /**
     * @var string extraConfigChain provided by the relationship chain
     */
    protected $extraConfigChain = [];

    /**
     * @var string extraConfigRender provided by the relationRender method
     */
    protected $extraConfigRender = [];

    /**
     * @var bool bumpSessionKeys is used to create a new session for forms
     */
    protected $bumpSessionKeys = false;

    /**
     * @var array configReadOnly holds the readOnly value each relation was defined with, null when not set
     */
    protected $configReadOnly = [];

    /**
     * setExtraConfigForChain returns extra config with the relation chain, encoded
     */
    protected function setExtraConfigForChain()
    {
        if ($this->bumpSessionKeys) {
            $this->relationSessionKey = $this->sessionKey;
            $this->sessionKey = str_random(40);
        }

        $extraConfig = $this->extraConfig;
        $extraConfig['chain'][] = $this->field;
        $extraConfig['manageIds'][$this->field] = $this->manageId;
        $extraConfig['sessionKeys'][$this->field] = [$this->sessionKey, $this->relationSessionKey];
        $extraConfig['eventTargets'][$this->field] = $this->eventTarget;

        $this->extraConfigChain = $this->extraConfig = $extraConfig;
    }

    /**
     * setExtraConfigForRender comes from the render call method
     */
    protected function setExtraConfigForRender($config)
    {
        $this->extraConfigRender = $config;

        $this->setExtraConfig($config);
    }

    /**
     * setExtraConfig usually comes from the postback variable
     */
    protected function setExtraConfig($config)
    {
        if (is_string($config)) {
            $config = json_decode($config, true);
        }

        if (!is_array($config)) {
            $config = [];
        }

        $this->extraConfig = array_merge(
            $config,
            $this->extraConfigChain,
            $this->extraConfigRender
        );
    }

    /**
     * applyExtraConfig
     */
    protected function applyExtraConfig($field = null)
    {
        if (!$field) {
            $field = $this->field;
        }

        $config = $this->extraConfig;

        $originalConfig = $this->originalConfig->{$field} ?? null;
        if (!$config || !$originalConfig) {
            return;
        }

        // Remember the defined value before extra config is written over it
        if (!array_key_exists($field, $this->configReadOnly)) {
            $this->configReadOnly[$field] = $originalConfig['readOnly'] ?? null;
        }

        // readOnlyDefault is used by the relation widget to apply a soft
        // default value, i.e. where a value is otherwise unspecified.
        // In order of application: 1. default 2. config 3. render
        if (
            array_key_exists('readOnlyDefault', $config) &&
            !array_key_exists('readOnly', $config) &&
            !array_key_exists('readOnly', $originalConfig)
        ) {
            $config['readOnly'] = $config['readOnlyDefault'];
        }

        // A readOnly set in the relation config is locked, otherwise extra config only changes the display
        $parsedConfig = array_only($config, ['readOnly']);
        if ($this->configReadOnly[$field] !== null) {
            $parsedConfig['readOnly'] = (bool) $this->configReadOnly[$field];
        }

        $parsedConfig['view'] = array_only($config, ['recordUrl', 'recordOnClick']);

        $this->originalConfig->{$field} = array_replace_recursive(
            $originalConfig,
            $parsedConfig
        );
    }
}
