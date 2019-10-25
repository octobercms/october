<?php namespace Backend\Traits;

use Str;
use Session;

/**
 * Session Maker Trait
 *
 * Adds session management based methods to a controller class, or a class
 * that contains a `$controller` property referencing a controller.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
trait SessionMaker
{
    /**
     * Saves a widget related key/value pair in to session data.
     * @param string $key Unique key for the data store.
     * @param string $value The value to store.
     * @return void
     */
    protected function putSession($key, $value)
    {
        $sessionId = $this->makeSessionId();

        $currentStore = $this->getSession();

        $currentStore[$key] = $value;

        Session::put($sessionId, base64_encode(serialize($currentStore)));
    }

    /**
     * Retrieves a widget related key/value pair from session data.
     * @param string $key Unique key for the data store.
     * @param string $default A default value to use when value is not found.
     * @return string
     */
    protected function getSession($key = null, $default = null)
    {
        $sessionId = $this->makeSessionId();

        $currentStore = [];

        if (
            Session::has($sessionId) &&
            ($cached = @unserialize(@base64_decode(Session::get($sessionId)))) !== false
        ) {
            $currentStore = $cached;
        }

        if ($key === null) {
            return $currentStore;
        }

        return $currentStore[$key] ?? $default;
    }

    /**
     * Returns a unique session identifier for this widget and controller action.
     * @return string
     */
    protected function makeSessionId()
    {
        $controller = property_exists($this, 'controller') && $this->controller
            ? $this->controller
            : $this;

        $uniqueId = method_exists($this, 'getId') ? $this->getId() : $controller->getId();

        // Removes Class name and "Controllers" directory
        $rootNamespace = Str::getClassId(Str::getClassNamespace(Str::getClassNamespace($controller)));

        // The controller action is intentionally omitted, session should be shared for all actions
        return 'widget.' . $rootNamespace . '-' . class_basename($controller) . '-' . $uniqueId;
    }

    /**
     * Resets all session data related to this widget.
     * @return void
     */
    public function resetSession()
    {
        $sessionId = $this->makeSessionId();

        Session::forget($sessionId);
    }
}
