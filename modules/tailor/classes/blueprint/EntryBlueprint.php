<?php namespace Tailor\Classes\Blueprint;

use Tailor\Classes\Blueprint;
use Tailor\Classes\BlueprintCollection;

/**
 * EntryBlueprint
 *
 * @property string handle
 * @property string type
 * @property string name
 * @property array fields
 * @property array groups
 * @property array structure
 * @property bool drafts
 * @property bool softDeletes
 * @property mixed multisite
 * @property string pagefinder
 * @property string defaultSort
 * @property array customMessages
 * @property bool showExport
 * @property bool showImport
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class EntryBlueprint extends Blueprint
{
    /**
     * @var string typeName of the blueprint
     */
    protected $typeName = 'entry';

    /**
     * getModelClassName
     */
    public function getModelClassName()
    {
        return \Tailor\Models\EntryRecord::class;
    }

    /**
     * listInProject is a modified version to find any blueprints that inherit this one
     */
    public static function listInProject(array $options = []): BlueprintCollection
    {
        $result = [];
        foreach (Blueprint::listInProject($options) as $blueprint) {
            if ($blueprint instanceof static) {
                $result[] = $blueprint;
            }
        }

        return (new static)->newCollection($result);
    }

    /**
     * getMetaData returns meta data for the content schema table
     */
    public function getMetaData(): array
    {
        return parent::getMetaData() + [
            'multisite_sync' => $this->useMultisiteSync(),
        ];
    }

    /**
     * useDrafts determines if this section should use drafts
     */
    public function useDrafts(): bool
    {
        return (bool) $this->drafts;
    }

    /**
     * useSoftDeletes determines if this section should use soft deletion
     */
    public function useSoftDeletes(): bool
    {
        return $this->softDeletes !== false;
    }

    /**
     * useVersions determines if this section should capture version history
     */
    public function useVersions(): bool
    {
        // @todo version support not finished
        return false;

        return (bool) $this->versions;
    }

    /**
     * useMultisite
     */
    public function useMultisite(): bool
    {
        return (bool) $this->multisite;
    }

    /**
     * useMultisiteSync defaults to false.
     */
    public function useMultisiteSync(): bool
    {
        // Strict check since multisite can be set to true
        if (in_array($this->multisite, ['sync', 'locale', 'all', 'group'], true)) {
            return true;
        }

        if (!is_array($this->multisite)) {
            return false;
        }

        return (bool) array_get($this->multisite, 'sync', false);
    }

    /**
     * getMultisiteConfig requests configuration for the multisite implementation, such as
     * the sync group (all, group, locale) and the general propagation logic.
     */
    public function getMultisiteConfig($key, $default = null)
    {
        if ($key === 'sync' && is_string($this->multisite)) {
            return $this->multisite;
        }

        if (!is_array($this->multisite)) {
            return $default;
        }

        return array_get($this->multisite, $key, $default);
    }

    /**
     * usePageFinder in a specific context, either item or list. Defaults to true.
     */
    public function usePageFinder(string $context = 'item')
    {
        if (!$this->pagefinder && $this->pagefinder !== null) {
            return false;
        }

        if (is_string($this->pagefinder)) {
            return $this->pagefinder === $context;
        }

        if (is_array($this->pagefinder) && isset($this->pagefinder['context'])) {
            return $this->pagefinder['context'] === $context ||
                $this->pagefinder['context'] === 'all';
        }

        return true;
    }

    /**
     * getPageReplacements returns the replacements to be included when resolving the page
     * link. Each replacement key should match a URL parameter name and use a dot notation
     * path to the attribute value. eg: `[category => categories.0.slug]`
     */
    public function getPageFinderReplacements(): array
    {
        if (!is_array($this->pagefinder) || !is_array($this->pagefinder['replacements'])) {
            return [];
        }

        return $this->pagefinder['replacements'];
    }

    /**
     * isEntryEnabledByDefault
     */
    public function isEntryEnabledByDefault(): bool
    {
        if (
            !is_array($this->fields) ||
            !isset($this->fields['is_enabled']) ||
            !array_key_exists('default', $this->fields['is_enabled'])
        ) {
            return true;
        }

        return $this->fields['is_enabled']['default'];
    }

    /**
     * hasMultipleEntryTypes
     */
    public function hasMultipleEntryTypes(): bool
    {
        return is_array($this->groups) && count($this->groups) > 1;
    }

    /**
     * getEntryTypeOptions
     */
    public function getEntryTypeOptions(): array
    {
        if (!is_array($this->groups)) {
            return [];
        }

        $options = [];

        foreach ($this->groups as $handle => $entry) {
            $options[$handle] = trans($entry['name'] ?? $handle);
        }

        return $options;
    }

    /**
     * makeBlueprintTableName where type can be used for content, join or repeater
     */
    protected function makeBlueprintTableName($type = 'content'): string
    {
        $code = str_replace('-', '', $this->uuid);

        if (!$code) {
            return '';
        }

        if ($type === 'content') {
            return 'xc_'.$code.'c';
        }

        if ($type === 'join') {
            return 'xc_'.$code.'j';
        }

        if ($type === 'repeater') {
            return 'xc_'.$code.'r';
        }

        return '';
    }
}
