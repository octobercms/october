<?php namespace Backend\Models;

use Model;

/**
 * Model used for importing data
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class ImportModel extends Model
{

	/**
	 * Relations
	 */
    public $attachOne = [
        'import_file' => ['System\Models\File']
    ];

    /**
     * Called when data is being imported.
     */
    abstract public function importData();

}