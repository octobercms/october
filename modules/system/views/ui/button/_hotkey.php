<?php
/**
 * Shared hotkey processing for button views.
 *
 * Expects $hotkey (string|array) and $label (string) to be set.
 * Produces $hotkeyStr (for data-hotkey) and $tooltipHotkey (for data-tooltip-hotkey).
 */
$hotkeyStr = '';
$tooltipHotkey = '';

if ($hotkey) {
    $hotkeyParts = (array) $hotkey;
    $hotkeyStr = implode(',', $hotkeyParts);

    $symbolMap = [
        'ctrl' => "\u{2303}",
        'cmd' => "\u{2318}",
        'command' => "\u{2318}",
        'meta' => "\u{2318}",
        'shift' => "\u{21E7}",
        'alt' => "\u{2325}",
        'option' => "\u{2325}",
        'enter' => "\u{21B5}",
        'return' => "\u{21B5}",
    ];

    $symbols = [];
    foreach ($hotkeyParts as $part) {
        $keys = explode('+', trim($part));
        $sym = '';
        foreach ($keys as $key) {
            $key = strtolower(trim($key));
            if (isset($symbolMap[$key])) {
                $sym .= $symbolMap[$key];
            }
            else {
                $sym .= strtoupper($key);
            }
        }
        $symbols[] = $sym;
    }

    $tooltipHotkey = implode(', ', $symbols);
}
