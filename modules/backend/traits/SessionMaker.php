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

        Session::put($sessionId, json_encode($currentStore));
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

        $currentStore = $this->readSessionStore($sessionId);

        if ($key === null) {
            return $currentStore;
        }

        return array_get($currentStore, $key, $default);
    }

    /**
     * Reads the widget session store, preferring JSON and falling back to
     * the legacy base64+serialize format for sessions written before the
     * format change. Legacy values are deserialized with allowed_classes
     * set to false so deserialization cannot instantiate gadget chains.
     *
     * @return array<string, mixed>
     */
    protected function readSessionStore(string $sessionId): array
    {
        if (!Session::has($sessionId)) {
            return [];
        }

        $raw = Session::get($sessionId);
        if (!is_string($raw) || $raw === '') {
            return [];
        }

        // JSON-encoded sessions always begin with { or [ since putSession
        // stores an associative array. Anything else is the legacy format.
        if ($raw[0] === '{' || $raw[0] === '[') {
            $decoded = json_decode($raw, true);
            return is_array($decoded) ? $decoded : [];
        }

        // @deprecated Legacy base64(serialize($array)) format. Retained for
        // one upgrade cycle so existing sessions don't lose their saved
        // widget state. The allowed_classes guard prevents object
        // instantiation. Remove this fallback in a future release.
        $decoded = @unserialize(@base64_decode($raw), ['allowed_classes' => false]);
        return is_array($decoded) ? $decoded : [];
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
