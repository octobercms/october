<?php namespace System\Helpers;

use Lang;
use Carbon\Carbon;
use Exception;
use DateTime as PhpDateTime;

class DateTime
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * Returns a human readable time difference from the value to the
     * current time. Eg: **10 minutes ago**
     *
     * @return string
     */
    public static function timeSince($datetime)
    {
        return self::instance()
            ->makeCarbon($datetime)
            ->diffForHumans()
        ;
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
        $datetime = self::instance()->makeCarbon($datetime);
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
    public function makeCarbon($value, $throwException = true)
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

        if (!$value instanceof Carbon && $throwException) {
            throw new Exception('Invalid date value supplied to DateTime helper.');
        }

        return $value;
    }
}
