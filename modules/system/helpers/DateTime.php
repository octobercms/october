<?php namespace System\Helpers;

use Carbon\Carbon;
use DateTime as PhpDateTime;
use InvalidArgumentException;
use Exception;

class DateTime
{
    /**
     * Returns a human readable time difference from the value to the
     * current time. Eg: **10 minutes ago**
     *
     * @return string
     */
    public static function timeSince($datetime)
    {
        return self::makeCarbon($datetime)->diffForHumans();
    }

    /**
     * Returns 24-hour time and the day using the grammatical tense
     * of the current time. Eg: Today at 12:49, Yesterday at 4:00
     * or 18 Sep 2015 at 14:33.
     *
     * @return string
     */
    public static function timeTense($datetime)
    {
        $datetime = self::makeCarbon($datetime);
        $yesterday = $datetime->subDays(1);
        $tomorrow = $datetime->addDays(1);
        $time = $datetime->format('H:i');
        $date = $datetime->format('j M Y');

        if ($datetime->isToday()) {
            $date = 'Today';
        }
        elseif ($datetime->isYesterday()) {
            $date = 'Yesterday';
        }
        elseif ($datetime->isTomorrow()) {
            $date = 'Tomorrow';
        }

        return $date.' at '.$time;
    }

    /**
     * Converts mixed inputs to a Carbon object.
     *
     * @return Carbon\Carbon
     */
    public static function makeCarbon($value, $throwException = true)
    {
        if ($value instanceof Carbon) {
            // Do nothing
        }
        elseif ($value instanceof PhpDateTime) {
            $value = Carbon::instance($value);
        }
        elseif (is_numeric($value)) {
            $value = Carbon::createFromTimestamp($value);
        }
        elseif (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $value)) {
            $value = Carbon::createFromFormat('Y-m-d', $value)->startOfDay();
        }
        else {
            try {
                $value = Carbon::parse($value);
            } catch (Exception $ex) {
            }
        }

        if (!$value instanceof Carbon && $throwException) {
            throw new InvalidArgumentException('Invalid date value supplied to DateTime helper.');
        }

        return $value;
    }

    /**
     * Converts a PHP date format to "Moment.js" format.
     * @param string $format
     * @return string
     */
    public static function momentFormat($format)
    {
        $replacements = [
            'd' => 'DD',
            'D' => 'ddd',
            'j' => 'D',
            'l' => 'dddd',
            'N' => 'E',
            'S' => 'o',
            'w' => 'e',
            'z' => 'DDD',
            'W' => 'W',
            'F' => 'MMMM',
            'm' => 'MM',
            'M' => 'MMM',
            'n' => 'M',
            't' => '', // no equivalent
            'L' => '', // no equivalent
            'o' => 'YYYY',
            'Y' => 'YYYY',
            'y' => 'YY',
            'a' => 'a',
            'A' => 'A',
            'B' => '', // no equivalent
            'g' => 'h',
            'G' => 'H',
            'h' => 'hh',
            'H' => 'HH',
            'i' => 'mm',
            's' => 'ss',
            'u' => 'SSS',
            'e' => 'zz', // deprecated since version 1.6.0 of moment.js
            'I' => '', // no equivalent
            'O' => '', // no equivalent
            'P' => '', // no equivalent
            'T' => '', // no equivalent
            'Z' => '', // no equivalent
            'c' => '', // no equivalent
            'r' => '', // no equivalent
            'U' => 'X',
        ];

        foreach ($replacements as $from => $to) {
            $replacements['\\'.$from] = '['.$from.']';
        }

        return strtr($format, $replacements);
    }
}
