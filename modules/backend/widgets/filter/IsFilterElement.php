<?php namespace Backend\Widgets\Filter;

use Backend\Classes\FilterScope;
use October\Rain\Element\Filter\ScopeDefinition;

/**
 * IsFilterElement defines all methods to satisfy the FilterElement contract
 *
 * @see \October\Contracts\Element\FilterElement
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
trait IsFilterElement
{
    /**
     * defineScope adds a scope to the filter element
     */
    public function defineScope(?string $scopeName = null, ?string $label = null): ScopeDefinition
    {
        $scopeObj = new FilterScope([
            'scopeName' => $scopeName,
            'label' => $label,
            'arrayName' => $this->arrayName,
            'idPrefix' => $this->getId()
        ]);

        $this->allScopes[$scopeName] = $scopeObj;

        return $scopeObj;
    }
}
