<?php namespace October\Test\Models;

use Model;
use Cms\Classes\Page;

/**
 * Country Model
 */
class Country extends Model
{

    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_countries';

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Jsonable fields
     */
    protected $jsonable = ['pages', 'states', 'locations', 'content'];

    /**
     * @var array Relations
     */
    public $belongsToMany = [
        'types' => [
            'October\Test\Models\Attribute',
            'table' => 'october_test_countries_types',
            'conditions' => "type = 'general.type'"
        ],
    ];

    /**
     * Softly implement the TranslatableModel behavior.
     */
    public $implement = ['@RainLab.Translate.Behaviors.TranslatableModel'];

    public $translatable = ['states', 'content'];

    public function filterFields($fields, $context = null)
    {
        // Repeater field shares this logic
        if (!isset($fields->pages_section)) {
            return;
        }

        if (empty($this->pages)) {
            $fields->pages_section->hidden = false;
        }
        else {
            $fields->pages_section->hidden = true;
        }

        if ($this->is_active) {
            $fields->currency->hidden = true;
        }
    }

    public function getPagesOptions()
    {
        return Page::sortBy('baseFileName')->lists('baseFileName', 'baseFileName');
    }

    public function getCountryOptions()
    {
        return self::lists('name', 'id');
    }

    public function getStateOptions($value, $data)
    {
        $countryId = isset($data->country)
            ? $data->country
            : key($this->getCountryOptions());

        $country = self::find($countryId);

        return collect($country->states)->lists('title');
    }
}