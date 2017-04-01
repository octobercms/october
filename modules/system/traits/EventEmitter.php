<?php namespace System\Traits;

use Event;

/**
 * Adds system event related features to any class.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */

trait EventEmitter
{
    use \October\Rain\Support\Traits\Emitter;

    /**
     * Fires a combination of local and global events. The first segment is removed
     * from the event name locally and the local object is passed as the first
     * argument to the event globally. Halting is also enabled by default.
     *
     * For example:
     *
     *     $this->fireSystemEvent('backend.list.myEvent', ['my value']);
     *
     * Is equivalent to:
     *
     *     $this->fireEvent('list.myEvent', ['myvalue'], true);
     *
     *     Event::fire('backend.list.myEvent', [$this, 'myvalue'], true);
     *
     * @param string $event Event name
     * @param array $params Event parameters
     * @param boolean $halt Halt after first non-null result
     * @return mixed
     */
    public function fireSystemEvent($event, $params = [], $halt = true)
    {
        $result = [];

        $shortEvent = substr($event, strpos($event, '.') + 1);

        $longArgs = array_merge([$this], $params);

        /*
         * Local event first
         */
        if ($response = $this->fireEvent($shortEvent, $params, $halt)) {
            if ($halt) {
                return $response;
            }
            else {
                $result = array_merge($result, $response);
            }
        }

        /*
         * Global event second
         */
        if ($response = Event::fire($event, $longArgs, $halt)) {
            if ($halt) {
                return $response;
            }
            else {
                $result = array_merge($result, $response);
            }
        }

        return $result;
    }

    /**
     * Special event function used for extending within view files,
     * allowing HTML to be injected multiple times.
     *
     * For example:
     *
     *     <?= $this->fireViewEvent('backend.auth.extendSigninView') ?>
     *
     * @param string $event Event name
     * @param array $params Event parameters
     * @return string
     */
    public function fireViewEvent($event, $params = [])
    {
        // Add the local object to the first parameter always
        array_unshift($params, $this);

        if ($result = Event::fire($event, $params)) {
            return implode(PHP_EOL.PHP_EOL, (array) $result);
        }

        return '';
    }
}
