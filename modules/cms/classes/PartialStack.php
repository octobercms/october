<?php namespace Cms\Classes;

/**
 * Manager class for stacking nested partials and keeping track
 * of their components. Partial "objects" store the components
 * used by that partial for deferred retrieval.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PartialStack
{
    /**
     * @var array The current partial "object" being rendered.
     */
    public $activePartial = null;

    /**
     * @var array Collection of previously rendered partial "objects".
     */
    protected $partialStack = [];

    /**
     * Partial entry point, appends a new partial to the stack.
     */
    public function stackPartial()
    {
        if ($this->activePartial !== null) {
            array_unshift($this->partialStack, $this->activePartial);
        }

        $this->activePartial = [
            'components' => []
        ];
    }

    /**
     * Partial exit point, removes the active partial from the stack.
     */
    public function unstackPartial()
    {
        $this->activePartial = array_shift($this->partialStack);
    }

    /**
     * Adds a component to the active partial stack.
     */
    public function addComponent($alias, $componentObj)
    {
        array_push($this->activePartial['components'], [
            'name' => $alias,
            'obj' => $componentObj
        ]);
    }

    /**
     * Returns a component by its alias from the partial stack.
     */
    public function getComponent($name)
    {
        if (!$this->activePartial) {
            return null;
        }

        $component = $this->findComponentFromStack($name, $this->activePartial);
        if ($component !== null) {
            return $component;
        }

        foreach ($this->partialStack as $stack) {
            $component = $this->findComponentFromStack($name, $stack);
            if ($component !== null) {
                return $component;
            }
        }

        return null;
    }

    /**
     * Locates a component by its alias from the supplied stack.
     */
    protected function findComponentFromStack($name, $stack)
    {
        foreach ($stack['components'] as $componentInfo) {
            if ($componentInfo['name'] == $name) {
                return $componentInfo['obj'];
            }
        }

        return null;
    }
}
