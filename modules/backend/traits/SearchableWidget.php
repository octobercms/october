<?php namespace Backend\Traits;

use Str;
use File;
use Lang;
use Block;
use SystemException;

/**
 * Searchable Widget Trait
 * Adds search features to back-end widgets
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait SearchableWidget
{
    protected $searchTerm = false;

    protected function getSearchTerm()
    {
        return $this->searchTerm !== false ? $this->searchTerm : $this->getSession('search');
    }

    protected function setSearchTerm($term)
    {
        $this->searchTerm = trim($term);
        $this->putSession('search', $this->searchTerm);
    }

    protected function textMatchesSearch(&$words, $text)
    {
        foreach ($words as $word) {
            $word = trim($word);
            if (!strlen($word)) {
                continue;
            }

            if (Str::contains(Str::lower($text), $word)) {
                return true;
            }
        }

        return false;
    }
}
